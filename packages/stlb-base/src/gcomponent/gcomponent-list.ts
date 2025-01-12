import { injectable } from 'inversify';
import { StlbBaseGcomponent } from './stlb-base-gcomponent';

@injectable()
export class GComponentList {
  private readonly _components: { [compId: string]: StlbBaseGcomponent } = {};

  addComponent(comp: StlbBaseGcomponent) {
    this._components[comp.id] = comp;
  }

  getComponentById(id: string): StlbBaseGcomponent | undefined {
    if (id in this._components === false) return undefined;

    return this._components[id];
  }
}
