import { createSlice } from "@reduxjs/toolkit";

const initialState = []
const addressAccountClientSlice = createSlice({
  name: "addressAccountClient",
  initialState,
  reducers: {
    SetAddressAccountClient: (state, action) => {
      return action.payload;
    },
    CreateAddressAccountClient: (state, action) => {
     if(action.payload.status === "DANG_SU_DUNG"){
      const activeIndex = state.findIndex((item) => item.status === "DANG_SU_DUNG");
      if (activeIndex !== -1) {
        state[activeIndex].status = "KHONG_SU_DUNG";
      }
     }
      state.unshift(action.payload);
      state.sort((a) => {
        if (a.status === "DANG_SU_DUNG") return -1;
        return 0;
      });
      return state;
    },
    UpdateAddressDefaultAccountClient: (state, action) => {
      const update = action.payload;

      const activeIndex = state.findIndex((item) => item.status === "DANG_SU_DUNG");
      if (activeIndex !== -1) {
        state[activeIndex].status = "KHONG_SU_DUNG";
      }

      const updatedIndex = state.findIndex((item) => item.id === update.id);
      if (updatedIndex !== -1) {
        state[updatedIndex] = update;
      }
      state.sort((a) => {
        if (a.status === "DANG_SU_DUNG") return -1;
        return 0;
      });
      return state;
    },
    UpdateAddressAccountClient: (state, action) => {
      const update = action.payload;
      const index = state.findIndex((item) => item.id === update.id);
      if (index !== -1) {
        state[index] = update;
      }
  },
  
    DeleteAddressAccountClient: (state, action) => {
      const update = action.payload;
      const activeIndex = state.filter((item) => item.id !== update.id);
      return activeIndex;
    },
  },
});

export const { SetAddressAccountClient, UpdateAddressDefaultAccountClient, DeleteAddressAccountClient,CreateAddressAccountClient,UpdateAddressAccountClient } = addressAccountClientSlice.actions;
export default addressAccountClientSlice.reducer;
export const GetAddressAccountClient = (state) => state.addressAccountClient;
