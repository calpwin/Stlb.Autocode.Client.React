import { StlbBaseGComponent, StlbDbEditor, StlbGlobals, StlbIoc, StlbStore } from '@stlb-autocode/stlb-base';
import { Container, Graphics, Text } from 'pixi.js';
import watch from 'redux-watch';
import { StlbTextGComponent } from '../gcomponents/stlb-text-gcomponent';
import { GComponentList } from 'packages/stlb-base/src/gcomponent/gcomponent-list';
import { StlbIocTypes } from 'packages/stlb-base/src/IoC/ioc-types';

export class GComponentPropertyEditor {
  private _selectedGComp?: StlbBaseGComponent;

  private _container = new Container();
  private _isDbPropertyEnabled = false;

  renderTo(parent: Container) {
    parent.addChild(this._container);

    this._redrawProperties();

    return this._container;
  }

  private _redrawProperties() {
    this._container.removeChildren();

    const padding = 10;
    const containerComnponentPropWidth = 300;
    const containerDbPropWidth = 900;
    const containerComnponentPropX = StlbGlobals.app.renderer.width - containerComnponentPropWidth;
    const containerDbPropX = StlbGlobals.app.renderer.width - containerDbPropWidth;
    const containerHeight = (StlbGlobals.app.renderer.height / 3) * 2;

    this._container.position.x = this._isDbPropertyEnabled ? containerDbPropX : containerComnponentPropX;
    this._container.position.y = 0;

    const containerBgG = new Graphics()
      .rect(0, 0, this._isDbPropertyEnabled ? containerDbPropWidth : containerComnponentPropWidth, containerHeight)
      .fill('white');
    this._container.addChild(containerBgG);

    const compPropertyContainer = new Container();
    this._container.addChild(compPropertyContainer);

    var lineG = new Graphics()
      .moveTo(0, 0)
      .lineTo(0, (StlbGlobals.app.renderer.height / 3) * 2)
      .stroke({ color: 0xeeeeee, width: 1 });

    this._container.addChild(lineG);

    // Db to Comp property button
    const dbToCompPropBtnG = new Text({
      text: this._isDbPropertyEnabled ? 'To Component property' : 'To DB property',
      style: { fontSize: 14 },
    });
    dbToCompPropBtnG.position.x = padding;
    dbToCompPropBtnG.position.y = padding;
    dbToCompPropBtnG.eventMode = 'static';
    dbToCompPropBtnG.on('click', () => {
      this._isDbPropertyEnabled = !this._isDbPropertyEnabled;
      this._redrawProperties();
    });
    this._container.addChild(dbToCompPropBtnG);

    let currentX = padding;
    let currentY = dbToCompPropBtnG.getBounds().height + padding;

    // Component property
    const w = watch(StlbStore.default.getState, 'stlbbase.selectedComponentId');
    StlbStore.default.subscribe(
      w((newVal?: string, oldVal?: string) => {
        if (!newVal) return;

        const compList = StlbIoc.get<GComponentList>(StlbIocTypes.GComponentList);
        this._selectedGComp = compList.getComponentById(newVal)!;

        if (!this._isDbPropertyEnabled && this._selectedGComp)
          this.redrawCompProperties(this._selectedGComp, compPropertyContainer, currentX, currentY);
      })
    );

    // Database property
    if (this._isDbPropertyEnabled) {
      const dbEditor = new StlbDbEditor();
      const dbContainer = dbEditor.redraw();
      dbContainer.position.x = currentX;
      dbContainer.position.y = currentY + padding;

      this._container.addChild(dbContainer);

      currentX = padding;
      currentY += dbContainer.getBounds().height;
    }

    if (!this._isDbPropertyEnabled && this._selectedGComp)
      this.redrawCompProperties(this._selectedGComp, compPropertyContainer, currentX, currentY);
  }

  private redrawCompProperties(comp: StlbBaseGComponent, toContainer: Container, currentX: number, currentY: number) {
    comp.redrawProperty();

    toContainer.removeChildren();
    toContainer.x = currentX;
    toContainer.y = currentY;
    toContainer.addChild(comp.propertyEditorContainer);
  }
}
