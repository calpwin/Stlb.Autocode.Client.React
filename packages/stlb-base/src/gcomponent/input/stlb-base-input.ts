import { Container, Graphics, FederatedMouseEvent, Rectangle, Text } from 'pixi.js';
import { Subject } from 'rxjs';
import { StlbGlobals } from '../../globals';
import { SComponentPropertyType } from '../../redux/stlb-properties';

export abstract class StlbBaseinput<Type extends string | number | boolean> {
  private _inputValue: string = '';
  private _inputValueString: string = '';

  public get inputText(): string {
    return this._inputValue;
  }
  public set inputText(v: string) {
    this._inputValue = v;
    this._inputValueString = v.toString();
    this._inputValueTextG.text = this._inputValueString;
  }

  public get value(): Type {
    return this._valueToTypeValue();
  }

  protected _inputValueTextG: Text = new Text({ style: { fill: 'black', fontSize: 12 } });

  public readonly onChanged = new Subject<Type>();
  public readonly container = new Container();

  protected _inputWidth = 100;
  protected readonly _nameWidth: number;
  protected readonly _height = 20;

  protected _isActive = false;

  constructor(protected readonly _name: string, protected readonly valueType: SComponentPropertyType, width?: number) {
    this._inputWidth = width ?? this._inputWidth;

    this._nameWidth = _name.length <= 2 ? 20 : 35;

    this._bindKeyvoardEvents();
  }

  public get width() {
    return this._nameWidth + this._inputWidth;
  }

  public get height() {
    return this._height;
  }

  public render(): Container {
    this.container.removeChildren();

    const bgG = new Graphics().rect(0, 0, this._nameWidth + this._inputWidth, this._height).fill('white');
    this.container.addChild(bgG);

    const buttomLineG = this.drawButtomLineG();
    this.container.addChild(buttomLineG);

    const nameG = this.drawNameG();
    this.container.addChild(nameG);

    const inputValueG = this.drawInputValue();
    this.container.addChild(inputValueG);

    return this.container;
  }

  drawButtomLineG() {
    const buttomLineG = new Graphics()
      .moveTo(0, this._height)
      .lineTo(this._nameWidth + this._inputWidth, this._height)
      .stroke('black');

    return buttomLineG;
  }

  // #region Name
  drawNameG() {
    const onMousemove = (e: FederatedMouseEvent) => this._changeValueByMouse(e);
    let onMouseup = undefined;
    onMouseup = (e: FederatedMouseEvent) => {
      this.onChanged.next(this._valueToTypeValue());

      this._isMouseValueChangeActive = false;
      StlbGlobals.app.stage.off('mousemove', onMousemove!);
      StlbGlobals.app.stage.off('mouseup', onMouseup!);

      e.stopPropagation();
    };

    const nameG = new Graphics().rect(0, 0, this._nameWidth, this._height).fill('white');

    if (this.valueType === SComponentPropertyType.Number) {
      nameG.eventMode = 'static';
      nameG.on('mousedown', (e: FederatedMouseEvent) => {
        this._isMouseValueChangeActive = true;

        StlbGlobals.app.stage.on('mousemove', onMousemove);
        StlbGlobals.app.stage.on('mouseup', onMouseup);

        e.stopPropagation();
      });
    }

    const nameTextG = new Text({ style: { fill: 'black', fontSize: 14 } });
    nameTextG.position.x = 0;
    nameTextG.position.y = 2;
    nameTextG.text = this._name + ':';
    nameG.addChild(nameTextG);

    return nameG;
  }

  private readonly _mouseValueChangeScale = 2;
  private _isMouseValueChangeActive = false;

  private _changeValueByMouse(e: FederatedMouseEvent) {
    if (!this._isMouseValueChangeActive) return;

    const value = parseInt(this._inputValueTextG.text);
    this.inputText = (value + e.movementX).toFixed(0);
    this._inputValueTextG.text = this.inputText;

    e.stopImmediatePropagation();
    e.preventDefault();
  }

  // #endregion Name

  drawInputValue(): Container {
    this._inputValueTextG.text = this.inputText;
    this._inputValueTextG.position.x = this._nameWidth + 5;
    this._inputValueTextG.position.y = 2;
    this._inputValueTextG.eventMode = 'static';
    this._inputValueTextG.hitArea = new Rectangle(this._nameWidth, 0, this._nameWidth + this._inputWidth, this._height);
    this._inputValueTextG.on('click', () => {
      this._isActive = true;
    });

    return this._inputValueTextG;
  }

  protected _bindKeyvoardEvents() {
    window.addEventListener('keydown', (event: KeyboardEvent) => {
      if (!this._isActive) return;

      if (event.code === 'Escape') {
        this._isActive = false;

        this.onChanged.next(this._valueToTypeValue());
      } else if (event.code === 'Backspace') {
        this._inputValue = this._inputValueString.substring(0, this._inputValueString.length - 1);
      } else if (event.key.length === 1 && event.key.match(/[a-zA-Z0-9\.\s]/)) {
        this._inputValue += event.key;
      }

      this._inputValueTextG.text = this._inputValue;

      event.preventDefault();
    });
  }

  private _valueToTypeValue(): Type {
    if (this.valueType === SComponentPropertyType.String) {
      return <Type>this._inputValue;
    } else if (this.valueType === SComponentPropertyType.Number) {
      return <Type>parseInt(this._inputValue);
    } else if (this.valueType === SComponentPropertyType.Boolean) {
      return <Type>(this._inputValue === 'true');
    }

    throw new Error(`Type ${this.valueType} is not implemented`);
  }
}
