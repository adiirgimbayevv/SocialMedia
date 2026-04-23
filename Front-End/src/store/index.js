import { configureStore } from '@reduxjs/toolkit';
import postReducer from './postSlice';
import uiReducer from './uiSlice';

export const store = configureStore({
  reducer: {
    posts: postReducer,
    ui: uiReducer
  },
});