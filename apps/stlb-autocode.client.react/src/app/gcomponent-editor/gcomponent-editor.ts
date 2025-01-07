import { StlbGlobals } from '@stlb-autocode/stlb-base';
import { Container, Text } from 'pixi.js';
import { StlbTextGComponent } from '../gcomponents/stlb-text-gcomponent';
import {StlbIoc} from '@stlb-autocode/stlb-base';
import { GComponentList } from 'packages/stlb-base/src/gcomponent-list';
import { StlbIocTypes } from 'packages/stlb-base/src/IoC/ioc-types';

export class GComponentEditor {
  renderTo(parent: Container) {
    var container = new Container();
    container.width = StlbGlobals.app.renderer.width - 300;
    container.height = (StlbGlobals.app.renderer.height / 3) * 2;
    container.position.x = 0;
    container.position.y = 0;

    const textG = new StlbTextGComponent();
    textG.renderTo(container);

    const gComponentList = StlbIoc.get<GComponentList>(StlbIocTypes.GComponentList);
    gComponentList.addComponent(textG);

    parent.addChild(container);

    return container;
  }
}
