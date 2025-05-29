import { requestCustomer } from "../../../helper/request";

export class BillClientApi {
  static createBillOnline = (data) => {
    return requestCustomer({
      method: "POST",
      url: `/client/bill`,
      data: data,
    });
  };
  static getBillById = (idBill) => {
    return requestCustomer({
      method: "GET",
      url: `/client/bill/detail/${idBill}`,
    });
  };
  static createBillAccountOnline = (data) => {
    return requestCustomer({
      method: "POST",
      url: `/client/bill/account`,
      data: data,
    });
  };

  //  code bill Detail
  static fetchDetailBill = (code, phoneNumber) => {
    return requestCustomer({
      method: "GET",
      url: `/client/bill/` + code + "/" + phoneNumber,
    });
  };
  static getBillAccount = (data) => {
    return requestCustomer({
      method: "POST",
      url: `/client/bill/status`,
      data: data,
    });
  };
  static fetchAllBillHistoryInBill = (id) => {
    return requestCustomer({
      method: "GET",
      url: `/client/bill-history/` + id,
    });
  };
  static fetchAllBillDetailInBill = (data) => {
    return requestCustomer({
      method: "GET",
      url: `/client/bill-detail`,
      params: data,
    });
  };
  static fetchAllBillDetailByIdBill = (id) => {
    return requestCustomer({
      method: "GET",
      url: `/client/bill-detail/findByIdBill/${id}`,
    });
  };

  static fetchAllPayMentlInBill = (id) => {
    return requestCustomer({
      method: "GET",
      url: `/client/payment/bill/` + id,
    });
  };

  static changeCancelStatusBill = (id, data) => {
    return requestCustomer({
      method: "PUT",
      url: `/client/bill/cancel-status/` + id,
      params: data,
    });
  };
  static cancelBill = (data) => {
    return requestCustomer({
      method: "PUT",
      url: `/client/bill/cancel`,
      data:data
    });
  };
}
