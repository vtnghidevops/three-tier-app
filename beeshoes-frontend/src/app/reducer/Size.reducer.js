import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const sizeSlice = createSlice({
  name: "size",
  initialState,
  reducers: {
    SetSize: (state, action) => {
      return action.payload;
    },
    CreateSize: (state, action) => {
      const data = action.payload;
      const newSize = {
        stt: 1,
        id: data.id,
        name: data.name,
        status: data.status,
        createdDate: data.createdDate,
        lastModifiedDate: data.startTime,
      };
      state.unshift(newSize);
      state.forEach((item, index) => {
        item.stt = index + 1;
      });
    },
    UpdateSize: (state, action) => {
      const update = action.payload; // backend
      const index = state.findIndex((period) => period.id === update.id);
      console.log(index);
      if (index !== -1) {
        state[index].name = update.name;
        state[index].status = update.status;
        state[index].createdDate = update.createdDate;
        state[index].lastModifiedDate = update.lastModifiedDate;
      }
    },
  },
});

export const { SetSize, CreateSize, UpdateSize } = sizeSlice.actions;
export default sizeSlice.reducer;
export const GetSize = (state) => state.size;
