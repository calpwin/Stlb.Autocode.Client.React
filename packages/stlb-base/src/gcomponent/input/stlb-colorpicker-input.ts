import { Container, Graphics } from 'pixi.js';
import { SComponentPropertyType } from '../../redux/stlb-properties';
import { StlbBaseinput } from './stlb-base-input';

export class StlbColorPickerInput extends StlbBaseinput<string> {
  constructor(name: string, width?: number) {
    super(name, SComponentPropertyType.String, width);
  }

  render() {
    super.render();

    return this.container;
  }

  drawInputValue() {
    const pickerWidth = 10;
    const padding = 5;

    const inputValueG = super.drawInputValue();

    const container = new Container();
    container.position.x = inputValueG.position.x;
    container.position.y = inputValueG.position.y;

    inputValueG.position.x = pickerWidth + padding;
    container.addChild(inputValueG);

    const pickerG = new Graphics()
      .circle(inputValueG.position.x + pickerWidth / 2, inputValueG.position.y, 5)
      .fill('red');
    container.addChild(pickerG);

    return inputValueG;
  }
}
