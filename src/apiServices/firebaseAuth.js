import axios from "axios";
import BACKEND_BASE_URL from "./baseurl";
import cryptoJS from "crypto-js";
// const cryptoKey = process.env.REACT_APP_CRYPTOGRAPHY_SECRET_KEY;

// Encrypt & Decrypt
// const BACKEND_URL = BACKEND_BASE_URL;

const axiosInstanceFirebaseAuth = axios.create({
  // baseURL: BACKEND_URL,
});

axiosInstanceFirebaseAuth.interceptors.request.use(
  (config) => {
    config.headers = {
      "Authorization": "key=AAAAtdokviw:AAAAn_Ouzz0:APA91bENUfXNw_EM4YAryyHgN1EuDYoBuXy8X3DHwQfjpn1Dpj3oqZ0NnbqEbQH77sv1b263NwIVEnR05XaXvvGEAWyo6eHGRkolBaHhgIXF_E0-ukrOxHwyuioAFDPtqYeO9TH0iJLy",
      "Accept": "application/json",
      "Content-Type": "application/json",
    };
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);
// axiosInstanceAuth.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     Promise.reject(error);
//   }
// );
export default axiosInstanceFirebaseAuth;
