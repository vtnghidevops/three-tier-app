import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const soleSlice = createSlice({
  name: "sole",
  initialState,
  reducers: {
    SetSole: (state, action) => {
      return action.payload;
    },
    CreateSole: (state, action) => {
      const data = action.payload;
      const newSole = {
        stt: 1,
        id: data.id,
        name: data.name,
        status: data.status,
        createdDate: data.createdDate,
        lastModifiedDate: data.startTime,
      };
      state.unshift(newSole);
      state.forEach((item, index) => {
        item.stt = index + 1;
      });
    },
    UpdateSole: (state, action) => {
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

export const { SetSole, CreateSole, UpdateSole } = soleSlice.actions;
export default soleSlice.reducer;
export const GetSole = (state) => state.sole;
