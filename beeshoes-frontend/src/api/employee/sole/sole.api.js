import { request } from "../../../helper/request";
export class SoleApi {
  static fetchAll = (filter) => {
    return request({
      method: "GET",
      url: `/admin/sole`,
      params: filter,
    });
  };

  static create = (data) => {
    return request({
      method: "POST",
      url: `/admin/sole`,
      data: data,
    });
  };

  static getOne = (id) => {
    return request({
      method: "GET",
      url: `/admin/sole/${id}`,
    });
  };

  static update = (id, data) => {
    return request({
      method: "PUT",
      url: `/admin/sole/${id}`,
      data: data,
    });
  };
  static getSoleInProductDetail = () => {
    return request({
      method: "GET",
      url: `/client/sole/in-product-detail`,
    });
  };
}
