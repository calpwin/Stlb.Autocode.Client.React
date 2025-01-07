import { Container, Text } from 'pixi.js';
import { StlbBaseGcomponent } from '../../../../../packages/stlb-base/src/gcomponent/stlb-base-gcomponent';

export class StlbTextGComponent extends StlbBaseGcomponent {
  settings: { [name: string]: string } = { name: 'Andrei' };

  renderTo(parent: Container) {
    const container = new Container();
    container.position.x = 50;
    container.position.y = 50;

    const text = new Text();
    text.text = `Yeeh hello ${this.settings.name}!`;

    container.addChild(text);
    parent.addChild(container);

    return container;
  }
}
