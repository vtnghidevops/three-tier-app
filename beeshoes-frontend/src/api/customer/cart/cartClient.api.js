import { requestCustomer } from "../../../helper/request";

export class CartClientApi {
  static addCart = (data) => {
    return requestCustomer({
      method: "POST",
      url: `/cart`,
      data: data
    });
  };
  static listCart = (idAccount) => {
    return requestCustomer({
      method: "GET",
      url: `/cart/${idAccount}`,
    });
  };
  static quantityInCart = (idAccount) => {
    return requestCustomer({
      method: "GET",
      url: `/cart/quantityInCart/${idAccount}`,
    });
  };

}