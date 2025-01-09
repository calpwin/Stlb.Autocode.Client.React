import { Application, Container, Graphics, Text } from 'pixi.js';
import { TextSocket } from './text-socket';
import { LogicBlock } from './logic.block';
import { LogicBlockPopUp } from './logic-block-popup';
import { Stlbinput } from '../../../stlb-base/src/gcomponent/stlb-input';

export class LogicDataBlock {
  constructor(
    public readonly props: string[],    
    private readonly _textSocket: TextSocket
  ) {}

  private readonly _container = new Container({ x: 50, y: 50 });

  render() {
    const block = new Graphics().rect(0, 0, 200, 80).fill(0xffeedd);
    this._container.addChild(block);

    for (let index = 0; index < this.props.length; index++) {
      const prop = this.props[index];

      this._renderProperty(prop, index);
      this._renderNextBtn();
    }

    return this._container;
  }

  private _renderProperty(name: string, index: number) {
    const propInputG = new Stlbinput().render();
    propInputG.text = name;
    propInputG.position.set(20, 13 + 20 * index);

    this._container.addChild(propInputG);

    const circle = new Graphics().circle(180, 21 * (index + 1), 5).fill('red');
    this._container.addChild(circle);
  }

  private _renderNextBtn() {
    const nextBtn = new Graphics().circle(200, 40, 10).fill('yellow');
    this._container.addChild(nextBtn);

    nextBtn.eventMode = 'static';
    nextBtn.on('click', (e) => {
      console.log(e.globalY);

      fetch('http://127.0.0.1:5149/get-logic-blocks', {
        method: 'post',
        body: JSON.stringify({ logicParameterCode: 'Text' }),
        headers: {
          'content-type': 'application/json',
        },
      })
        .then((response) => response.text())
        .then((text) => {
          const json: LogicBlock[] = JSON.parse(text);

          const popup = new LogicBlockPopUp(
            { x: e.globalX + 10, y: e.globalY},
            json.map((x) => x.code)            
          );

          popup.render();
        });
    });
  }
}
