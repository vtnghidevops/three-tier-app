import { request } from "../../../helper/request";
export class PoinApi {
  static findPoin = () => {
    return request({
      method: "GET",
      url: `/admin/poin`,
    });
  };

 
}
