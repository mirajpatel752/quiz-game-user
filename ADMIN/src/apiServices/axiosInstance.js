import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BASE_DEV_URL;
const axiosInstance = axios.create({
  baseURL: BACKEND_URL,
});
axiosInstance.interceptors.request.use(
  (config) => {
    config.headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    Promise.reject(error);
  }
);
export default axiosInstance;
