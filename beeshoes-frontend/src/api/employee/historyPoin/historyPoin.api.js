import { request } from "../../../helper/request";

export class HistoryPoinApi {
  static fetchAllByUser = (id) => {
    return request({
      method: "GET",
      url: `/admin/history-poin/user/${id}`,
    });
  };

}
