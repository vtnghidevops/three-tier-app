import { request } from "../../../helper/request";

export class NotificationApi {
    static getAll = (filter) => {
        return request({
            method: "GET",
            url: `/client/category`,
            params: filter,
        });
    };

}