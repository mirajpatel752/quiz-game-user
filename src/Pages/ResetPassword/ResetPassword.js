import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import axiosInstance from "../../apiServices/axiosInstance"
import PromiseLoader from "../../common/Loader/PromiseLoader"
import useEncryption from "../../customHook/useEncryption"
import "../SignUp/SignUp.scss"
const ResetPassword = ({ open, close, confirmClose }) => {
  const { encryptData, decryptData } = useEncryption()
  const [loading, setLoading] = useState(false)
  const [isShowPw, setIsShowPw] = useState({
    showPassword: false,
    showConfirmPassword: false,
  })
  const [error, setError] = useState({ status: false, type: "", message: "" })
  const [fields, setFields] = useState({
    password: "",
    confirmPassword: "",
  })

  const encEmail = localStorage.getItem("email")
  const email = decryptData(encEmail)

  const navigate = useNavigate()

  const onChange = (e) => {
    const value = e.target.value.replace(/^\s+|\s+$/gm, "")
    const name = e.target.name
    if (name === "password") {
      if (value.length > 5) {
        setError({
          ...error,
          status: false,
          type: "",
          message: "",
        })
        setFields({
          ...fields,
          [name]: value,
        })
      } else {
        setError({
          ...error,
          status: true,
          type: "password",
          message: "must be 6 character",
        })
        setFields({
          ...fields,
          [name]: value,
        })
      }
    }
    if (name === "confirmPassword") {
      if (value === fields.password) {
        setError({
          ...error,
          status: false,
          type: "",
          message: "",
        })
        setFields({
          ...fields,
          [name]: value,
        })
      } else {
        setError({
          ...error,
          status: true,
          type: "confirmPassword",
          message: "confirmPassword not match",
        })
        setFields({
          ...fields,
          [name]: value,
        })
      }
    }
  }

  const onSubmit = async () => {
    if (fields.password.length < 6) {
      setError({
        ...error,
        status: true,
        type: "password",
        message: "must be 6 character",
      })
    } else if (fields.confirmPassword !== fields.password) {
      setError({
        ...error,
        status: true,
        type: "confirmPassword",
        message: "confirmPassword not match",
      })
    } else {
      setLoading(true)
      const encryptedData = encryptData(
        JSON.stringify({
          email: email.email,
          password: fields.password,
        })
      )
      await axiosInstance
        .post("reset-password", {
          data: encryptedData,
        })
        .then((res) => {
          setLoading(false)
          const data = decryptData(res.data.data)
          if (res?.data?.status) {
            toast.success(res?.data?.message)
            navigate("/login")
          } else {
            toast.error(res?.data?.message)
          }
        })
        .catch((err) => {
          console.log(err)
          setLoading(false)
        })
    }
  }

  return (
    <div className="d-flex justify-content-center align-items-center my-5">
      <div className="sign-up-modal">
        <h1 className="heading">Reset Password</h1>
        <div className="form">
          <div
            className={`${error.status && error.type === "password" ? "" : "mb-30"
              } form-item-input`}
          >
            <input
              type={isShowPw.showPassword ? "text" : "password"}
              name="password"
              id="password"
              autoComplete="off"
              required
              value={fields.password}
              onChange={onChange}
            />
            <label htmlFor="password">Password</label>
            {isShowPw.showPassword ? (
              <img
                onClick={() =>
                  setIsShowPw({
                    ...isShowPw,
                    showPassword: !isShowPw.showPassword,
                  })
                }
                className="img-fluid eye-icon"
                src={require("../../Assets/Img/view-eye.svg").default}
                alt=""
              />
            ) : (
              <img
                onClick={() =>
                  setIsShowPw({
                    ...isShowPw,
                    showPassword: !isShowPw.showPassword,
                  })
                }
                className="img-fluid eye-icon"
                src={require("../../Assets/Img/hidden-eye.svg").default}
                alt=""
              />
            )}
          </div>
          {error.status && error.type === "password" && (
            <div className="input-bottom-error">{error.message}</div>
          )}

          <div
            className={`${error.status && error.type === "confirmPassword" ? "" : "mb-30"
              } form-item-input`}
          >
            <input
              type={isShowPw.showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              id="confirmPassword"
              autoComplete="off"
              required
              value={fields.confirmPassword}
              onChange={onChange}
            />
            <label htmlFor="confirmPassword">Confirm Password</label>
            {isShowPw.showConfirmPassword ? (
              <img
                onClick={() =>
                  setIsShowPw({
                    ...isShowPw,
                    showConfirmPassword: !isShowPw.showConfirmPassword,
                  })
                }
                className="img-fluid eye-icon"
                src={require("../../Assets/Img/view-eye.svg").default}
                alt=""
              />
            ) : (
              <img
                onClick={() =>
                  setIsShowPw({
                    ...isShowPw,
                    showConfirmPassword: !isShowPw.showConfirmPassword,
                  })
                }
                className="img-fluid eye-icon"
                src={require("../../Assets/Img/hidden-eye.svg").default}
                alt=""
              />
            )}
          </div>
          {error.status && error.type === "confirmPassword" && (
            <div className="input-bottom-error">{error.message}</div>
          )}

          <button
            className={`sign-up-btn ${loading ? " border-0 bg-transparent" : "gradient-button"
              }`}
            onClick={onSubmit}
          >
            {loading ? <PromiseLoader /> : "Forgot Password"}
          </button>

          <button
            onClick={() => navigate("/login")}
            className="back-to-login-btn"
          >
            <img
              className="img-fluid"
              src={require("../../Assets/Img/back.svg").default}
              alt=""
            />
            <span>Back to Login</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword
