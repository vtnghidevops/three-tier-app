import axios from "axios";
import { AppConfig, AppConfigAddress } from "../AppConfig";
import { toast } from "react-toastify";
import { store } from "../app/store";
import {
  SetLoadingFalse,
  SetLoadingTrue,
} from "../app/reducer/Loading.reducer";
import { deleteToken, getTokenCustomer, getTokenEmpoloyee } from "./useCookies";

export const request = axios.create({
  baseURL: AppConfig.apiUrl,
});

export const requestCustomer = axios.create({
  baseURL: AppConfig.apiUrl,
});

export const requestAdress = axios.create({
  baseURL: AppConfigAddress.apiUrl,
});

request.interceptors.request.use((config) => {
  store.dispatch(SetLoadingTrue());
  const token = getTokenEmpoloyee();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

requestCustomer.interceptors.request.use((config) => {
  store.dispatch(SetLoadingTrue());
  const token = getTokenCustomer();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

request.interceptors.response.use(
  (response) => {
    store.dispatch(SetLoadingFalse());
    return response;
  },
  (error) => {
    // if (
    //   error.response &&
    //   (error.response.status === 401 || error.response.status === 403)
    // ) {
    //   window.location.href = "/not-authorization";
    //   deleteToken();
    //   return;
    // }
    if (error.response != null && error.response.status === 400) {
      toast.error(error.response.data.message);
    }
    if (error.response && error.response.status === 404) {
      window.location.href = "/not-found";
      return;
    }
    store.dispatch(SetLoadingFalse());
    throw error;
  }
);

requestCustomer.interceptors.response.use(
  (response) => {
    store.dispatch(SetLoadingFalse());
    return response;
  },
  (error) => {
    // if (
    //   error.response &&
    //   (error.response.status === 401 || error.response.status === 403)
    // ) {
    //   window.location.href = "/not-authorization";
    //   deleteToken();
    //   return;
    // }
    if (error.response != null && error.response.status === 400) {
      toast.error(error.response.data.message);
    }
    if (error.response && error.response.status === 404) {
      window.location.href = "/not-found";
      return;
    }
    store.dispatch(SetLoadingFalse());
    throw error;
  }
);
