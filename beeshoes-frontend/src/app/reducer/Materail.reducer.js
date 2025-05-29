import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const materialSlice = createSlice({
  name: "material",
  initialState,
  reducers: {
    SetMaterial: (state, action) => {
      return action.payload;
    },
    CreateMaterail: (state, action) => {
      const data = action.payload;
      const newMaterail = {
        stt: state.length + 1,
        id: data.id,
        name: data.name,
        status: data.status,
        createdDate: data.createdDate,
        lastModifiedDate: data.startTime,
      };
      state.unshift(newMaterail);
      state.forEach((item, index) => {
        item.stt = index + 1;
      });
    },
    UpdateMaterail: (state, action) => {
      const update = action.payload; // backend
      const index = state.findIndex((period) => period.id === update.id);
      console.log(update);
      if (index !== -1) {
        state[index].name = update.name;
        state[index].status = update.status;
        state[index].createdDate = update.createdDate;
        state[index].lastModifiedDate = update.lastModifiedDate;
      }
    },
  },
});

export const { SetMaterial, CreateMaterail, UpdateMaterail } =
  materialSlice.actions;
export default materialSlice.reducer;
export const GetMaterail = (state) => state.material;
