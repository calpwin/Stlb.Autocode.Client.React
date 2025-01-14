import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { act } from 'react';

export class SComponentProperty<T = string | number> {
  constructor(public readonly name: string, public value: T) {}
}

export class SComponent {
  constructor(
    public readonly id: string,
    public readonly properties: { [name: string]: SComponentProperty }
  ) {}
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
    setComponentSettings: (
      state,
      action: PayloadAction<{ compId: string; property: SComponentProperty }>
    ) => {
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
export const {
  addComponent,
  selectComponent,
  unselectComponent,
  setComponentSettings,
} = counterSlice.actions;

export default counterSlice.reducer;
