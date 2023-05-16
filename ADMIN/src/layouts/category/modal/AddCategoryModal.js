/* eslint-disable react-hooks/exhaustive-deps */
import {
  Autocomplete,
  Box,
  FormControl,
  Modal,
  TextField,
} from "@mui/material";
import axiosInstanceAuth from "apiServices/axiosInstanceAuth";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDTypography from "components/MDTypography";
import useEncryption from "customHook/useEncryption";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";

const AddFormatModal = (props) => {
  const { open, onClose, onConfirmClose } = props;
  const { encryptData, decryptData } = useEncryption();
  const [state, setState] = useState({
    title: "",
    description: "",
    color_code: "#000000",
  });
  const [error, setError] = useState({ status: false, type: "", message: "" });
  const [preview, setPreview] = useState([]);
  const [logo, setLogo] = useState();
  const [account, setAccount] = useState([]);
  const [accountValue, setAccountValue] = useState([]);
  const navigate = useNavigate();

  const getViewFileFormat = async () => {
    await axiosInstanceAuth
      .get("/admin/account-types/get")
      .then((res) => {
        const decryptedData = decryptData(res.data.data);
        if (res.data.status) {
          const data = decryptedData;
          setAccount(data);
        } else {
          toast.error(res.data.message);
          setAccount([]);
          if (res.data.isAuth === false) {
            localStorage.clear();
            navigate("/sign-in");
          }else if (!localStorage.getItem("token")){
            navigate("/sign-in");
          }
        }
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  useEffect(() => {
    getViewFileFormat();
  }, []);

  // onChange
  const handleChange = (event) => {
    const value = event.target.value;
    const name = event.target.name;
    if (name === "title") {
      if (value.length === 0) {
        setError({
          ...error,
          status: true,
          type: "title",
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
    }
    if (name === "account_type_id") {
      if (value < 0) {
        setError({
          ...error,
          status: true,
          type: "account_type_id",
          message: "Enter valid Account Type Id",
        });
        setState({
          ...state,
          [name]: value,
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
          [name]: value,
        });
      }
    }
    if (name === "description") {
      if (value.length < 1) {
        setError({
          ...error,
          status: true,
          type: "description",
          message: "Enter valid description",
        });
        setState({
          ...state,
          [name]: value.slice(0, 200),
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
          [name]: value.slice(0, 200),
        });
      }
    } else {
      setState({
        ...state,
        [name]: value.slice(0, 200),
      });
    }
  };

  // form submit
  const countryId = JSON.stringify(accountValue.map((d, i) => d.id));
  const handleSubmit = async () => {
    if (state.title.length === 0) {
      setError({
        ...error,
        status: true,
        type: "title",
        message: "Enter valid title",
      });
    } else if (accountValue.length === 0) {
      setError({
        ...error,
        status: true,
        type: "account_type_id",
        message: "Enter valid Account Type Id",
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
      const encryptedData = {
        title: state.title,
        account_types: countryId,
        description: state.description,
        color_code: state.color_code,
      };
      const formData = new FormData();
      formData.append("data", encryptData(JSON.stringify(encryptedData)));
      formData.append("file", logo);
      await axiosInstanceAuth
        .post(`/admin/categories/add`, formData)
        .then((res) => {
          if (res.data.status) {
            toast.success(res.data.message);
            onConfirmClose();
          } else {
            toast.error(res.data.message);
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
    bgcolor: "background.paper",
    position: "absolute",
    top: "15%",
    left: "50%",
    transform: "translate(-50%, 0%)",
    width: 500,
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

  const onCloseEditModal = (event, reason) => {
    if (reason && reason == "backdropClick") return;
    else onClose();
  };

  return (
    <>
      <Modal
        open={open}
        onClose={onCloseEditModal}
        sx={modal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <button className="icon-end-close" onClick={onCloseEditModal}>
            <div className="close-icon">
              <CloseIcon />
            </div>
          </button>
          <MDBox mx={2} p={1} textAlign="center">
            <MDTypography variant="h4" fontWeight="medium">
              Add Category
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
                    name="title"
                    value={state.title}
                    label="Title"
                    fullWidth
                    error={!!error.fileType}
                    onChange={handleChange}
                  />{" "}
                  {error.status && error.type === "title" && (
                    <MDTypography variant="button" color="error">
                      {error.message}{" "}
                    </MDTypography>
                  )}{" "}
                </FormControl>
              </MDBox>
              <MDBox mb={3}>
                <FormControl sx={{ width: "100%" }}>
                  <Autocomplete
                    multiple
                    id="tags-standard"
                    options={account}
                    ListboxProps={{
                      style: {
                        maxHeight: 150,
                        overflow: "auto",
                      },
                    }}
                    getOptionLabel={(option) => option.account_type}
                    value={accountValue}
                    onChange={(e, value) => {
                      setAccountValue(value);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label="Account Types"
                        placeholder={
                          accountValue.length > 0 ? "" : "Account Types"
                        }
                      />
                    )}
                  />{" "}
                  {error.status && error.type === "account_type_id" && (
                    <MDTypography variant="button" color="error">
                      {error.message}{" "}
                    </MDTypography>
                  )}{" "}
                </FormControl>
              </MDBox>
              <MDBox mb={3}>
                <FormControl sx={{ width: "100%" }}>
                  <span className="color-picker">
                    <label htmlFor="colorPicker" className="label-color">
                      <input
                        type="color"
                        value={state.color_code}
                        id="color_code"
                        name="color_code"
                        onChange={handleChange}
                      />
                      <label htmlFor="user_name">Color</label>
                      <span className="color-text">{state.color_code} </span>
                    </label>
                  </span>
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
