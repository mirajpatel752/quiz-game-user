import { Box, Modal, Typography } from '@mui/material'
import MDBox from 'components/MDBox'
import MDButton from 'components/MDButton';
import MDTypography from 'components/MDTypography';
import React from 'react'

const EditConfirmation = ({ open, close, confirm }) => {

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "0px solid #000",
    boxShadow: 24,
    borderRadius: 4,
    p: 4,
  };


  const onCloseEditModal = (event, reason) => {
    if (reason && reason == "backdropClick") return;
    else close();
  };

  return (
    <>
      <Modal
        open={open}
        onClose={onCloseEditModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-modal-title" variant="h4" component="h2">
            Are you sure want to Edit?
          </Typography>
          <MDBox component="form" role="form">
            <MDBox mt={4} mb={1}>
              <MDButton
                onClick={confirm}
                variant="gradient"
                color="info"
                fullWidth
              >
                Yes
              </MDButton>
            </MDBox>
            <MDBox textAlign="center">
              <MDTypography
                style={{ cursor: "pointer" }}
                variant="button"
                color="info"
                fontWeight="medium"
                textGradient
                onClick={close}
              >
                Close
              </MDTypography>
            </MDBox>
          </MDBox>
        </Box>
      </Modal>
    </>
  )
}

export default EditConfirmation