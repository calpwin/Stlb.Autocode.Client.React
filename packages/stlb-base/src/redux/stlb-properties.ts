export enum SComponentPropertyType {
  String,
  Number,
  Boolean,
  Json,
}

export enum SComponentPropertyAttribute {
  System,
  Custom,
}

export class SComponentProperty<T = string | number> {
  constructor(
    public readonly name: string,
    public value: T,
    public readonly type = SComponentPropertyType.String,
    public readonly attributes: SComponentPropertyAttribute[] = []
  ) {}
}

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
