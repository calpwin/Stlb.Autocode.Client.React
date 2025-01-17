import { Container, Graphics, Text } from 'pixi.js';
import { Subject } from 'rxjs';

export class Stlbinput {
  public readonly onChanged = new Subject<string>();
  public readonly container = new Container();

  private readonly _inputWidth = 50;
  private readonly _nameWidth = 20;
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
    const bgG = new Graphics().rect(0, 0, this._nameWidth + this._inputWidth, this._height).fill('white');
    const buttomLineG = new Graphics()
      .moveTo(0, this._height)
      .lineTo(this._nameWidth + this._inputWidth, this._height)
      .stroke('black');

    const nameG = new Graphics().rect(0, 0, this._nameWidth, this._height).fill('white');
    const nameTextG = new Text({ style: { fill: 'black', fontSize: 14 } });
    nameTextG.position.x = this._nameWidth / 2;
    nameTextG.position.y = this._height / 2;
    nameTextG.text = this._name + ':';

    this._textG.text = this._inputText;
    this._textG.position.x = this._nameWidth + 5;
    this._textG.position.y = 2;
    this._textG.eventMode = 'static';
    this._textG.on('click', () => {
      this._isActive = true;
    });

    this.container.addChild(bgG);
    this.container.addChild(this._textG);
    this.container.addChild(buttomLineG);

    return this.container;
  }
}
