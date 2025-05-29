import { requestCustomer } from "../../../helper/request";
export class UserPoinApi {
  static findUser = () => {
    return requestCustomer({
      method: "GET",
      url: `/client/user`,
    });
  };

 
}
