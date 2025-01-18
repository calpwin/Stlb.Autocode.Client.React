import { SComponentPropertyType } from '../../redux/stlb-store-slice';
import { StlbBaseinput } from './stlb-base-input';

export class StlbBooleanInput extends StlbBaseinput<boolean> {
  constructor(name: string, width?: number) {
    super(name, width, SComponentPropertyType.Boolean);
  }

  render() {
    super.render();

    return this.container;
  }
}
