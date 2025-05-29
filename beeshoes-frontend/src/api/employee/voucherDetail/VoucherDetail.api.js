import { request } from "../../../helper/request";
export class VoucherDetailApi {
  static getVoucherDetailByIdBill = (idBill) => {
    return request({
      method: "GET",
      url:`/admin/voucher-detail/${idBill}`,
    });
  };
}
