import { requestCustomer } from "../../../helper/request";

export class PromotionClientApi {
      static getPromotionOfProductDetail = (id) => {
        return requestCustomer({
          method: "GET",
          url: `/client/promotion/ofProductDetail/${id}`,
        });
      };
   
}