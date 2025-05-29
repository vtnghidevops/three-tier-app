import { request } from "../../../helper/request";
export class MaterialApi {
  static fetchAll = (filter) => {
    return request({
      method: "GET",
      url: `/admin/material`,
      params: filter,
    });
  };

  static create = (data) => {
    return request({
      method: "POST",
      url: `/admin/material`,
      data: data,
    });
  };

  static getOne = (id) => {
    return request({
      method: "GET",
      url: `/admin/material/${id}`,
    });
  };

  static update = (id, data) => {
    return request({
      method: "PUT",
      url: `/admin/material/${id}`,
      data: data,
    });
  };
  static getMaterialInProductDetail = () => {
    return request({
      method: "GET",
      url: `/client/material/in-product-detail`,
    });
  };
}
