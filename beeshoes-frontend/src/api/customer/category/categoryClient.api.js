import { requestCustomer } from "../../../helper/request";

export class CategoryClientApi {
    static getAll = (filter) => {
        return requestCustomer({
          method: "GET",
          url: `/client/category`,
          params: filter,
        });
      };
    
   
}