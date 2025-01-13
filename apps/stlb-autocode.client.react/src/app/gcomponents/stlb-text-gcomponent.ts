import { Container, ContainerChild, Text, validFormats } from 'pixi.js';
import { StlbBaseGcomponent } from '@stlb-autocode/stlb-base';

export class StlbTextGComponent extends StlbBaseGcomponent {
  constructor(parentCompId: string) {
    super(parentCompId);

    this.setProperty({ name: 'name', value: 'Andrei' });
    this.setProperty({ name: 'width', value: 200 });
    this.setProperty({ name: 'height', value: 100 });

    this._onPropertyChange.subscribe({
      next: (prop) => {
        if (prop.name === 'name') this._textG.text = prop.value;
      },
    });
  }

  private readonly _textG = new Text();

  renderTo(parent: Container) {
    super.renderTo(parent);

    this._container.position.x = 50;
    this._container.position.y = 50;

    this._textG.text = `Yeeh hello ${this.getProperty('name').value}!`;

    this._container.addChild(this._textG);
    parent.addChild(this._container);

    return this._container;
  }
}
