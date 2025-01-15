import { injectable } from 'inversify';
import { Container, Graphics } from 'pixi.js';

export enum FlexboxAlignDirection {
  Horizontal,
  Vertical,
}

export enum FlexboxAutoAlign {
  Start,
  Center,
  End,
}

export enum FlexboxFixAlign {
  TopLeft,
  TopCenter,
  TopRight,
  Left,
  Center,
  Right,
  BottomLeft,
  BottomCenter,
  BottomRight,
}

@injectable()
export class FlexboxAdapterUtil {
  public readonly testContainer = new Container();
  public readonly propertyEditorContainer = new Container();

  private readonly _testElsBounds = [
    {
      width: 150,
      height: 70,
      fill: 'yellow',
    },
    {
      width: 100,
      height: 50,
      fill: 'green',
    },
    {
      width: 70,
      height: 40,
      fill: 'red',
    },
  ];

  redraw() {
    this.redrawTest();
  }

  private readonly _propEditorWidth = 150;
  private readonly _propEditorHeight = 80;
  private readonly _propEditorPadding = 20;
  private readonly _propEditorCellGapHorizontal = (this._propEditorWidth - this._propEditorPadding * 2) / 2;
  private readonly _propEditorCellGapVertical = (this._propEditorHeight - this._propEditorPadding * 2) / 2;

  private propEditorFieldCells: { [key in FlexboxFixAlign]: { x: number; y: number; graphics: Graphics } } = {
    [FlexboxFixAlign.TopLeft]: { x: this._propEditorPadding, y: this._propEditorPadding, graphics: new Graphics() },
    [FlexboxFixAlign.TopCenter]: {
      x: this._propEditorPadding + this._propEditorCellGapHorizontal,
      y: this._propEditorPadding,
      graphics: new Graphics(),
    },
    [FlexboxFixAlign.TopRight]: {
      x: this._propEditorPadding + this._propEditorCellGapHorizontal * 2,
      y: this._propEditorPadding,
      graphics: new Graphics(),
    },

    [FlexboxFixAlign.Left]: {
      x: this._propEditorPadding,
      y: this._propEditorPadding + this._propEditorCellGapVertical,
      graphics: new Graphics(),
    },
    [FlexboxFixAlign.Center]: {
      x: this._propEditorPadding + this._propEditorCellGapHorizontal,
      y: this._propEditorPadding + this._propEditorCellGapVertical,
      graphics: new Graphics(),
    },
    [FlexboxFixAlign.Right]: {
      x: this._propEditorPadding + this._propEditorCellGapHorizontal * 2,
      y: this._propEditorPadding + this._propEditorCellGapVertical,
      graphics: new Graphics(),
    },

    [FlexboxFixAlign.BottomLeft]: {
      x: this._propEditorPadding,
      y: this._propEditorPadding + this._propEditorCellGapVertical * 2,
      graphics: new Graphics(),
    },
    [FlexboxFixAlign.BottomCenter]: {
      x: this._propEditorPadding + this._propEditorCellGapHorizontal,
      y: this._propEditorPadding + this._propEditorCellGapVertical * 2,
      graphics: new Graphics(),
    },
    [FlexboxFixAlign.BottomRight]: {
      x: this._propEditorPadding + this._propEditorCellGapHorizontal * 2,
      y: this._propEditorPadding + this._propEditorCellGapVertical * 2,
      graphics: new Graphics(),
    },
  };

  redrawPropertyEditor() {
    this.propertyEditorContainer.removeChildren();

    const propEditorWidth = 150;
    const propEditorHeight = 80;

    const propEditoBgG = new Graphics().rect(0, 0, propEditorWidth, propEditorHeight).fill(0xefeeee);

    this.propertyEditorContainer.addChild(propEditoBgG);

    Object.keys(this.propEditorFieldCells).forEach((key) => {
      const align = <FlexboxFixAlign>+key;
      const alignCell = this.propEditorFieldCells[align];

      alignCell.graphics.circle(alignCell.x, alignCell.y, 1).fill('black');
      this.propertyEditorContainer.addChild(alignCell.graphics);
    });

    return this.propertyEditorContainer;
  }

  redrawTest() {
    const parentBound = { width: 600, height: 500 };

    const elPositionsAndBounds = this._testElsBounds.map((el) => ({
      x: 0,
      y: 0,
      width: el.width,
      height: el.height,
    }));
    const newElPositionsAndBounds = this.applyAlign(
      elPositionsAndBounds,
      parentBound,
      FlexboxAlignDirection.Vertical,
      FlexboxAutoAlign.Start
    ).map((elB, index) => ({ ...elB, fill: this._testElsBounds[index].fill }));

    const testBg = new Graphics().rect(0, 0, parentBound.width, parentBound.height).fill('grey');
    this.testContainer.addChild(testBg);

    newElPositionsAndBounds.forEach((elBound) => {
      const testReact = new Graphics().rect(elBound.x, elBound.y, elBound.width, elBound.height).fill(elBound.fill);
      this.testContainer.addChild(testReact);
    });
  }

  static applyAlign(
    elPositionsAndBounds: { x: number; y: number; width: number; height: number }[],
    parentBound: { width: number; height: number },
    alignDirection: FlexboxAlignDirection,
    align: FlexboxAutoAlign
  ) {
    if (elPositionsAndBounds.length <= 1) return elPositionsAndBounds;

    const newElPositionsAndBounds = [];

    let totalElsWidth = 0;
    let totalElsHeight = 0;

    elPositionsAndBounds.forEach((elPosBound) => {
      totalElsWidth += elPosBound.width;
      totalElsHeight += elPosBound.height;
    });

    let currentX = 0;
    let currentY = 0;
    let gapX = (parentBound.width - totalElsWidth) / (elPositionsAndBounds.length - 1);
    let gapY = (parentBound.height - totalElsHeight) / (elPositionsAndBounds.length - 1);
    for (let i = 0; i < elPositionsAndBounds.length; i++) {
      const newElPosBound = { ...elPositionsAndBounds[i] };

      // FlexboxAlignDirection.Horizontal
      if (alignDirection === FlexboxAlignDirection.Horizontal && align === FlexboxAutoAlign.Start) {
        newElPosBound.x = currentX;
        newElPosBound.y = 0;

        currentX += newElPosBound.width + gapX;
      } else if (alignDirection === FlexboxAlignDirection.Horizontal && align === FlexboxAutoAlign.Center) {
        newElPosBound.x = currentX;
        newElPosBound.y = parentBound.height / 2 - newElPosBound.height / 2;

        currentX += newElPosBound.width + gapX;
      } else if (alignDirection === FlexboxAlignDirection.Horizontal && align === FlexboxAutoAlign.End) {
        newElPosBound.x = currentX;
        newElPosBound.y = parentBound.height - newElPosBound.height;

        currentX += newElPosBound.width + gapX;
      }

      // FlexboxAlignDirection.Vertical
      else if (alignDirection === FlexboxAlignDirection.Vertical && align === FlexboxAutoAlign.Start) {
        newElPosBound.x = 0;
        newElPosBound.y = currentY;

        currentY += newElPosBound.height + gapY;
      } else if (alignDirection === FlexboxAlignDirection.Vertical && align === FlexboxAutoAlign.Center) {
        newElPosBound.x = parentBound.width / 2 - newElPosBound.width / 2;
        newElPosBound.y = currentY;

        currentY += newElPosBound.height + gapY;
      } else if (alignDirection === FlexboxAlignDirection.Vertical && align === FlexboxAutoAlign.End) {
        newElPosBound.x = parentBound.width - newElPosBound.width;
        newElPosBound.y = currentY;

        currentY += newElPosBound.height + gapY;
      }

      newElPositionsAndBounds.push(newElPosBound);
    }

    return newElPositionsAndBounds;
  }
}
