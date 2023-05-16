import { Box, FormControl, Modal } from "@mui/material";
import axiosInstanceAuth from "apiServices/axiosInstanceAuth";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDTypography from "components/MDTypography";
import useEncryption from "customHook/useEncryption";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import CloseIcon from "@mui/icons-material/Close";

const GameTime = ({ open, close, defaultData, getRegions }) => {
  const [fields, setFields] = useState({ game_time: defaultData });

  const { encryptData } = useEncryption();
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
    if (name === "game_time") {
      if(value > 0){
        console.log("come")
        setFields({
          ...fields,
          [name]: value,
        });
      }
    }
  };

  useEffect(() => {
    if (defaultData) {
      setFields({ game_time: defaultData });
    }
  }, [defaultData]);

  const handleSubmit = async () => {
    setLoading(true);
    const encryptedData = encryptData(
      JSON.stringify({ game_time: fields.game_time,})
    );
    await axiosInstanceAuth
      .put("admin/settings/change-game-time", { data: encryptedData })
      .then((res) => {
        if (res?.data?.status) {
          toast.success(res?.data?.message);
          close();
          getRegions()
          setLoading(false);
        } else {
          toast.error(res?.data?.message);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
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
            Game Expiry Time
            </MDTypography>
          </MDBox>
          <MDBox pt={4} pb={3} px={3}>
            <MDBox component="form" role="form">
              <MDBox mb={3}>
                <FormControl sx={{ width: "100%" }}>
                  <MDInput
                    name="game_time"
                    type="number"
                    value={fields.game_time}
                    label="Game Time"
                    fullWidth
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
                  Save Changes
                </MDButton>
              </MDBox>
            </MDBox>
          </MDBox>
        </Box>
      </Modal>
    </>
  );
};

export default GameTime;
