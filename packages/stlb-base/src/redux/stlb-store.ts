import { configureStore, createSlice } from '@reduxjs/toolkit';
import counterReducer from './stlb-store-slice';

export default configureStore({
  reducer: {
    counter: counterReducer,
  },
});
