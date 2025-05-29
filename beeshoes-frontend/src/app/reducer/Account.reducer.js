import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    SetAccount: (state, action) => {
      return action.payload;
    },
    CreateAccount: (state, action) => {
      const data = action.payload;
      const newaccount = {
        stt: state.length + 1,
        id: data.id,
        fullName: data.fullName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        dateOfBirth: data.dateOfBirth,
        avata: data.avata,
        gender: data.gender,
        status: data.status,
        citizenIdentity: data.citizenIdentity,
      };
      state.unshift(newaccount);
    },
    UpdateAccount: (state, action) => {
      const updatedAccount = action.payload; // backend
      const index = state.findIndex(
        (period) => period.id === updatedAccount.id
      );
      console.log(index);
      if (index !== -1) {
        state[index].fullName = updatedAccount.fullName;
        state[index].email = updatedAccount.email;
        state[index].phoneNumber = updatedAccount.phoneNumber;
        state[index].dateOfBirth = updatedAccount.dateOfBirth;
        state[index].password = updatedAccount.password;
        state[index].avata = updatedAccount.avata;
        state[index].status = updatedAccount.status;
        state[index].gender = updatedAccount.gender;
        state[index].citizenIdentity = updatedAccount.citizenIdentity;
      }
    },
  },
});

export const { SetAccount, CreateAccount, UpdateAccount } =
  accountSlice.actions;
export default accountSlice.reducer;
export const GetAccount = (state) => state.account;
