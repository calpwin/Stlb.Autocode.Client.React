import { injectable } from 'inversify';
import { StlbBaseGcomponent } from './stlb-base-gcomponent';
import { StlbEditorGComponent } from './stlb-editor.gcomponent';
import { StlbGlobals } from '../globals';

@injectable()
export class GComponentList {
  private readonly _components: { [compId: string]: StlbBaseGcomponent } = {};

  constructor() {
    const rootGComp = new StlbEditorGComponent();
    this._components[StlbGlobals.RootCompId] = rootGComp;

    rootGComp.redraw();

    StlbGlobals.app.stage.addChild(rootGComp._container);
  }

  addComponent(comp: StlbBaseGcomponent) {
    this._components[comp.id] = comp;

    const parentGComp = this._components[comp.parentCompId];
    parentGComp.addChild(comp);

    comp.redraw();
  }

  removeComponent(compid: string) {
    const gComp = this._components[compid];
    const parentGComp = this._components[gComp.parentCompId];

    parentGComp._container.removeChild(gComp._container);
    delete this._components[compid];
  }

  getComponentById(id: string): StlbBaseGcomponent | undefined {
    if (id in this._components === false) return undefined;

    return this._components[id];
  }
}
