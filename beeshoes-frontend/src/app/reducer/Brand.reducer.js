import { createSlice } from "@reduxjs/toolkit";
import Item from "antd/es/list/Item";

const initialState = [];

const brandSlice = createSlice({
  name: "brand",
  initialState,
  reducers: {
    SetBrand: (state, action) => {
      return action.payload;
    },
    CreateBrand: (state, action) => {
      const data = action.payload;
      const newBrand = {
        stt: 1,
        id: data.id,
        name: data.name,
        status: data.status,
        createdDate: data.createdDate,
        lastModifiedDate: data.startTime,
      };
      state.unshift(newBrand);
      state.forEach((item, index) => {
        item.stt = index + 1;
      });
    },
    UpdateBrand: (state, action) => {
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

export const { SetBrand, CreateBrand, UpdateBrand } = brandSlice.actions;
export default brandSlice.reducer;
export const GetBrand = (state) => state.brand;
