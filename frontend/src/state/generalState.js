import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  darkMode: false,
};

const generalSlice = createSlice({
  name: "general",
  initialState,
  reducers: {
    toggleDarkMode: (state, action) => {
      state.darkMode = action.payload;
    },
  },
});

export const { toggleDarkMode } = generalSlice.actions;

export default generalSlice.reducer;
