import { createSlice } from "@reduxjs/toolkit";

const billSlice = createSlice({
  name: "bill",
  initialState: {
    bills: {
      value: [],
    },
    billAtCounter: {
      value: [],
      key: -1,
    },
    search: {
      users: [],
      employees: [],
    },
    billWaits: {
      value: [],
    },
    billWaitProduct: {
      value: [],
      user: null,
      vouchers: []
    },
    bill: {
      value: {},
      billDetail: [],
      billHistory: [],
      paymentsMethod: [],
      status: -1,
      change: 0,
    },
  },
  reducers: {
    addProductBillWait: (state, action) => {
      console.log(state.billWaitProduct.value);
      state.billWaitProduct.change = action.payload;

    },
    ChangeProductInBill: (state, action) => {
      state.bill.change = action.payload
    },
    updateTotalBill: (state, action) => {
      console.log(state.billWaitProduct.value);
      state.bill.value = Object.assign({},state.bill.value, {totalMoney: action.payload});

    },
    addUserBillWait: (state, action) => {
      state.billWaitProduct.user = (action.payload);
    },
    addVoucherBillWait: (state, action) => {
      state.billWaitProduct.vouchers.push(action.payload);
    },
    addBills: (state, action) => {
      state.bills.value = [...action.payload];
    },
    getAllBill: (state, action) => {
      state.bills.value = [...action.payload];
    },
    getAllBillWait: (state, action) => {
      console.log(action.payload)
      state.billWait.value = [...action.payload];
    },
    getUsers: (state, action) => {
      state.search.users = [...action.payload];
    },
    getEmployees: (state, action) => {
      state.search.employees = [...action.payload];
    },
    getAllBillAtCounter:  (state, action) => {
      state.billAtCounter.value = [...action.payload];
    },
    addBillAtCounTer:  (state, action) => {
      state.billAtCounter.value.push(action.payload);
    },
    updateKeyBillAtCounter:  (state, action) => {
      state.billAtCounter.key = (action.payload);
    },
    deletebillWait: (state, action) => {
      state.search.users = [];
    },
    getBill: (state, action) => {
      state.bill.value = action.payload;
    },
    getProductInBillDetail: (state, action) => {
      state.bill.billDetail = [...action.payload];
    },
    addProductInBillDetail: (state, action) => {
      state.bill.billDetail.push(action.payload);
    },
    getBillHistory: (state, action) => {
      state.bill.billHistory = [...action.payload];
    },
    getPaymentsMethod: (state, action) => {
      state.bill.paymentsMethod = [...action.payload];
    },
    addPaymentsMethod: (state, action) => {
      state.bill.paymentsMethod.push(action.payload);
    },
    addStatusPresent: (state, action) => {
      state.bill.status = action.payload;
    },
    addBillHistory: (state, action) => {
      state.bill.billHistory.push(action.payload);
    },
    addBillWait: (state, action) => {
      state.billWaits.value.push(action.payload);
    },
    getAllBillWait: (state, action) => {
      state.billWaits.value = [...action.payload];
    },
    deleteBillWait: (state, action) => {
      state.billWaits.value.splice(action.payload, 1);
    },
  },
});

export const {
  addBillWait,
  getAllBillWait,
  deleteBillWait,
  getAllBill,
  getUsers,
  getEmployees,
  getProductInBillDetail,
  getBillHistory,
  getBill,
  addBillAtCounTer,
  addStatusPresent,
  addBillHistory,
  addProductBillWait,
  getPaymentsMethod,
  addPaymentsMethod,
  addUserBillWait,
  addVoucherBillWait,
  getAllBillAtCounter,
  addProductInBillDetail,
  updateKeyBillAtCounter,
  updateTotalBill,
  ChangeProductInBill
} = billSlice.actions;
export default billSlice.reducer;
export const GetBill = (state) => state.bill;
