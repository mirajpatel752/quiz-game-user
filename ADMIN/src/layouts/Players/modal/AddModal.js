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
import { Close } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";

const AddBotModal = ({ open, onClose, onConfirmClose }) => {
  const { encryptData, decryptData } = useEncryption();

  const [state, setState] = useState({ name: "" });

  const [error, setError] = useState({ status: false, type: "", message: "" });
  const [level, setLevel] = useState([]);
  const navigate = useNavigate();
  const [avatarImage, setAvatarImage] = useState([]);
  const [activeCard, setActiveCard] = useState({});
  const [levelId, setLevelId] = useState({ options: "" });
  const [seeMore, setSeeMore] = useState(false);
  const [countriesData, setCountriesData] = useState([]);
  const [countriesId, setCountriesId] = useState();

  const getCountries = async (id) => {
    await axiosInstanceAuth
      .get(`admin/default-match-fees-rewards`)
      .then((res) => {
        const data = decryptData(res.data.data);
        if (res.data?.status) {
          setLevel(data);
        } else {
          toast.error(res?.data?.message);
          if (res.data.isAuth === false) {
            localStorage.clear();
            navigate("/sign-in");
          } else if (!localStorage.getItem("token")) {
            navigate("/sign-in");
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getViewFileFormat = async () => {
    await axiosInstanceAuth
      .get("/admin/avatars/get")
      .then((res) => {
        const decryptedData = decryptData(res.data.data);
        if (res.data.status) {
          setAvatarImage(decryptedData);
        } else {
          setAvatarImage([]);
          toast.error(res.data?.message);
          if (res.data.isAuth === false) {
            localStorage.clear();
            navigate("/sign-in");
          } else if (!localStorage.getItem("token")) {
            navigate("/sign-in");
          }
        }
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  useEffect(() => {
    getCountries();
    getViewFileFormat();
    getCountriesdata();
  }, []);
  // onChange
  const handleChange = (event) => {
    const value = event.target.value;
    const name = event.target.name;
    if (name === "name") {
      if (value.length === 0) {
        setError({
          ...error,
          status: true,
          type: "name",
          message: "Enter valid Bot",
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
    } else {
      setState({
        ...state,
        [name]: value.slice(0, 200),
      });
    }
  };

  // form submit

  const handleSubmit = async () => {
    if (state.name.length === 0) {
      setError({
        ...error,
        status: true,
        type: "name",
        message: "Enter valid Bot",
      });
    } else {
      const encryptedData = {
        name: state?.name,
        level: levelId?.options,
        avatar_id: activeCard?.id,
        country_id: countriesId?.id,
      };
      const data = encryptData(JSON.stringify(encryptedData));
      await axiosInstanceAuth
        .post(`/admin/bots/add`, { data: data })
        .then((res) => {
          if (res.data.status) {
            toast.success(res.data.message);
            onConfirmClose();
            onClose();
          } else {
            toast.error(res.data.message);
          }
        })
        .catch((err) => {
          toast.error(err);
        });
    }
  };

  const modalStyle = {
    bgcolor: "background.paper",
    position: "absolute",
    top: "15%",
    left: "50%",
    transform: "translate(-50%, 0%)",
    width: 600,
    border: "0px solid #000",
    boxShadow: 24,
    borderRadius: 4,
    p: 4,
    overflow: "auto",
  };
  const modal = {
    overflow: "scroll",
  };

  const clearAuto = () => {
    setLevelId({});
  };

  const clear = <Close fontSize="small" onClick={clearAuto} />;

  const changeBackdrop = () => {
    setSeeMore(!seeMore);
  };
  const handleChangemarchData = (event, value) => {
    setLevelId(value);
  };

  const getCountriesdata = async () => {
    await axiosInstanceAuth
      .get("admin/countries/get")
      .then((res) => {
        const data = decryptData(res.data.data);
        if (res.data.status) {
          setCountriesData(data.data);
        } else {
          setCountriesData([]);
          toast.error(res?.data?.message);
          if (res.data.isAuth === false) {
            localStorage.clear();
            navigate("/sign-in");
          } else if (!localStorage.getItem("token")) {
            navigate("/sign-in");
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleChangemarch = (event, value) => {
    setCountriesId(value);
  };

  const onCloseEditModal = (event, reason) => {
    if (reason && reason == "backdropClick") return;
    else onClose();
  };

  return (
    <>
      <Modal
        open={open}
        disableBackdropClick
        onClose={onCloseEditModal}
        sx={modal}
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
              Add Bot
            </MDTypography>
          </MDBox>
          <MDBox mt={3} px={3} textAlign="center">
            <div className="avatar-button">
              <div className="avatar-name-wrapper">
                <h5 className="avatar-title">Avatar</h5>
                <p className="see-more-title" onClick={changeBackdrop}>
                  See more
                </p>
              </div>
            </div>
            <div className="avatar-card-wrapper">
              {avatarImage.map((d, i) => {
                return (
                  i <= 5 && (
                    <div className="avatar-image-wrapper" key={i}>
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
                        } avatar-image`}
                      />
                    </div>
                  )
                );
              })}
            </div>
            {seeMore && (
              <div className="more-avatar-card-wrapper">
                <Grid container columns={{ xs: 2, sm: 6, md: 12 }}>
                  {avatarImage.map((d, i) => (
                    <Grid
                      key={i}
                      item
                      xs={2}
                      sm={2}
                      md={2}
                      keys={i}
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
                        } avatar-image`}
                      />
                    </Grid>
                  ))}
                </Grid>
              </div>
            )}
          </MDBox>
          <MDBox pt={4} pb={3} px={3}>
            <MDBox component="form" role="form">
              <MDBox mb={3}>
                <FormControl sx={{ width: "100%" }}>
                  <MDInput
                    sx={{ height: "44.125px" }}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    name="name"
                    value={state.name}
                    label="Bot Name"
                    fullWidth
                    error={!!error.fileType}
                    onChange={handleChange}
                  />
                  {error.status && error.type === "name" && (
                    <MDTypography variant="button" color="error">
                      {error.message}{" "}
                    </MDTypography>
                  )}
                </FormControl>
              </MDBox>
              <MDBox mb={3}>
                <Autocomplete
                  className="backgroundColor-autocomplete"
                  id="multiple-limit-tags"
                  options={level}
                  name="description"
                  clearIcon={false}
                  value={levelId}
                  onChange={handleChangemarchData}
                  getOptionLabel={(option) => option.options}
                  renderInput={(params) => (
                    <TextField {...params} label="Select Level" />
                  )}
                  sx={{ height: "38px" }}
                />
                {error.status && error.type === "description" && (
                  <MDTypography variant="button" color="error">
                    {error.message}{" "}
                  </MDTypography>
                )}{" "}
              </MDBox>
              <MDBox mb={3}>
                <Autocomplete
                  className="backgroundColor-autocomplete"
                  id="multiple-limit-tags"
                  options={countriesData}
                  name="description"
                  clearIcon={false}
                  value={countriesId}
                  onChange={handleChangemarch}
                  getOptionLabel={(option) => option.name}
                  renderInput={(params) => (
                    <TextField {...params} label="Select Country" />
                  )}
                  sx={{ height: "38px" }}
                />
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

export default AddBotModal;
