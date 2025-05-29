import { request } from "../../../helper/request";
export class ColorApi {
  static fetchAll = (filter) => {
    return request({
      method: "GET",
      url: `/admin/color`,
      params: filter,
    });
  };

  static getAllCode = () => {
    return request({
      method: "GET",
      url: `/admin/color/code`,
    });
  };

  static create = (data) => {
    return request({
      method: "POST",
      url: `/admin/color`,
      data: data,
    });
  };

  static getOne = (id) => {
    return request({
      method: "GET",
      url: `/admin/color/${id}`,
    });
  };

  static update = (id, data) => {
    return request({
      method: "PUT",
      url: `/admin/color/${id}`,
      data: data,
    });
  };
  static getColorInProductDetail = () => {
    return request({
      method: "GET",
      url: `/client/color/in-product-detail`,
    });
  };
}
