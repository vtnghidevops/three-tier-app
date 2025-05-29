import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const colorSlice = createSlice({
  name: "color",
  initialState,
  reducers: {
    SetColor: (state, action) => {
      return action.payload;
    },
    CreateColor: (state, action) => {
      const data = action.payload;
      const newColor = {
        stt: 1,
        id: data.id,
        code: data.code,
        name: data.name,
        status: data.status,
        createdDate: data.createdDate,
        lastModifiedDate: data.lastModifiedDate,
      };
      state.unshift(newColor);
      state.forEach((item, index) => {
        item.stt = index + 1;
      });
    },
    UpdateColor: (state, action) => {
      const updatedColor = action.payload; // backend
      const index = state.findIndex((period) => period.id === updatedColor.id);
      if (index !== -1) {
        state[index].code = updatedColor.code;
        state[index].name = updatedColor.name;
        state[index].status = updatedColor.status;
        state[index].createdDate = updatedColor.createdDate;
        state[index].lastModifiedDate = updatedColor.lastModifiedDate;
      }
    },
  },
});

export const { SetColor, CreateColor, UpdateColor } = colorSlice.actions;
export default colorSlice.reducer;
export const GetColor = (state) => state.color;
