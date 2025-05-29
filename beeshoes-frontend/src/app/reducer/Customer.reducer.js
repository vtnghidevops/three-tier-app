import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const accountSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    SetCustomer: (state, action) => {
      return action.payload;
    },
    CreateCustomer: (state, action) => {
      const data = action.payload;
      const newaccount = {
        stt: state.length + 1,
        id: data.id,
        fullName: data.fullName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        dateOfBirth: data.dateOfBirth,
        citizenIdentity: data.citizenIdentity,
        password: data.password,
        points: data.points,
        status: data.status,
      };
      state.unshift(newaccount);
    },
    UpdateCustomer: (state, action) => {
      const updatedCustomer = action.payload; // backend
      const index = state.findIndex(
        (period) => period.id === updatedCustomer.id
      );
      console.log(index);
      if (index !== -1) {
        state[index].fullName = updatedCustomer.fullName;
        state[index].email = updatedCustomer.email;
        state[index].phoneNumber = updatedCustomer.phoneNumber;
        state[index].dateOfBirth = updatedCustomer.dateOfBirth;
        state[index].password = updatedCustomer.password;
        state[index].points = updatedCustomer.points;
        state[index].status = updatedCustomer.status;
      }
    },
  },
});

export const { SetCustomer, CreateCustomer, UpdateCustomer } =
  accountSlice.actions;
export default accountSlice.reducer;
export const GetCustomer = (state) => state.customer;
