/* eslint-disable eqeqeq */
import { Box, FormControl, Modal } from "@mui/material";
import axiosInstanceAuth from "apiServices/axiosInstanceAuth";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDTypography from "components/MDTypography";
import useEncryption from "customHook/useEncryption";
import React, {  useState } from "react";
import { toast } from "react-toastify";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";

const AddFormatModal = ({ open, onClose, onConfirmClose }) => {
  const { encryptData } = useEncryption();

  const [state, setState] = useState({ account_type: "", description: "" });
  const [error, setError] = useState({ status: false, type: "", message: "" });
  const [preview, setPreview] = useState([]);
  const [logo, setLogo] = useState();
  const navigate = useNavigate();

  // onChange
  const handleChange = (event) => {
    const value = event.target.value;
    const name = event.target.name;
    if (name === "account_type") {
      if (value.length === 0) {
        setError({
          ...error,
          status: true,
          type: "account_type",
          message: "Enter valid title",
        });
        setState({
          ...state,
          [name]: value.slice(0, 120),
        });
      } else {
        setError({
          ...error,
          status: false,
          type: "",
          message: "",
        });
        setState({
          ...state,
          [name]: value.slice(0, 120),
        });
      }
    } else if (name === "description") {
      if (value.length > 1) {
        setState({
          ...state,
          [name]: value.slice(0, 120),
        });
      } else {
        setError({
          ...error,
          status: false,
          type: "",
          message: "",
        });
        setState({
          ...state,
          [name]: value.slice(0, 120),
        });
      }
    } else {
      setState({
        ...state,
        [name]: value.slice(0, 120),
      });
    }
  };

  // form submit
  const handleSubmit = async () => {
    if (state.account_type.length === 0) {
      setError({
        ...error,
        status: true,
        type: "account_type",
        message: "Enter valid title",
      });
    } else if (state.description.length === 0) {
      setError({
        ...error,
        status: true,
        type: "description",
        message: "Enter valid description",
      });
    } else if (!logo) {
      toast.error("Please select Image file ");
    } else {
      const formData = new FormData();
      formData.append("data", encryptData(JSON.stringify(state)));
      formData.append("file", logo);
      await axiosInstanceAuth
        .post(`/admin/account-types/add`, formData)
        .then((res) => {
          if (res.data.status) {
            toast.success(res.data.message);
            onConfirmClose();
          } else {
            toast.error(res.data.message);
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
    }
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
    position: "absolute",
    top: "15%",
    left: "50%",
    transform: "translate(-50%, 0%)",
    width: 500,
    bgcolor: "background.paper",
    border: "0px solid #000",
    boxShadow: 24,
    borderRadius: 4,
    p: 4,
    overflow: "auto",
  };

  const imageStyle = {
    height: "100px",
    width: "100px",
    border: "1px dashed $darkBlue",
    borderRadius: "50%",
  };

  const modal = {
    overflow: "scroll",
  };

  const onCloseModal = (event, reason)=>{
    if (reason && reason == "backdropClick"){
          return;
    }else{
      onClose()
    } 
  }

  return (
    <>
      <Modal
        open={open}
        sx={modal}
        disableBackdropClick
        onClose={onCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <button className="icon-end-close" onClick={onClose}>
            <div className="close-icon">
              <CloseIcon />
            </div>
          </button>
          <MDBox mx={2} p={1} textAlign="center">
            <MDTypography variant="h4" fontWeight="medium">
              Add Account
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
                    <img htmlFor="photo-upload" src={preview} alt="" />
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
                Upload
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
                    sx={{ height: "44.125px" }}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    name="account_type"
                    value={state.account_type}
                    label="Account Type"
                    fullWidth
                    error={!!error.fileType}
                    onChange={handleChange}
                  />{" "}
                  {error.status && error.type === "account_type" && (
                    <MDTypography variant="button" color="error">
                      {error.message}{" "}
                    </MDTypography>
                  )}{" "}
                </FormControl>
              </MDBox>
              <MDBox mb={3}>
                <MDInput
                  type="text"
                  onChange={handleChange}
                  name="description"
                  rows={2}
                  multiline
                  value={state.description}
                  label="Description"
                  fullWidth
                />{" "}
                {error.status && error.type === "description" && (
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
                  fullWidth
                >
                  Add
                </MDButton>
              </MDBox>
            </MDBox>
          </MDBox>
        </Box>
      </Modal>
    </>
  );
};

export default AddFormatModal;
