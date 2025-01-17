import { Container, FederatedMouseEvent, Graphics, Rectangle, Text } from 'pixi.js';
import { Subject } from 'rxjs';
import { StlbGlobals } from '../globals';

export class Stlbinput {
  public readonly onChanged = new Subject<string>();
  public readonly container = new Container();

  public get width() {
    return this._nameWidth + this._inputWidth;
  }

  public get height() {
    return this._height;
  }

  private readonly _inputWidth = 100;
  private readonly _nameWidth = 25;
  private readonly _height = 20;

  private _inputText: string = '';
  public get inputText(): string {
    return this._inputText;
  }
  public set inputText(v: string) {
    this._inputText = v;
    this._textG.text = v;
  }

  private _isActive = false;
  private _textG: Text = new Text({ style: { fill: 'black', fontSize: 12 } });

  constructor(private readonly _name: string) {
    this._bindKeyvoardEvents();
  }

  private _bindKeyvoardEvents() {
    window.addEventListener('keydown', (event: KeyboardEvent) => {
      if (!this._isActive) return;

      if (event.code === 'Escape') {
        this._isActive = false;

        this.onChanged.next(this._inputText);
      } else if (event.code === 'Backspace') {
        this._inputText = this._inputText.substring(0, this._inputText.length - 1);
      } else if (event.key.length === 1 && event.key.match(/[a-zA-Z0-9\.\s]/)) {
        this._inputText += event.key;
      }

      this._textG.text = this._inputText;

      event.preventDefault();
    });
  }

  render() {
    this.container.removeChildren();

    const bgG = new Graphics().rect(0, 0, this._nameWidth + this._inputWidth, this._height).fill('white');
    const buttomLineG = new Graphics()
      .moveTo(0, this._height)
      .lineTo(this._nameWidth + this._inputWidth, this._height)
      .stroke('black');

    const onMousemove = (e: FederatedMouseEvent) => this._changeValueByMouse(e);
    let onMouseup = undefined;
    onMouseup = (e: FederatedMouseEvent) => {
      this.onChanged.next(this._inputText);

      this._isMouseValueChangeActive = false;
      StlbGlobals.app.stage.off('mousemove', onMousemove!);
      StlbGlobals.app.stage.off('mouseup', onMouseup!);

      e.stopPropagation();
    };

    const nameG = new Graphics().rect(0, 0, this._nameWidth, this._height).fill('white');
    nameG.eventMode = 'static';

    nameG.on('mousedown', (e: FederatedMouseEvent) => {
      this._isMouseValueChangeActive = true;

      StlbGlobals.app.stage.on('mousemove', onMousemove);
      StlbGlobals.app.stage.on('mouseup', onMouseup);

      e.stopPropagation();
    });

    const nameTextG = new Text({ style: { fill: 'black', fontSize: 14 } });
    nameTextG.position.x = 0;
    nameTextG.position.y = 2;
    nameTextG.text = this._name + ':';
    nameG.addChild(nameTextG);

    this._textG.text = this._inputText;
    this._textG.position.x = this._nameWidth + 5;
    this._textG.position.y = 2;
    this._textG.eventMode = 'static';
    this._textG.hitArea = new Rectangle(this._nameWidth, 0, this._nameWidth + this._inputWidth, this._height);
    this._textG.on('click', () => {
      this._isActive = true;
    });

    this.container.addChild(bgG);
    this.container.addChild(nameG);
    this.container.addChild(this._textG);
    this.container.addChild(buttomLineG);

    return this.container;
  }

  private readonly _mouseValueChangeScale = 2;
  private _isMouseValueChangeActive = false;

  private _changeValueByMouse(e: FederatedMouseEvent) {
    if (!this._isMouseValueChangeActive) return;

    const value = parseInt(this._textG.text);
    this._inputText = (value + e.movementX).toFixed(0);
    this._textG.text = this._inputText;

    e.stopImmediatePropagation();
    e.preventDefault();
  }
}
