import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum SComponentPropertyType {
  String,
  Number,
  Boolean,
}

export class SComponentProperty<T = string | number> {
  constructor(public readonly name: string, public value: T, public readonly type = SComponentPropertyType.String) {}
}

// #region Flexbox align
export enum SComponentFlexboxAlignDirection {
  Horizontal,
  Vertical,
}

export enum SComponentFlexboxAutoAlign {
  Start,
  Center,
  End,
}

export enum SComponentFlexboxFixAlign {
  TopLeft,
  TopCenter,
  TopRight,
  Left,
  Center,
  Right,
  BottomLeft,
  BottomCenter,
  BottomRight,
}

export enum SComponentAlignType {
  Absolute,
  Auto,
  Fix,
}

export class SComponentFlexboxAlign {
  constructor(
    public alignType: SComponentAlignType,
    public align: SComponentFlexboxAutoAlign | SComponentFlexboxFixAlign,
    public direction: SComponentFlexboxAlignDirection,
    public alignFixComponentsGap: number = 0
  ) {}
}
// #endregion

// #region Paddings

export enum SComponentPaddingDirection {
  Left,
  Top,
  Right,
  Bottom,
}

export class SComponentPadding {
  constructor(public value: number, public readonly direction: SComponentPaddingDirection) {}
}

// #endregion

export enum SComponentConstraintDirection {
  Left,
  Top,
  Right,
  Bottom,
  CenterHorizontal,
  CenterVertical,
}

export class SComponent {
  constructor(public readonly id: string, public readonly properties: { [name: string]: SComponentProperty }) {}
}

export interface StlbBaseState {
  components: { [compId: string]: SComponent };
  selectedComponentId?: string;
}

export const counterSlice = createSlice({
  name: 'stlbbase',
  initialState: {
    components: {},
    selectedComponentId: undefined,
  } as StlbBaseState,
  reducers: {
    addComponent: (state, action: PayloadAction<SComponent>) => {
      state.components[action.payload.id] = action.payload;
    },
    setComponentSettings: (state, action: PayloadAction<{ compId: string; property: SComponentProperty }>) => {
      const comp = state.components[action.payload.compId];
      comp.properties[action.payload.property.name] = {
        ...action.payload.property,
      };
    },

    selectComponent: (state, action: PayloadAction<{ compId: string }>) => {
      state.selectedComponentId = action.payload.compId;
    },
    unselectComponent: (state) => {
      state.selectedComponentId = undefined;
    },
  },
});

// Action creators are generated for each case reducer function
export const { addComponent, selectComponent, unselectComponent, setComponentSettings } = counterSlice.actions;

export default counterSlice.reducer;
