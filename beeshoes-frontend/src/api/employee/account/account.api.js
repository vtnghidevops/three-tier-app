import { request } from "../../../helper/request";
export class AccountApi {
  static getAllAccount = () => {
    return request({
      method: "GET",
      url:`/account`,
    });
  };
  static fetchAll = (filter) => {
    return request({
      method: "GET",
      url: `/admin/employee`,
      params: filter,
    });
  };
  static fetchByDateOfBirthRange = (startDate, endDate) => {
    return request({
      method: "GET",
      url: `/admin/employee/search-date`,
      params: {
        startDate: startDate,
        endDate: endDate,
      },
    });
  };
  static create = (data) => {
    return request({
      method: "POST",
      url: `/admin/employee`,
      data: data,
    });
  };

  static getOne = (id) => {
    return request({
      method: "GET",
      url: `/admin/employee/${id}`,
    });
  };

  static update = (id,data) => {
    return request({
      method: "PUT",
      url: `/admin/employee/${id}`,
      data: data,
    });
  };
  static fetchDataSimpleEntityEmployees = () => {
    return request({
      method: "GET",
      url: `/account/simple-employess`
    });
  };

  static getAccountUserByIdBill = (idBill) => {
    return request({
      method: "GET",
      url: `/account/detail-account/${idBill}`
    });
  };
}
