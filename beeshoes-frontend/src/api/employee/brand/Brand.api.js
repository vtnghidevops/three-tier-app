import { request } from "../../../helper/request";
export class BrandApi {
  static fetchAll = (filter) => {
    return request({
      method: "GET",
      url: `/admin/brand`,
      params: filter,
    });
  };

  static create = (data) => {
    return request({
      method: "POST",
      url: `/admin/brand`,
      data: data,
    });
  };

  static getOne = (id) => {
    return request({
      method: "GET",
      url: `/admin/brand/${id}`,
    });
  };

  static update = (id, data) => {
    return request({
      method: "PUT",
      url: `/admin/brand/${id}`,
      data: data,
    });
  };
  static getBrandInProductDetail = () => {
    return request({
      method: "GET",
      url: `/client/brand/in-product-detail`,
    });
  };
}
