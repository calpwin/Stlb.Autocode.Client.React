import { Component, ReactNode } from 'react';

export class AutocodeBlock extends Component<{ text: string }> {
  state = { text: '' };

  constructor(props: { text: string }) {
    super(props);
  }

  render() {
    return (
      <div id="text-editor-wrapper" style={{ width: '100%', height: '50%' }}>
        {this.props.text}
      </div>
    );
  }
}
