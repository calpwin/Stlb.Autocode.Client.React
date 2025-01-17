import { StlbBaseGComponent, StlbGlobals, StlbIoc, StlbStore } from '@stlb-autocode/stlb-base';
import { Container, Graphics, Text } from 'pixi.js';
import watch from 'redux-watch';
import { StlbTextGComponent } from '../gcomponents/stlb-text-gcomponent';
import { GComponentList } from 'packages/stlb-base/src/gcomponent/gcomponent-list';
import { StlbIocTypes } from 'packages/stlb-base/src/IoC/ioc-types';

export class GComponentPropertyEditor {
  
  private _selectedGComp?: StlbBaseGComponent;

  renderTo(parent: Container) {
    var container = new Container();
    container.width = 300;
    container.height = (StlbGlobals.app.renderer.height / 3) * 2;
    container.position.x = StlbGlobals.app.renderer.width - 300;
    container.position.y = 0;

    var lineG = new Graphics()
      .moveTo(0, 0)
      .lineTo(0, (StlbGlobals.app.renderer.height / 3) * 2)
      .stroke({ color: 0xeeeeee, width: 1 });

    container.addChild(lineG);
    parent.addChild(container);

    let currentX = 0;
    let currentY = container.getBounds().rectangle.height;

    const w = watch(StlbStore.default.getState, 'stlbbase.selectedComponentId');
    StlbStore.default.subscribe(
      w((newVal?: string, oldVal?: string) => {
        if (!newVal) return;

        const compList = StlbIoc.get<GComponentList>(
          StlbIocTypes.GComponentList
        );
        this._selectedGComp = compList.getComponentById(newVal)!;

        this._selectedGComp.redrawProperty();
        container.removeChildren();
        container.addChild(this._selectedGComp.propertyContainer);

        currentY = this._selectedGComp.propertyContainer.getBounds().rectangle.height;

        container.addChild(new Graphics().rect(0, currentY, 70, 40).fill('red'));        
      })
    );

    

    return container;
  }

  private _renderProperty(comp: StlbTextGComponent) {}
}
