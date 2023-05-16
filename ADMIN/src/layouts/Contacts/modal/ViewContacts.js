/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Grid,
  Modal,
} from "@mui/material";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import React from "react";
import CloseIcon from "@mui/icons-material/Close";

const ViewContacts = (props) => {
  const { open, onClose, categoryData } = props;

  const modalStyle = {
    bgcolor: "background.paper",
    position: "absolute",
    top: "8%",
    left: "50%",
    transform: "translate(-50%, 0%)",
    width: 400,
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
              View Contact Us
              <br />
              Message
            </MDTypography>
          </MDBox>
          <MDBox pt={4} px={3}>
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
                  <MDTypography width={"100%"} variant="h5" fontWeight="medium">
                    {categoryData?.message}{" "}
                  </MDTypography>
                </Grid>
              </Grid>
              <MDBox mt={2}>
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
              </MDBox>
            </MDBox>
          </MDBox>
        </Box>
      </Modal>
    </>
  );
};

export default ViewContacts;
