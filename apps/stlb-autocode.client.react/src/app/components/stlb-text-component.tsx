import { StlbBaseComponent } from './stlb-base-component';

export class StlbTextComponent extends StlbBaseComponent<{ text: string }> {
  settings!: { [name: string]: string };

  state = { text: '' };

  constructor(props: { text: string }) {
    super(props);

    this.state.text = this.props.text;
    this.settings = { text: this.state.text };
  }

  render() {
    return <div id="stlb-text-wrapper">{this.state.text} DELETE IT!!</div>;
  }
}
