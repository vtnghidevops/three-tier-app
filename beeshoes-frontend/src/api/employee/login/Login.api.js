import { request } from "../../../helper/request";
export class LoginApi {
  static authenticationIn = (data) => {
    return request({
      method: "POST",
      url: `/login-v2/singin`,
      data: data,
    });
  };

  static authenticationUp = (data) => {
    return request({
      method: "POST",
      url: `/login-v2/singup`,
      data: data,
    });
  };

  static restPassword = (data) => {
    return request({
      method: "POST",
      url: `/login-v2/reset-password`,
      data: data,
    });
  };

  static changePassword = (data) => {
    return request({
      method: "POST",
      url: `/login-v2/change-password`,
      data: data,
    });
  };
}
