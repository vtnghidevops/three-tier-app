import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const userClientSlice = createSlice({
  name: "userClient",
  initialState,
  reducers: {
    SetUserClient: (state, action) => {
      return action.payload;
    },
    CreateUserClient: (state, action) => {
        state.unshift(action.payload);
    },
    UpdateUserClient: (state, action) => {
        const update = action.payload;
        console.log(update);
        console.log(state);
        const index = state.findIndex((userClient) => userClient.id === update.id);
        if (index !== -1) {
          state[index] = update;
        }
    },
  },
});

export const { SetUserClient, CreateUserClient, UpdateUserClient } =
userClientSlice.actions;
export default userClientSlice.reducer;
export const GetUserClient = (state) => state.userClient;
