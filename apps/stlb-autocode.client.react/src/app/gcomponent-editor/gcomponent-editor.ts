import { StlbGlobals } from '@stlb-autocode/stlb-base';
import { Container, Graphics, Text } from 'pixi.js';
import { StlbTextGComponent } from '../gcomponents/stlb-text-gcomponent';
import { StlbIoc } from '@stlb-autocode/stlb-base';
import { GComponentList } from 'packages/stlb-base/src/gcomponent/gcomponent-list';
import { StlbIocTypes } from 'packages/stlb-base/src/IoC/ioc-types';
import { StlbRectangleGComponent } from '../gcomponents/stlb-rectangle.gcomponent';

export class GComponentEditor {
  render() {
  //   var container = new Container();
  //   container.width = StlbGlobals.app.renderer.width - 300;
  //   container.height = (StlbGlobals.app.renderer.height / 3) * 2;
  //   container.position.x = 0;
  //   container.position.y = 0;
  //   const containerG = new Graphics()
  //     .rect(
  //       0,
  //       0,
  //       StlbGlobals.app.renderer.width - 300,
  //       (StlbGlobals.app.renderer.height / 3) * 2
  //     )
  //     .fill('white');
  //   container.addChild(containerG);

    const gComponentList = StlbIoc.get<GComponentList>(
      StlbIocTypes.GComponentList
    );

    // const textG = new StlbTextGComponent();
    // textG.renderTo(container);

    const rectG = new StlbRectangleGComponent(GComponentList.RootCompId);
    gComponentList.addComponent(rectG);

    // gComponentList.addComponent(rectG);

    // parent.addChild(container);

    // return container;
  }
}
