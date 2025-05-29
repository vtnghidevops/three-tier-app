import { request } from "../../../helper/request";
export class CustomerApi {
  static fetchAll = (filter) => {
    return request({
      method: "GET",
      url: `/admin/customer`,
      params: filter,
    });
  };
  static fetchByDateOfBirthRange = (startDate, endDate) => {
    return request({
      method: "GET",
      url: `/admin/customer/search-date`,
      params: {
        startDate: startDate,
        endDate: endDate,
      },
    });
  };
  static create = (data) => {
    return request({
      method: "POST",
      url: `/admin/customer`,
      data: data,
    });
  };

  static getOne = (id) => {
    return request({
      method: "GET",
      url: `/admin/customer/${id}`,
    });
  };

  static update = (id, data) => {
    return request({
      method: "PUT",
      url: `/admin/customer/${id}`,
      data: data,
    });
  };

  static quickCreate = (data) => {
    return request({
      method: "POST",
      url: `/admin/customer/quick-create`,
      data: data,
    });
  };

  static getOneByPhoneNumber = (phoneNumber) => {
    return request({
      method: "GET",
      url: `/admin/customer/phone-number/${phoneNumber}`,
    });
  };
}
