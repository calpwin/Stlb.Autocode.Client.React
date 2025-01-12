import { StlbBaseGcomponent } from '@stlb-autocode/stlb-base';
import { Container, Graphics } from 'pixi.js';

export class StlbRectangleGComponent extends StlbBaseGcomponent {
  private readonly _rectangleG = new Graphics().rect(0, 0, 100, 200);

  constructor() {
    super();

    this.setProperty({ name: 'width', value: 200 });
    this.setProperty({ name: 'height', value: 100 });
  }

  renderTo(parent: Container) {
    super.renderTo(parent);

    this._container.position.x = 100;
    this._container.position.y = 100;

    this._rectangleG.fill('red');
    this._rectangleG.width = this.getProperty<number>('width').value;
    this._rectangleG.height = this.getProperty<number>('height').value;

    this._container.addChild(this._rectangleG);   
    parent.addChild(this._container);

    

    return this._container;
  }
}
