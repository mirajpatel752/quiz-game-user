import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./SignUp.scss";
import axiosInstance from "../../apiServices/axiosInstance";
import useEncryption from "../../customHook/useEncryption";
import { GoogleLogin } from "react-google-login";
import { useEffect } from "react";
import Logo from "../../Assets/Img/logo.svg";
import PromiseLoader from "../../common/Loader/PromiseLoader";
import { useMediaQuery } from "react-responsive";

const SignUp = () => {
  const [error, setError] = useState({ status: false, type: "", message: "" });
  const [isShowPw, setIsShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeCard, setActiveCard] = useState({});
  const [avatarImage, setAvatarImage] = useState([]);
  const [seeMore, setSeeMore] = useState(false);
  const { encryptData, decryptData } = useEncryption();
  const [fields, setFields] = useState({
    user_name: "",
    email: "",
    password: "",
  });
  const isWide = useMediaQuery({ minWidth: "800px" });
  const navigate = useNavigate();

  const emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const onChange = (e) => {
    const value = e.target.value.replace(/^\s+|\s+$/gm, "");
    const name = e.target.name;
    const checked = e.target.checked;

    if (name === "user_name") {
      if (value.length < 1) {
        setError({
          ...error,
          status: true,
          type: "user_name",
          message: "User is required",
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
    // if (name === "terms") {
    //   if (checked) {
    //     setError({
    //       ...error,
    //       status: false,
    //       type: "",
    //       message: "",
    //     })
    //     setFields({
    //       ...fields,
    //       [name]: checked,
    //     })
    //   } else {
    //     setError({
    //       ...error,
    //       status: true,
    //       type: "terms",
    //       message: "please check terms",
    //     })
    //     setFields({
    //       ...fields,
    //       [name]: checked,
    //     })
    //   }
    // }
  };

  const handleSubmit = async () => {
    if (activeCard.id === undefined || activeCard.id === null) {
      setError({
        ...error,
        status: true,
        type: "avatar",
        message: "Please select avatar",
      });
    } else if (fields.user_name.length < 1) {
      setError({
        ...error,
        status: true,
        type: "user_name",
        message: "User is required",
      });
    } else if (!emailRegex.test(fields.email)) {
      setError({
        ...error,
        status: true,
        type: "email",
        message: "Enter valid email ID",
      });
    } else if (fields.password.length < 6) {
      setError({
        ...error,
        status: true,
        type: "password",
        message: "must be 6 character",
      });
    } else {
      setLoading(true);
      const encryptedData = encryptData(
        JSON.stringify({
          user_name: fields.user_name,
          email: fields.email,
          avatar_id: activeCard.id,
          password: fields.password,
        })
      );
      await axiosInstance
        .post("signup", {
          data: encryptedData,
        })
        .then((res) => {
          const data = decryptData(res.data.data);
          if (res?.data?.status) {
            toast.success(res?.data?.message);
            localStorage.setItem("user", res.data.data);
            localStorage.setItem("token", res.data.jwt);
            navigate("/account-type");
            setLoading(false);
          } else {
            toast.error(res?.data?.message);
            setLoading(false);
          }
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  };

  const getAvatar = async () => {
    await axiosInstance
      .get("avatars/get")
      .then((res) => {
        const data = decryptData(res.data.data);
        if (res?.data?.status) {
          setAvatarImage(data);
        } else {
          setAvatarImage([]);
          toast.error(res?.data?.message);
        }
      })
      .catch((err) => {
        toast.error(err);
        setAvatarImage([]);
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

  const onFailure = (err) => {
    console.log("failed:", err);
  };

  const clientId =
    "440592472912-13ui2s20ndbf5qh6qnppktkjl2j56jli.apps.googleusercontent.com";

  useEffect(() => {
    getAvatar();
    document.cookie = "username=Avi Patel";
  }, []);

  const changeBackdrop = () => {
    setSeeMore(!seeMore);
  };

  return (
    <>
      <div className="logo-Sign-up">
        <img
          onClick={() => navigate("/")}
          src={require("../../Assets/Img/logo.svg").default}
          alt=""
          className="image-brand"
        />
      </div>
      <div className="d-flex justify-content-center align-items-center py-5 header-mobile ">
        <div className={`sign-up-modal  ${seeMore ? "add-visibility" : ""}`}>
          <div className="position-relative">
            <div className="text-center d-block d-md-none">
              <img src={Logo} alt="logo" className="logo-width" />
            </div>
            <h1 className="d-flex justify-content-center pb-5">
              Sign up
              <span className="d-block d-md-none pl-2">
                &nbsp;to Play &nbsp;
              </span>
            </h1>
            <div className="avatar-button">
              <div className="d-flex justify-content-between">
                <h5 className="avatar-title">Avatar</h5>
                <p className="see-more-title" onClick={changeBackdrop}>
                  See more
                </p>
              </div>
            </div>
            <div>
              <div className="avatar-card-wrapper row">
                {avatarImage &&
                  avatarImage.map((d, i) => {
                    return (
                      i <= 5 && (
                        <div className="col-md-2 col-3 " key={i}>
                          <img
                            onClick={() => {
                              setActiveCard(d);
                              setError({
                                ...error,
                                status: false,
                                type: "",
                                message: "",
                              });
                            }}
                            src={d?.avatar}
                            alt="avatar"
                            className={`${
                              activeCard?.id === d.id ? "active-border" : ""
                            } img-fluid`}
                          />
                        </div>
                      )
                    );
                  })}
              </div>
              {error.status && error.type === "avatar" && (
                <div className="input-bottom-error">{error.message}</div>
              )}

              {seeMore && (
                <div className="more-avatar-card-wrapper">
                  {isWide === false ? (
                    <div className="avatar-wrapper">
                      {" "}
                      <h2 className="select-avatar col-11">
                        Select your Avatar
                      </h2>
                      <img
                        src={require("../../Assets/Img/close-icon.svg").default}
                        alt=""
                        onClick={changeBackdrop}
                        className="img-fluid col-1"
                      />
                    </div>
                  ) : null}

                  <div className="row">
                    {avatarImage &&
                      avatarImage.map((d, i) => (
                        <div
                          key={i}
                          className="col-md-2 col-3 mb-3"
                          onClick={() => setSeeMore(!seeMore)}
                        >
                          <img
                            onClick={() => {
                              setActiveCard(d);
                              setError({
                                ...error,
                                status: false,
                                type: "",
                                message: "",
                              });
                            }}
                            src={d?.avatar}
                            alt="avatar"
                            className={`${
                              activeCard?.id === d.id ? "active-border" : ""
                            } img-fluid`}
                          />
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
            <div className="form">
              <div
                className={`${
                  error.status && error.type === "user_name" ? "" : "mb-30"
                } form-item-input`}
              >
                <input
                  type="text"
                  name="user_name"
                  id="user_name"
                  autoComplete="off"
                  required
                  value={fields.user_name}
                  onChange={onChange}
                />
                <label htmlFor="user_name">Username</label>
              </div>
              {error.status && error.type === "user_name" && (
                <div className="input-bottom-error">{error.message}</div>
              )}

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
                />
                <label htmlFor="email">Email</label>
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

              <div className="form-item-checkbox">
                <input
                  type="checkbox"
                  id="terms"
                  name="terms"
                  value={fields.terms}
                  onChange={onChange}
                />

                <label htmlFor="terms">
                  I agree with <span>Terms</span> and <span>Privacy</span>
                </label>
              </div>

              {error.status && error.type === "terms" && (
                <div className="input-bottom-error m-0">{error.message}</div>
              )}

              <button
                className={`sign-up-btn ${
                  loading ? " border-0 bg-transparent" : "gradient-button"
                }`}
                onClick={handleSubmit}
              >
                {loading ? <PromiseLoader /> : "Sign Up"}
              </button>

              <h1 className="sign-up-with">
                <span>Or </span>
              </h1>

              {/* <button className="sign-up-btn-google">
            <img
              className="img-fluid"
              src={require("../../Assets/Img/google-logo.svg").default}
              alt=""
            />
            <span>Sign Up with Google</span>
          </button> */}
              <GoogleLogin
                className="sign-up-btn-google"
                clientId={clientId}
                buttonText="Sign up with Google"
                onSuccess={onSuccess}
                onFailure={onFailure}
                cookiePolicy={"single_host_origin"}
              />

              <div className="already-account">
                <span>Already have an account?</span>
                <p onClick={() => navigate("/login")}>Log in</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
