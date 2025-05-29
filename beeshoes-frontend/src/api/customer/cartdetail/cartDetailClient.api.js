import { requestCustomer } from "../../../helper/request";

export class CartDetailClientApi {
  static changeSize = (data) => {
    return requestCustomer({
      method: "POST",
      url: `/cart-detail/change-size`,
      data: data,
    });
  };
  static deleteCartDetail = (idCartDetail) => {
    return requestCustomer({
      method: "DELETE",
      url: `/cart-detail/${idCartDetail}`,
    });
  };
  static deleteAllCartDetail = (idAccount) => {
    return requestCustomer({
      method: "DELETE",
      url: `/cart-detail/deleteAll/${idAccount}`,
    });
  };

  static changeQuantity = (data) => {
    return requestCustomer({
      method: "POST",
      url: `/cart-detail/change-quantity`,
      data: data,
    });
  };
}
