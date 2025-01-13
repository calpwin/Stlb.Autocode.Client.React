import { Container, Graphics } from 'pixi.js';
import { GComponentList } from './gcomponent-list';
import { StlbBaseGcomponent } from './stlb-base-gcomponent';
import { StlbGlobals } from '../globals';

export class StlbGComponentEditor extends StlbBaseGcomponent {
  constructor() {
    super(GComponentList.RootCompId);

    this.setProperty({ name: 'width', value: StlbGlobals.app.renderer.width - 300 });
    this.setProperty({ name: 'height', value: (StlbGlobals.app.renderer.height / 3) * 2 });
    this.setProperty({ name: 'x', value: 0 });
    this.setProperty({ name: 'y', value: 0 });
  }

  redraw(): void {
    const containerG = new Graphics()
      .rect(
        0,
        0,
        StlbGlobals.app.renderer.width - 300,
        (StlbGlobals.app.renderer.height / 3) * 2
      )
      .fill('white');
    this._container.addChild(containerG);    
  }
}
