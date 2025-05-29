import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    SetAddress: (state, action) => {
      return action.payload;
    },
    CreateAddress: (state, action) => {
      const data = action.payload;
      const newAddress = {
        stt: state.length + 1,
        id: data.id,
        line: data.line,
        district: data.district,
        province: data.province,
        ward: data.ward,
        status: data.status,
        createdDate: data.createdDate,
        lastModifiedDate: data.startTime,
        userId: data.userId,
      };
      state.unshift(newAddress);
    },
    UpdateAddress: (state, action) => {
      const updatedAddress = action.payload; // backend
      const index = state.findIndex(
        (period) => period.id === updatedAddress.id
      );
      console.log(index);
      if (index !== -1) {
        state[index].line = updatedAddress.line;
        state[index].district = updatedAddress.district;
        state[index].province = updatedAddress.province;
        state[index].ward = updatedAddress.ward;
        state[index].status = updatedAddress.status;
        state[index].createdDate = updatedAddress.createdDate;
        state[index].lastModifiedDate = updatedAddress.lastModifiedDate;
      }
    },
    SetProvince: (state, action) => {
      return action.payload;
    },
  },
});

export const { SetAddress, CreateAddress, UpdateAddress, SetProvince } =
  addressSlice.actions;
export default addressSlice.reducer;
export const GetAddress = (state) => state.address;
