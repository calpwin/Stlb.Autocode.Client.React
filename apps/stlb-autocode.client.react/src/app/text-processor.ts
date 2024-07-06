import { TextFloatBoxGComponent } from './text-float-box.gcomponent';
import {
  EventMessage,
  EventMessageType,
  NextVariantsMessage,
  SelectVariantMessage,
  TextSocket,
} from './text-socket';
import { TextWord } from './text-word';
import { Application, Text } from 'pixi.js';

export class TextProcessor {
  private _textSocket!: TextSocket;

  private _currentWord: TextWord = new TextWord('', this.createTextG(''));
  private _textWords: TextWord[] = [this._currentWord];

  private _nextTextVariants: TextWord[] = [];

  private _flosatTextBoxGComponent?: TextFloatBoxGComponent;

  constructor(private readonly _app: Application) {
    document.addEventListener('keydown', (e: any) => this._handleKeyDown(e));

    this._textSocket = new TextSocket('localhost:5149/ws');

    this._textSocket.messageRecievedEvent.on('event', (e: EventMessage) => {
      if (e.type === EventMessageType.NextVariants) {
        const eventNewVariants = e as NextVariantsMessage;

        this._nextTextVariants = eventNewVariants.variantsCodes.map(
          (code) => new TextWord(code, this.createTextG(code))
        );

        this.toggleContextMenu(this._currentWord);
      }
    });
  }

  private toggleContextMenu(word: TextWord, open = true) {
    if (this._flosatTextBoxGComponent?.graphics) {
      this._app.stage.removeChild(this._flosatTextBoxGComponent.graphics);
      this._flosatTextBoxGComponent.destroy();
      this._flosatTextBoxGComponent = undefined;
    }

    if (!open) return;

    const lastWord = this._textWords.at(this._textWords.length - 1)!;

    this._flosatTextBoxGComponent = new TextFloatBoxGComponent(
      lastWord.textG.position.x,
      lastWord.textG.position.y,
      lastWord.textG.width,
      word,
      this._nextTextVariants
    );

    this._app.stage.addChild(this._flosatTextBoxGComponent.render());
  }

  private createTextG(text: string) {
    return new Text({
      text: text,
      style: {
        fontFamily: 'Arial',
        fontSize: 24,
        fill: 0xff1010,
        align: 'center',
      },
    });
  }

  private _handleKeyDown(event: KeyboardEvent): any {
    console.log(event.key);

    switch (event.key) {
      case 'Backspace':
        this._currentWord.text = this._currentWord.text.slice(0, -1);

        if (this._currentWord.text.length === 0 && this._textWords.length > 1) {
          const previouseWord = this._textWords.at(this._textWords.length - 2)!;
          this._currentWord = previouseWord;
          this._textWords = this._textWords.slice(0, -1);
        }

        this._updateText();

        if (this._flosatTextBoxGComponent) {
          this.toggleContextMenu(
            this._textWords.at(this._textWords.length - 1)!,
            true
          );
        }
        break;
      case 'Control':
        this.toggleContextMenu(
          this._textWords.at(this._textWords.length - 1)!,
          this._flosatTextBoxGComponent ? false : true
        );
        break;
      case 'Enter':
        this._currentWord.fromWord(
          this._flosatTextBoxGComponent!.selectedWord.textWord
        );
        this._updateText();

        this._textSocket.sendMessage({
          type: EventMessageType.SelectVariant,
          selectedVariant: this._currentWord.text,
        });

        this._textWords.push(new TextWord(' ', this.createTextG(' ')));

        this._currentWord = new TextWord('', this.createTextG(''));
        this._textWords.push(this._currentWord);

        this._updateText();

        this.toggleContextMenu(this._currentWord, false);
        break;
      default:
        if (!/^([a-z\d\s,\.]){1}$/i.test(event.key)) return;

        this.processNewLetter(event.key);

        this._updateText();

        if (this._flosatTextBoxGComponent) {
          this.toggleContextMenu(
            this._textWords.at(this._textWords.length - 1)!,
            true
          );
        }
        break;
    }
  }

  private processNewLetter(letter: string) {
    const isCurrentWordSpaces =
      this._currentWord.text.length > 0 &&
      this._currentWord.text.trim().length === 0;

    if (
      (letter === ' ' && this._currentWord.text !== ' ') ||
      (letter !== ' ' && isCurrentWordSpaces)
    ) {
      this._currentWord = new TextWord(letter, this.createTextG(''));
      this._textWords.push(this._currentWord);
      return;
    }

    this._currentWord.text += letter;
  }

  private _updateText() {
    this._app.stage.removeChildren();

    let currentX = 0;

    this._textWords.forEach((textWord) => {
      const textWordG = this.createTextG(textWord.text);
      textWord.textG = textWordG;

      textWordG.position.x = currentX;

      currentX += textWordG.width;

      this._app.stage.addChild(textWordG);
    });
  }
}
