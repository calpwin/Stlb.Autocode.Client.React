import { injectable } from 'inversify';
import { StlbBaseGComponent } from './stlb-base-gcomponent';
import { StlbEditorGComponent } from './stlb-editor.gcomponent';
import { StlbGlobals } from '../globals';

@injectable()
export class GComponentList {
  private readonly _components: { [compId: string]: StlbBaseGComponent } = {};

  constructor() {
    const rootGComp = new StlbEditorGComponent();
    this._components[StlbGlobals.RootCompId] = rootGComp;

    rootGComp.drawGraphics();

    StlbGlobals.app.stage.addChild(rootGComp._container);
  }

  addComponent(comp: StlbBaseGComponent) {
    this._components[comp.id] = comp;

    const parentGComp = this._components[comp.parentCompId];
    parentGComp.addChildToContainer(comp._container);

    comp.setParentGComponent(parentGComp);
    this._bindEventsToComp(comp);
    parentGComp.addChildComps(comp);

    comp.redraw();
  }

  removeComponent(compid: string) {
    const gComp = this._components[compid];
    const parentGComp = this._components[gComp.parentCompId];

    parentGComp._container.removeChild(gComp._container);
    delete this._components[compid];
  }

  getComponentById(id: string): StlbBaseGComponent | undefined {
    if (id in this._components === false) return undefined;

    return this._components[id];
  }

  private _bindEventsToComp(comp: StlbBaseGComponent) {
    comp._container.on('click', (e) => {
      Object.keys(this._components).forEach((key) => {
        const _comp = this._components[key];
        _comp.isSelected = false;
      });

      comp.isSelected = true;

      e.stopPropagation();
    });
  }
}
