import { StlbBaseGComponent } from '@stlb-autocode/stlb-base';
import { SComponentBooleanCustomProperty, SComponentNumberCustomProperty, SComponentStringCustomProperty } from 'packages/stlb-base/src/redux/stlb-properties';
import { Color, Container, Graphics } from 'pixi.js';

export class StlbRectangleGComponent extends StlbBaseGComponent {
  private readonly _rectangleG = new Graphics().rect(0, 0, 100, 200).fill('#'+(0x1033000+Math.random()*0xffeeff).toString(16).substr(1,6));

  constructor(parentCompId: string) {
    super(parentCompId);

    this.width = 200;
    this.height = 100;
    this.x = 100;
    this.y = 100    

    this.setProperty(new SComponentNumberCustomProperty('Cus', 123));
    this.setProperty(new SComponentStringCustomProperty('Nam', 'John'));
    this.setProperty(new SComponentBooleanCustomProperty('Flag', true));
  }

  renderTo(parent: Container) {
    super.renderTo(parent);    

    this.drawGraphics();

    parent.addChild(this._container);

    return this._container;
  }

  drawGraphics(): void {
    super.drawGraphics();
    
    this._rectangleG.width = this.width;
    this._rectangleG.height = this.height;
    this._container.addChild(this._rectangleG);
  }
}
