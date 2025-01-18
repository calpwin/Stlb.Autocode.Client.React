import { Container, Text } from 'pixi.js';
import { StlbBaseGComponent } from '@stlb-autocode/stlb-base';
import { SComponentNumberSystemProperty, SComponentStringSystemProperty } from 'packages/stlb-base/src/redux/stlb-properties';

export class StlbTextGComponent extends StlbBaseGComponent {
  constructor(parentCompId: string) {
    super(parentCompId);

    this.setProperty(new SComponentStringSystemProperty('name', 'Andrei'));
    this.setProperty(new SComponentNumberSystemProperty('width', 200));
    this.setProperty(new SComponentNumberSystemProperty('height', 100));

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
