import { request } from "../../../helper/request";
export class AddressApi {
  static fetchCity = () => {
    return request({
      method: "GET",
      url: `https://provinces.open-api.vn/api/?depth=1` ,
    });
  };

    static fetchDistrict = (idCity) => {
      return request({
        method: "GET",
        url: `https://provinces.open-api.vn/api/p/` + idCity + `?depth=2`
      });
    };

    static fetchWard = (idDistrict) => {
      return request({
        method: "GET",
        url: `https://provinces.open-api.vn/api/d/` + idDistrict + `?depth=2`
      });
    };

}