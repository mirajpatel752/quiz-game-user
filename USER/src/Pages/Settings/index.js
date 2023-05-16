import React, { useEffect, useState } from "react";
import "./Settings.scss";
import "../Sidebar/style.scss";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar/sidebar";
import axiosInstance from "../../apiServices/axiosInstance";
import { toast } from "react-toastify";
import useEncryption from "../../customHook/useEncryption";
import { Modal } from "reactstrap";
import axiosInstanceAuth from "../../apiServices/axiosInstanceAuth";
import PromiseLoader from "../../common/Loader/PromiseLoader";
import UserDetails from "../../common/Header/userDetails";
import { type } from "@testing-library/user-event/dist/type";
import Loader from "../../common/Loader/loader";

const Settings = () => {
  const navigate = useNavigate();
  const [avatarImage, setAvatarImage] = useState([]);
  const [countries, setCountries] = useState([]);
  const { encryptData, decryptData } = useEncryption();
  const [select, setSelect] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [activeImg, setActiveImg] = useState({});
  const [isShowPw, setIsShowPw] = useState(false);
  const [currentIsShowPw, setCurrentIsShowPw] = useState(false);
  const [newIsShowPw, setNewIsShowPw] = useState(false);
  const [accountDetails, setAccountDetails] = useState([]);
  const [loader, setLoader] = useState(false);

  const [fields, setFields] = useState({
    full_name: "",
    birth_year: "",
    country_id: "",
    avatar_id: "",
    avatar: "",
    old_password: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState({ status: false, type: "", message: "" });

  const onChange = (e) => {
    const value = e.target.value.replace(/^\s+|\s+$/gm, "");
    const name = e.target.name;

    if (name === "full_name") {
      if (value?.length < 1) {
        setError({
          ...error,
          status: true,
          type: "full_name",
          message: "Enter valid full name",
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
    if (name === "birth_year") {
      if (value?.length < 1) {
        setError({
          ...error,
          status: true,
          type: "birth_year",
          message: "Enter valid birth",
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
    if (name === "country_id") {
      if (value?.length < 1) {
        setError({
          ...error,
          status: true,
          type: "country_id",
          message: "Enter valid country",
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
    if (name === "old_password") {
      if (value?.length > 5) {
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
          type: "old_password",
          message: "must be 6 character",
        });
        setFields({
          ...fields,
          [name]: value,
        });
      }
    }
    if (name === "password") {
      if (value?.length > 5) {
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
    if (name === "confirmPassword") {
      if (fields.password === value) {
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
          type: "confirmPassword",
          message: "password not match",
        });
        setFields({
          ...fields,
          [name]: value,
        });
      }
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
          toast.error(res?.data?.message);
        }
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  const getUser = async (type) => {
    setLoader(type === true ? true : false);
    await axiosInstanceAuth
      .get("user/get")
      .then((res) => {
        const data = decryptData(res.data.data);
        if (res?.data?.status) {
          setFields({
            ...fields,
            full_name: data.user_name,
            birth_year: data.birth_year ? data.birth_year : "",
            country_id: data.country_id ? data.country_id : "",
            avatar_id: data.avatar_id,
            avatar: data.avatar,
          });
          setLoader(false);
        } else {
          toast.error(res?.data?.message);
          setLoader(false);
        }
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  const getCountries = async () => {
    await axiosInstanceAuth
      .get("countries/get")
      .then((res) => {
        const data = decryptData(res.data.data);
        if (res?.data?.status) {
          setCountries(data.data);
        } else {
          toast.error(res?.data?.message);
        }
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  const onUpdateProfile = async () => {
    if (fields?.full_name?.length < 1) {
      setError({
        ...error,
        status: true,
        type: "full_name",
        message: "Enter valid full name",
      });
    } else if (fields?.birth_year?.length < 1) {
      setError({
        ...error,
        status: true,
        type: "birth_year",
        message: "Enter valid birth",
      });
    } else if (fields?.country_id?.length < 1) {
      setError({
        ...error,
        status: true,
        type: "country_id",
        message: "Enter valid country",
      });
    } else {
      setProfileLoading(true);
      const encryptedData = encryptData(
        JSON.stringify({
          full_name: fields.full_name,
          birth_year: parseInt(fields.birth_year),
          country_id: fields.country_id,
          avatar_id: fields.avatar_id,
        })
      );
      await axiosInstanceAuth
        .put("update-profile", { data: encryptedData })
        .then((res) => {
          setProfileLoading(false);
          const data = decryptData(res.data.data);
          if (res?.data?.status) {
            getUser();
            toast.success(res?.data?.message);
          } else {
            toast.error(res?.data?.message);
          }
        })
        .catch((err) => {
          setProfileLoading(false);
          console.log(err);
        });
    }
  };

  const onChangePassword = async () => {
    if (fields?.old_password?.length < 6) {
      setError({
        ...error,
        status: true,
        type: "old_password",
        message: "must be 6 character",
      });
    } else if (fields?.password?.length < 6) {
      setError({
        ...error,
        status: true,
        type: "password",
        message: "must be 6 character",
      });
    } else if (fields?.password !== fields?.confirmPassword) {
      setError({
        ...error,
        status: true,
        type: "confirmPassword",
        message: "password not match",
      });
    } else {
      setPasswordLoading(true);
      const encryptedData = encryptData(
        JSON.stringify({
          password: fields.password,
          old_password: fields.old_password,
        })
      );
      await axiosInstanceAuth
        .put("update-password", { data: encryptedData })
        .then((res) => {
          setPasswordLoading(false);
          const data = decryptData(res.data.data);
          if (res?.data?.status) {
            toast.success(res?.data?.message);
          } else {
            toast.error(res?.data?.message);
          }
        })
        .catch((err) => {
          console.log(err);
          setPasswordLoading(false);
        });
    }
  };

  const getCategoriesAll = async () => {
    await axiosInstanceAuth
      .get(`categories/get-all`)
      .then((res) => {
        const data = decryptData(res.data.data);
        if (res?.data?.status) {
          setAccountDetails(data);
        } else {
          toast.error(res?.data?.message);
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error(err);
      });
  };

  const getOngoing = async () => {
    await axiosInstanceAuth
      .get("quiz/ongoing-quiz")
      .then((res) => {
        const data = decryptData(res.data.data);
        if (res?.data?.status) {
        } else {
          toast.error(res?.data?.message);
        }
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  useEffect(() => {
    getUser(true);
    getAvatar();
    getCountries();
    getOngoing();
  }, []);

  const years = Array.from(
    new Array(70),
    (val, index) => new Date().getFullYear() - 7 - index
  );

  return (
    <>
      <div className="d-flex">
        <Sidebar />
        <div className="side-bar-outside">
          <div className="ranking-general-wrapper">
            {loader === true ? (
              <Loader />
            ) : (
              <div className="ranking-general-card">
                <div className="ranking-general-card-title-wrapper">
                  <img
                    src={require("../../Assets/Img/left-arrow.svg").default}
                    alt=""
                    onClick={() => navigate(-1)}
                    className="img-fluid"
                  />
                  <div className="question-title-wrapper d-flex align-items-center">
                    <h3>Settings</h3>
                  </div>
                </div>
                <div className="image">
                  <div className="image-center">
                    <div className="image-upload">
                      <img
                        onClick={() => setSelect(true)}
                        src={fields?.avatar}
                        className="custom-file-upload fas"
                        alt=""
                      />
                      <img
                        onClick={() => setSelect(true)}
                        src={require("../../Assets/Img/editIcon.svg").default}
                        className="custom-file-edit-icon"
                        alt=""
                      />
                    </div>
                  </div>
                </div>

                <div className="form-contend-settings">
                  <div className="d-flex justify-content-between form-title align-items-center">
                    <h3 className="account-title">ACCOUNT INFORMATION</h3>
                    <button
                      className={`account-save ${
                        profileLoading
                          ? "border-0 bg-transparent"
                          : "gradient-button"
                      }`}
                      onClick={onUpdateProfile}
                    >
                      {profileLoading ? <PromiseLoader /> : "Save"}{" "}
                    </button>
                  </div>
                  <div className="account-form">
                    <div className="account-full-name">
                      <label className="label-title" htmlFor="full_name">
                        Full Name
                      </label>
                      <br />
                      <input
                        className="input-name-full"
                        type="text"
                        name="full_name"
                        placeholder="Henry Davis"
                        id="full_name"
                        value={fields.full_name}
                        onChange={onChange}
                      />{" "}
                      {error.status && error.type === "full_name" && (
                        <div className="input-bottom-error">
                          {error.message}
                        </div>
                      )}{" "}
                    </div>
                    <div className="account-full-name">
                      <label className="label-title" htmlFor="birth_year">
                        Birth Year
                      </label>
                      <br />
                      <select
                        className="input-name-full default-arrow"
                        value={fields.birth_year}
                        id="birth_year"
                        name="birth_year"
                        onChange={onChange}
                      >
                        <option value="">Select</option>
                        {years.map((index) => {
                          return (
                            <option key={index} value={index}>
                              {index}{" "}
                            </option>
                          );
                        })}{" "}
                      </select>
                      {error.status && error.type === "birth_year" && (
                        <div className="input-bottom-error">
                          {error.message}
                        </div>
                      )}{" "}
                    </div>
                    <div className="account-full-name">
                      <label className="label-title" htmlFor="country_id">
                        Country
                      </label>
                      <br />
                      <select
                        className="input-name-full default-arrow"
                        name="country_id"
                        value={fields.country_id}
                        onChange={onChange}
                      >
                        <option value="">Select</option>
                        {countries.map((d, i) => (
                          <option key={i} value={d.id}>
                            {d.name}{" "}
                          </option>
                        ))}{" "}
                      </select>
                      {error.status && error.type === "country_id" && (
                        <div className="input-bottom-error">
                          {error.message}
                        </div>
                      )}{" "}
                    </div>
                  </div>
                  <div className="d-flex justify-content-between form-title align-items-center">
                    <h3 className="account-title">CHANGE PASSWORD</h3>
                    <button
                      className={`account-save ${
                        passwordLoading
                          ? " border-0 bg-transparent"
                          : "gradient-button"
                      }`}
                      onClick={onChangePassword}
                    >
                      {passwordLoading ? <PromiseLoader /> : "Change Password"}{" "}
                    </button>
                  </div>
                  <div className="account-form">
                    <div className="account-full-name position-relative">
                      <label className="label-title" htmlFor="old_password">
                        Current Password
                      </label>
                      <br />
                      <input
                        className="input-name-full"
                        type={currentIsShowPw ? "text" : "password"}
                        name="old_password"
                        placeholder="Current Password"
                        id="old_password"
                        value={fields.old_password}
                        autoComplete="off"
                        required
                        onChange={onChange}
                      />{" "}
                      {currentIsShowPw ? (
                        <img
                          onClick={() => setCurrentIsShowPw(!currentIsShowPw)}
                          className="img-fluid eye-icon-password position-absolute"
                          src={require("../../Assets/Img/view-eye.svg").default}
                          alt=""
                        />
                      ) : (
                        <img
                          onClick={() => setCurrentIsShowPw(!currentIsShowPw)}
                          className="img-fluid eye-icon-password position-absolute"
                          src={
                            require("../../Assets/Img/hidden-eye.svg").default
                          }
                          alt=""
                        />
                      )}
                      {error.status && error.type === "old_password" && (
                        <div className="input-bottom-error">
                          {error.message}
                        </div>
                      )}{" "}
                    </div>
                    <div className="account-full-name position-relative">
                      <label className="label-title" htmlFor="password">
                        New Password
                      </label>
                      <br />
                      <input
                        className="input-name-full"
                        type={newIsShowPw ? "text" : "password"}
                        id="password"
                        name="password"
                        value={fields.password}
                        onChange={onChange}
                        placeholder="New Password"
                      />{" "}
                      {newIsShowPw ? (
                        <img
                          onClick={() => setNewIsShowPw(!newIsShowPw)}
                          className="img-fluid eye-icon-password position-absolute"
                          src={require("../../Assets/Img/view-eye.svg").default}
                          alt=""
                        />
                      ) : (
                        <img
                          onClick={() => setNewIsShowPw(!newIsShowPw)}
                          className="img-fluid eye-icon-password position-absolute"
                          src={
                            require("../../Assets/Img/hidden-eye.svg").default
                          }
                          alt=""
                        />
                      )}
                      {error.status && error.type === "password" && (
                        <div className="input-bottom-error">
                          {error.message}
                        </div>
                      )}{" "}
                    </div>
                    <div className="account-full-name position-relative">
                      <label className="label-title" htmlFor="confirmPassword">
                        Confirm Password
                      </label>
                      <br />
                      <input
                        className="input-name-full"
                        type={isShowPw ? "text" : "password"}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={fields.confirmPassword}
                        onChange={onChange}
                        placeholder="Confirm Password"
                      />{" "}
                      {isShowPw ? (
                        <img
                          onClick={() => setIsShowPw(!isShowPw)}
                          className="img-fluid eye-icon-password position-absolute"
                          src={require("../../Assets/Img/view-eye.svg").default}
                          alt=""
                        />
                      ) : (
                        <img
                          onClick={() => setIsShowPw(!isShowPw)}
                          className="img-fluid eye-icon-password position-absolute"
                          src={
                            require("../../Assets/Img/hidden-eye.svg").default
                          }
                          alt=""
                        />
                      )}
                      {error.status && error.type === "confirmPassword" && (
                        <div className="input-bottom-error">
                          {error.message}
                        </div>
                      )}{" "}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="">
            <UserDetails flag={true} fields={fields} />
          </div>
        </div>
      </div>
      <Modal
        className="modal-avatar-select"
        autoFocus={true}
        centered={true}
        backdrop="static"
        isOpen={select}
      >
        <div className="modal-avatar-lost-contend">
          <div className="close-icon-wrapper d-flex justify-content-end">
            <img
              onClick={() => {
                setSelect(false);
                setActiveImg({});
              }}
              src={require("../../Assets/Img/close-icon.svg").default}
              alt=""
              className="img-fluid"
            />
          </div>
          <div className="avatar-list">
            <div className="avatar-title">
              <h2 className="subtitle">Select Avatar</h2>
            </div>
            <div className="avatar-wrapper row">
              {avatarImage.map((d, i) => (
                <div className={`avatar-image col-2 py-2`} key={i}>
                  <img
                    onClick={() => setActiveImg(d)}
                    src={d.avatar}
                    alt=""
                    className={`${
                      activeImg?.id === d.id ? "activeBorder" : ""
                    } img-fluid`}
                  />
                </div>
              ))}{" "}
            </div>
            <div className="avatar-update d-flex justify-content-center">
              <button
                className="update"
                onClick={() => {
                  setFields({
                    ...fields,
                    avatar: activeImg.avatar,
                    avatar_id: activeImg?.id,
                  });
                  setSelect(false);
                }}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Settings;
