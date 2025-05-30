import { requestAdress, requestCustomer } from "../../../helper/request";

const GHN_TOKEN = process.env.REACT_APP_GHN_TOKEN;
const GHN_SHOP_ID = 4374133;
const GHN_FROM_DISTRICT_ID = 1485;
const GHN_FROM_WARD_CODE = "1A0607";
const GHN_SERVICE_ID = 53320;
const GHN_BASE_URL = "https://online-gateway.ghn.vn/shiip/public-api";

export class AddressClientApi {
  static getAllProvince = () => {
    return requestAdress({
      method: "GET",
      headers: {
        token: GHN_TOKEN,
      },
      url: `${GHN_BASE_URL}/master-data/province`,
    });
  };
  static getAlldistrict = (codeCity) => {
    return requestAdress({
      method: "GET",
      headers: {
        token: GHN_TOKEN,
      },
      url: `${GHN_BASE_URL}/master-data/district`,
      params: { province_id: codeCity },
    });
  };
  static getAllWard = (codeDistrict) => {
    return requestAdress({
      method: "GET",
      headers: {
        token: GHN_TOKEN,
      },
      url: `${GHN_BASE_URL}/master-data/ward`,
      params: { district_id: codeDistrict },
    });
  };

  static getMoneyShip = (to_district_id, to_ward_code) => {
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
        height: 15,
        length: 15,
        weight: 1000,
        width: 15,
      },
    });
  };
  static getDayShip = (to_district_id, to_ward_code) => {
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

  static getByAccountAndStatus = (idAccount) => {
    return requestCustomer({
      method: "GET",
      url: `/client/address/${idAccount}`,
    });
  };
  static getListByAccount = (idAccount) => {
    return requestCustomer({
      method: "GET",
      url: `/client/address/list/${idAccount}`,
    });
  };
  static setDefault = (data) => {
    return requestCustomer({
      method: "POST",
      url: `/client/address/setDefault`,
      data: data,
    });
  };
  static updateAddressClient = (data) => {
    return requestCustomer({
      method: "POST",
      url: `/client/address/update`,
      data: data,
    });
  };
  static createAddressClient = (data) => {
    return requestCustomer({
      method: "POST",
      url: `/client/address/create`,
      data: data,
    });
  };
  static deleteAddressClient = (idAddress) => {
    return requestCustomer({
      method: "DELETE",
      url: `/client/address/delete/${idAddress}`,
    });
  };
  static detailAddressClient = (idAddress) => {
    return requestCustomer({
      method: "GET",
      url: `/client/address/detail/${idAddress}`,
    });
  };
  //Address client
  static fetchAllAddressByUser = (idUser) => {
    return requestCustomer({
      method: "GET",
      url: `/client/address/address-user/${idUser}`,
    });
  };
  static create = (data) => {
    return requestCustomer({
      method: "POST",
      url: `/client/address`,
      data: data,
    });
  };

  static getOne = (id) => {
    return requestCustomer({
      method: "GET",
      url: `/client/getOne/${id}`,
    });
  };

  static getAddressByUserIdAndStatus = (id) => {
    return requestCustomer({
      method: "GET",
      url: `/client/address/address-user-status/${id}`,
    });
  };

  static update = (id, data) => {
    return requestCustomer({
      method: "PUT",
      url: `/client/address/${id}`,
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
}
