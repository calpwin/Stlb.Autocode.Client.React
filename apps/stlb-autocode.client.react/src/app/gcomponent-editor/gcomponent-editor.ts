import { FlexboxAdapterUtil, StlbGlobals } from '@stlb-autocode/stlb-base';
import { Container, Graphics, Text } from 'pixi.js';
import { StlbTextGComponent } from '../gcomponents/stlb-text-gcomponent';
import { StlbIoc } from '@stlb-autocode/stlb-base';
import { GComponentList } from 'packages/stlb-base/src/gcomponent/gcomponent-list';
import { StlbIocTypes } from 'packages/stlb-base/src/IoC/ioc-types';
import { StlbRectangleGComponent } from '../gcomponents/stlb-rectangle.gcomponent';
import { SComponentPaddingDirection } from 'packages/stlb-base/src/redux/stlb-store-slice';

export class GComponentEditor {
  render() {  

    const gComponentList = StlbIoc.get<GComponentList>(
      StlbIocTypes.GComponentList
    );

    // const textG = new StlbTextGComponent();
    // textG.renderTo(container);

    // -------------------

    const rectG = new StlbRectangleGComponent(StlbGlobals.RootCompId);
    rectG.width = 500;
    rectG.height = 250;
    gComponentList.addComponent(rectG);

    const innerRectG1 = new StlbRectangleGComponent(rectG.id);    
    gComponentList.addComponent(innerRectG1);
    innerRectG1.y = 20;
    innerRectG1.x = 20;
    innerRectG1.width = rectG.width / 4;
    innerRectG1.height = rectG.height / 4;        

    const innerRectG2 = new StlbRectangleGComponent(rectG.id);    
    gComponentList.addComponent(innerRectG2);
    innerRectG2.x = 20;
    innerRectG2.y = 20;
    innerRectG2.width = rectG.width / 4;
    innerRectG2.height = rectG.height / 4;        

    rectG.setPadding(10, SComponentPaddingDirection.Left);
    rectG.setPadding(10, SComponentPaddingDirection.Top);
    rectG.setPadding(10, SComponentPaddingDirection.Right);
    rectG.setPadding(10, SComponentPaddingDirection.Bottom);

    // -------------------

    // const rootGComp = gComponentList.getComponentById(StlbGlobals.RootCompId);

    // const flexbox = new FlexboxAdapterUtil();
    // flexbox.redraw();
    // flexbox.testContainer.position.x = 400;
    // flexbox.testContainer.position.y = 70;
    // rootGComp?._container.addChild(flexbox.testContainer);

  }
}
