import { Container, Graphics } from 'pixi.js';
import { GComponentList } from './gcomponent-list';
import { StlbBaseGComponent } from './stlb-base-gcomponent';
import { StlbGlobals } from '../globals';

export class StlbEditorGComponent extends StlbBaseGComponent {
  constructor() {
    super('none', StlbGlobals.RootCompId);

    this.width = StlbGlobals.app.renderer.width - 300;
    this.height = (StlbGlobals.app.renderer.height / 3) * 2;
    this.x = 0;
    this.y = 0;
  }

  drawGraphics(): void {
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
