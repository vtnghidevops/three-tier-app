import { request, requestAdress } from "../../../helper/request";

const GHN_TOKEN = process.env.REACT_APP_GHN_TOKEN;
const GHN_SHOP_ID = 4374133;
const GHN_FROM_DISTRICT_ID = 1485;
const GHN_FROM_WARD_CODE = "1A0607";
const GHN_SERVICE_ID = 53320;
const GHN_BASE_URL = "https://online-gateway.ghn.vn/shiip/public-api";

export class AddressApi {
  static fetchAll = (filter) => {
    return request({
      method: "GET",
      url: `/admin/address?id_user=2dd6dc5e-ad8d-473b-a2aa-23f3477a6394`,
      params: filter,
    });
  };

  static create = (data) => {
    return request({
      method: "POST",
      url: `/admin/address`,
      data: data,
    });
  };

  static getOne = (id) => {
    return request({
      method: "GET",
      url: `/admin/address/${id}`,
    });
  };

  static getAddressByUserIdAndStatus = (id) => {
    return request({
      method: "GET",
      url: `/admin/address/address-user-status/${id}`,
    });
  };

  static getAddressByUserIdAndStatusRoleEmployee = (id) => {
    return request({
      method: "GET",
      url: `/admin/address/address-user-status/${id}`,
    });
  };

  static update = (id, data) => {
    return request({
      method: "PUT",
      url: `/admin/address/${id}`,
      data: data,
    });
  };
  static fetchAllProvince = () => {
    return requestAdress({
      method: "GET",
      headers: {
        token: GHN_TOKEN,
      },
      url: `${GHN_BASE_URL}/master-data/province`,
    });
  };
  static fetchAllProvinceDistricts = (codeProvince) => {
    return requestAdress({
      method: "GET",
      headers: {
        token: GHN_TOKEN,
      },
      url: `${GHN_BASE_URL}/master-data/district`,
      params: { province_id: codeProvince },
    });
  };
  static fetchAllProvinceWard = (codeDistrict) => {
    return requestAdress({
      method: "GET",
      headers: {
        token: GHN_TOKEN,
      },
      url: `${GHN_BASE_URL}/master-data/ward`,
      params: { district_id: codeDistrict },
    });
  };

  static fetchAllMoneyShip = (to_district_id, to_ward_code, quantity) => {
    let quantityProducts = 0;
    if (quantity == "" || quantity == null || quantity == undefined) {
      quantityProducts = 1;
    } else {
      quantityProducts = quantity;
    }

    return requestAdress({
      method: "GET",
      headers: {
        token: GHN_TOKEN,
        shop_id: GHN_SHOP_ID,
      },
      url: `${GHN_BASE_URL}/v2/shipping-order/fee`,
      params: {
        service_type_id: 2,
        insurance_value: "",
        coupon: "",
        from_district_id: GHN_FROM_DISTRICT_ID,
        to_district_id: to_district_id,
        to_ward_code: to_ward_code,
        height: 11 * quantityProducts,
        length: 28,
        weight: 300 * quantityProducts,
        width: 16,
      },
    });
  };
  static fetchAllDayShip = (to_district_id, to_ward_code) => {
    return requestAdress({
      method: "GET",
      headers: {
        token: GHN_TOKEN,
        shop_id: GHN_SHOP_ID,
      },
      url: `${GHN_BASE_URL}/v2/shipping-order/leadtime`,
      params: {
        from_district_id: GHN_FROM_DISTRICT_ID,
        from_ward_code: GHN_FROM_WARD_CODE,
        to_district_id: to_district_id,
        to_ward_code: to_ward_code,
        service_id: GHN_SERVICE_ID,
      },
    });
  };
  static fetchAllAddressByUser = (idUser) => {
    return request({
      method: "GET",
      url: `/admin/address/address-user/${idUser}`,
    });
  };

  static fetchAllAddressByUserRoleEmployee = (idUser) => {
    return request({
      method: "GET",
      url: `/admin/address/address-user/${idUser}`,
    });
  };
}
