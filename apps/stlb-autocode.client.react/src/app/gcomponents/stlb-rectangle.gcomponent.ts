import { StlbBaseGComponent } from '@stlb-autocode/stlb-base';
import { Color, Container, Graphics } from 'pixi.js';

export class StlbRectangleGComponent extends StlbBaseGComponent {
  private readonly _rectangleG = new Graphics().rect(0, 0, 100, 200).fill('#'+(0x1033000+Math.random()*0xffeeff).toString(16).substr(1,6));

  constructor(parentCompId: string) {
    super(parentCompId);

    this.width = 200;
    this.height = 100;
    this.x = 100;
    this.y = 100    
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
