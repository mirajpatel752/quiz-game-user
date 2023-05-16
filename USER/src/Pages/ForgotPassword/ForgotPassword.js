import React, { useState } from "react";
import { toast } from "react-toastify";
import "../SignUp/SignUp.scss";
import axiosInstance from "../../apiServices/axiosInstance";
import useEncryption from "../../customHook/useEncryption";
import { useNavigate } from "react-router-dom";
import Logo from "../../Assets/Img/logo.svg";
import PromiseLoader from "../../common/Loader/PromiseLoader";

const ForgotPassword = ({ open, close, confirmClose }) => {
  const { encryptData, decryptData } = useEncryption();
  const [isOtpDone, setIsOtpDone] = useState(false);

  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState({
    email: "",
    otp: "",
  });
  const [error, setError] = useState({ status: false, type: "", message: "" });

  const navigate = useNavigate();

  const emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const onChange = (e) => {
    const value = e.target.value.replace(/^\s+|\s+$/gm, "");
    const name = e.target.name;
    if (name === "email") {
      if (!emailRegex.test(value)) {
        setError({
          ...error,
          status: true,
          type: "email",
          message: "Enter valid email ID",
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
    if (name === "otp") {
      if (value.length < 6) {
        setError({
          ...error,
          status: true,
          type: "otp",
          message: "Enter valid otp",
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
  };

  const handleSubmit = async () => {
    if (!emailRegex.test(fields.email)) {
      setError({
        ...error,
        status: true,
        type: "email",
        message: "Enter valid email ID",
      });
    } else {
      setLoading(true);
      const encryptedData = encryptData(
        JSON.stringify({
          email: fields.email,
        })
      );
      await axiosInstance
        .post("forgot-password", {
          data: encryptedData,
        })
        .then((res) => {
          setLoading(false);
          const data = decryptData(res.data.data);
          if (res?.data?.status) {
            toast.success(res?.data?.message);
            setIsOtpDone(true);
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

  const handleSubmitOtp = async () => {
    if (fields.otp.length < 6) {
      setError({
        ...error,
        status: true,
        type: "otp",
        message: "Enter valid otp",
      });
    } else {
      setLoading(true);
      const encryptedData = encryptData(
        JSON.stringify({
          email: fields.email,
          otp: fields.otp,
        })
      );
      await axiosInstance
        .post("verify-otp", {
          data: encryptedData,
        })
        .then((res) => {
          setLoading(false);
          const data = decryptData(res.data.data);
          if (res.data.status) {
            toast.success(res?.data?.message);
            localStorage.setItem("email", encryptedData);
            navigate("/reset-password");
            setIsOtpDone(false);
          } else {
            toast.error(res?.data?.message);
          }
        })
        .catch((err) => {
          setLoading(false);
          console.log(err);
        });
    }
  };

  return (
    <>
      <div className="logo-Sign-up">
        <img
          src={require("../../Assets/Img/logo.svg").default}
          alt=""
          className="image-brand"
        />
      </div>
      <div className="d-flex justify-content-center align-items-center my-5 header-mobile">
        <div className="sign-up-modal">
          {/* <div className="close-icon-wrapper">
          <img
            onClick={close}
            src={require("../../Assets/Img/close-icon.svg").default}
            alt=""
            className="img-fluid"
          />
        </div> */}
          <div className="text-center d-block d-md-none">
            <img src={Logo} alt="logo" className="logo-width" />
          </div>
          {isOtpDone ? (
            <h1 className="mb-3 heading"> OTP Verification</h1>
          ) : (
            <h1 className="heading">Forgot Password</h1>
          )}
          {isOtpDone ? (
            <div className="form">
              <div className="green-wrapper-email">
                <p>
                  We’ve sent a verification code to your <br />
                  email - {fields.email}
                </p>
              </div>
              <div
                className={`${
                  error.status && error.type === "otp" ? "" : "mb-30"
                } form-item-input`}
              >
                <input
                  type="text"
                  name="otp"
                  id="otp"
                  autoComplete="off"
                  required
                  onChange={onChange}
                  value={fields.otp}
                />
                <label htmlFor="otp">Enter verification code</label>
              </div>
              {error.status && error.type === "otp" && (
                <div className="input-bottom-error">{error.message}</div>
              )}

              <button
                className={`sign-up-btn ${
                  loading ? " border-0 bg-transparent" : "gradient-button"
                }`}
                onClick={handleSubmitOtp}
              >
                {loading ? <PromiseLoader /> : " Submit"}
              </button>
            </div>
          ) : (
            <div className="form">
              <div
                className={`${
                  error.status && error.type === "email" ? "" : "mb-60"
                } form-item-input`}
              >
                <input
                  type="text"
                  name="email"
                  id="email"
                  autoComplete="off"
                  required
                  onChange={onChange}
                  value={fields.email}
                />
                <label htmlFor="email">Email</label>
              </div>
              {error.status && error.type === "email" && (
                <div className="input-bottom-error">{error.message}</div>
              )}

              <button
                className={`sign-up-btn ${
                  loading ? " border-0 bg-transparent" : "gradient-button"
                }`}
                onClick={handleSubmit}
              >
                {loading ? <PromiseLoader /> : "Forgot Password"}
              </button>

              <button
                className="back-to-login-btn"
                onClick={() => navigate("/login")}
              >
                <img
                  className="img-fluid"
                  src={require("../../Assets/Img/back.svg").default}
                  alt=""
                />
                <span>Back to Login</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
