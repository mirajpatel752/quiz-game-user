import {
  Box,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Modal,
  Select,
} from "@mui/material";
import axiosInstanceAuth from "apiServices/axiosInstanceAuth";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDTypography from "components/MDTypography";
import useEncryption from "customHook/useEncryption";
import React, { useState } from "react";
import { toast } from "react-toastify";
import CloseIcon from "@mui/icons-material/Close";

const AddMatchModal = ({ open, onClose, onConfirmClose, topicId }) => {
  const { encryptData } = useEncryption();
  const [state, setState] = useState({
    options: "",
    entry_fee: 0,
    win_reward: 0,
    comments: "",
    game_mode: "Training",
    color_code: "#000000",
    unit: "lt",
    topic_id: topicId.id.toString(),
  });

  const [error, setError] = useState({ status: false, type: "", message: "" });
  const [preview, setPreview] = useState([]);
  const [logo, setLogo] = useState();

  // onChange
  const handleChange = (event) => {
    const value = event.target.value;
    const name = event.target.name;

    if (name === "options") {
      if (value.length === 0) {
        setError({
          ...error,
          status: true,
          type: "options",
          message: "Enter valid options",
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
    } else if (name === "is_free") {
      if (value >= 0) {
        setState({
          ...state,
          [name]: value,
        });
      } else {
      }
    } else if (name === "entry_fee") {
      setState({
        ...state,
        [name]: parseInt(value),
      });
      // if (parseInt(value) <= parseInt(state.win_reward)) {
      //   setState({
      //     ...state,
      //     [name]: value,
      //   });
      // }
    } else if (name === "win_reward") {
      setState({
        ...state,
        [name]: parseInt(value),
      });
      // if (parseInt(value) >= parseInt(state.entry_fee)) {
      //   setState({
      //     ...state,
      //     [name]: value,
      //   });
      // }
    } else {
      setState({
        ...state,
        [name]: value,
      });
    }
  };

  // form submit

  const handleSubmit = async () => {
    if (state.options.length === 0) {
      setError({
        ...error,
        status: true,
        type: "options",
        message: "Enter valid options",
      });
    } else if (state.entry_fee.length === 0) {
      toast.error("Please fill amount");
    } else if (state.win_reward <= state.entry_fee) {
      toast.error("Entry fee must be smaller than winning rewards.");
    } else if (!logo) {
      toast.error("Please select Image file ");
    } else {
      const formData = new FormData();
      formData.append("data", encryptData(JSON.stringify(state)));
      formData.append("file", logo);
      await axiosInstanceAuth
        .post(`/admin/match-fees-rewards/add`, formData)
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

  const imageStyle = {
    height: "100px",
    width: "100px",
    border: "1px dashed $darkBlue",
    borderRadius: "50%",
  };

  const modalStyle = {
    bgcolor: "background.paper",
    position: "absolute",
    top: "3%",
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
              Add Match Fee & Reward option
            </MDTypography>
          </MDBox>
          {/* image */}
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
              <Grid
                container
                rowSpacing={0.5}
                columnSpacing={{
                  xs: 1,
                  sm: 2,
                  md: 3,
                }}
              >
                <Grid item xs={12}>
                  {/* options */}
                  <MDBox mb={3}>
                    <FormControl sx={{ width: "100%" }}>
                      <MDInput
                        sx={{ height: "44.125px" }}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        type="text"
                        name="options"
                        value={state.options}
                        label="Name"
                        fullWidth
                        error={!!error.fileType}
                        onChange={handleChange}
                      />{" "}
                      {error.status && error.type === "options" && (
                        <MDTypography variant="button" color="error">
                          {error.message}{" "}
                        </MDTypography>
                      )}{" "}
                    </FormControl>
                  </MDBox>
                </Grid>

                {/* Game Mode */}
                <Grid item xs={12}>
                  <MDBox mb={3}>
                    <FormControl sx={{ width: "100%" }}>
                      <InputLabel id="demo-simple-select-label">
                        Game Mode
                      </InputLabel>
                      <Select
                        sx={{ height: "44.125px" }}
                        id="demo-simple-select"
                        name="game_mode"
                        value={state.game_mode}
                        label="Game Mode"
                        fullWidth
                        disabled
                        onChange={handleChange}
                      >
                        <MenuItem value="Training">Training</MenuItem>
                        <MenuItem value="Tournament">Tournament</MenuItem>
                      </Select>
                    </FormControl>
                  </MDBox>
                </Grid>

                {/* Amount */}
                <Grid item xs={6}>
                  <MDBox mb={3}>
                    <FormControl sx={{ width: "100%" }}>
                      <MDInput
                        sx={{ height: "44.125px" }}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        type="number"
                        name="entry_fee"
                        value={state.entry_fee}
                        onWheel={(e) => e.target.blur()}
                        label="Entry Fee"
                        fullWidth
                        error={!!error.fileType}
                        onChange={handleChange}
                      />{" "}
                      {error.status && error.type === "entry_fee" && (
                        <MDTypography variant="button" color="error">
                          {error.message}{" "}
                        </MDTypography>
                      )}{" "}
                    </FormControl>
                  </MDBox>
                </Grid>
                {/* unit */}
                <Grid item xs={6}>
                  <MDBox mb={3}>
                    <FormControl sx={{ width: "100%" }}>
                      <InputLabel id="demo-simple-select-label">
                        Unit
                      </InputLabel>
                      <Select
                        sx={{ height: "44.125px" }}
                        id="demo-simple-select"
                        name="unit"
                        value={state.unit}
                        label="Unit"
                        disabled
                        fullWidth
                        onChange={handleChange}
                      >
                        <MenuItem value="lt">LT</MenuItem>
                        <MenuItem value="tt">TT</MenuItem>
                        <MenuItem value="gt">GT</MenuItem>
                      </Select>
                    </FormControl>
                  </MDBox>
                </Grid>

                {/* reward */}
                <Grid item xs={12}>
                  <MDBox mb={3}>
                    <FormControl sx={{ width: "100%" }}>
                      <MDInput
                        sx={{ height: "44.125px" }}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        type="number"
                        name="win_reward"
                        value={state.win_reward}
                        label="Reward"
                        onWheel={(e) => e.target.blur()}
                        fullWidth
                        error={!!error.fileType}
                        onChange={handleChange}
                      />{" "}
                      {error.status && error.type === "win_reward" && (
                        <MDTypography variant="button" color="error">
                          {error.message}{" "}
                        </MDTypography>
                      )}{" "}
                    </FormControl>
                  </MDBox>
                </Grid>

                <Grid item xs={12}>
                  {/* Comments */}
                  <MDBox mb={3}>
                    <MDInput
                      type="text"
                      onChange={handleChange}
                      name="comments"
                      value={state.comments}
                      label="Comments"
                      fullWidth
                    />{" "}
                    {error.status && error.type === "comments" && (
                      <MDTypography variant="button" color="error">
                        {error.message}{" "}
                      </MDTypography>
                    )}{" "}
                  </MDBox>
                </Grid>

                <Grid item xs={12}>
                  {/* Color */}
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
                          <span className="color-text">
                            {state.color_code}{" "}
                          </span>
                        </label>
                      </span>
                    </FormControl>
                  </MDBox>
                </Grid>
                {/* is_free */}
                {/* <Grid item xs={12}>
                  <MDBox mb={3}>
                    <FormControl sx={{ width: "100%" }}>
                      <InputLabel id="demo-simple-select-label">
                        Free
                      </InputLabel>
                      <Select
                        sx={{ height: "44.125px" }}
                        id="demo-simple-select"
                        name="is_free"
                        value={state.is_free}
                        label="Free"
                        fullWidth
                        onChange={handleChange}
                      >
                        <MenuItem value={"0"}>NO</MenuItem>
                        <MenuItem value={"1"}>YES</MenuItem>
                      </Select>
                    </FormControl>
                  </MDBox>
                </Grid> */}
                <Grid item xs={12}>
                  <MDBox mt={2} mb={1}>
                    <MDButton
                      onClick={handleSubmit}
                      variant="gradient"
                      color="info"
                      fullWidth
                    >
                      Add
                    </MDButton>
                  </MDBox>
                </Grid>
              </Grid>
            </MDBox>
          </MDBox>
        </Box>
      </Modal>
    </>
  );
};

export default AddMatchModal;
