import { injectable } from 'inversify';
import { Circle, Container, Graphics, GraphicsPath, TextureMatrix } from 'pixi.js';
import { Subject } from 'rxjs';
import {
  SComponentFlexboxAlign,
  SComponentFlexboxAlignDirection,
  SComponentFlexboxAutoAlign,
  SComponentFlexboxFixAlign,
} from '../redux/stlb-store-slice';

@injectable()
export class FlexboxAdapterUtil {
  public readonly testContainer = new Container();
  public readonly propertyEditorContainer = new Container();

  public readonly onAlignChanged = new Subject<SComponentFlexboxAlign>();

  // private _isAutoAlign: boolean = true;
  // private _alignDirection: SComponentFlexboxAlignDirection = SComponentFlexboxAlignDirection.Horizontal;
  // private _align: SComponentFlexboxAutoAlign | SComponentFlexboxFixAlign = SComponentFlexboxAutoAlign.Start;

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
  private readonly _alignCellGraphicsFill = 'blue';

  private readonly _autoAlignGraphicsBounds = { width: 2, heightCenter: 6, heightEnds: 10 };

  private propEditorFieldCells: {
    [key in SComponentFlexboxFixAlign]: {
      x: number;
      y: number;
      graphics: Graphics;
      autoHorizontalAlignGrapchis: Graphics;
      autoVerticalAlignGrapchis: Graphics;
    };
  } = {
    [SComponentFlexboxFixAlign.TopLeft]: {
      x: this._propEditorPadding,
      y: this._propEditorPadding,
      graphics: new Graphics(),
      autoHorizontalAlignGrapchis: new Graphics().rect(
        0,
        0,
        this._autoAlignGraphicsBounds.width,
        this._autoAlignGraphicsBounds.heightEnds
      ),
      autoVerticalAlignGrapchis: new Graphics().rect(
        0,
        0,
        this._autoAlignGraphicsBounds.heightEnds,
        this._autoAlignGraphicsBounds.width
      ),
    },
    [SComponentFlexboxFixAlign.TopCenter]: {
      x: this._propEditorPadding + this._propEditorCellGapHorizontal,
      y: this._propEditorPadding,
      graphics: new Graphics(),
      autoHorizontalAlignGrapchis: new Graphics().rect(
        0,
        0,
        this._autoAlignGraphicsBounds.width,
        this._autoAlignGraphicsBounds.heightCenter
      ),
      autoVerticalAlignGrapchis: new Graphics().rect(
        0,
        0,
        this._autoAlignGraphicsBounds.heightCenter,
        this._autoAlignGraphicsBounds.width
      ),
    },
    [SComponentFlexboxFixAlign.TopRight]: {
      x: this._propEditorPadding + this._propEditorCellGapHorizontal * 2,
      y: this._propEditorPadding,
      graphics: new Graphics(),
      autoHorizontalAlignGrapchis: new Graphics().rect(
        0,
        0,
        this._autoAlignGraphicsBounds.width,
        this._autoAlignGraphicsBounds.heightEnds
      ),
      autoVerticalAlignGrapchis: new Graphics().rect(
        0,
        0,
        this._autoAlignGraphicsBounds.heightEnds,
        this._autoAlignGraphicsBounds.width
      ),
    },

    [SComponentFlexboxFixAlign.Left]: {
      x: this._propEditorPadding,
      y: this._propEditorPadding + this._propEditorCellGapVertical,
      graphics: new Graphics(),
      autoHorizontalAlignGrapchis: new Graphics().rect(
        0,
        0,
        this._autoAlignGraphicsBounds.width,
        this._autoAlignGraphicsBounds.heightEnds
      ),
      autoVerticalAlignGrapchis: new Graphics().rect(
        0,
        0,
        this._autoAlignGraphicsBounds.heightCenter,
        this._autoAlignGraphicsBounds.width
      ),
    },
    [SComponentFlexboxFixAlign.Center]: {
      x: this._propEditorPadding + this._propEditorCellGapHorizontal,
      y: this._propEditorPadding + this._propEditorCellGapVertical,
      graphics: new Graphics(),
      autoHorizontalAlignGrapchis: new Graphics().rect(
        0,
        0,
        this._autoAlignGraphicsBounds.width,
        this._autoAlignGraphicsBounds.heightCenter
      ),
      autoVerticalAlignGrapchis: new Graphics().rect(
        0,
        0,
        this._autoAlignGraphicsBounds.heightCenter,
        this._autoAlignGraphicsBounds.width
      ),
    },
    [SComponentFlexboxFixAlign.Right]: {
      x: this._propEditorPadding + this._propEditorCellGapHorizontal * 2,
      y: this._propEditorPadding + this._propEditorCellGapVertical,
      graphics: new Graphics(),
      autoHorizontalAlignGrapchis: new Graphics().rect(
        0,
        0,
        this._autoAlignGraphicsBounds.width,
        this._autoAlignGraphicsBounds.heightEnds
      ),
      autoVerticalAlignGrapchis: new Graphics().rect(
        0,
        0,
        this._autoAlignGraphicsBounds.heightCenter,
        this._autoAlignGraphicsBounds.width
      ),
    },

    [SComponentFlexboxFixAlign.BottomLeft]: {
      x: this._propEditorPadding,
      y: this._propEditorPadding + this._propEditorCellGapVertical * 2,
      graphics: new Graphics(),
      autoHorizontalAlignGrapchis: new Graphics().rect(
        0,
        0,
        this._autoAlignGraphicsBounds.width,
        this._autoAlignGraphicsBounds.heightEnds
      ),
      autoVerticalAlignGrapchis: new Graphics().rect(
        0,
        0,
        this._autoAlignGraphicsBounds.heightEnds,
        this._autoAlignGraphicsBounds.width
      ),
    },
    [SComponentFlexboxFixAlign.BottomCenter]: {
      x: this._propEditorPadding + this._propEditorCellGapHorizontal,
      y: this._propEditorPadding + this._propEditorCellGapVertical * 2,
      graphics: new Graphics(),
      autoHorizontalAlignGrapchis: new Graphics().rect(
        0,
        0,
        this._autoAlignGraphicsBounds.width,
        this._autoAlignGraphicsBounds.heightCenter
      ),
      autoVerticalAlignGrapchis: new Graphics().rect(
        0,
        0,
        this._autoAlignGraphicsBounds.heightEnds,
        this._autoAlignGraphicsBounds.width
      ),
    },
    [SComponentFlexboxFixAlign.BottomRight]: {
      x: this._propEditorPadding + this._propEditorCellGapHorizontal * 2,
      y: this._propEditorPadding + this._propEditorCellGapVertical * 2,
      graphics: new Graphics(),
      autoHorizontalAlignGrapchis: new Graphics().rect(
        0,
        0,
        this._autoAlignGraphicsBounds.width,
        this._autoAlignGraphicsBounds.heightEnds
      ),
      autoVerticalAlignGrapchis: new Graphics().rect(
        0,
        0,
        this._autoAlignGraphicsBounds.heightEnds,
        this._autoAlignGraphicsBounds.width
      ),
    },
  };

  constructor(public readonly flexboxAlign: SComponentFlexboxAlign) {}

  redrawPropertyEditor() {
    this.propertyEditorContainer.removeChildren();

    const propEditorWidth = 150;
    const propEditorHeight = 80;

    const propEditoBgG = new Graphics().rect(0, 0, propEditorWidth, propEditorHeight).fill(0xefeeee);

    this.propertyEditorContainer.addChild(propEditoBgG);

    Object.keys(this.propEditorFieldCells).forEach((key) => {
      const cellAlign = <SComponentFlexboxFixAlign>+key;
      const cell = this.propEditorFieldCells[cellAlign];

      cell.graphics.circle(cell.x, cell.y, 1).fill('black');
      cell.graphics.eventMode = 'static';
      cell.graphics.hitArea = new Circle(cell.x, cell.y, 5);
      cell.graphics.on('click', () => this._oncCellClick(cell, cellAlign));

      let isCellInSelectedAlign = false;
      if (this.flexboxAlign.isAutoAlign) {
        const alignCellGraphics =
          this.flexboxAlign.direction === SComponentFlexboxAlignDirection.Horizontal
            ? cell.autoHorizontalAlignGrapchis
            : cell.autoVerticalAlignGrapchis;
        alignCellGraphics.fill(this._alignCellGraphicsFill);
        alignCellGraphics.position.x = cell.x - alignCellGraphics.getBounds().width / 2;
        alignCellGraphics.position.y = cell.y - alignCellGraphics.getBounds().height / 2;
        alignCellGraphics.eventMode = 'static';
        alignCellGraphics.hitArea = new Circle(cell.x, cell.y, 5);
        alignCellGraphics.on('click', () => this._oncCellClick(cell, cellAlign));

        if (
          FlexboxAdapterUtil.isAutoAlignBelongsToAlign(
            <SComponentFlexboxAutoAlign>this.flexboxAlign.align,
            cellAlign,
            this.flexboxAlign.direction
          )
        ) {
          this.propertyEditorContainer.addChild(alignCellGraphics);
          isCellInSelectedAlign = true;
        }
      }

      if (!isCellInSelectedAlign) this.propertyEditorContainer.addChild(cell.graphics);
    });

    return this.propertyEditorContainer;
  }

  private _oncCellClick(
    cell: {
      x: number;
      y: number;
      graphics: Graphics;
      autoHorizontalAlignGrapchis: Graphics;
      autoVerticalAlignGrapchis: Graphics;
    },
    cellAlign: SComponentFlexboxFixAlign
  ) {
    const newAutoAlign = FlexboxAdapterUtil._autoAlignDirectionByCellAlign(cellAlign, this.flexboxAlign.direction);
    this.onAlignChanged.next(new SComponentFlexboxAlign(true, newAutoAlign, this.flexboxAlign.direction));
  }

  redrawTest() {
    const parentBound = { width: 600, height: 500 };

    const elPositionsAndBounds = this._testElsBounds.map((el) => ({
      x: 0,
      y: 0,
      width: el.width,
      height: el.height,
    }));
    const newElPositionsAndBounds = FlexboxAdapterUtil.applyAlign(
      elPositionsAndBounds,
      parentBound,
      SComponentFlexboxAlignDirection.Vertical,
      SComponentFlexboxAutoAlign.Start
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
    alignDirection: SComponentFlexboxAlignDirection,
    align: SComponentFlexboxAutoAlign
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
      if (alignDirection === SComponentFlexboxAlignDirection.Horizontal && align === SComponentFlexboxAutoAlign.Start) {
        newElPosBound.x = currentX;
        newElPosBound.y = 0;

        currentX += newElPosBound.width + gapX;
      } else if (
        alignDirection === SComponentFlexboxAlignDirection.Horizontal &&
        align === SComponentFlexboxAutoAlign.Center
      ) {
        newElPosBound.x = currentX;
        newElPosBound.y = parentBound.height / 2 - newElPosBound.height / 2;

        currentX += newElPosBound.width + gapX;
      } else if (
        alignDirection === SComponentFlexboxAlignDirection.Horizontal &&
        align === SComponentFlexboxAutoAlign.End
      ) {
        newElPosBound.x = currentX;
        newElPosBound.y = parentBound.height - newElPosBound.height;

        currentX += newElPosBound.width + gapX;
      }

      // FlexboxAlignDirection.Vertical
      else if (
        alignDirection === SComponentFlexboxAlignDirection.Vertical &&
        align === SComponentFlexboxAutoAlign.Start
      ) {
        newElPosBound.x = 0;
        newElPosBound.y = currentY;

        currentY += newElPosBound.height + gapY;
      } else if (
        alignDirection === SComponentFlexboxAlignDirection.Vertical &&
        align === SComponentFlexboxAutoAlign.Center
      ) {
        newElPosBound.x = parentBound.width / 2 - newElPosBound.width / 2;
        newElPosBound.y = currentY;

        currentY += newElPosBound.height + gapY;
      } else if (
        alignDirection === SComponentFlexboxAlignDirection.Vertical &&
        align === SComponentFlexboxAutoAlign.End
      ) {
        newElPosBound.x = parentBound.width - newElPosBound.width;
        newElPosBound.y = currentY;

        currentY += newElPosBound.height + gapY;
      }

      newElPositionsAndBounds.push(newElPosBound);
    }

    return newElPositionsAndBounds;
  }

  private static _autoAlignDirectionByCellAlign(
    cellAlign: SComponentFlexboxFixAlign,
    alignDirection: SComponentFlexboxAlignDirection
  ) {
    if (alignDirection === SComponentFlexboxAlignDirection.Horizontal) {
      if (
        cellAlign === SComponentFlexboxFixAlign.TopLeft ||
        cellAlign === SComponentFlexboxFixAlign.TopCenter ||
        cellAlign === SComponentFlexboxFixAlign.TopRight
      ) {
        return SComponentFlexboxAutoAlign.Start;
      } else if (
        cellAlign === SComponentFlexboxFixAlign.Left ||
        cellAlign === SComponentFlexboxFixAlign.Center ||
        cellAlign === SComponentFlexboxFixAlign.Right
      ) {
        return SComponentFlexboxAutoAlign.Center;
      } else if (
        cellAlign === SComponentFlexboxFixAlign.BottomLeft ||
        cellAlign === SComponentFlexboxFixAlign.BottomCenter ||
        cellAlign === SComponentFlexboxFixAlign.BottomRight
      ) {
        return SComponentFlexboxAutoAlign.End;
      }
    } else if (alignDirection === SComponentFlexboxAlignDirection.Vertical) {
      if (
        cellAlign === SComponentFlexboxFixAlign.TopLeft ||
        cellAlign === SComponentFlexboxFixAlign.Left ||
        cellAlign === SComponentFlexboxFixAlign.BottomLeft
      ) {
        return SComponentFlexboxAutoAlign.Start;
      } else if (
        cellAlign === SComponentFlexboxFixAlign.TopCenter ||
        cellAlign === SComponentFlexboxFixAlign.Center ||
        cellAlign === SComponentFlexboxFixAlign.BottomCenter
      ) {
        return SComponentFlexboxAutoAlign.Center;
      } else if (
        cellAlign === SComponentFlexboxFixAlign.TopRight ||
        cellAlign === SComponentFlexboxFixAlign.Right ||
        cellAlign === SComponentFlexboxFixAlign.BottomRight
      ) {
        return SComponentFlexboxAutoAlign.End;
      }
    }

    throw new Error(`autoAlignDirectionByCellAlign: not all align variants emplimented`);
  }

  private static isAutoAlignBelongsToAlign(
    autoAlign: SComponentFlexboxAutoAlign,
    fixAlign: SComponentFlexboxFixAlign,
    alignDirection: SComponentFlexboxAlignDirection
  ) {
    if (autoAlign === SComponentFlexboxAutoAlign.Start) {
      return this.isStartAlign(fixAlign, alignDirection);
    } else if (autoAlign === SComponentFlexboxAutoAlign.Center) {
      return this.isCenterAlign(fixAlign, alignDirection);
    } else if (autoAlign === SComponentFlexboxAutoAlign.End) {
      return this.isEndAlign(fixAlign, alignDirection);
    }
  }

  private static alignToAutoAlign(align: SComponentFlexboxFixAlign, alignDirection: SComponentFlexboxAlignDirection) {
    if (FlexboxAdapterUtil.isStartAlign(align, alignDirection)) {
      return SComponentFlexboxAutoAlign.Start;
    } else if (FlexboxAdapterUtil.isCenterAlign(align, alignDirection)) {
      return SComponentFlexboxAutoAlign.Center;
    } else if (FlexboxAdapterUtil.isEndAlign(align, alignDirection)) {
      return SComponentFlexboxAutoAlign.End;
    }

    throw new Error(`alignToAutoAlign: ${FlexboxAdapterUtil} is not implemented`);
  }

  private static isStartAlign(align: SComponentFlexboxFixAlign, alignDirection: SComponentFlexboxAlignDirection) {
    return alignDirection === SComponentFlexboxAlignDirection.Horizontal
      ? align === SComponentFlexboxFixAlign.TopLeft ||
          align === SComponentFlexboxFixAlign.TopCenter ||
          align === SComponentFlexboxFixAlign.TopRight
      : align === SComponentFlexboxFixAlign.TopLeft ||
          align === SComponentFlexboxFixAlign.Left ||
          align === SComponentFlexboxFixAlign.BottomLeft;
  }

  private static isCenterAlign(align: SComponentFlexboxFixAlign, alignDirection: SComponentFlexboxAlignDirection) {
    return alignDirection === SComponentFlexboxAlignDirection.Horizontal
      ? align === SComponentFlexboxFixAlign.Left ||
          align === SComponentFlexboxFixAlign.Center ||
          align === SComponentFlexboxFixAlign.Right
      : align === SComponentFlexboxFixAlign.TopCenter ||
          align === SComponentFlexboxFixAlign.Center ||
          align === SComponentFlexboxFixAlign.BottomCenter;
  }

  private static isEndAlign(align: SComponentFlexboxFixAlign, alignDirection: SComponentFlexboxAlignDirection) {
    return alignDirection === SComponentFlexboxAlignDirection.Horizontal
      ? align === SComponentFlexboxFixAlign.BottomLeft ||
          align === SComponentFlexboxFixAlign.BottomCenter ||
          align === SComponentFlexboxFixAlign.BottomRight
      : align === SComponentFlexboxFixAlign.TopRight ||
          align === SComponentFlexboxFixAlign.Right ||
          align === SComponentFlexboxFixAlign.BottomRight;
  }

  // private static isCenterAlign(align: FlexboxFixAlign) {
  //   if (
  //     align === FlexboxFixAlign.TopCenter ||
  //     align === FlexboxFixAlign.Center ||
  //     align === FlexboxFixAlign.BottomCenter
  //   )
  //     return true;

  //   return false;
  // }
}
