import { Application, Container, Graphics } from 'pixi.js';
import styles from './logic-editor.module.less';
import { LogicDataBlock } from './logic-data.block';
import { TextSocket } from './text-socket';
import { StlbGlobals } from '@stlb-autocode/stlb-base';

export class LogicEditor {
  private readonly _textSocket: TextSocket;
  constructor(private readonly _app: Application) {
    this._textSocket = new TextSocket('localhost:5149/ws');
  }

  render() {
    const container = new Container();
    container.position.x = 0;
    container.position.y = (StlbGlobals.app.renderer.height / 3) * 2;
    container.height = (StlbGlobals.app.renderer.height / 3) * 1;

    var lineG = new Graphics()
      .moveTo(0, 0)
      .lineTo(StlbGlobals.app.renderer.width, 0)
      .stroke({ color: 0xeeeeee, width: 1 });

    const logicBlock = new LogicDataBlock(
      ['Name', 'Surname'],
      this._textSocket
    );
    const logicBlockG = logicBlock.render();

    container.addChild(logicBlockG);
    container.addChild(lineG);

    return container;
  }
}
