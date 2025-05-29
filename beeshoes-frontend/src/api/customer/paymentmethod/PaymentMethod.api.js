import { requestCustomer } from "../../../helper/request";


export class PaymentMethodClientApi {
  static getByBill = (idBill) => {
    return requestCustomer({
      method: "GET",
      url: `/client/payment-method/byBill/${idBill}`,
    });
  };
}
