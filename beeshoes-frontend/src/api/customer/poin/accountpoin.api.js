import { requestCustomer } from "../../../helper/request";
export class AccountPoinApi {
  static findPoin = () => {
    return requestCustomer({
      method: "GET",
      url: `/admin/poin`,
    });
  };

 
}
