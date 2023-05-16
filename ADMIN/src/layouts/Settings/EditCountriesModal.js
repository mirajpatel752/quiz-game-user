import { Box, FormControl, Modal } from "@mui/material";
import axiosInstanceAuth from "apiServices/axiosInstanceAuth";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDTypography from "components/MDTypography";
import useEncryption from "customHook/useEncryption";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CloseIcon from "@mui/icons-material/Close";

const EditCountriesModal = ({ open, close, data = null ,countriesData ,setCountriesData }) => {

 
  const [fields, setFields] = useState({
    name: "",
    country_code: "",
    id: 1,
    status: 1,
  });

  const [error, setError] = useState({ status: false, type: "", message: "" });
  const { encryptData } = useEncryption();
  const authExpired = "Something is wrong in Authentication.Please try again.";
  const navigate = useNavigate();
  const [preview, setPreview] = useState([]);
  const [logo, setLogo] = useState();
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    if (name === "name") {
      if (value.length > 0) {
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
          type: "name",
          message: "Name is required",
        });
        setFields({
          ...fields,
          [name]: value,
        });
      }
    }
    if (name === "country_code") {
      if (value >= 0) {
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
          type: "country_code",
          message: "Country code is required",
        });
        // setFields({
        // ...fields,
        // [name]: value,
        // })
      }
    }
  };

  useEffect(() => {
    if (data) {
      setFields({
        name: data.name,
        country_code: data.country_code,
        id: data.id,
        status: data.status,
      });
      setPreview(data.flag);
    }
  }, []);



  const editDataShow = (()=>{
  })




  const handleSubmit = async () => {
    if (fields.name.length < 1) {
      setError({
        ...error,
        status: true,
        type: "name",
        message: "Name is required",
      });
    } else if (fields.country_code.length <= 0) {
      setError({
        ...error,
        status: true,
        type: "country_code",
        message: "Country Code is required",
      });
    } else {
      if (data) {
        setLoading(true);
        const encryptedData = encryptData(
          JSON.stringify({
            name: fields.name,
            country_code: fields.country_code,
            id: fields.id,
            status: fields.status,
          })
        );
        const formData = new FormData();
        formData.append("data", encryptedData);
        logo && formData.append("file", logo);
        await axiosInstanceAuth
          .put("admin/countries/edit", formData)
          .then((res) => {
            if (res?.data?.status) {
              toast.success(res?.data?.message);
              close();
              editDataShow();
            } else {
              toast.error(res?.data?.message);
              if (res.data.message === authExpired) {
                localStorage.clear();
                navigate("/sign-in");
              }
            }
            setLoading(false);
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        const encryptedData = encryptData(
          JSON.stringify({
            name: fields.name,
            country_code: fields.country_code,
          })
        );
        const formData = new FormData();
        formData.append("data", encryptedData);
        logo && formData.append("file", logo);
        await axiosInstanceAuth
          .post("admin/countries/add", formData)
          .then((res) => {
            if (res?.data?.status) {
              toast.success(res?.data?.message);
              close();
            } else {
              toast.error(res?.data?.message);
              if (res.data.message === authExpired) {
                localStorage.clear();
                navigate("/sign-in");
              }
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  };

  const imageStyle = {
    height: "100px",
    width: "100px",
    border: "1px dashed $darkBlue",
    borderRadius: "50%",
  };

  const handleLogoChange = (e) => {
    e.preventDefault();
    let file = e.target.files[0];
    let reader = new FileReader();
    reader.onloadend = () => {
      setLogo(file);
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const modalStyle = {
    bgcolor: "background.paper",
    position: "absolute",
    top: "17%",
    left: "50%",
    transform: "translate(-50%, 0%)",
    width: 500,
    border: "0px solid #000",
    boxShadow: 24,
    borderRadius: 4,
    p: 4,
    overflow: "auto",
  };
  const modal = {
    overflow: "scroll",
  };

  const onCloseEditModal = (event, reason) => {
    if (reason && reason == "backdropClick") return;
    else close();
  };

  return (
    <>
      <Modal open={open} sx={modal} onClose={onCloseEditModal}>
        <Box sx={modalStyle}>
          <button className="icon-end-close" onClick={close}>
            <div className="close-icon">
              <CloseIcon />
            </div>
          </button>
          <MDBox mx={2} p={1} textAlign="center">
            <MDTypography variant="h4" fontWeight="medium">
              {data ? "Edit Country" : "Add Country"}{" "}
            </MDTypography>
          </MDBox>
          <MDBox mt={3} textAlign="center">
            <div className="image-center">
              <div
                className=" d-flex p-1"
                style={imageStyle}
                sx={{ borderRadius: "50%" }}
              >
                <label
                  htmlFor="photo-upload"
                  className="custom-file-upload fas"
                >
                  <div className="img-wrap img-upload">
                    <img for="photo-upload" src={preview} alt="" />
                  </div>
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleLogoChange(e)}
                  />
                </label>
              </div>
            </div>
            <button type="button" className="image-change-btn upload-button">
              <label
                style={{
                  fontSize: "12px",
                  cursor: "pointer",
                  padding: "15px",
                }}
                className="label-input"
                htmlFor="logoImage"
              >
                Upload Flag
                <input
                  id="logoImage"
                  type="file"
                  hidden={true}
                  name="logo"
                  accept="image/*"
                  onChange={(e) => handleLogoChange(e)}
                />
              </label>
            </button>
          </MDBox>
          <MDBox pt={4} pb={3} px={3}>
            <MDBox component="form" role="form">
              <MDBox mb={3}>
                <FormControl sx={{ width: "100%" }}>
                  <MDInput
                    name="name"
                    value={fields.name}
                    label="Name"
                    fullWidth
                    onChange={handleChange}
                  />{" "}
                  {error.status && error.type === "name" && (
                    <MDTypography variant="button" color="error">
                      {error.message}{" "}
                    </MDTypography>
                  )}{" "}
                </FormControl>
              </MDBox>
              <MDBox mb={3}>
                <MDInput
                  type="number"
                  onChange={handleChange}
                  name="country_code"
                  value={fields.country_code}
                  label="Country Code"
                  fullWidth
                />{" "}
                {error.status && error.type === "country_code" && (
                  <MDTypography variant="button" color="error">
                    {error.message}{" "}
                  </MDTypography>
                )}{" "}
              </MDBox>
              <MDBox mt={4} mb={1}>
                <MDButton
                  onClick={handleSubmit}
                  variant="gradient"
                  color="info"
                  pt-1
                  disabled={loading}
                  fullWidth
                >
                  {data ? "Save Changes" : "Add"}{" "}
                </MDButton>
              </MDBox>
            </MDBox>
          </MDBox>
        </Box>
      </Modal>
    </>
  );
};

export default EditCountriesModal;
