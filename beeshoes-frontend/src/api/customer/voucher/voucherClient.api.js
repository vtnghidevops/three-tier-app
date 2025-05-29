import { requestCustomer } from "../../../helper/request";

export class VoucherClientApi {
  static getByCode = (code) => {
    return requestCustomer({
      method: "GET",
      url: `/client/voucher/${code}`,
    });
  };
  static getListVoucherByAccount = (idAccount) => {
    return requestCustomer({
      method: "GET",
      url: `/client/voucher/account/${idAccount}`,
    });
  };
  static getListVoucher = () => {
    return requestCustomer({
      method: "GET",
      url: `/client/voucher/list`,
    });
  };
}
