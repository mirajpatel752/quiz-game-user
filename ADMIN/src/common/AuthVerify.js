import React from "react";
import jwt_decode from "jwt-decode";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import withRouter from "./withRouter";
import useEncryption from "customHook/useEncryption";
import axiosInstanceAuth from "apiServices/axiosInstanceAuth";

const AuthVerify = () => {
  const {  decryptData } = useEncryption();
  const userData = decryptData(localStorage.getItem("user"));

  const logOut = async () => {
    await axiosInstanceAuth
      .post("/admin/logout")
      .then((res) => {
        if (res.data.status) {
          localStorage.removeItem("user");
          navigate("/sign-in");
          localStorage.clear();
        } else {
          toast.error(res.data?.message);
          if (res.data.isAuth === false) {
            localStorage.clear();
            navigate("/sign-in");
          }
          if (!localStorage.getItem("token")) {
            navigate("/sign-in");
          }
        }
      })
      .catch((err) => {
        toast.error(err);
      });
    toast.dismiss();
    toast.error("Session Expired, Please Login Again", { toastId: "sessionExpired" });
  };

  const navigate = useNavigate();
  const token = userData?.data?.token;

  if (token) {
    const { exp } = jwt_decode(token);
    const expirationTime = exp * 1000 - 60000;
    if (Date.now() >= expirationTime) {
      logOut();
    }
    if (new Date().getTime() / 1000 > exp) {
      logOut();
    }
  }
  return <div></div>;
};
export default withRouter(AuthVerify);
