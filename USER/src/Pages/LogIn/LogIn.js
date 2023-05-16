import React, { useEffect, useState } from "react";
import "../SignUp/SignUp.scss";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../apiServices/axiosInstance";
import axiosInstanceAuth from "../../apiServices/axiosInstanceAuth";
import useEncryption from "../../customHook/useEncryption";
import { GoogleLogin } from "react-google-login";
import Logo from "../../Assets/Img/logo.svg";
import "./Login.scss";
import PromiseLoader from "../../common/Loader/PromiseLoader";
import { useMediaQuery } from "react-responsive";

const LogIn = ({ open, close, onSwipe, onForgot }) => {
  const [error, setError] = useState({ status: false, type: "", message: "" });
  const [isShowPw, setIsShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { encryptData, decryptData } = useEncryption();
  const isMobile = useMediaQuery({ minWidth: "768px" });
  const [fields, setFields] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const navigate = useNavigate();

  const emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const onChange = (e) => {
    const value = e.target.value.replace(/^\s+|\s+$/gm, "");
    const name = e.target.name;
    const checked = e.target.checked;
    if (name === "email") {
      if (value.length === 0) {
        setError({
          ...error,
          status: true,
          type: "email",
          message: "Enter valid email ID Or User Name",
        });
        setFields({
          ...fields,
          [name]: value,
        });
      } else {
        setError({
          ...error,
          status: false,
          type: "",
          message: "",
        });
        setFields({
          ...fields,
          [name]: value,
        });
      }
    }
    if (name === "password") {
      if (value.length > 5) {
        setError({
          ...error,
          status: false,
          type: "",
          message: "",
        });
        setFields({
          ...fields,
          [name]: value,
        });
      } else {
        setError({
          ...error,
          status: true,
          type: "password",
          message: "must be 6 character",
        });
        setFields({
          ...fields,
          [name]: value,
        });
      }
    }
    // if (name === "remember") {
    //   if (checked) {
    //     setError({
    //       ...error,
    //       status: false,
    //       type: "",
    //       message: "",
    //     });
    //     setFields({
    //       ...fields,
    //       [name]: checked,
    //     });
    //   } else {
    //     setError({
    //       ...error,
    //       status: true,
    //       type: "remember",
    //       message: "please check remember me",
    //     });
    //     setFields({
    //       ...fields,
    //       [name]: checked,
    //     });
    //   }
    // }
  };

  const handleSubmit = async () => {
    if (fields.email.length === 0) {
      setError({
        ...error,
        status: true,
        type: "email",
        message: "Enter valid email ID Or User Name",
      });
    } else if (fields.password.length < 6) {
      setError({
        ...error,
        status: true,
        type: "password",
        message: "must be 6 character",
      });
    }
    // else if (!fields.remember) {
    //   setError({
    //     ...error,
    //     status: true,
    //     type: "remember",
    //     message: "please check remember me",
    //   });
    // }
    else {
      setLoading(true);
      const encryptedData = encryptData(
        JSON.stringify({
          email: fields.email,
          password: fields.password,
          is_social_login: "0",
        })
      );
      await axiosInstance
        .post("login", {
          data: encryptedData,
        })
        .then((res) => {
          setLoading(false);
          const data = decryptData(res.data.data);
          if (res?.data?.status) {
            if (isMobile) {
              localStorage.setItem("isSideBar", "1");
            }
            toast.success(res?.data?.message);
            getAllCategories();
            localStorage.setItem("user", res.data.data);
            localStorage.setItem("token", res.data.jwt);
          } else {
            toast.error(res?.data?.message);
          }
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  };

  const getAllCategories = async () => {
    await axiosInstanceAuth
      .get("categories/get-user-category")
      .then((res) => {
        const data = decryptData(res.data.data);
        if (res?.data?.status) {
          navigate("/dashboard");
        } else {
          navigate("/account-type");
        }
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  const onSuccess = async (res) => {
    const encryptedData = encryptData(
      JSON.stringify({
        user_name: res?.profileObj?.name,
        email: res?.profileObj?.email,
        is_social_login: "1",
        social_media_type: "google",
        social_media_id: res?.profileObj?.googleId,
      })
    );
    await axiosInstance
      .post("login", {
        data: encryptedData,
      })
      .then((res) => {
        const data = decryptData(res.data.data);
        if (res?.data?.status) {
          toast.success(res?.data?.message);
          localStorage.setItem("user", res.data.data);
          localStorage.setItem("token", res.data.jwt);
          navigate("");
        } else {
          toast.error(res?.data?.message);
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Error");
      });
  };
  const onFailure = (err) => {};

  const clientId =
    "440592472912-13ui2s20ndbf5qh6qnppktkjl2j56jli.apps.googleusercontent.com";

  return (
    <>
      <div className="logo-Sign-up">
        <img
        onClick={()=>navigate("/")}
          src={require("../../Assets/Img/logo.svg").default}
          alt=""
          className="image-brand"
        />
      </div>
      <div className="d-flex justify-content-center align-items-center my-5 header-mobile">
        <div className="sign-up-modal">
          <div className="text-center d-block d-md-none">
            <img src={Logo} alt="logo" className="logo-width" />
          </div>
          <h1 className="heading">
            Log in <span className="d-md-none">to Play</span>
          </h1>
          <div className="form">
            <div
              className={`${
                error.status && error.type === "email" ? "" : "mb-30"
              } form-item-input`}
            >
              <input
                type="text"
                name="email"
                id="email"
                autoComplete="off"
                required
                value={fields.email}
                onChange={onChange}
                onKeyPress={(e) => {
                  if (e.key === "Enter") { handleSubmit(e) }
              }}
              />
              <label htmlFor="email">Email Or User Name</label>
            </div>
            {error.status && error.type === "email" && (
              <div className="input-bottom-error">{error.message}</div>
            )}

            <div
              className={`${
                error.status && error.type === "password" ? "" : "mb-3"
              } form-item-input`}
            >
              <input
                type={isShowPw ? "text" : "password"}
                name="password"
                id="password"
                autoComplete="off"
                required
                value={fields.password}
                onChange={onChange}
                onKeyPress={(e) => {
                  if (e.key === "Enter") { handleSubmit(e) }
              }}
              />
              
              <label htmlFor="password">Password</label>
              {isShowPw ? (
                <img
                  onClick={() => setIsShowPw(!isShowPw)}
                  className="img-fluid eye-icon"
                  src={require("../../Assets/Img/view-eye.svg").default}
                  alt=""
                />
              ) : (
                <img
                  onClick={() => setIsShowPw(!isShowPw)}
                  className="img-fluid eye-icon"
                  src={require("../../Assets/Img/hidden-eye.svg").default}
                  alt=""
                />
              )}
            </div>
            {error.status && error.type === "password" && (
              <div className="input-bottom-error">{error.message}</div>
            )}

            <div className="form-item-checkbox d-flex justify-content-between align-items-center">
              <input
                type="checkbox"
                name="remember"
                value={fields.remember}
                onChange={onChange}
                id="remember"
              />

              <label htmlFor="remember">Remember me</label>

              <button onClick={() => navigate("/forgot-password")}>
                Forgot Password?
              </button>
            </div>
            {error.status && error.type === "remember" && (
              <div className="input-bottom-error m-0">{error.message}</div>
            )}

            <button
              className={`sign-up-btn ${
                loading ? " border-0 bg-transparent" : "gradient-button"
              }`}
              onClick={handleSubmit}
            >
              {loading ? <PromiseLoader /> : "Log in"}
            </button>

            <h1 className="sign-up-with">
              <span>or</span>
            </h1>


            <GoogleLogin
              className="sign-up-btn-google"
              clientId={clientId}
              buttonText="Log in with Google"
              onSuccess={onSuccess}
              onFailure={onFailure}
              cookiePolicy={"single_host_origin"}
            />

            <div className="already-account login-already">
              <span>Don’t have an account?</span>
              <p onClick={() => navigate("/signup")}>Sign Up</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LogIn;
