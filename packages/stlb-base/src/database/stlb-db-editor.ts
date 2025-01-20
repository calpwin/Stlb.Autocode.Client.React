import { Container, parseDDS, Text } from 'pixi.js';
import { StlbTextInput } from '../gcomponent/input/stlb-text-input';

export class StlbDbEditor {
  private readonly _container = new Container();

  redraw() {
    this._container.removeChildren();

    const padding = 10;
    let currentX = 0;
    let currentY = 0;

    const newTypeBtnG = new Text({ text: 'New type', style: { fontSize: 14, fill: 'black' } });
    newTypeBtnG.position.x = currentX;
    newTypeBtnG.position.y = currentY;
    newTypeBtnG.eventMode = 'static';
    newTypeBtnG.on('click', () => {
      const newTypeG = this.drawAddType();
      newTypeG.position.x = currentX;
      newTypeG.position.y = currentY;

      this._container.addChild(newTypeG);

      currentY += newTypeG.getBounds().height + padding;
      newTypeBtnG.position.y = currentY;
    });

    this._container.addChild(newTypeBtnG);

    return this._container;
  }

  drawAddType() {
    const container = new Container();

    let currentX = 0;
    let currentY = 0;
    const padding = 10;

    const nameInput = new StlbTextInput('Name');
    nameInput.render();
    nameInput.container.position.x = currentX;
    nameInput.container.position.y = currentY;

    currentX += nameInput.width + padding;

    const typeInput = new StlbTextInput('Type');
    typeInput.render();
    typeInput.container.position.x = currentX;
    typeInput.container.position.y = currentY;

    currentX += typeInput.width + padding;

    container.addChild(nameInput.container);
    container.addChild(typeInput.container);

    return container;
  }
}
