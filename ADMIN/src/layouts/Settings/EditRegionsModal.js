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

const EditRegionsModal = ({ open, close, defaultData = null, getRegions }) => {
  const [fields, setFields] = useState({ name: "" });
  const [error, setError] = useState({ status: false, type: "", message: "" });
  const { encryptData } = useEncryption();
  const authExpired = "Something is wrong in Authentication.Please try again.";
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    bgcolor: "background.paper",
    border: "0px solid #000",
    boxShadow: 24,
    borderRadius: 4,
    p: 4,
  };

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
  };

  useEffect(() => {
    if (defaultData) {
      setFields({ name: defaultData.name });
    }
  }, [defaultData]);

  const handleSubmit = async () => {
    if (fields.name.length <= 0) {
      setError({
        ...error,
        status: true,
        type: "name",
        message: "Name is required",
      });
    } else {
      if (defaultData) {
        setLoading(true);
        const encryptedData = encryptData(
          JSON.stringify({ name: fields.name, id: defaultData.id, status: 1 })
        );
        await axiosInstanceAuth
          .put("admin/difficulty_levels/edit", { data: encryptedData })
          .then((res) => {
            if (res?.data?.status) {
              toast.success(res?.data?.message);
              getRegions();

              close();
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
          JSON.stringify({ name: fields.name })
        );
        await axiosInstanceAuth
          .post("admin/difficulty_levels/add", { data: encryptedData })
          .then((res) => {
            if (res?.data?.status) {
              toast.success(res?.data?.message);
              getRegions();
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

  const onCloseEditModal = (event, reason) => {
    if (reason && reason == "backdropClick") return;
    else close();
  };

  return (
    <>
      <Modal open={open} onClose={onCloseEditModal}>
        <Box sx={modalStyle}>
          <button className="icon-end-close" onClick={close}>
            <div className="close-icon">
              <CloseIcon />
            </div>
          </button>
          <MDBox mx={2} p={1} textAlign="center">
            <MDTypography variant="h4" fontWeight="medium">
              {defaultData ? "Edit Difficulty Level" : "Add Difficulty Level"}{" "}
            </MDTypography>
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
                    error={!!error.message}
                    onChange={handleChange}
                  />
                </FormControl>
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
                  {defaultData ? "Save Changes" : "Add"}{" "}
                </MDButton>
              </MDBox>
            </MDBox>
          </MDBox>
        </Box>
      </Modal>
    </>
  );
};

export default EditRegionsModal;
