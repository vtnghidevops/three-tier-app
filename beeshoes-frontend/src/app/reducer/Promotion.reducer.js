import { createSlice } from "@reduxjs/toolkit";

const initialState =[]
const promotionSlice = createSlice({
  name: "promotion",
  initialState,
  reducers: {
    SetPromotion: (state,action) => {
      return action.payload;
    },
    CreatePromotion: (state, action) => {
      state.unshift(action.payload);
    },
    UpdatePromotion: (state, action) => {
        const updatedPromotion = action.payload;
        const index = state.findIndex((promotion) => promotion.id === updatedPromotion.id);
        if (index !== -1) {
          state[index] = updatedPromotion;
        }
    },
  },
});

export const { SetPromotion, CreatePromotion, UpdatePromotion } =
promotionSlice.actions;
export default promotionSlice.reducer;
export const GetPromotion = (state) => state.promotion;
