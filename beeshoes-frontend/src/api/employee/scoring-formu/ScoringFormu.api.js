import { request } from "../../../helper/request";

export class ScoringFormu {
  static addOrUpdate = (data) => {
    return request({
      method: "POST",
      url: `/admin/scoring-formula`,
      data: data,
    });
  };
}
