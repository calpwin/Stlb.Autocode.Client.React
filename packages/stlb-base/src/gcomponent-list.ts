import { StlbBaseGcomponent } from './gcomponent/stlb-base-gcomponent';

export class GComponentList {
  private readonly _components: StlbBaseGcomponent[] = [];

  public get components() {
    return [...this._components];
  }

  addComponent(comp: StlbBaseGcomponent) {    

    this._components.push(comp);    
  }
}
