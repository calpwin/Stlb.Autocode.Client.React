import { Container, ContainerChild, Text, validFormats } from 'pixi.js';
import { StlbBaseGComponent } from '@stlb-autocode/stlb-base';
import { SComponentPropertyType } from 'packages/stlb-base/src/redux/stlb-store-slice';

export class StlbTextGComponent extends StlbBaseGComponent {
  constructor(parentCompId: string) {
    super(parentCompId);

    this.setProperty({ name: 'name', value: 'Andrei', type: SComponentPropertyType.String });
    this.setProperty({ name: 'width', value: 200, type: SComponentPropertyType.Number });
    this.setProperty({ name: 'height', value: 100, type: SComponentPropertyType.Number });

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
