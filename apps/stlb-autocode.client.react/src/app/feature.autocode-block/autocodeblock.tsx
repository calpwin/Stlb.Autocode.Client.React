import { Component, ReactNode } from 'react';
import { StlbTextComponent } from '../components/stlb-text-component';

export class AutocodeBlock extends Component<{ text: string }> {
  state = { text: '' };

  constructor(props: { text: string }) {
    super(props);
  }

  render() {
    return (
      <div id="text-editor-wrapper" style={{ width: '100%', height: '50%' }}>
        <StlbTextComponent text={this.props.text} />
      </div>
    );
  }
}
