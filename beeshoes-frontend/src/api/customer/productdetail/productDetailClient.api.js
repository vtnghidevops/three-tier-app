import { requestCustomer } from "../../../helper/request";

export class ProductDetailClientApi {
  static getByIdCategory = (id) => {
    return requestCustomer({
      method: "GET",
      url: `/client/product-detail/byCategory/${id}`,
    });
  };

  static getDetailProductOfClient = (idProductDetail) => {
    return requestCustomer({
      method: "GET",
      url: `/client/product-detail/${idProductDetail}`,
    });
  };
  static getListSizeCart = (id, codeColor) => {
    return requestCustomer({
      method: "GET",
      url: `/client/product-detail/listSizeCart/${id}&&${codeColor}`,
    });
  };
  static getDetailProductHavePromotion = (pageNo) => {
    return requestCustomer({
      method: "GET",
      url: `/client/product-detail/have-promotion?page=${pageNo}&size=15`,
    });
  };
  static getDetailProductNew = (pageNo) => {
    return requestCustomer({
      method: "GET",
      url: `/client/product-detail/new?page=${pageNo}&size=15`,
    });
  };
  static getDetailProductSellMany = (pageNo) => {
    return requestCustomer({
      method: "GET",
      url: `/client/product-detail/sell-many?page=${pageNo}&size=15`,
    });
  };
  static list = (data) => {
    return requestCustomer({
      method: "GET",
      url: `/client/product-detail/list`,
      params: data,
    });
  };
}
