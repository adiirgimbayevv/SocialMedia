import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: { notification: null },
  reducers: {
    setNotification: (state, action) => {
      state.notification = action.payload; // Можно передавать { message: 'Текст', type: 'error' }
    },
    clearNotification: (state) => {
      state.notification = null;
    },
  },
});

export const { setNotification, clearNotification } = uiSlice.actions;
export default uiSlice.reducer;