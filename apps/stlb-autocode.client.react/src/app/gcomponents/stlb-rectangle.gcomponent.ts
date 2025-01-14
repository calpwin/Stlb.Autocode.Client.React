import { StlbBaseGcomponent } from '@stlb-autocode/stlb-base';
import { Container, Graphics } from 'pixi.js';

export class StlbRectangleGComponent extends StlbBaseGcomponent {
  private readonly _rectangleG = new Graphics().rect(0, 0, 100, 200).fill('red');

  constructor(parentCompId: string) {
    super(parentCompId);

    this.width = 200;
    this.height = 100;
    this.x = 100;
    this.y = 100    
  }

  renderTo(parent: Container) {
    super.renderTo(parent);    

    this.redraw();

    parent.addChild(this._container);

    return this._container;
  }

  redraw(): void {
    super.redraw();
    
    this._rectangleG.width = this.width;
    this._rectangleG.height = this.height;
    this._container.addChild(this._rectangleG);
  }
}
