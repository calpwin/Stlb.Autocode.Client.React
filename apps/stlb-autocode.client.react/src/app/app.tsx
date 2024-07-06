// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Component, KeyboardEvent } from 'react';
import styles from './app.module.less';

import { Application, Sprite, Assets, Text } from 'pixi.js';
import { TextFloatBoxGComponent } from './text-float-box.gcomponent';
import { TextWord } from './text-word';
import { TextSocket } from './text-socket';
import { TextProcessor } from './text-processor';

class App extends Component {
  _isComponentMounted = false;

  state = { receivedEvent: null };

  private _textProcessor!: TextProcessor;

  private _currentWord: TextWord = new TextWord('');
  private _textWords: TextWord[] = [this._currentWord];
  // private _textGCompoent: Text = new Text();
  private _app: Application = new Application();

  private _flosatTextBoxGComponent?: TextFloatBoxGComponent;

  render() {
    return '';
  }

  componentDidMount() {
    if (this._isComponentMounted) return;

    this._textProcessor = new TextProcessor(this._app);

    // this._textSocket = new TextSocket('localhost:5149/ws');

    // document.addEventListener('keydown', (e: any) => this._handleKeyDown(e));

    initPixiJs(this._app);

    this._isComponentMounted = true;
  }

  // private toggleContextMenu(word: TextWord, open = true) {
  //   if (this._flosatTextBoxGComponent?.graphics) {
  //     this._app.stage.removeChild(this._flosatTextBoxGComponent.graphics);
  //     this._flosatTextBoxGComponent.destroy();
  //     this._flosatTextBoxGComponent = undefined;
  //   }

  //   if (!open) return;

  //   const lastWord = this._textWords.at(this._textWords.length - 1)!;

  //   this._flosatTextBoxGComponent = new TextFloatBoxGComponent(
  //     lastWord.textG.position.x,
  //     lastWord.textG.position.y,
  //     lastWord.textG.width,
  //     word,
  //     [
  //       new TextWord('Oppotunity', this.createTextG('Oppotunity')),
  //       new TextWord('Dusters', this.createTextG('Oppotunity')),
  //       new TextWord('Alligorye', this.createTextG('Alligorye')),
  //       new TextWord('New York', this.createTextG('New York')),
  //     ]
  //   );

  //   this._app.stage.addChild(this._flosatTextBoxGComponent.render());
  // }

  // private _handleKeyDown(event: KeyboardEvent): any {
  //   console.log(event.key);

  //   switch (event.key) {
  //     case 'Backspace':
  //       this._currentWord.text = this._currentWord.text.slice(0, -1);

  //       if (this._currentWord.text.length === 0 && this._textWords.length > 1) {
  //         const previouseWord = this._textWords.at(this._textWords.length - 2)!;
  //         this._currentWord = previouseWord;
  //         this._textWords = this._textWords.slice(0, -1);
  //       }

  //       this._updateText();

  //       if (this._flosatTextBoxGComponent) {
  //         this.toggleContextMenu(
  //           this._textWords.at(this._textWords.length - 1)!,
  //           true
  //         );
  //       }
  //       break;
  //     case 'Control':
  //       this.toggleContextMenu(
  //         this._textWords.at(this._textWords.length - 1)!,
  //         this._flosatTextBoxGComponent ? false : true
  //       );
  //       break;
  //     default:
  //       if (!/^([a-z\d\s,\.]){1}$/i.test(event.key)) return;

  //       this.processNewLetter(event.key);

  //       this._updateText();

  //       if (this._flosatTextBoxGComponent) {
  //         this.toggleContextMenu(
  //           this._textWords.at(this._textWords.length - 1)!,
  //           true
  //         );
  //       }
  //       break;
  //   }
  // }

  // private createTextG(text: string) {
  //   return new Text({
  //     text: text,
  //     style: {
  //       fontFamily: 'Arial',
  //       fontSize: 24,
  //       fill: 0xff1010,
  //       align: 'center',
  //     },
  //   });
  // }

  // private processNewLetter(letter: string) {
  //   const isCurrentWordSpaces =
  //     this._currentWord.text.length > 0 &&
  //     this._currentWord.text.trim().length === 0;

  //   if (
  //     (letter === ' ' && this._currentWord.text !== ' ') ||
  //     (letter !== ' ' && isCurrentWordSpaces)
  //   ) {
  //     this._currentWord = new TextWord(letter);
  //     this._textWords.push(this._currentWord);
  //     return;
  //   }

  //   this._currentWord.text += letter;
  // }

  // private _updateText() {
  //   this._app.stage.removeChildren();

  //   let currentX = 0;

  //   this._textWords.forEach((textWord) => {
  //     const textWordG = this.createTextG(textWord.text);
  //     textWord.textG = textWordG;

  //     textWordG.position.x = currentX;

  //     currentX += textWordG.width;

  //     this._app.stage.addChild(textWordG);
  //   });
  // }
}

async function initPixiJs(app: Application) {
  // The application will create a renderer using WebGL, if possible,
  // with a fallback to a canvas render. It will also setup the ticker
  // and the root stage PIXI.Container
  // this._app = new Application();

  // Wait for the Renderer to be available
  await app.init({
    width: Math.max(1, document.body.clientWidth - 4),
    height: Math.max(1, document.body.clientHeight - 4),
    resolution: devicePixelRatio,
    autoDensity: true,
  });

  // The application will create a canvas element for you that you
  // can then insert into the DOM
  document.body.appendChild(app.canvas);

  // // load the texture we need
  // const texture = await Assets.load('assets/bunny.jpg');

  // // This creates a texture from a 'bunny.png' image
  // const bunny = new Sprite(texture);

  // // Setup the position of the bunny
  // bunny.x = app.renderer.width / 2;
  // bunny.y = app.renderer.height / 2;

  // // Rotate around the center
  // bunny.anchor.x = 0.5;
  // bunny.anchor.y = 0.5;

  // Add the bunny to the scene we are building
  // app.stage.addChild(text);

  // // Listen for frame updates
  // app.ticker.add(() => {
  //   // each frame we spin the bunny around a bit
  //   bunny.rotation += 0.01;
  // });
}

export default App;
