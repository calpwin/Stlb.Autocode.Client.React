import { Container, Text } from 'pixi.js';
import { StlbTextInput } from '../gcomponent/input/stlb-text-input';
import { injectable } from 'inversify';

export enum StlbDbType {
  String,
  Number,
}

export class StlbDbColumnValue<Type extends string | number> {
  constructor(public value: Type, public rowId: number = 0) {}
}

export class StlbDbColumn<Type extends string | number> {
  private readonly _values: StlbDbColumnValue<Type>[] = [];

  public get values() {
    return [...this._values];
  }

  addValue(value: StlbDbColumnValue<Type>) {
    this._values.push(value);
  }

  constructor(public readonly name: string, public readonly toTableName: string, public readonly type: StlbDbType) {}
}

@injectable()
export class StlbDbStore {
  private _store: { [columnName: string]: StlbDbColumn<any> } = {};

  getValues(columnName: string) {
    return this._store[columnName].values;
  }

  addColumn(column: StlbDbColumn<any>) {
    this._store[column.name] = column;
  }

  getColumns() {
    return Object.keys(this._store);
  }

  async addValue(columnName: string, value: StlbDbColumnValue<any>): Promise<number> {
    if (!this._store[columnName]) return 0;

    const column = this._store[columnName];
    column.addValue(value);

    var rowId = await fetch('http://localhost:5149/add-column', {
      method: 'post',
      body: JSON.stringify({
        rowId: value.rowId ? value.rowId : undefined,
        columnName: column.name,
        tableName: column.toTableName,
        value: value.value,
      }),
      headers: {
        'content-type': 'application/json',
      },
    })
      .then((response) => response.text())
      .then((responseJson) => {
        const entityRowId = parseInt(responseJson);
        value.rowId = entityRowId;

        return entityRowId;
      });

    return rowId;
  }

  removeAll() {
    this._store = {};
  }
}

export class StlbDbEditor {
  private readonly _container = new Container();

  private readonly _padding = 10;
  private _isTypeEditorActive = false;

  private _dbStore = new StlbDbStore();

  constructor() {
    this._dbStore.addColumn(new StlbDbColumn('Name', 'Person', StlbDbType.String));
    this._dbStore.addColumn(new StlbDbColumn('SurName', 'Person', StlbDbType.String));

    this._dbStore.addValue('Name', new StlbDbColumnValue('Andrei')).then((rowId) => {
      this._dbStore.addValue('SurName', new StlbDbColumnValue('Yello', rowId));
    });
    // this._dbStore.addValue('Name', new StlbDbColumnValue('John')).then((rowId) => {
    //   this._dbStore.addValue('SurName', new StlbDbColumnValue('Samith', rowId));
    // });
  }

  redraw() {
    this._container.removeChildren();

    let currentX = 0;
    let currentY = 0;

    const actionBtnsContainer = new Container();

    if (this._isTypeEditorActive) {
      const valueEditor = this._drawValueEditor(this._dbStore.getColumns());
      valueEditor.position.x = currentX;
      valueEditor.position.y = currentY;
      this._container.addChild(valueEditor);

      currentX = this._padding;
      currentY += valueEditor.getBounds().height + this._padding;

      actionBtnsContainer.position.y = currentY;
    } else {
      const newTypeBtnG = new Text({ text: 'New type', style: { fontSize: 14, fill: 'black' } });
      newTypeBtnG.position.x = 0;
      newTypeBtnG.position.y = 0;
      newTypeBtnG.eventMode = 'static';
      newTypeBtnG.on('click', () => {
        const newTypeG = this.drawAddType();
        newTypeG.position.x = currentX;
        newTypeG.position.y = currentY;

        this._container.addChild(newTypeG);

        currentY += newTypeG.getBounds().height + this._padding;
        actionBtnsContainer.position.y = currentY;
      });

      actionBtnsContainer.addChild(newTypeBtnG);
    }

    const editTypeOrValueBtnG = new Text({
      text: this._isTypeEditorActive ? 'To Value editor' : 'To Type editor',
      style: { fontSize: 14, fill: 'black' },
    });
    editTypeOrValueBtnG.position.x = 100 + currentX;
    editTypeOrValueBtnG.position.y = 0;
    editTypeOrValueBtnG.eventMode = 'static';
    editTypeOrValueBtnG.on('click', () => {
      this._isTypeEditorActive = !this._isTypeEditorActive;
      this.redraw();
    });

    actionBtnsContainer.addChild(editTypeOrValueBtnG);

    this._container.addChild(actionBtnsContainer);

    return this._container;
  }

  private _drawValueEditor(types: string[]) {
    const container = new Container();

    let currentX = 0;
    let currentY = 0;

    const typeNameColumnWidth = 100;
    const columnHeight = 30;
    const typeHeaderContainer = new Container();
    typeHeaderContainer.position.x = currentX;
    typeHeaderContainer.position.y = currentY;
    types.forEach((type) => {
      const typeName = new Text({ text: type, style: { fontSize: 14, fill: 'black', fontWeight: 'bold' } });

      typeName.position.x = currentX;
      typeName.position.y = currentY;

      currentX += typeNameColumnWidth + this._padding * 2;

      container.addChild(typeName);
    });

    currentX = 0;
    currentY = columnHeight;

    types.forEach((columnName) => {
      currentY = 30;
      this._dbStore.getValues(columnName).forEach((dbValue) => {
        const newValueG = this._drawNewValueFields(typeNameColumnWidth);
        newValueG.inputText = dbValue.value;
        newValueG.render();
        newValueG.container.position.x = currentX;
        newValueG.container.position.y = currentY;

        container.addChild(newValueG.container);

        currentY += columnHeight;
      });

      currentX += typeNameColumnWidth + this._padding * 2;
    });

    currentX = 0;

    const newValueBtnG = new Text({ text: 'Add value', style: { fontSize: 14, fill: 'black', fontWeight: 'bold' } });
    newValueBtnG.position.x = currentX;
    newValueBtnG.position.y = currentY;
    newValueBtnG.eventMode = 'static';
    newValueBtnG.on('click', () => {
      this._dbStore.addValue('Name', new StlbDbColumnValue('')).then((rowId) => {
        this._dbStore.addValue('SurName', new StlbDbColumnValue('', rowId));
      });

      this.redraw();
    });

    newValueBtnG.position.y = currentY;

    container.addChild(newValueBtnG);

    return container;
  }

  private _drawNewValueFields(width: number) {
    return new StlbTextInput('', width);
  }

  drawAddType() {
    const container = new Container();

    let currentX = 0;
    let currentY = 0;

    const nameInput = new StlbTextInput('Name');
    nameInput.render();
    nameInput.container.position.x = currentX;
    nameInput.container.position.y = currentY;

    currentX += nameInput.width + this._padding;

    const typeInput = new StlbTextInput('Type');
    typeInput.render();
    typeInput.container.position.x = currentX;
    typeInput.container.position.y = currentY;

    currentX += typeInput.width + this._padding;

    container.addChild(nameInput.container);
    container.addChild(typeInput.container);

    return container;
  }
}
