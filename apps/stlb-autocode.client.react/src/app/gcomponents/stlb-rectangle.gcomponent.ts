import { StlbBaseGcomponent } from '@stlb-autocode/stlb-base';
import { Container, Graphics } from 'pixi.js';

export class StlbRectangleGComponent extends StlbBaseGcomponent {
  private readonly _rectangleG = new Graphics().rect(0, 0, 100, 200).fill('red');

  constructor(parentCompId: string) {
    super(parentCompId);

    this.setProperty({ name: 'width', value: 200 });
    this.setProperty({ name: 'height', value: 100 });
    this.setProperty({ name: 'x', value: 100 });
    this.setProperty({ name: 'y', value: 100 });
  }

  renderTo(parent: Container) {
    super.renderTo(parent);    

    this.redraw();

    parent.addChild(this._container);

    return this._container;
  }

  redraw(): void {
    super.redraw();
    
    // this._container.removeChild(this.graphics);
    // this._rectangleG = new Graphics().rect(0,0,100,70).fill('red');
    // this.graphics.clear();
    // this.graphics.rect(0,0,20,20);
    // this.graphics.fill('red');
    this._rectangleG.width = this.getProperty<number>('width').value;
    this._rectangleG.height = this.getProperty<number>('height').value;
    this._container.addChild(this._rectangleG);

    // this._container.addChild(this._rectangleG);
  }
}
