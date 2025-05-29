import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    SetCategory: (state, action) => {
      return action.payload;
    },
    CreateCategory: (state, action) => {
      const data = action.payload;
      const newCategory = {
        stt: state.length + 1,
        id: data.id,
        name: data.name,
        status: data.status,
        createdDate: data.createdDate,
        lastModifiedDate: data.startTime,
      };
      state.unshift(newCategory);
      state.forEach((item, index) => {
        item.stt = index + 1;
      });
    },
    UpdateCategory: (state, action) => {
      const updatedCategory = action.payload; // backend
      const index = state.findIndex(
        (period) => period.id === updatedCategory.id
      );
      console.log(index);
      if (index !== -1) {
        state[index].name = updatedCategory.name;
        state[index].status = updatedCategory.status;
        state[index].createdDate = updatedCategory.createdDate;
        state[index].lastModifiedDate = updatedCategory.lastModifiedDate;
      }
    },
  },
});

export const { SetCategory, CreateCategory, UpdateCategory } =
  categorySlice.actions;
export default categorySlice.reducer;
export const GetCategory = (state) => state.category;
