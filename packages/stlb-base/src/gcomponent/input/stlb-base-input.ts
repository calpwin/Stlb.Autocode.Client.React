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
  protected readonly _nameWidth: number = 0;
  protected readonly _height = 20;
  private readonly _padding = 5;

  protected _isActive = false;

  private _cursorG: Graphics;
  private _cursoTimer!: NodeJS.Timer;

  constructor(protected readonly _name: string, protected readonly valueType: SComponentPropertyType, width?: number) {
    this._inputWidth = width ?? this._inputWidth;

    if (_name) this._nameWidth = _name.length <= 2 ? 20 : 35;

    this._cursorG = this._drawCursorG();

    this._bindKeyboardEvents();
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

    if (this._name) {
      const nameG = this.drawNameG();
      this.container.addChild(nameG);
    }

    const inputValueG = this.drawInputValue();
    this.container.addChild(inputValueG);

    this.container.addChild(this._cursorG);

    return this.container;
  }

  drawButtomLineG() {
    const buttomLineG = new Graphics()
      .moveTo(this._nameWidth + this._padding, this._height)
      .lineTo(this._inputWidth, this._height)
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

  // #endregion

  drawInputValue(): Container {
    this._inputValueTextG.text = this.inputText;
    this._inputValueTextG.position.x = this._nameWidth + this._padding;
    this._inputValueTextG.position.y = 2;
    this._inputValueTextG.eventMode = 'static';
    this._inputValueTextG.hitArea = new Rectangle(0, 0, this._inputWidth, this._height);
    this._inputValueTextG.on('click', () => {
      this._isActive = true;
      this._enableCursor();
    });

    return this._inputValueTextG;
  }

  // #region Cursor

  private _drawCursorG() {
    const cursor = new Graphics()
      .moveTo(this._nameWidth + this._padding, 0)
      .lineTo(this._nameWidth + this._padding, this._height)
      .stroke({ width: 2, color: 'black' });

    cursor.visible = false;

    return cursor;
  }

  private _enableCursor() {
    if (!this._cursorG) return;

    this._cursoTimer = setInterval(() => {
      this._cursorG.visible = !this._cursorG.visible;
    }, 450);
  }

  private _disableCursor() {
    this._cursorG.visible = false;
    clearInterval(this._cursoTimer);
  }

  private _moveCursor(nextPosXMove: -1 | 1) {
    const posScale = 7;
    const newPos = this._cursorG.position.x + nextPosXMove * posScale;

    if (newPos >= 0 && newPos <= this._inputValueString.length * posScale) this._cursorG.position.x = newPos;
  }

  // #endregion

  protected _bindKeyboardEvents() {
    window.addEventListener('keydown', (event: KeyboardEvent) => {
      if (!this._isActive) return;

      if (event.code === 'Escape') {
        this._isActive = false;
        this._disableCursor();

        this.onChanged.next(this._valueToTypeValue());
      } else if (event.code === 'Backspace') {
        this._inputValue = this._inputValueString.substring(0, this._inputValueString.length - 1);
      } else if (event.key.length === 1 && event.key.match(/[a-zA-Z0-9\.\s]/)) {
        this._inputValue += event.key;
      } else if (event.key === 'ArrowLeft') {
        this._moveCursor(-1);
      } else if (event.key === 'ArrowRight') {
        this._moveCursor(1);
      }

      this.inputText = this._inputValue;

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
