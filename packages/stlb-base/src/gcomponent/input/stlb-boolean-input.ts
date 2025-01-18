import { SComponentPropertyType } from '../../redux/stlb-properties';
import { StlbBaseinput } from './stlb-base-input';

export class StlbBooleanInput extends StlbBaseinput<boolean> {
  constructor(name: string, width?: number) {
    super(name, SComponentPropertyType.Boolean, width);
  }

  render() {
    super.render();

    return this.container;
  }
}
