import { request } from "../../../helper/request";

export class CategoryApi {
  static fetchAll = (filter) => {
    return request({
      method: "GET",
      url: `/admin/category`,
      params: filter,
    });
  };

  static create = (data) => {
    return request({
      method: "POST",
      url: `/admin/category`,
      data: data,
    });
  };

  static getOne = (id) => {
    return request({
      method: "GET",
      url: `/admin/category/${id}`,
    });
  };

  static update = (id, data) => {
    return request({
      method: "PUT",
      url: `/admin/category/${id}`,
      data: data,
    });
  };
  static getCategoryInProductDetail = () => {
    return request({
      method: "GET",
      url: `/client/category/in-product-detail`,
    });
  };
}
