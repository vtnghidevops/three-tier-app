import { request } from "../../../helper/request";
export class SizeApi {
  static fetchAll = (filter) => {
    return request({
      method: "GET",
      url: `/admin/size`,
      params: filter,
    });
  };

  static getAll = () => {
    return request({
      method: "GET",
      url: `/admin/size/list`,
    });
  };

  static getOneByName = (name) => {
    return request({
      method: "GET",
      url: `/admin/size/name/${name}`,
    });
  };

  static create = (data) => {
    return request({
      method: "POST",
      url: `/admin/size`,
      data: data,
    });
  };

  static getOne = (id) => {
    return request({
      method: "GET",
      url: `/admin/size/${id}`,
    });
  };

  static update = (id, data) => {
    return request({
      method: "PUT",
      url: `/admin/size/${id}`,
      data: data,
    });
  };
  static getSizeInProductDetail = () => {
    return request({
      method: "GET",
      url: `/client/size/in-product-detail`,
    });
  };
}
