import { Box,  Modal, Typography } from '@mui/material'
import MDBox from 'components/MDBox'
import MDButton from 'components/MDButton';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const LogOutConfirmation = () => {

    const navigate = useNavigate();
    const [isEditConfirmation, setIsEditConfirmation] = useState(true)

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
        p: 4
    };

    const confirm = () => {
        localStorage.clear();
        navigate("/sign-in")
    }

    const Close = () => {
        setIsEditConfirmation(false)
        navigate(-1)
    }
    const onCloseEditModal = (event, reason) => {
        if (reason && reason == "backdropClick") return;
        else Close();
      };

    return (
        <>
            <Modal open={isEditConfirmation}
                onClose={onCloseEditModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description">
                <Box sx={modalStyle}>
                    <Typography id="modal-modal-title" variant="h4" component="h2">
                        Are you sure do you want to logout?
                    </Typography>
                    <MDBox component="form" role="form">
                        <MDBox mt={4}
                            mb={1}>
                            <MDButton onClick={confirm}
                                variant="gradient"
                                color="info"
                                textGradient
                                fullWidth>
                                Yes
                            </MDButton>
                        </MDBox>
                        <MDBox textAlign="center">
                            <MDButton
                                onClick={Close}
                                variant="gradient"
                                className="logout_no_button"
                                textGradient
                                fullWidth
                            >
                                No
                            </MDButton>
                        </MDBox>
                    </MDBox>
                </Box>
            </Modal>
        </>
    )
}

export default LogOutConfirmation
