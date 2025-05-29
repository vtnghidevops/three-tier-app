import { request } from "../../../helper/request";
export class IamgeApi {
  static fetchAll = (idProductDetail) => {
    return request({
      method: "GET",
      url: `/admin/image/${idProductDetail}`,
    });
  };
}
