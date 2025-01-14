import {
  Circle,
  Color,
  Container,
  Graphics,
  GraphicsPath,
  loadKTX2onWorker,
  Rectangle,
  Text,
} from 'pixi.js';
import * as StlbStore from '../redux/stlb-store';
import {
  addComponent,
  SComponentProperty,
  selectComponent,
  setComponentSettings as setComponentProperty,
} from '../redux/stlb-store-slice';
import { Guid } from 'guid-typescript';
import { Subject } from 'rxjs';
import { StlbResizer, StlcResizerSide } from './resizer';
import { Stlbinput } from './stlb-input';
import { GComponentList } from './gcomponent-list';
import { StlbGlobals } from '../globals';
import { current } from '@reduxjs/toolkit';

export abstract class StlbBaseGcomponent {
  public readonly id!: string;
  public readonly _container: Container = new Container();
  public readonly propertyContainer: Container = new Container();
  public readonly graphics: Graphics = new Graphics()
    .rect(0, 0, 20, 20)
    .fill('white');

  private readonly _properties: { [name: string]: SComponentProperty } = {
    ['x']: new SComponentProperty('x', 0),
    ['y']: new SComponentProperty('y', 0),
    ['width']: new SComponentProperty('width', 0),
    ['height']: new SComponentProperty('height', 0),
  };
  protected readonly _onPropertyChange = new Subject<SComponentProperty>();

  private readonly _resizers: { [key in StlcResizerSide]: StlbResizer } = {
    [StlcResizerSide.Left]: new StlbResizer(StlcResizerSide.Left, this),
    [StlcResizerSide.Top]: new StlbResizer(StlcResizerSide.Top, this),
    [StlcResizerSide.Right]: new StlbResizer(StlcResizerSide.Right, this),
    [StlcResizerSide.Bottom]: new StlbResizer(StlcResizerSide.Bottom, this),
  };

  public get x(): number {
    return <number>this._properties['x'].value;
  }
  public set x(v: number) {
    this.setProperty(new SComponentProperty<number>('x', v));
  }

  public get y(): number {
    return <number>this._properties['y'].value;
  }
  public set y(v: number) {
    this.setProperty(new SComponentProperty<number>('y', v));
  }

  public get width(): number {
    return <number>this._properties['width'].value;
  }
  public set width(v: number) {
    this.setProperty(new SComponentProperty<number>('width', v));
  }

  public get height(): number {
    return <number>this._properties['height'].value;
  }
  public set height(v: number) {
    this.setProperty(new SComponentProperty<number>('height', v));
  }

  constructor(public readonly parentCompId: string, _id?: string) {
    this.id = _id ?? Guid.create().toString();

    this._container.addChild(this.graphics);

    StlbStore.default.dispatch(
      addComponent({ id: this.id, properties: { ...this._properties } })
    );

    if (this.id !== StlbGlobals.RootCompId) this.bindevents();
  }

  bindevents() {
    this._container.eventMode = 'static';
    this._container.on('click', (e) => {
      StlbStore.default.dispatch(selectComponent({ compId: this.id }));

      e.stopImmediatePropagation();
    });
  }

  setProperty(property: SComponentProperty<string | number>) {
    this._properties[property.name] = property;

    if (property.name === 'x') {
      this._container.position.x = (<SComponentProperty<number>>property).value;

      this.redraw();
    } else if (property.name === 'y') {
      this._container.position.y = (<SComponentProperty<number>>property).value;

      this.redraw();
    } else if (property.name === 'width') {
      // this._container.width = (<SComponentProperty<number>>property).value;
      this.graphics.width = (<SComponentProperty<number>>property).value;

      this.redraw();
    } else if (property.name === 'height') {
      // this._container.height = (<SComponentProperty<number>>property).value;
      this.graphics.height = (<SComponentProperty<number>>property).value;

      this.redraw();
    }

    StlbStore.default.dispatch(
      setComponentProperty({ compId: this.id, property })
    );

    this._onPropertyChange.next({ ...property });

    this.redrawProperty();
  }

  getProperty<T = string | number>(name: string) {
    return <SComponentProperty<T>>this._properties[name];
  }

  renderTo(parent: Container) {}

  redraw() {
    this._container.removeChildren();

    for (const key in StlcResizerSide) {
      Object.keys(StlcResizerSide).forEach((key) => {
        if (+key >= 0) {
          const resizerG = this._resizers[+key as 0 | 1 | 2 | 3].render();
          this._container.addChild(resizerG);
        }
      });
    }
  }

  addChild(gcomp: StlbBaseGcomponent) {
    this._container.addChild(gcomp._container);
  }

  redrawProperty() {
    this.propertyContainer.removeChildren();

    const padding = 10;

    let currentX = padding;
    let currentY = padding;

    /// X
    const xG = new Text({ style: { fontSize: 13, fill: 'black' } });
    xG.position.x = currentX;
    xG.position.y = currentY;
    xG.text = 'x:';

    const xInputG = new Stlbinput();
    xInputG.container.position.x = currentX + 55;
    xInputG.container.position.y = currentY;
    xInputG.inputText = this.x.toFixed(0);

    currentX += 55 + 70 + padding;

    this.propertyContainer.addChild(xG);
    this.propertyContainer.addChild(xInputG.render());

    xInputG.onChanged.subscribe({
      next: (value) => {
        this.x = parseInt(value);
      },
    });

    /// Y
    const yG = new Text({ style: { fontSize: 13, fill: 'black' } });
    yG.position.x = currentX;
    yG.position.y = currentY;
    yG.text = 'y:';

    const yInputG = new Stlbinput();
    yInputG.container.position.x = currentX + 55 + padding;
    yInputG.container.position.y = currentY;
    yInputG.inputText = this.y.toFixed(0);

    currentX = padding;
    currentY += 20 + padding;

    this.propertyContainer.addChild(yG);
    this.propertyContainer.addChild(yInputG.render());

    yInputG.onChanged.subscribe({
      next: (value) => {
        this.y = parseInt(value);
      },
    });

    /// Width
    const widthG = new Text({ style: { fontSize: 13, fill: 'black' } });
    widthG.position.x = currentX;
    widthG.position.y = currentY;
    widthG.text = 'width:';

    const widthInputG = new Stlbinput();
    widthInputG.container.position.x = currentX + 55;
    widthInputG.container.position.y = currentY;
    widthInputG.inputText = this.width.toFixed(0);

    currentX += 55 + 70 + padding;

    this.propertyContainer.addChild(widthG);
    this.propertyContainer.addChild(widthInputG.render());

    widthInputG.onChanged.subscribe({
      next: (value) => {
        this.width = parseInt(value);
      },
    });

    /// Height
    const heightG = new Text({ style: { fontSize: 13, fill: 'black' } });
    heightG.position.x = currentX;
    heightG.position.y = currentY;
    heightG.text = 'height:';

    const heightInputG = new Stlbinput();
    heightInputG.container.position.x = currentX + 55 + padding;
    heightInputG.container.position.y = currentY;
    heightInputG.inputText = this.height.toFixed(0);

    currentX = padding;
    currentY += 20 + padding;

    this.propertyContainer.addChild(heightG);
    this.propertyContainer.addChild(heightInputG.render());

    heightInputG.onChanged.subscribe({
      next: (value) => {
        this.height = parseInt(value);
      },
    });

    // GComponent Constraints
    const constraintsG = new GComponentConstraint();
    constraintsG.container.position.x = currentX;
    constraintsG.container.position.y = currentY;
    constraintsG.redraw();

    currentY += constraintsG.height + padding;
    this.propertyContainer.addChild(constraintsG.container);
  }
}

enum GComponentConstraintDirection {
  Left,
  Top,
  Right,
  Bottom,
  CenterHorizontal,
  CenterVertical,
}

class GComponentConstraint {
  public readonly container = new Container();
  public readonly width = 140;
  public readonly height = 70;

  private _strokeStyle = { width: 1, color: 'black' };
  private _selectedStrokeStyle = { width: 2, color: 'blue' };

  private _constraints: {
    [key in GComponentConstraintDirection]: {
      graphics: Graphics;
      isSelected: boolean;
    };
  } = {
    [GComponentConstraintDirection.Left]: {
      graphics: new Graphics(),
      isSelected: false,
    },
    [GComponentConstraintDirection.Top]: {
      graphics: new Graphics(),
      isSelected: false,
    },
    [GComponentConstraintDirection.Right]: {
      graphics: new Graphics(),
      isSelected: false,
    },
    [GComponentConstraintDirection.Bottom]: {
      graphics: new Graphics(),
      isSelected: false,
    },
    [GComponentConstraintDirection.CenterHorizontal]: {
      graphics: new Graphics(),
      isSelected: false,
    },
    [GComponentConstraintDirection.CenterVertical]: {
      graphics: new Graphics(),
      isSelected: false,
    },
  };

  private _linkedDirections = [
    [
      GComponentConstraintDirection.Left,
      GComponentConstraintDirection.CenterHorizontal,
      GComponentConstraintDirection.Right,
    ],
    [
      GComponentConstraintDirection.Top,
      GComponentConstraintDirection.CenterVertical,
      GComponentConstraintDirection.Bottom,
    ],
  ];

  private _currentConstraintDirection?: GComponentConstraintDirection;

  private _changeConstraintDirectionTo(
    direction: GComponentConstraintDirection
  ) {
    this._currentConstraintDirection = direction;

    const constraint = this._constraints[direction];

    constraint.isSelected = constraint.isSelected ? false : true;

    // Reset all loinked directions exception current
    if (constraint.isSelected) {
      this._linkedDirections.forEach((linkedDirections) => {
        linkedDirections.forEach((linkedDirection) => {
          if (linkedDirection === direction) {
            linkedDirections.forEach(
              (d) =>
                (this._constraints[d].isSelected =
                  d !== direction ? false : true)
            );
          }
        });
      });
    }

    this.redraw();
  }

  redraw() {
    this.container.removeChildren();

    const padding = 5;
    const constLineWidth = 12;

    const bgG = new Graphics()
      .rect(0, 0, this.width, this.height)
      .fill(0xefeeee);

    this.container.addChild(bgG);

    Object.keys(this._constraints).forEach((key) => {
      const constDirection = <GComponentConstraintDirection>+key;
      const constraint = this._constraints[constDirection];

      let moveXTo = 0;
      let moveYTo = 0;
      let lineXTo = 0;
      let lineYTo = 0;

      if (constDirection === GComponentConstraintDirection.Left) {
        moveXTo = padding;
        moveYTo = this.height / 2;
        lineXTo = padding + constLineWidth;
        lineYTo = this.height / 2;
      } else if (constDirection === GComponentConstraintDirection.Top) {
        moveXTo = this.width / 2;
        moveYTo = padding;
        lineXTo = this.width / 2;
        lineYTo = padding + constLineWidth;
      } else if (constDirection === GComponentConstraintDirection.Right) {
        moveXTo = this.width - constLineWidth - padding;
        moveYTo = this.height / 2;
        lineXTo = this.width - padding;
        lineYTo = this.height / 2;
      } else if (constDirection === GComponentConstraintDirection.Bottom) {
        moveXTo = this.width / 2;
        moveYTo = this.height - constLineWidth - padding;
        lineXTo = this.width / 2;
        lineYTo = this.height - padding;
      } else if (
        constDirection === GComponentConstraintDirection.CenterHorizontal
      ) {
        moveXTo = this.width / 2 - constLineWidth / 2;
        moveYTo = this.height / 2;
        lineXTo = this.width / 2 + constLineWidth / 2;
        lineYTo = this.height / 2;
      } else if (
        constDirection === GComponentConstraintDirection.CenterVertical
      ) {
        moveXTo = this.width / 2;
        moveYTo = this.height / 2 - constLineWidth / 2;
        lineXTo = this.width / 2;
        lineYTo = this.height / 2 + constLineWidth / 2;
      }

      constraint.graphics.clear();
      constraint.graphics
        .moveTo(moveXTo, moveYTo)
        .lineTo(lineXTo, lineYTo)
        .stroke(
          constraint.isSelected ? this._selectedStrokeStyle : this._strokeStyle
        );
      constraint.graphics.eventMode = 'static';
      constraint.graphics.hitArea = new Circle(
        moveXTo + Math.abs(lineXTo - moveXTo) / 2,
        moveYTo + Math.abs(lineYTo - moveYTo) / 2,
        Math.abs(lineXTo - moveXTo) + 5
      );
      constraint.graphics.removeAllListeners('click');
      constraint.graphics.on('click', () => {
        this._changeConstraintDirectionTo(constDirection);
      });

      this.container.addChild(constraint.graphics);
    });
  }
}
