import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    SetNotification: (state, action) => {
      return action.payload;
    },
    UpdateNotification: (state, action) => {
      const updated = action.payload;
      const index = state.findIndex((notify) => notify.id === updated.id);
      if (index !== -1) {
        state[index] = updated;
      }
    },
  },
});

export const { SetNotification, UpdateNotification } =
notificationSlice.actions;
export default notificationSlice.reducer;
export const GetNotification = (state) => state.notification;
