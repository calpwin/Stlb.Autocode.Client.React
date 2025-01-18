import { SComponentPropertyType } from '../../redux/stlb-store-slice';
import { StlbBaseinput } from './stlb-base-input';

export class StlbNumberInput extends StlbBaseinput<number> {
  constructor(name: string, width?: number) {
    super(name, width, SComponentPropertyType.Number);
  }

  render() {
    super.render();

    return this.container;
  }
}
