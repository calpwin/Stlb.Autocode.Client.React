import { Container, Graphics } from 'pixi.js';
import * as StlbStore from '../redux/stlb-store';
import {
  addComponent,
  SComponentProperty,
  selectComponent,
  setComponentSettings as setComponentProperty,
} from '../redux/stlb-store-slice';
import { Guid } from 'guid-typescript';
import { Subject } from 'rxjs';
import { StlbResizer, StlcResizerSide } from './resizer';

export abstract class StlbBaseGcomponent {
  readonly id = Guid.create().toString();
  protected readonly _container: Container = new Container();

  private readonly _properties: { [name: string]: SComponentProperty } = {};
  protected readonly _onPropertyChange = new Subject<SComponentProperty>();

  private readonly _resizers = {
    [StlcResizerSide.Left]: new StlbResizer(StlcResizerSide.Left, this),
  };

  constructor() {
    StlbStore.default.dispatch(
      addComponent({ id: this.id, properties: { ...this._properties } })
    );

    this.bindevents();
  }

  bindevents() {
    this._container.eventMode = 'static';
    this._container.on('click', () => {
      StlbStore.default.dispatch(selectComponent({ compId: this.id }));
    });
  }

  setProperty(property: SComponentProperty<string | number>) {
    this._properties[property.name] = property;

    if (property.name === 'x') {
      this._container.position.x = (<SComponentProperty<number>>property).value;

      this.redraw();
    } else if (property.name === 'width') {
      this._container.width = (<SComponentProperty<number>>property).value;

      // Only if both width and height exists
      if (this._properties['heiight']) this.redraw();
    }

    StlbStore.default.dispatch(
      setComponentProperty({ compId: this.id, property })
    );

    this._onPropertyChange.next({ ...property });
  }

  getProperty<T = string | number>(name: string) {
    return <SComponentProperty<T>>this._properties[name];
  }

  renderTo(parent: Container) {    
  }

  redraw() {
    this._container.removeChildren();

    const resizerG = this._resizers[StlcResizerSide.Left].render();
    this._container.addChild(resizerG);
  }
}
