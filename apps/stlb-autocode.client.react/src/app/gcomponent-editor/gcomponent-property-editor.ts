import { StlbGlobals, StlbStore } from '@stlb-autocode/stlb-base';
import { Container, Graphics, Text } from 'pixi.js';
import watch from 'redux-watch';

export class GComponentPropertyEditor {
  renderTo(parent: Container) {
    var container = new Container();
    container.width = 300;
    container.height = (StlbGlobals.app.renderer.height / 3) * 2;
    container.position.x = StlbGlobals.app.renderer.width - 300;
    container.position.y = 0;

    var text = new Text({ style: { fontSize: 12, fill: 'black' } });
    text.text = 'dsdsdsdfdfdfdfdfd';
    container.addChild(text);

    var lineG = new Graphics()
      .moveTo(0, 0)
      .lineTo(0, (StlbGlobals.app.renderer.height / 3) * 2)
      .stroke({ color: 0xeeeeee, width: 1 });

    container.addChild(lineG);
    parent.addChild(container);

    const w = watch(StlbStore.default.getState, 'counter.value');
    StlbStore.default.subscribe(
      w((newVal, oldVal, objPath) => {
        console.log(newVal, objPath);
      })
    );

    return container;
  }
}
