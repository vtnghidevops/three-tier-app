import { requestCustomer } from "../../../helper/request";

export class NotificationClientApi {
    static getAll = () => {
        return requestCustomer({
          method: "GET",
          url: `/client/notification/listAdmin`,
        });
      };
      static getNotRead = () => {
        return requestCustomer({
          method: "GET",
          url: `/client/notification/listAdminNotRead`,
        });
      };
      static setStatus = (id) => {
        return requestCustomer({
          method: "POST",
          url: `/client/notification/setStatus/${id}`,
        });
      };
}

