import { Component } from 'react';

// export class StlbComponentSettings {
//   constructor(public name: string, public value: string) {}
// }

export abstract class StlbBaseComponent<
  P = {},
  S = {},
  SS = any
> extends Component<P, S, SS> {
  abstract readonly settings: { [name: string]: string };
}
