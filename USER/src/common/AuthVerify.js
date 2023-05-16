import React from "react";
import jwt_decode from "jwt-decode";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import withRouter from "../customHook/withRouter";

const AuthVerify = () => {
  const logOut = () => {
    localStorage.clear();
    navigate("/", { replace: true });
    toast.dismiss();
    toast.error("Session Expired, Please Login Again", {
      toastId: "sessionExpired",
    });
  };
  const navigate = useNavigate();
  const token = localStorage.getItem("_TOKEN");

  if (token) {
    const { exp } = jwt_decode(token);
    const expirationTime = exp * 1000 - 60000;
    if (Date.now() >= expirationTime) {
      logOut();
    }
    return <div></div>;
  }
  return <div></div>;
};
export default withRouter(AuthVerify);
