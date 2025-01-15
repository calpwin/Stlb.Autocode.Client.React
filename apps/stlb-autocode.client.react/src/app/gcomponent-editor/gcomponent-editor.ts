import { FlexboxAdapterUtil, StlbGlobals } from '@stlb-autocode/stlb-base';
import { Container, Graphics, Text } from 'pixi.js';
import { StlbTextGComponent } from '../gcomponents/stlb-text-gcomponent';
import { StlbIoc } from '@stlb-autocode/stlb-base';
import { GComponentList } from 'packages/stlb-base/src/gcomponent/gcomponent-list';
import { StlbIocTypes } from 'packages/stlb-base/src/IoC/ioc-types';
import { StlbRectangleGComponent } from '../gcomponents/stlb-rectangle.gcomponent';

export class GComponentEditor {
  render() {  

    const gComponentList = StlbIoc.get<GComponentList>(
      StlbIocTypes.GComponentList
    );

    // const textG = new StlbTextGComponent();
    // textG.renderTo(container);

    // -------------------

    const rectG = new StlbRectangleGComponent(StlbGlobals.RootCompId);
    gComponentList.addComponent(rectG);

    const innerRectG = new StlbRectangleGComponent(rectG.id);    
    gComponentList.addComponent(innerRectG);
    innerRectG.x = 20;
    innerRectG.y = 20;
    innerRectG.width = rectG.width / 2;
    innerRectG.height = rectG.height / 2;        

    // -------------------

    // const rootGComp = gComponentList.getComponentById(StlbGlobals.RootCompId);

    // const flexbox = new FlexboxAdapterUtil();
    // flexbox.redraw();
    // flexbox.testContainer.position.x = 400;
    // flexbox.testContainer.position.y = 70;
    // rootGComp?._container.addChild(flexbox.testContainer);

  }
}
