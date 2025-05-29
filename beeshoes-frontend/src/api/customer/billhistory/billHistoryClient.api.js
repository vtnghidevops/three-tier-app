import { requestCustomer } from "../../../helper/request";


export class BillHistoryClientApi {
  static getByIdBill = (idBill) => {
    return requestCustomer({
      method: "GET",
      url: `/client/bill-history/byBill/${idBill}`,
    });
  };
}
