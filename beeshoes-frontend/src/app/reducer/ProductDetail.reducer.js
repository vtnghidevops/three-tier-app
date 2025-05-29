import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const productDetailSlice = createSlice({
  name: "productDetail",
  initialState,
  reducers: {
    SetProductDetail: (state, action) => {
      return action.payload;
    },
    CreateProductDetail: (state, action) => {
      const data = action.payload;
      const newProduct = {
        stt: state.length + 1,
        id: data.id,
        gender: data.gender,
        price: data.price,
        image: data.image,
        nameProduct: data.nameProduct,
        status: data.status,
        createdDate: data.createdDate,
      };
      state.unshift(newProduct);
      state.forEach((item, index) => {
        item.stt = index + 1;
      });
    },
    UpdateProductDetail: (state, action) => {
      const update = action.payload; // backend
      const index = state.findIndex((period) => period.id === update.id);
      if (index !== -1) {
        state[index].nameProduct = update.nameProduct;
        state[index].gender = update.gender;
        state[index].price = update.price;
        state[index].image = update.image;
        state[index].status = update.status;
        state[index].createdDate = update.createdDate;
      }
    },
  },
});

export const { SetProductDetail, CreateProductDetail, UpdateProductDetail } =
  productDetailSlice.actions;
export default productDetailSlice.reducer;
export const GetProductDetail = (state) => state.productDetail;
