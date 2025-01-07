import { StlbGlobals, StlbIoc, StlbStore } from '@stlb-autocode/stlb-base';
import { Container, Graphics, Text } from 'pixi.js';
import watch from 'redux-watch';
import { StlbTextGComponent } from '../gcomponents/stlb-text-gcomponent';
import { GComponentList } from 'packages/stlb-base/src/gcomponent-list';
import { StlbIocTypes } from 'packages/stlb-base/src/IoC/ioc-types';

export class GComponentPropertyEditor {
  private _text = new Text({ style: { fontSize: 12, fill: 'black' } });

  renderTo(parent: Container) {
    var container = new Container();
    container.width = 300;
    container.height = (StlbGlobals.app.renderer.height / 3) * 2;
    container.position.x = StlbGlobals.app.renderer.width - 300;
    container.position.y = 0;
    
    this._text.text = "Waitig ...";
    container.addChild(this._text);

    var lineG = new Graphics()
      .moveTo(0, 0)
      .lineTo(0, (StlbGlobals.app.renderer.height / 3) * 2)
      .stroke({ color: 0xeeeeee, width: 1 });

    container.addChild(lineG);
    parent.addChild(container);

    const w = watch(StlbStore.default.getState, 'stlbbase.selectedComponentId');
    StlbStore.default.subscribe(
      w((newVal?: string, oldVal?: string) => {
        if (!newVal) return;

        const compList = StlbIoc.get<GComponentList>(StlbIocTypes.GComponentList);
        const comp = <StlbTextGComponent>compList.getComponentById(newVal);
        this._text.text = comp.settings['name'];
      })
    );

    return container;
  }

  private _renderProperty(comp: StlbTextGComponent) {}
}
