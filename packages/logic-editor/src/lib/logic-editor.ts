import { Application, Graphics } from 'pixi.js';
import styles from './logic-editor.module.less';
import { LogicDataBlock } from './logic-data.block';
import { TextSocket } from './text-socket';

export class LogicEditor {
  private readonly _textSocket: TextSocket;
  constructor(private readonly _app: Application) {
    this._textSocket = new TextSocket('localhost:5149/ws');
  }

  renderDataBlock() {
    const logicBlock = new LogicDataBlock(['Name', 'Surname'], this._app, this._textSocket);
    logicBlock.render();
  }
}
