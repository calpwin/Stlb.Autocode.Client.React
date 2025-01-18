import { SComponentPropertyType } from '../../redux/stlb-properties';
import { StlbBaseinput } from './stlb-base-input';

export class StlbNumberInput extends StlbBaseinput<number> {
  constructor(name: string, width?: number) {
    super(name, SComponentPropertyType.Number, width);
  }

  render() {
    super.render();

    return this.container;
  }
}
