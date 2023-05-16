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


const EditCategoryModal = (props) => {
  const { open, onClose, onConfirmClose, editData, flag } = props;
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
          toast.error(res.data?.message);
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

  useEffect(() => {
    if (editData) {
      setState({
        title: editData.title,
        description: editData.description,
        color_code: editData.color_code,
        id: editData.id.toString(),
      });
      setPreview(editData.icon);
      setAccountValue(editData?.account_types);
    }
  }, [editData]);

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
    } else if (state.description.length === 0) {
      toast.error("Please Enter your description");
    } else {
      const encryptedData = {
        title: state.title,
        account_types: countryId,
        description: state.description,
        color_code: state.color_code,
        id: editData.id,
      };
      const formData = new FormData();
      formData.append("data", encryptData(JSON.stringify(encryptedData)));
      logo && formData.append("file", logo);
      await axiosInstanceAuth
        .put(`admin/categories/edit`, formData)
        .then((res) => {
          const decryptedData = decryptData(res.data);
          if (res.data.status) {
            getViewFileFormat();
            onConfirmClose();
            toast.success(res.data.message);
          } else {
            toast.error(res.data.message);
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

  function removeDuplicates(arr) {
    const uniqueIds = [];
    const unique = arr.filter((element) => {
      const isDuplicate = uniqueIds.includes(element.id);
      if (!isDuplicate) {
        uniqueIds.push(element.id);
        return true;
      }
      return false;
    });
    return unique;
  }

  const accountTypes = (e, value) => {
    setAccountValue(removeDuplicates(value));
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
        sx={modal}
        onClose={onCloseEditModal}
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
              {flag === true ? "View  Category" : "Edit Category"}
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
                    disabled={flag}
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
                  disabled={flag}
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
                    disabled={flag}
                    label="Title"
                    className="input-box"
                    fullWidth
                    onChange={handleChange}
                  />
                  {error.status && error.type === "title" && (
                    <MDTypography variant="button" color="error">
                      {error.message}{" "}
                    </MDTypography>
                  )}
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
                    disabled={flag}
                    getOptionLabel={(option) => option.account_type}
                    defaultValue={editData.account_types}
                    value={accountValue}
                    onChange={accountTypes}
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
                  />
                </FormControl>
              </MDBox>
              <MDBox mb={3}>
                <FormControl sx={{ width: "100%" }}>
                  <span className="color-picker">
                    <label htmlFor="colorPicker" className="label-color">
                      <input
                        type="color"
                        disabled={flag}
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
                  className="description-text input-box"
                  rows={3}
                  multiline
                  disabled={flag}
                  value={state.description}
                  label="Description"
                  fullWidth
                />
              </MDBox>
              <MDBox mt={4} mb={1}>
                {flag === true ? (
                  <MDBox mt={2}>
                    <MDButton
                      onClick={onClose}
                      variant="gradient"
                      color="info"
                      fullWidth
                    >
                      Close
                    </MDButton>
                  </MDBox>
                ) : (
                  <MDBox mt={2}>
                    <MDButton
                      onClick={handleSubmit}
                      variant="gradient"
                      color="info"
                      fullWidth
                    >
                      Save Changes
                    </MDButton>
                  </MDBox>
                )}
              </MDBox>
            </MDBox>
          </MDBox>
        </Box>
      </Modal>
    </>
  );
};

export default EditCategoryModal;
