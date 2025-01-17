import { Circle, Container, Graphics, Text } from 'pixi.js';
import * as StlbStore from '../redux/stlb-store';
import {
  addComponent,
  SComponentAlignType,
  SComponentConstraintDirection,
  SComponentFlexboxAlign,
  SComponentFlexboxAlignDirection,
  SComponentFlexboxAutoAlign,
  SComponentPadding,
  SComponentPaddingDirection,
  SComponentConstraintDirection as SComponentPositionConstraintDirection,
  SComponentProperty,
  selectComponent,
  setComponentSettings as setComponentProperty,
  unselectComponent,
} from '../redux/stlb-store-slice';
import { Guid } from 'guid-typescript';
import { Subject } from 'rxjs';
import { StlbResizer, StlcResizerSide } from './resizer';
import { Stlbinput } from './stlb-input';
import { StlbGlobals } from '../globals';
import { FlexboxAdapterUtil } from '../utils/flexbox-adapter.util';
import { StlbGComponentMovier } from './stlb-gcomponent-movier';

export abstract class StlbBaseGComponent {
  public readonly id!: string;
  public readonly _container: Container = new Container();
  public readonly propertyContainer: Container = new Container();
  public readonly graphics: Graphics = new Graphics().rect(0, 0, 20, 20).fill('white');

  // Will set via GComponentList
  protected _parentGComp!: StlbBaseGComponent;
  protected readonly _childComps: StlbBaseGComponent[] = [];

  protected readonly _onPropertyChange = new Subject<SComponentProperty>();

  private _isCurrentCompSelected = false;

  private readonly _componentMovier = new StlbGComponentMovier(this);

  private readonly _resizers: { [key in StlcResizerSide]: StlbResizer } = {
    [StlcResizerSide.Left]: new StlbResizer(StlcResizerSide.Left, this),
    [StlcResizerSide.Top]: new StlbResizer(StlcResizerSide.Top, this),
    [StlcResizerSide.Right]: new StlbResizer(StlcResizerSide.Right, this),
    [StlcResizerSide.Bottom]: new StlbResizer(StlcResizerSide.Bottom, this),
  };

  private readonly _paddings: { [key in SComponentPaddingDirection]: SComponentPadding } = {
    [SComponentPaddingDirection.Left]: new SComponentPadding(0, SComponentPaddingDirection.Left),
    [SComponentPaddingDirection.Top]: new SComponentPadding(0, SComponentPaddingDirection.Top),
    [SComponentPaddingDirection.Right]: new SComponentPadding(0, SComponentPaddingDirection.Right),
    [SComponentPaddingDirection.Bottom]: new SComponentPadding(0, SComponentPaddingDirection.Bottom),
  };

  private readonly _properties: { [name: string]: SComponentProperty } = {
    ['x']: new SComponentProperty('x', 0),
    ['y']: new SComponentProperty('y', 0),
    ['width']: new SComponentProperty('width', 0),
    ['height']: new SComponentProperty('height', 0),
    ['paddings']: new SComponentProperty('paddings', JSON.stringify(this._paddings)),
    ['positionConstraints']: new SComponentProperty('positionConstraints', JSON.stringify({})),
    ['flexboxAlign']: new SComponentProperty(
      'flexboxAlign',
      JSON.stringify(
        new SComponentFlexboxAlign(
          SComponentAlignType.Auto,
          SComponentFlexboxAutoAlign.Start,
          SComponentFlexboxAlignDirection.Vertical
        )
      )
    ),
  };

  public get padding() {
    return { ...this._paddings };
  }

  public setPadding(value: number, direction: SComponentPaddingDirection) {
    this._paddings[direction].value = value;

    this.setProperty(new SComponentProperty<string>('paddings', JSON.stringify(this._paddings)));
  }

  public get positionConstraints(): { [key in SComponentPositionConstraintDirection]?: number } {
    return JSON.parse(<string>this._properties['positionConstraints'].value);
  }
  public set positionConstraints(v: { [key in SComponentPositionConstraintDirection]?: number }) {
    this.setProperty(new SComponentProperty<string>('positionConstraints', JSON.stringify(v)));
  }

  public get flexboxAlign(): SComponentFlexboxAlign {
    return JSON.parse(<string>this._properties['flexboxAlign'].value);
  }
  public set flexboxAlign(v: SComponentFlexboxAlign) {
    this.setProperty(new SComponentProperty<string>('flexboxAlign', JSON.stringify(v)));

    if (v.alignType === SComponentAlignType.Absolute) {
      this._componentMovier.enable();
    } else {
      this._componentMovier.disable();
    }
  }

  public get parentGComp() {
    return this._parentGComp;
  }

  public get childComps() {
    return [...this._childComps];
  }

  public get x(): number {
    return <number>this._properties['x'].value;
  }
  public get innerX(): number {
    return this.x + this._paddings[SComponentPaddingDirection.Left].value;
  }
  public set x(v: number) {
    this.setProperty(new SComponentProperty<number>('x', v));
  }

  public get y(): number {
    return <number>this._properties['y'].value;
  }
  public get innerY(): number {
    return this.y + this._paddings[SComponentPaddingDirection.Top].value;
  }
  public set y(v: number) {
    this.setProperty(new SComponentProperty<number>('y', v));
  }

  public get width(): number {
    return <number>this._properties['width'].value;
  }
  public get innerWidth(): number {
    return (
      this.width -
      this._paddings[SComponentPaddingDirection.Left].value -
      this._paddings[SComponentPaddingDirection.Right].value
    );
  }
  public set width(v: number) {
    this.setProperty(new SComponentProperty<number>('width', v));
  }

  public get height(): number {
    return <number>this._properties['height'].value;
  }
  public get innerHeight(): number {
    return (
      this.height -
      this._paddings[SComponentPaddingDirection.Top].value -
      this._paddings[SComponentPaddingDirection.Bottom].value
    );
  }
  public set height(v: number) {
    this.setProperty(new SComponentProperty<number>('height', v));
  }

  public get isSelected(): boolean {
    return this._isCurrentCompSelected;
  }
  public set isSelected(isSelected: boolean) {
    this._isCurrentCompSelected = isSelected;

    if (isSelected) {
      StlbStore.default.dispatch(selectComponent({ compId: this.id }));
    } else {
      StlbStore.default.dispatch(unselectComponent());
    }

    this.redraw();
  }

  constructor(public readonly parentCompId: string, _id?: string) {
    this.id = _id ?? Guid.create().toString();

    this._container.addChild(this.graphics);

    StlbStore.default.dispatch(
      addComponent({
        id: this.id,
        properties: { ...this._properties },
      })
    );

    if (this.id !== StlbGlobals.RootCompId) this.bindevents();
  }

  setParentGComponent(parent: StlbBaseGComponent) {
    this._parentGComp = parent;
  }

  addChildComps(...gComps: StlbBaseGComponent[]) {
    gComps.forEach((c) => this._childComps.push(c));
  }

  bindevents() {
    this._container.eventMode = 'static';
    this._container.on('click', (e) => {
      StlbStore.default.dispatch(selectComponent({ compId: this.id }));

      this.redraw();

      e.stopPropagation();
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
      this.graphics.width = (<SComponentProperty<number>>property).value;

      this.redraw();
    } else if (property.name === 'height') {
      this.graphics.height = (<SComponentProperty<number>>property).value;

      this.redraw();
    } else if (property.name === 'flexboxAlign') {
      this.redraw();
    } else if (property.name === 'paddings') {
      this.redraw();
    }

    StlbStore.default.dispatch(setComponentProperty({ compId: this.id, property }));

    this._onPropertyChange.next({ ...property });

    this.redrawProperty();
  }

  getProperty<T = string | number>(name: string) {
    return <SComponentProperty<T>>this._properties[name];
  }

  renderTo(parent: Container) {}

  redraw() {
    this.drawGraphics();
    this.drawChildrenGraphics();

    this._updateChildrenFlexboxAlign();
  }

  drawGraphics() {
    this._container.removeChildren();

    if (this.isSelected) {
      for (const key in StlcResizerSide) {
        Object.keys(StlcResizerSide).forEach((key) => {
          if (+key >= 0) {
            const resizerG = this._resizers[+key as 0 | 1 | 2 | 3].render();
            this._container.addChild(resizerG);
          }
        });
      }
    }
  }

  drawChildrenGraphics() {
    this._childComps.forEach((childGComp) => {
      this._container.addChild(childGComp._container);
      childGComp.drawGraphics();
    });

    this._updateChildrenConstraintPosition();
  }

  addChildToContainer(container: Container) {
    this._container.addChild(container);
  }

  redrawProperty() {
    this.propertyContainer.removeChildren();

    const propGrapchics: Container[] = [];

    const padding = 10;

    let currentX = padding;
    let currentY = padding;

    /// X
    const xInput = new Stlbinput('X');
    xInput.container.position.x = currentX;
    xInput.container.position.y = currentY;
    xInput.inputText = this.x.toFixed(0);

    currentX += xInput.width;

    propGrapchics.push(xInput.render());

    xInput.onChanged.subscribe({
      next: (value) => {
        this.x = parseInt(value);
      },
    });

    /// Y
    const yInput = new Stlbinput('Y');
    yInput.container.position.x = currentX + padding;
    yInput.container.position.y = currentY;
    yInput.inputText = this.y.toFixed(0);

    currentX = padding;
    currentY += 20 + padding;

    propGrapchics.push(yInput.render());

    yInput.onChanged.subscribe({
      next: (value) => {
        this.y = parseInt(value);
      },
    });

    /// Width
    const widthInput = new Stlbinput('W');
    widthInput.container.position.x = currentX;
    widthInput.container.position.y = currentY;
    widthInput.inputText = this.width.toFixed(0);

    currentX += widthInput.width;

    propGrapchics.push(widthInput.render());

    widthInput.onChanged.subscribe({
      next: (value) => {
        this.width = parseInt(value);
      },
    });

    /// Height
    const heightInputG = new Stlbinput('H');
    heightInputG.container.position.x = currentX + padding;
    heightInputG.container.position.y = currentY;
    heightInputG.inputText = this.height.toFixed(0);

    currentX = padding;
    currentY += 20 + padding;

    propGrapchics.push(heightInputG.render());

    heightInputG.onChanged.subscribe({
      next: (value) => {
        this.height = parseInt(value);
      },
    });

    // Paddings
    const paddingstLeftRightInputG = new Stlbinput('PL');
    paddingstLeftRightInputG.container.position.x = currentX;
    paddingstLeftRightInputG.container.position.y = currentY;
    paddingstLeftRightInputG.inputText = this._paddings[SComponentPaddingDirection.Left].value.toFixed(0);
    paddingstLeftRightInputG.onChanged.subscribe({
      next: (value) => {
        const paddingValue = parseInt(value);
        this.setPadding(paddingValue, SComponentPaddingDirection.Left);
        this.setPadding(paddingValue, SComponentPaddingDirection.Right);
      },
    });

    currentX += paddingstLeftRightInputG.width + padding;

    const paddingstTopBottomInputG = new Stlbinput('PT');
    paddingstTopBottomInputG.container.position.x = currentX;
    paddingstTopBottomInputG.container.position.y = currentY;
    paddingstTopBottomInputG.inputText = this._paddings[SComponentPaddingDirection.Top].value.toFixed(0);
    paddingstTopBottomInputG.onChanged.subscribe({
      next: (value) => {
        const paddingValue = parseInt(value);
        this.setPadding(paddingValue, SComponentPaddingDirection.Top);
        this.setPadding(paddingValue, SComponentPaddingDirection.Bottom);
      },
    });

    currentX = padding;
    currentY += paddingstLeftRightInputG.height * 2 + padding;

    propGrapchics.push(paddingstLeftRightInputG.render());
    propGrapchics.push(paddingstTopBottomInputG.render());

    // GComponent Constraints
    const constraintsG = new GComponentPositionConstraint(
      Object.keys(this.positionConstraints).map((c) => <SComponentPositionConstraintDirection>+c)
    );
    constraintsG.container.position.x = currentX;
    constraintsG.container.position.y = currentY;
    constraintsG.redraw();
    constraintsG.onConstraintChanged.subscribe((constraints) => {
      const constraintsValues = GComponentPositionConstraint.getCurrentPositionConstraintsValues(constraints, this);
      this.positionConstraints = constraintsValues;
    });

    currentX = padding;
    currentY += constraintsG.height + padding;

    propGrapchics.push(constraintsG.container);

    // Flexbox adapter property
    const flexboxAdapter = new FlexboxAdapterUtil(this.flexboxAlign);
    const flexboxAdapterG = flexboxAdapter.redrawPropertyEditor();
    flexboxAdapterG.position.x = currentX;
    flexboxAdapterG.position.y = currentY;
    flexboxAdapter.onAlignChanged.subscribe((newAlign) => {
      this.flexboxAlign = newAlign;
    });

    propGrapchics.push(flexboxAdapterG);

    currentX = padding;
    currentY += flexboxAdapter.propertyEditorHeight + padding;

    // Add all prop graphics
    this.propertyContainer.addChild(
      new Graphics().rect(0, 0, this.propertyContainer.getBounds().rectangle.width, currentY).fill('white')
    );
    propGrapchics.forEach((propG) => {
      this.propertyContainer.addChild(propG);
    });
  }

  private _updateChildrenConstraintPosition() {
    if (this._childComps.length === 0) return;

    this._childComps.forEach((gComp) => {
      if (Object.keys(gComp.positionConstraints).length === 0) return;

      const newPosition = GComponentPositionConstraint.calculateCurrentPositionBasedOnParentGComponent(
        gComp,
        gComp._parentGComp,
        gComp.positionConstraints
      );

      gComp.x = newPosition.x ?? gComp.x;
      gComp.y = newPosition.y ?? gComp.y;
      gComp.width = newPosition.width ?? gComp.width;
      gComp.height = newPosition.height ?? gComp.height;
    });
  }

  private _updateChildrenFlexboxAlign() {
    if (this.flexboxAlign.alignType === SComponentAlignType.Absolute || this._childComps.length === 0) return;

    const childrenPosAndBounds = this._childComps.map((child) => ({
      x: child.x,
      y: child.y,
      width: child.width,
      height: child.height,
    }));

    const applyResult = FlexboxAdapterUtil.applyAlign(
      childrenPosAndBounds,
      { width: this.innerWidth, height: this.innerHeight },
      this.flexboxAlign.direction,
      <SComponentFlexboxAutoAlign>this.flexboxAlign.align
    );

    for (let index = 0; index < this._childComps.length; index++) {
      const childComp = this._childComps[index];
      const newChildPosAndBounds = applyResult.elPositionsAndBounds[index];

      childComp.x = this._paddings[SComponentPaddingDirection.Left].value + newChildPosAndBounds.x;
      childComp.y = this._paddings[SComponentPaddingDirection.Top].value + newChildPosAndBounds.y;
    }
  }
}

class GComponentPositionConstraint {
  public readonly container = new Container();
  public readonly width = 140;
  public readonly height = 70;

  constructor(selectedConstraints: SComponentPositionConstraintDirection[] = []) {
    selectedConstraints.forEach((selectedConst) => {
      this._constraints[selectedConst].isSelected = true;
    });
  }

  // Current selected constraints will pass
  public readonly onConstraintChanged = new Subject<SComponentPositionConstraintDirection[]>();

  private _strokeStyle = { width: 1, color: 'black' };
  private _selectedStrokeStyle = { width: 2, color: 'blue' };

  private _constraints: {
    [key in SComponentPositionConstraintDirection]: {
      graphics: Graphics;
      isSelected: boolean;
      direction: SComponentPositionConstraintDirection;
    };
  } = {
    [SComponentPositionConstraintDirection.Left]: {
      graphics: new Graphics(),
      isSelected: false,
      direction: SComponentPositionConstraintDirection.Left,
    },
    [SComponentPositionConstraintDirection.Top]: {
      graphics: new Graphics(),
      isSelected: false,
      direction: SComponentPositionConstraintDirection.Top,
    },
    [SComponentPositionConstraintDirection.Right]: {
      graphics: new Graphics(),
      isSelected: false,
      direction: SComponentPositionConstraintDirection.Right,
    },
    [SComponentPositionConstraintDirection.Bottom]: {
      graphics: new Graphics(),
      isSelected: false,
      direction: SComponentPositionConstraintDirection.Bottom,
    },
    [SComponentPositionConstraintDirection.CenterHorizontal]: {
      graphics: new Graphics(),
      isSelected: false,
      direction: SComponentPositionConstraintDirection.CenterHorizontal,
    },
    [SComponentPositionConstraintDirection.CenterVertical]: {
      graphics: new Graphics(),
      isSelected: false,
      direction: SComponentPositionConstraintDirection.CenterVertical,
    },
  };

  private _linkedDirections = [
    [
      SComponentPositionConstraintDirection.Left,
      SComponentPositionConstraintDirection.CenterHorizontal,
      SComponentPositionConstraintDirection.Right,
    ],
    [
      SComponentPositionConstraintDirection.Top,
      SComponentPositionConstraintDirection.CenterVertical,
      SComponentPositionConstraintDirection.Bottom,
    ],
  ];

  private _currentConstraintDirection?: SComponentPositionConstraintDirection;

  private _changeConstraintDirectionTo(direction: SComponentPositionConstraintDirection) {
    this._currentConstraintDirection = direction;

    const constraint = this._constraints[direction];

    constraint.isSelected = constraint.isSelected ? false : true;

    // Reset all loinked directions exception current
    if (constraint.isSelected) {
      this._linkedDirections.forEach((linkedDirections) => {
        linkedDirections.forEach((linkedDirection) => {
          if (linkedDirection === direction) {
            linkedDirections.forEach((d) => (this._constraints[d].isSelected = d !== direction ? false : true));
          }
        });
      });
    }

    const currentConstraints = Object.values(this._constraints)
      .filter((constr) => constr.isSelected)
      .map((x) => x.direction);
    this.onConstraintChanged.next(currentConstraints);
    // this.redraw();
  }

  redraw() {
    this.container.removeChildren();

    const padding = 5;
    const constLineWidth = 12;

    const bgG = new Graphics().rect(0, 0, this.width, this.height).fill(0xefeeee);

    this.container.addChild(bgG);

    Object.keys(this._constraints).forEach((key) => {
      const constDirection = <SComponentPositionConstraintDirection>+key;
      const constraint = this._constraints[constDirection];

      let moveXTo = 0;
      let moveYTo = 0;
      let lineXTo = 0;
      let lineYTo = 0;

      if (constDirection === SComponentPositionConstraintDirection.Left) {
        moveXTo = padding;
        moveYTo = this.height / 2;
        lineXTo = padding + constLineWidth;
        lineYTo = this.height / 2;
      } else if (constDirection === SComponentPositionConstraintDirection.Top) {
        moveXTo = this.width / 2;
        moveYTo = padding;
        lineXTo = this.width / 2;
        lineYTo = padding + constLineWidth;
      } else if (constDirection === SComponentPositionConstraintDirection.Right) {
        moveXTo = this.width - constLineWidth - padding;
        moveYTo = this.height / 2;
        lineXTo = this.width - padding;
        lineYTo = this.height / 2;
      } else if (constDirection === SComponentPositionConstraintDirection.Bottom) {
        moveXTo = this.width / 2;
        moveYTo = this.height - constLineWidth - padding;
        lineXTo = this.width / 2;
        lineYTo = this.height - padding;
      } else if (constDirection === SComponentPositionConstraintDirection.CenterHorizontal) {
        moveXTo = this.width / 2 - constLineWidth / 2;
        moveYTo = this.height / 2;
        lineXTo = this.width / 2 + constLineWidth / 2;
        lineYTo = this.height / 2;
      } else if (constDirection === SComponentPositionConstraintDirection.CenterVertical) {
        moveXTo = this.width / 2;
        moveYTo = this.height / 2 - constLineWidth / 2;
        lineXTo = this.width / 2;
        lineYTo = this.height / 2 + constLineWidth / 2;
      }

      constraint.graphics.clear();
      constraint.graphics
        .moveTo(moveXTo, moveYTo)
        .lineTo(lineXTo, lineYTo)
        .stroke(constraint.isSelected ? this._selectedStrokeStyle : this._strokeStyle);
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

  public static getCurrentPositionConstraintsValues(
    currentConstraints: SComponentPositionConstraintDirection[],
    currentGComp: StlbBaseGComponent
  ) {
    const constraints: { [key in SComponentPositionConstraintDirection]?: number } = {};

    currentConstraints.forEach((constraint) => {
      if (constraint === SComponentConstraintDirection.Left) {
        constraints[SComponentConstraintDirection.Left] = currentGComp.x;
      } else if (constraint === SComponentConstraintDirection.Top) {
        constraints[SComponentConstraintDirection.Top] = currentGComp.y;
      } else if (constraint === SComponentConstraintDirection.Right) {
        constraints[SComponentConstraintDirection.Right] =
          currentGComp.parentGComp.width - currentGComp.x - currentGComp.width;
      } else if (constraint === SComponentConstraintDirection.Bottom) {
        constraints[SComponentConstraintDirection.Bottom] =
          currentGComp.parentGComp.height - currentGComp.y - currentGComp.height;
      } else if (constraint === SComponentConstraintDirection.CenterHorizontal) {
        constraints[SComponentConstraintDirection.CenterHorizontal] = undefined;
      } else if (constraint === SComponentConstraintDirection.CenterVertical) {
        constraints[SComponentConstraintDirection.CenterVertical] = undefined;
      }
    });

    return constraints;
  }

  public static calculateCurrentPositionBasedOnParentGComponent(
    currentGComp: StlbBaseGComponent,
    parentGComp: StlbBaseGComponent,
    constraints: { [key in SComponentPositionConstraintDirection]?: number }
  ): { x?: number; y?: number; width?: number; height?: number } {
    const newPosition: { x?: number; y?: number; width?: number; height?: number } = {};

    Object.keys(constraints).forEach((key) => {
      const constraint = <SComponentConstraintDirection>+key;
      const constraintValue = constraints[constraint];

      if (constraint === SComponentConstraintDirection.Left) {
        newPosition.x = constraintValue!;
      } else if (constraint === SComponentConstraintDirection.Top) {
        newPosition.y = constraintValue!;
      } else if (constraint === SComponentConstraintDirection.Right) {
        newPosition.width = parentGComp.width - currentGComp.x - constraintValue!;
      } else if (constraint === SComponentConstraintDirection.Bottom) {
        newPosition.height = parentGComp.height - currentGComp.y - constraintValue!;
      } else if (constraint === SComponentConstraintDirection.CenterHorizontal) {
        newPosition.x = (parentGComp.x + parentGComp.width) / 2 - currentGComp.width / 2;
      } else if (constraint === SComponentConstraintDirection.CenterVertical) {
        newPosition.y = (parentGComp.y + parentGComp.height) / 2 - currentGComp.height / 2;
      }
    });

    return newPosition;
  }
}
