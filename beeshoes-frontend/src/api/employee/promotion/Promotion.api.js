import { request } from "../../../helper/request";

export class PromotionApi {
    static fetchAll = (filter) => {
        return request({
          method: "GET",
          url: `/admin/promotion`,
          params: filter,
        });
      };
    
      static create = (data) => {
        return request({
          method: "POST",
          url: `/admin/promotion`,
          data: data,
        });
      };
    
      static getOne = (id) => {
        return request({
          method: "GET",
          url: `/admin/promotion/${id}`,
        });
      };
      static getByProductDetail = (id) => {
        return request({
          method: "GET",
          url: `/admin/promotion/byProductDetail/${id}`,
        });
      };
    
      static update = (id,data) => {
        return request({
          method: "PUT",
          url: `/admin/promotion/${id}`,
          data: data,
        });
      };
      static updateStatus = (id) => {
        return request({
          method: "POST",
          url: `/admin/promotion/expired/${id}`,
        });
      };
}