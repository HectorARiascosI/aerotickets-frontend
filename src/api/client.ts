import axios from "axios";
import { API_BASE } from "./endpoints";
import { STORAGE_KEYS, ROUTES } from "@/constants";

const CONTENT_TYPE_JSON = "application/json";
const HEADER_AUTHORIZATION = "Authorization";
const BEARER_PREFIX = "Bearer ";
const HTTP_UNAUTHORIZED = 401;
const HTTP_FORBIDDEN = 403;

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: { "Content-Type": CONTENT_TYPE_JSON, Accept: CONTENT_TYPE_JSON },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  if (token) config.headers[HEADER_AUTHORIZATION] = `${BEARER_PREFIX}${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    if (status === HTTP_UNAUTHORIZED || status === HTTP_FORBIDDEN) {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      window.location.href = ROUTES.LOGIN;
    }
    return Promise.reject(err);
  }
);

export { api };
export default api;