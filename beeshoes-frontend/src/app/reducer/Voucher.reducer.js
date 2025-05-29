import { createSlice } from "@reduxjs/toolkit";

const initialState =[]
const voucherSlice = createSlice({
  name: "voucher",
  initialState,
  reducers: {
    SetVoucher: (state,action) => {
      return action.payload;
    },
    CreateVoucher: (state, action) => {
      state.unshift(action.payload);
      state.forEach((item, index) => {
        item.stt = index + 1;
      });
    },
    UpdateVoucher: (state, action) => {
        const updatedVoucher = action.payload;
        const index = state.findIndex((voucher) => voucher.id === updatedVoucher.id);
        if (index !== -1) {
          state[index] = updatedVoucher;
        }
    },
    
  },
});

export const { SetVoucher, CreateVoucher, UpdateVoucher } = voucherSlice.actions;
export default voucherSlice.reducer;
export const GetVoucher = (state) => state.voucher;
