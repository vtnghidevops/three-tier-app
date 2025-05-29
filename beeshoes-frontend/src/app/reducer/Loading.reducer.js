import { createSlice } from "@reduxjs/toolkit";

const initialState = false;

const loadingSlice = createSlice({
  name: "loading",
  initialState,
  reducers: {
    SetLoadingTrue: (state, action) => {
      state = true;
      return state;
    },
    SetLoadingFalse: (state, action) => {
      state = false;
      return state;
    },
  },
});

export const { SetLoadingTrue, SetLoadingFalse } = loadingSlice.actions;
export default loadingSlice.reducer;
export const GetLoading = (state) => state.loading;
