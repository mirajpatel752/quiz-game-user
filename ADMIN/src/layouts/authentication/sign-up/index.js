import { Link, useNavigate } from "react-router-dom"
import Card from "@mui/material/Card"
import Checkbox from "@mui/material/Checkbox"
import MDBox from "components/MDBox"
import MDTypography from "components/MDTypography"
import MDInput from "components/MDInput"
import MDButton from "components/MDButton"
import CoverLayout from "layouts/authentication/components/CoverLayout"
import bgImage from "assets/images/bg-sign-up-cover.jpeg"
import { useState } from "react"
import axiosInstance from "apiServices/axiosInstance"
import useEncryption from "customHook/useEncryption"
import { toast } from "react-toastify"
import { FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput } from "@mui/material"
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

function Cover() {
  const [fields, setFields] = useState({
    user_name: "",
    email: "",
    contact_no: "",
    password: "",
    showPassword: false,
  })
  const [error, setError] = useState({ status: false, type: "", message: "" })
  const { encryptData, decryptData } = useEncryption()
  const navigate = useNavigate()

  const handleClickShowPassword = () => {
    setFields({
      ...fields,
      showPassword: !fields.showPassword,
    });
  };

  const emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  const onChange = (e) => {
    const value = e.target.value
    const name = e.target.name
    if (name === "user_name") {
      if (value.length < 1) {
        setError({
          ...error,
          status: true,
          type: "user_name",
          message: "User is required",
        })
        setFields({
          ...fields,
          [name]: value,
        })
      } else {
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
      }
    }
    if (name === "email") {
      if (!emailRegex.test(value)) {
        setError({
          ...error,
          status: true,
          type: "email",
          message: "Enter valid email ID",
        })
        setFields({
          ...fields,
          [name]: value,
        })
      } else {
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
      }
    }
    if (name === "contact_no") {
      if (value.length > 7 && value.length < 16) {
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
          type: "contact_no",
          message: "Enter valid contact",
        })
        setFields({
          ...fields,
          [name]: value,
        })
      }
    }
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
  }

  const handleSubmit = async () => {
    if (fields.user_name.length < 1) {
      setError({
        ...error,
        status: true,
        type: "user_name",
        message: "User is required",
      })
    } else if (!emailRegex.test(fields.email)) {
      setError({
        ...error,
        status: true,
        type: "email",
        message: "Enter valid email ID",
      })
    } else if (fields.contact_no.length < 8 && fields.contact_no.length > 17) {
      setError({
        ...error,
        status: true,
        type: "contact_no",
        message: "Enter valid contact",
      })
    } else if (fields.password.length < 6) {
      setError({
        ...error,
        status: true,
        type: "password",
        message: "must be 6 character",
      })
    } else {
      const encryptedData = encryptData(
        JSON.stringify({
          user_name: fields.user_name,
          email: fields.email,
          contact_no: fields.contact_no,
          password: fields.password,
        })
      )
      await axiosInstance
        .post("admin/signup", {
          data: encryptedData,
        })
        .then((res) => {
          const data = decryptData(res.data.data)
          if (res?.data?.status) {
            toast.success(res?.data?.message)
            localStorage.setItem("token", res.data.jwt)
            navigate("/dashboard")
          } else {
            toast.error(res?.data?.message)
          }
        })
        .catch((err) => {
          console.log(err)
          toast.error(err)
        })
    }
  }

  return (
    <CoverLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="success"
          mx={2}
          mt={-3}
          p={3}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Join us today
          </MDTypography>
          <MDTypography display="block" variant="button" color="white" my={1}>
            Enter your email and password to register
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form">
            <MDBox mb={2}>
              <MDInput
                type="text"
                name="user_name"
                label="User"
                value={fields.user_name}
                onChange={onChange}
                fullWidth
              />
              {error.status && error.type === "user_name" && (
                <MDTypography variant="button" color="error">
                  {error.message}
                </MDTypography>
              )}
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="text"
                name="email"
                label="Email"
                value={fields.email}
                onChange={onChange}
                fullWidth
              />
              {error.status && error.type === "email" && (
                <MDTypography variant="button" color="error">
                  {error.message}
                </MDTypography>
              )}
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="number"
                name="contact_no"
                label="Contact"
                value={fields.contact_no}
                onChange={onChange}
                fullWidth
              />
              {error.status && error.type === "contact_no" && (
                <MDTypography variant="button" color="error">
                  {error.message}
                </MDTypography>
              )}
            </MDBox>
            <MDBox mb={2}>
              <FormControl sx={{ width: "100%" }} variant="outlined">
                <InputLabel>Password</InputLabel>
                <OutlinedInput
                  name="password"
                  type={fields.showPassword ? "text" : "password"}
                  value={fields.password}
                  onChange={onChange}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                      >
                        {fields.showPassword ? (
                          <VisibilityIcon fontSize="small" />
                        ) : (
                          <VisibilityOffIcon fontSize="small" />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                />
              </FormControl>
              {error.status && error.type === "password" && (
                <MDTypography variant="button" color="error">
                  {error.message}
                </MDTypography>
              )}
            </MDBox>
            <MDBox display="flex" alignItems="center" ml={-1}>
              <Checkbox />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
              >
                &nbsp;&nbsp;I agree the&nbsp;
              </MDTypography>
              <MDTypography
                component="a"
                href="#"
                variant="button"
                fontWeight="bold"
                color="info"
                textGradient
              >
                Terms and Conditions
              </MDTypography>
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton
                onClick={handleSubmit}
                variant="gradient"
                color="info"
                fullWidth
              >
                sign up
              </MDButton>
            </MDBox>
            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Already have an account?{" "}
                <MDTypography
                  component={Link}
                  to="/sign-in"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  Sign In
                </MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </CoverLayout>
  )
}

export default Cover
