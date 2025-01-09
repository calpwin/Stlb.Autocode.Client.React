import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export class SComponent {
  constructor(public id: string) {}
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
    selectComponent: (state, action: PayloadAction<{compId: string}>) => {
      state.selectedComponentId = action.payload.compId;
    },
    unselectComponent: (state) => {
      state.selectedComponentId = undefined;
    },
  },
});

// Action creators are generated for each case reducer function
export const { addComponent, selectComponent, unselectComponent } = counterSlice.actions;

export default counterSlice.reducer;
