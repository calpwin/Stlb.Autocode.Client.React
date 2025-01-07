import { Container, ContainerChild, Text } from 'pixi.js';
import { StlbBaseGcomponent } from '@stlb-autocode/stlb-base';

export class StlbTextGComponent extends StlbBaseGcomponent {  
  settings: { [name: string]: string } = { name: 'Andrei' };

  renderTo(parent: Container) {    
    this._container.position.x = 50;
    this._container.position.y = 50;

    const text = new Text();
    text.text = `Yeeh hello ${this.settings.name}!`;

    this._container.addChild(text);

    parent.addChild(this._container);

    return this._container;
  }
}
