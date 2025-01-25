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
  selectComponent,
  setComponentSettings as setComponentProperty,
  unselectComponent,
} from '../redux/stlb-store-slice';
import { Guid } from 'guid-typescript';
import { Subject } from 'rxjs';
import { StlbResizer, StlcResizerSide } from './resizer';
import { StlbNumberInput } from './input/stlb-number-input';
import { StlbGlobals } from '../globals';
import { FlexboxAdapterUtil } from '../utils/flexbox-adapter.util';
import { StlbGComponentMovier } from './stlb-gcomponent-movier';
import {
  SComponentProperty,
  SComponentPropertyType,
  SComponentPropertyAttribute,
  SComponentNumberSystemProperty,
  SComponentJsonSystemProperty,
} from '../redux/stlb-properties';
import { StlbTextInput } from './input/stlb-text-input';
import { StlbBaseinput } from './input/stlb-base-input';
import { StlbBooleanInput } from './input/stlb-boolean-input';
import { StlbColorPickerInput } from './input/stlb-colorpicker-input';

export abstract class StlbBaseGComponent {
  public readonly id!: string;
  public readonly _container: Container = new Container();
  public readonly propertyEditorContainer: Container = new Container();
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
    ['x']: new SComponentNumberSystemProperty('x', 0),
    ['y']: new SComponentNumberSystemProperty('y', 0),
    ['width']: new SComponentNumberSystemProperty('width', 0),
    ['height']: new SComponentNumberSystemProperty('height', 0),
    ['paddings']: new SComponentJsonSystemProperty('paddings', JSON.stringify(this._paddings)),
    ['positionConstraints']: new SComponentJsonSystemProperty('positionConstraints', JSON.stringify({})),
    ['flexboxAlign']: new SComponentJsonSystemProperty(
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

    this.setProperty(new SComponentJsonSystemProperty('paddings', JSON.stringify(this._paddings)));
  }

  public get positionConstraints(): { [key in SComponentPositionConstraintDirection]?: number } {
    return JSON.parse(<string>this._properties['positionConstraints'].value);
  }
  public set positionConstraints(v: { [key in SComponentPositionConstraintDirection]?: number }) {
    this.setProperty(new SComponentJsonSystemProperty('positionConstraints', JSON.stringify(v)));
  }

  public get isMovable(): boolean {
    return this._componentMovier.isActive;
  }
  public set isMovable(value: boolean) {
    value ? this._componentMovier.enable() : this._componentMovier.disable();
  }

  public get flexboxAlign(): SComponentFlexboxAlign {
    return JSON.parse(<string>this._properties['flexboxAlign'].value);
  }
  public set flexboxAlign(v: SComponentFlexboxAlign) {
    this.setProperty(new SComponentJsonSystemProperty('flexboxAlign', JSON.stringify(v)));

    if (v.alignType === SComponentAlignType.Absolute) {
      this._childComps.forEach((c) => (c.isMovable = true));
    } else {
      this._childComps.forEach((c) => (c.isMovable = false));
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
    this.setProperty(new SComponentNumberSystemProperty('x', v));
  }

  public get y(): number {
    return <number>this._properties['y'].value;
  }
  public get innerY(): number {
    return this.y + this._paddings[SComponentPaddingDirection.Top].value;
  }
  public set y(v: number) {
    this.setProperty(new SComponentNumberSystemProperty('y', v));
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
    this.setProperty(new SComponentNumberSystemProperty('width', v));
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
    this.setProperty(new SComponentNumberSystemProperty('height', v));
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

  setProperty(property: SComponentProperty<string | number | boolean>) {
    this._properties[property.name] = property;

    if (property.name === 'x') {
      this._container.position.x = (<SComponentNumberSystemProperty>property).value;

      this.redraw();
    } else if (property.name === 'y') {
      this._container.position.y = (<SComponentNumberSystemProperty>property).value;

      this.redraw();
    } else if (property.name === 'width') {
      this.graphics.width = (<SComponentNumberSystemProperty>property).value;

      this.redraw();
    } else if (property.name === 'height') {
      this.graphics.height = (<SComponentNumberSystemProperty>property).value;

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

  getProperties(onlyWithAttributes?: SComponentPropertyAttribute[]) {
    let props = Object.keys(this._properties).map((key) => this._properties[key]);

    if (!onlyWithAttributes || onlyWithAttributes.length === 0) return props;

    return props.filter((p) => p.attributes.some((x) => onlyWithAttributes.some((y) => y === x)));
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

  // #region Properties
  private _propertyEditorCurrentX = 0;
  private _propertyEditorCurrentY = 0;
  private _propertyEditorPaddings = 10;

  redrawProperty() {
    this.propertyEditorContainer.removeChildren();

    this.drawSystemProperty();
    this.drawCustomProperty();
  }

  private _inputXG?: StlbBaseinput<number>;
  private _inputYG?: StlbBaseinput<number>;
  private _inputWidthG?: StlbBaseinput<number>;
  private _inputHeightG?: StlbBaseinput<number>;
  private _inputPaddingLeftRightG?: StlbBaseinput<number>;
  private _inputPaddingRightBottomG?: StlbBaseinput<number>;

  drawSystemProperty() {
    const propGrapchics: Container[] = [];

    this._propertyEditorCurrentX = this._propertyEditorPaddings;
    this._propertyEditorCurrentY = this._propertyEditorPaddings;

    /// X
    if (!this._inputXG) {
      const xInput = new StlbNumberInput('X');
      xInput.container.position.x = this._propertyEditorCurrentX;
      xInput.container.position.y = this._propertyEditorCurrentY;
      xInput.inputText = this.x.toFixed(0);

      this._propertyEditorCurrentX += xInput.width;

      propGrapchics.push(xInput.render());

      xInput.onChanged.subscribe({
        next: (value) => {
          this.x = value;
        },
      });

      this._inputXG = xInput;
    } else {
      this._inputXG.inputText = this.x.toFixed(0);
      propGrapchics.push(this._inputXG.container);

      this._propertyEditorCurrentX += this._inputXG.width;
    }

    /// Y
    if (!this._inputYG) {
      const yInput = new StlbNumberInput('Y');
      yInput.container.position.x = this._propertyEditorCurrentX + this._propertyEditorPaddings;
      yInput.container.position.y = this._propertyEditorCurrentY;
      yInput.inputText = this.y.toFixed(0);

      this._propertyEditorCurrentX = this._propertyEditorPaddings;
      this._propertyEditorCurrentY += 20 + this._propertyEditorPaddings;

      propGrapchics.push(yInput.render());

      yInput.onChanged.subscribe({
        next: (value) => {
          this.y = value;
        },
      });

      this._inputYG = yInput;
    } else {
      this._inputYG.inputText = this.y.toFixed(0);
      propGrapchics.push(this._inputYG.container);

      this._propertyEditorCurrentX = this._propertyEditorPaddings;
      this._propertyEditorCurrentY += 20 + this._propertyEditorPaddings;
    }

    /// Width
    if (!this._inputWidthG) {
      const widthInput = new StlbNumberInput('W');
      widthInput.container.position.x = this._propertyEditorCurrentX;
      widthInput.container.position.y = this._propertyEditorCurrentY;
      widthInput.inputText = this.width.toFixed(0);

      this._propertyEditorCurrentX += widthInput.width;

      propGrapchics.push(widthInput.render());

      widthInput.onChanged.subscribe({
        next: (value) => {
          this.width = value;
        },
      });

      this._inputWidthG = widthInput;
    } else {
      this._inputWidthG.inputText = this.width.toFixed(0);
      propGrapchics.push(this._inputWidthG.container);

      this._propertyEditorCurrentX += this._inputWidthG.width;
    }

    /// Height
    if (!this._inputHeightG) {
      const heightInputG = new StlbNumberInput('H');
      heightInputG.container.position.x = this._propertyEditorCurrentX + this._propertyEditorPaddings;
      heightInputG.container.position.y = this._propertyEditorCurrentY;
      heightInputG.inputText = this.height.toFixed(0);

      this._propertyEditorCurrentX = this._propertyEditorPaddings;
      this._propertyEditorCurrentY += 20 + this._propertyEditorPaddings;

      propGrapchics.push(heightInputG.render());

      heightInputG.onChanged.subscribe({
        next: (value) => {
          this.height = value;
        },
      });

      this._inputHeightG = heightInputG;
    } else {
      this._inputHeightG.inputText = this.height.toFixed(0);
      propGrapchics.push(this._inputHeightG.container);

      this._propertyEditorCurrentX = this._propertyEditorPaddings;
      this._propertyEditorCurrentY += 20 + this._propertyEditorPaddings;
    }

    // Paddings
    if (!this._inputPaddingLeftRightG || !this._inputPaddingRightBottomG) {
      const paddingstLeftRightInputG = new StlbNumberInput('PL');
      paddingstLeftRightInputG.container.position.x = this._propertyEditorCurrentX;
      paddingstLeftRightInputG.container.position.y = this._propertyEditorCurrentY;
      paddingstLeftRightInputG.inputText = this._paddings[SComponentPaddingDirection.Left].value.toFixed(0);
      paddingstLeftRightInputG.onChanged.subscribe({
        next: (value) => {
          const paddingValue = value;
          this.setPadding(paddingValue, SComponentPaddingDirection.Left);
          this.setPadding(paddingValue, SComponentPaddingDirection.Right);
        },
      });

      this._propertyEditorCurrentX += paddingstLeftRightInputG.width + this._propertyEditorPaddings;

      const paddingstTopBottomInputG = new StlbNumberInput('PT');
      paddingstTopBottomInputG.container.position.x = this._propertyEditorCurrentX;
      paddingstTopBottomInputG.container.position.y = this._propertyEditorCurrentY;
      paddingstTopBottomInputG.inputText = this._paddings[SComponentPaddingDirection.Top].value.toFixed(0);
      paddingstTopBottomInputG.onChanged.subscribe({
        next: (value) => {
          const paddingValue = value;
          this.setPadding(paddingValue, SComponentPaddingDirection.Top);
          this.setPadding(paddingValue, SComponentPaddingDirection.Bottom);
        },
      });

      this._propertyEditorCurrentX = this._propertyEditorPaddings;
      this._propertyEditorCurrentY += paddingstLeftRightInputG.height * 2 + this._propertyEditorPaddings;

      propGrapchics.push(paddingstLeftRightInputG.render());
      propGrapchics.push(paddingstTopBottomInputG.render());

      this._inputPaddingLeftRightG = paddingstLeftRightInputG;
      this._inputPaddingRightBottomG = paddingstTopBottomInputG;
    } else {
      this._inputPaddingLeftRightG.inputText = this._paddings[SComponentPaddingDirection.Left].value.toFixed(0);
      this._inputPaddingRightBottomG.inputText = this._paddings[SComponentPaddingDirection.Top].value.toFixed(0);

      propGrapchics.push(this._inputPaddingLeftRightG.container);
      propGrapchics.push(this._inputPaddingRightBottomG.container);

      this._propertyEditorCurrentX = this._propertyEditorPaddings;
      this._propertyEditorCurrentY += this._inputPaddingLeftRightG.height * 2 + this._propertyEditorPaddings;
    }

    // GComponent Constraints
    const constraintsG = new GComponentPositionConstraint(
      Object.keys(this.positionConstraints).map((c) => <SComponentPositionConstraintDirection>+c)
    );
    constraintsG.container.position.x = this._propertyEditorCurrentX;
    constraintsG.container.position.y = this._propertyEditorCurrentY;
    constraintsG.redraw();
    constraintsG.onConstraintChanged.subscribe((constraints) => {
      const constraintsValues = GComponentPositionConstraint.getCurrentPositionConstraintsValues(constraints, this);
      this.positionConstraints = constraintsValues;
    });

    this._propertyEditorCurrentX = this._propertyEditorPaddings;
    this._propertyEditorCurrentY += constraintsG.height + this._propertyEditorPaddings;

    propGrapchics.push(constraintsG.container);

    // Flexbox adapter property
    const flexboxAdapter = new FlexboxAdapterUtil(this.flexboxAlign);
    const flexboxAdapterG = flexboxAdapter.redrawPropertyEditor();
    flexboxAdapterG.position.x = this._propertyEditorCurrentX;
    flexboxAdapterG.position.y = this._propertyEditorCurrentY;
    flexboxAdapter.onAlignChanged.subscribe((newAlign) => {
      this.flexboxAlign = newAlign;
    });

    propGrapchics.push(flexboxAdapterG);
    propGrapchics.push(flexboxAdapterG);

    this._propertyEditorCurrentX = this._propertyEditorPaddings;
    this._propertyEditorCurrentY += flexboxAdapter.propertyEditorHeight + this._propertyEditorPaddings;

    // Add all prop graphics
    this.propertyEditorContainer.addChild(
      new Graphics()
        .rect(0, 0, this.propertyEditorContainer.getBounds().rectangle.width, this._propertyEditorCurrentY)
        .fill('white')
    );
    propGrapchics.forEach((propG) => {
      this.propertyEditorContainer.addChild(propG);
    });
  }

  private readonly _customPropInputs: { [prtopName: string]: StlbBaseinput<any> } = {};

  drawCustomProperty() {
    this.getProperties([SComponentPropertyAttribute.Custom]).forEach((prop) => {
      let propinput = this._customPropInputs[prop.name];
      if (!propinput) {
        let xInput: StlbBaseinput<any>;
        if (prop.type === SComponentPropertyType.String) {
          xInput = new StlbTextInput(prop.name);
          xInput.inputText = <string>prop.value;
        } else if (prop.type === SComponentPropertyType.Number) {
          xInput = new StlbNumberInput(prop.name);
          xInput.inputText = (<number>prop.value).toFixed(0);
        } else if (prop.type === SComponentPropertyType.Boolean) {
          xInput = new StlbBooleanInput(prop.name);
          xInput.inputText = <string>prop.value;
        } else if (prop.type === SComponentPropertyType.Color) {
          xInput = new StlbColorPickerInput(prop.name);
          xInput.inputText = <string>prop.value;
        } else {
          throw new Error(`Custom property is not support ${prop.type}`);
        }

        propinput = xInput;
        propinput.render();
        this._customPropInputs[prop.name] = propinput;
      } else {
        propinput.inputText = <string>prop.value;
      }
      
      propinput.container.position.x = this._propertyEditorCurrentX;
      propinput.container.position.y = this._propertyEditorCurrentY;

      this._propertyEditorCurrentX = this._propertyEditorPaddings;
      this._propertyEditorCurrentY += propinput.height + this._propertyEditorPaddings;

      this.propertyEditorContainer.addChild(propinput.container);
    });
  }

  // #endregion

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
