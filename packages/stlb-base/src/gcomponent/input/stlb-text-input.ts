import { SComponentPropertyType } from '../../redux/stlb-properties';
import { StlbBaseinput } from './stlb-base-input';

export class StlbTextInput extends StlbBaseinput<string> {
  constructor(name: string, width?: number) {
    super(name, SComponentPropertyType.String, width);
  }

  render() {
    super.render();

    return this.container;
  }
}
