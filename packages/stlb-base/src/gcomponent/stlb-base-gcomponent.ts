import { Container } from 'pixi.js';
import * as StlbStore from '../redux/stlb-store';
import { selectComponent } from '../redux/stlb-store-slice';
import { Guid } from 'guid-typescript';

export abstract class StlbBaseGcomponent {
  constructor() {
    this.bindevents();
  }

  bindevents() {
    this._container.eventMode = 'static';
    this._container.on('click', () => {
      StlbStore.default.dispatch(selectComponent({compId: this.id}));
    });    
  }

  readonly id = Guid.create().toString();
  protected readonly _container: Container = new Container();

  abstract readonly settings: { [name: string]: string };
}
