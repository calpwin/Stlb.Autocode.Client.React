// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Component, KeyboardEvent } from 'react';
/** .js file **/
import styles from './app.module.less';

import {LogicEditor} from '@stlb-autocode/logic-editor';
import {StlbGlobals, StlbStore} from '@stlb-autocode/stlb-base';

import { Application, Sprite, Assets, Text, setPositions } from 'pixi.js';
import { TextFloatBoxGComponent } from '../../../../packages/stlb-base/src/gcomponent/input-parser/text-float-box.gcomponent';
import { TextWord } from '../../../../packages/stlb-base/src/gcomponent/input-parser/text-word';
import { TextProcessor } from './text-processor';
import { AutocodeBlock } from './feature.autocode-block/autocodeblock';
import { ClientComponent, ComponentArgument } from './feature.autocode-block/component-argument';
import { GComponentEditor } from './gcomponent-editor/gcomponent-editor';
import { GComponentPropertyEditor } from './gcomponent-editor/gcomponent-property-editor';

class App extends Component {
  _isComponentMounted = false;

  state = { text: '' };

  private _textProcessor!: TextProcessor;
  private _logicEditor!: LogicEditor;

  private _currentWord: TextWord = new TextWord('');
  private _textWords: TextWord[] = [this._currentWord];
  // private _textGCompoent: Text = new Text();
  private _app: Application = new Application();

  private _flosatTextBoxGComponent?: TextFloatBoxGComponent;

  render() {
    return (
      <div id="app-wrapper" style={{ width: '100%', height: '100%' }}>
        <div id="text-editor-wrapper" style={{ width: '100%', height: '100%' }}>
          {/* <AutocodeBlock text={this.state.text} /> */}
        </div>

        <div id='stlb-colorpicker' style={{position: 'relative', display: 'block', width: 200, height: 200}}></div>
      </div>      
    );
  }

  componentDidMount() {
    if (this._isComponentMounted) return;

    StlbGlobals.app = this._app;

    initPixiJs(this._app).then(() => {
      const gCompEditorG = new GComponentEditor().render();    
      const gCompPropertyEditorG = new GComponentPropertyEditor().renderTo(this._app.stage);    
  
      this._logicEditor = new LogicEditor(this._app);
      const gLogicEditorG = this._logicEditor.render();
      this._app.stage.addChild(gLogicEditorG);      
    });

    // this._textProcessor = new TextProcessor(this._app);

    

    // this._textProcessor.clientRenderEvents.on(
    //   'render',
    //   (args: string[]) => {
    //     console.log(args);

    //     var arg = JSON.parse(args[0]) as ClientComponent;

    //     this.setState({ text: arg.arguments.at(0)?.value });
    //   }
    // );

    

    this._isComponentMounted = true;
  }
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
    backgroundColor: 'white'
  });  

  // The application will create a canvas element for you that you
  // can then insert into the DOM
  document.getElementById('text-editor-wrapper')!.appendChild(app.canvas);

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
