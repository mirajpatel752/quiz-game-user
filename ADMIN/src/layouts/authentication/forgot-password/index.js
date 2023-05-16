/* eslint-disable no-useless-escape */
/* eslint-disable no-whitespace-before-property */
import React, { useState } from "react";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import CoverLayout from "layouts/authentication/components/CoverLayout";
import { Link, useNavigate } from "react-router-dom";
import useEncryption from "customHook/useEncryption";
import axiosInstance from "apiServices/axiosInstance";
import { toast } from "react-toastify";
import brandlogo from "assets/images/logo.svg";

const ForgotPassword = () => {
  const [error, setError] = useState({ status: false, type: "", message: "" });
  const { encryptData } = useEncryption();
  const [isToggle, setIsToggle] = useState(false);
  const [loader, setLoader] = useState(false);

  const [fields, setFields] = useState({ email: "", password: "", otp: "" });
  const navigate = useNavigate();

  const emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const onChange = (e) => {
    const value = e.target.value;
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
      if (value.length !== 6) {
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
  };

  const onSendEmail = async () => {
    if (!emailRegex.test(fields.email)) {
      setError({
        ...error,
        status: true,
        type: "email",
        message: "Enter valid email ID",
      });
    } else {
      setLoader(true);
      const encryptedData = encryptData(
        JSON.stringify({ email: fields.email })
      );
      await axiosInstance
        .post("admin/forgot-password", { data: encryptedData })
        .then((res) => {
          setLoader(false);
          if (res?.data?.status) {
            toast.success(res?.data?.message);
            setIsToggle(true);
          } else {
            toast.error(res?.data?.message);
          }
        })
        .catch((err) => {
          toast.error(err);
        });
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
    } else if (fields.password.length < 6) {
      setError({
        ...error,
        status: true,
        type: "password",
        message: "must be 6 character",
      });
    } else if (fields.otp.length !== 6) {
      setError({
        ...error,
        status: true,
        type: "otp",
        message: "Enter valid otp",
      });
    } else {
      const encryptedData = encryptData(
        JSON.stringify({
          email: fields.email,
          password: fields.password,
          otp: fields.otp,
        })
      );
      await axiosInstance
        .post("admin/reset-password", { data: encryptedData })
        .then((res) => {
          if (res?.data?.status) {
            toast.success(res?.data?.message);
            navigate("/sign-in");
          } else {
            toast.error(res?.data?.message);
          }
        })
        .catch((err) => {
          console.log(err);
          toast.error(err);
        });
    }
  };

  return (
    <CoverLayout>
      <MDBox textAlign="center" mb={7}>
        <img className="breand-logo" src={brandlogo} alt="logo" />
        <h1>Zleetzz</h1>
      </MDBox>
      {isToggle ? (
        <Card>
          <MDBox
            variant="gradient"
            bgColor="info"
            borderRadius="lg"
            coloredShadow="success"
            mx={2}
            mt={-3}
            py={2}
            mb={1}
            textAlign="center"
          >
            <MDTypography variant="h3" fontWeight="medium" color="white" mt={1}>
              Forgot Password
            </MDTypography>
          </MDBox>
          <MDBox pt={4} pb={3} px={3}>
            <MDBox component="form" role="form">
              <MDBox mb={2}>
                <MDInput
                  type="number"
                  label="Otp"
                  name="otp"
                  onChange={onChange}
                  value={fields.otp}
                  variant="standard"
                  fullWidth
                />{" "}
                {error.status && error.type === "otp" && (
                  <MDTypography variant="button" color="error">
                    {error.message}{" "}
                  </MDTypography>
                )}{" "}
              </MDBox>
              <MDBox mb={2}>
                <MDInput
                  type="text"
                  label="Password"
                  name="password"
                  onChange={onChange}
                  value={fields.password}
                  variant="standard"
                  fullWidth
                />{" "}
                {error.status && error.type === "password" && (
                  <MDTypography variant="button" color="error">
                    {error.message}{" "}
                  </MDTypography>
                )}{" "}
              </MDBox>
              <MDBox mt={6} mb={1}>
                <MDButton
                  onClick={handleSubmit}
                  variant="gradient"
                  color="info"
                  fullWidth
                >
                  Reset Password
                </MDButton>
              </MDBox>
              <MDBox mt={3} mb={1} textAlign="center">
                <MDTypography
                  component={Link}
                  to="/sign-in"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  Back
                </MDTypography>
              </MDBox>
            </MDBox>
          </MDBox>
        </Card>
      ) : (
        <Card>
          <MDBox
            variant="gradient"
            bgColor="info"
            borderRadius="lg"
            coloredShadow="success"
            mx={2}
            mt={-3}
            py={2}
            mb={1}
            textAlign="center"
          >
            <MDTypography variant="h3" fontWeight="medium" color="white" mt={1}>
              Forgot Password
            </MDTypography>
            <MDTypography display="block" variant="button" color="white" my={1}>
              You will receive an e-mail in maximum 60 seconds
            </MDTypography>
          </MDBox>
          <MDBox pt={4} pb={3} px={3}>
            <MDBox component="form" role="form">
              <MDBox mb={4}>
                <MDInput
                  type="email"
                  label="Email"
                  name="email"
                  onChange={onChange}
                  value={fields.email}
                  variant="standard"
                  fullWidth
                />{" "}
                {error.status && error.type === "email" && (
                  <MDTypography variant="button" color="error">
                    {error.message}{" "}
                  </MDTypography>
                )}{" "}
              </MDBox>
              <MDBox mt={6} mb={1}>
                <MDButton
                  onClick={onSendEmail}
                  variant="gradient"
                  color="info"
                  fullWidth
                  disabled={loader}
                >
                  Reset Password
                </MDButton>
              </MDBox>
              <MDBox mt={3} mb={1} textAlign="center">
                <MDTypography
                  component={Link}
                  to="/sign-in"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  Back
                </MDTypography>
              </MDBox>
            </MDBox>
          </MDBox>
        </Card>
      )}{" "}
    </CoverLayout>
  );
};

export default ForgotPassword;
