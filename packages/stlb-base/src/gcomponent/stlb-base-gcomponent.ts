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

  private readonly _resizers: { [key in StlcResizerSide]: StlbResizer } = {
    [StlcResizerSide.Left]: new StlbResizer(StlcResizerSide.Left, this),
    [StlcResizerSide.Top]: new StlbResizer(StlcResizerSide.Top, this),
    [StlcResizerSide.Right]: new StlbResizer(StlcResizerSide.Right, this),
    [StlcResizerSide.Bottom]: new StlbResizer(StlcResizerSide.Bottom, this),
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
    } else if (property.name === 'y') {
      this._container.position.y = (<SComponentProperty<number>>property).value;

      this.redraw();
    } else if (property.name === 'width') {
      this._container.width = (<SComponentProperty<number>>property).value;

      // Only if both width and height exists
      if (this._properties['height']) this.redraw();
    } else if (property.name === 'height') {
      this._container.height = (<SComponentProperty<number>>property).value;

      // Only if both width and height exists
      if (this._properties['width']) this.redraw();
    }

    StlbStore.default.dispatch(
      setComponentProperty({ compId: this.id, property })
    );

    this._onPropertyChange.next({ ...property });
  }

  getProperty<T = string | number>(name: string) {
    return <SComponentProperty<T>>this._properties[name];
  }

  renderTo(parent: Container) {}

  redraw() {
    this._container.removeChildren();

    for (const key in StlcResizerSide) {
      Object.keys(StlcResizerSide).forEach((key) => {
        if (+key >= 0) {
          const resizerG = this._resizers[+key as 0 | 1 | 2 | 3].render();
          this._container.addChild(resizerG);
        }
      });
    }
  }
}
