import { request } from "../../../helper/request";
export class StatisticalApi {
  static fetchAllStatisticalDay = () => {
    return request({
      method: "GET",
      url: `/admin/statistical/day`,
    });
  };
  static fetchAllStatisticalMonth = () => {
    return request({
      method: "GET",
      url: `/admin/statistical/month`,
    });
  };
  static fetchAllStatisticalStatusBill = (startDate, endDate) => {
    return request({
      method: "GET",
      url: `/admin/statistical/status-bill`,
      params: {
        startDate: startDate,
        endDate: endDate,
      },
    });
  };
  static fetchAllStatisticalBestSellingProduct = (startDate, endDate) => {
    return request({
      method: "GET",
      url: `/admin/statistical/best-selling-product`,
      params: {
        startDate: startDate,
        endDate: endDate,
      },
    });
  };
  static fetchBillByDate = (startDate, endDate) => {
    return request({
      method: "GET",
      url: `/admin/statistical/bill-date`,
      params: {
        startDate: startDate,
        endDate: endDate,
      },
    });
  };
  static fetchAllStatisticalGrowth = () => {
    return request({
      method: "GET",
      url: `/admin/statistical/growth`,
    });
  };
  static fetchAllStatisticalStock = () => {
    return request({
      method: "GET",
      url: `/admin/statistical/stock`,
    });
  };

  static downloadExcel_xlsx = () => {
    return request({
      method: "GET",
      url: `/admin/statistical/download/xlsx`,
      responseType: "arraybuffer",
    });
  };
}
