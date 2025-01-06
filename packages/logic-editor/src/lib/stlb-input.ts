import {
  Text,
} from 'pixi.js';

export class Stlbinput {
  private _inputText: string = '';
  public get inputText(): string {
    return this._inputText;
  }
  public set inputText(v: string) {
    this._inputText = v;
  }

  private _isActive = false;
  private _textG: Text = new Text({ style: { fill: 'black', fontSize: 12 } });

  constructor() {
    this._bindKeyvoardEvents();
  }

  private _bindKeyvoardEvents() {
    window.addEventListener('keydown', (event: KeyboardEvent) => {
      if (!this._isActive) return;

      if (event.code === 'Escape') {
        this._isActive = false;
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
    this._textG.text = this._inputText;

    this._textG.eventMode = 'static';
    this._textG.on('click', () => {
      this._isActive = true;
    });

    return this._textG;
  }
}
