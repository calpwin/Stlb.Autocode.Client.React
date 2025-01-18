export enum SComponentPropertyType {
  String,
  Number,
  Boolean,
  Json,
  Color
}

export enum SComponentPropertyAttribute {
  System,
  Custom,
}

export class SComponentProperty<T = string | number | boolean> {
  constructor(
    public readonly name: string,
    public value: T,
    public readonly type = SComponentPropertyType.String,
    public readonly attributes: SComponentPropertyAttribute[] = []
  ) {}
}

// #region System properties

export class SComponentNumberSystemProperty extends SComponentProperty<number> {
  constructor(name: string, value: number) {
    super(name, value, SComponentPropertyType.Number, [SComponentPropertyAttribute.System]);
  }
}

export class SComponentStringSystemProperty extends SComponentProperty<string> {
  constructor(name: string, value: string) {
    super(name, value, SComponentPropertyType.String, [SComponentPropertyAttribute.System]);
  }
}

export class SComponentJsonSystemProperty extends SComponentProperty<string> {
  constructor(name: string, value: string) {
    super(name, value, SComponentPropertyType.Json, [SComponentPropertyAttribute.System]);
  }
}

// #endregion

// #region Custom properties

export class SComponentNumberCustomProperty extends SComponentProperty<number> {
  constructor(name: string, value: number) {
    super(name, value, SComponentPropertyType.Number, [SComponentPropertyAttribute.Custom]);
  }
}

export class SComponentStringCustomProperty extends SComponentProperty<string> {
  constructor(name: string, value: string) {
    super(name, value, SComponentPropertyType.String, [SComponentPropertyAttribute.Custom]);
  }
}

export class SComponentBooleanCustomProperty extends SComponentProperty<boolean> {
  constructor(name: string, value: boolean) {
    super(name, value, SComponentPropertyType.String, [SComponentPropertyAttribute.Custom]);
  }
}

export class SComponentColorCustomProperty extends SComponentProperty<number> {
    constructor(name: string, value: number) {
      super(name, value, SComponentPropertyType.Color, [SComponentPropertyAttribute.Custom]);
    }
  }

// #endregion
