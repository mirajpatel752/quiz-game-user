import {Box, FormControl, Modal} from "@mui/material";
import axiosInstanceAuth from "apiServices/axiosInstanceAuth";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDTypography from "components/MDTypography";
import useEncryption from "customHook/useEncryption";
import React, {useEffect, useState} from "react";
import {toast} from "react-toastify";
import CloseIcon from '@mui/icons-material/Close';
import {useNavigate} from "react-router-dom";


const AddFormatModal = ({
    open,
    onClose,
    onConfirmClose,
    flag,
    editData
}) => {
    const {encryptData, decryptData} = useEncryption();

    const [state, setState] = useState({name: ""});
    const [loading, setLoading] = useState(false);

    const [error, setError] = useState({status: false, type: "", message: ""})
    const [preview, setPreview] = useState([])
    const [logo, setLogo] = useState()
    const navigate = useNavigate();
    // onChange
    const handleChange = (event) => {
        const value = event.target.value
        const name = event.target.name
        if (name === "name") {
            if (value.length === 0) {
                setError({
                    ...error,
                    status: true,
                    type: "name",
                    message: "Enter valid title"
                })
                setState({
                    ...state,
                    [name]: value
                });
            } else {
                setError({
                    ...error,
                    status: false,
                    type: "",
                    message: ""
                })
                setState({
                    ...state,
                    [name]: value
                });
            }
        }
        setState({
            ...state,
            [name]: value
        });
    };


    useEffect(() => {
        if (editData) {
            setState({
                name: editData ?. name
            })
            setPreview(editData ?. avatar)
        } else {}
    }, [editData])


    // form submit
    const handleSubmit = async () => {
        if (state.name.length === 0) {
            setError({
                ...error,
                status: true,
                type: "name",
                message: "Enter valid title"
            })
        } else if (!logo && !flag) {
            toast.error("Please select Image file ");
        } else {
            const formData = new FormData()
            const encryptedData = encryptData(JSON.stringify({
                name: state.name,
                 id: flag === true ? editData.id : undefined
            }))
            formData.append("data", encryptedData)
            logo  && formData.append("file", logo)
            setLoading(true)
            await axiosInstanceAuth.post(`/admin/avatars/add`, formData).then((res) => {
                if (res.data.status) {
                    toast.success(res.data.message);
                    onConfirmClose()
                    onClose()
                    setLoading(false)
                } else {
                    toast.error(res.data.message);
                    setLoading(false)
                    if (res.data.isAuth === false) {
                        localStorage.clear();
                        navigate("/sign-in");
                    } else if (!localStorage.getItem("token")) {
                        navigate("/sign-in");
                    }
                }
            }).catch((err) => {
                toast.error(err);
                setLoading(false)
            });
        }
    };

    const handleLogoChange = (e) => {
        e.preventDefault()
        let file = e.target.files[0]
        let reader = new FileReader()
        reader.onloadend = () => {
            setLogo(file)
            setPreview(reader.result)
        };
        reader.readAsDataURL(file)

    }


    const imageStyle = {
        height: '100px',
        width: "100px",
        border: '1px dashed $darkBlue',
        borderRadius: '50%'
    };


    const modalStyle = {
        bgcolor: "background.paper",
        position: "absolute",
        top: "20%",
        left: "50%",
        transform: "translate(-50%, 0%)",
        width: 500,
        border: "0px solid #000",
        boxShadow: 24,
        borderRadius: 4,
        p: 4,
        overflow: "auto"
    };
    const modal = {
        overflow: 'scroll'
    };

    const onCloseEditModal = (event, reason) => {
        if (reason && reason == "backdropClick") 
            return;
         else 
            onClose();
        
    };

    return (
        <>
            <Modal open={open}
                onClose={onCloseEditModal}
                sx={modal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description">
                <Box sx={modalStyle}>
                    <button className="icon-end-close"
                        onClick={onClose}>
                        <div className="close-icon">
                            <CloseIcon/>
                        </div>
                    </button>
                    <MDBox mx={2}
                        p={1}
                        textAlign="center">
                        <MDTypography variant="h4" fontWeight="medium">
                            {
                            flag === true ? " Edit Avatar " : " Add Avatar"
                        } </MDTypography>
                    </MDBox>

                    <MDBox mt={3}
                        textAlign="center">
                        <div className="image-center">
                            <div className=" d-flex p-1"
                                style={imageStyle}
                                sx={
                                    {borderRadius: '50%'}
                            }>
                                <label htmlFor="photo-upload" className="custom-file-upload fas">
                                    <div className="img-wrap img-upload">
                                        <img for="photo-upload"
                                            src={preview}
                                            alt=""/>
                                    </div>
                                    <input id="photo-upload" type="file" accept="image/*"
                                        onChange={
                                            (e) => handleLogoChange(e)
                                        }/>
                                </label>
                            </div>

                        </div>
                        <button type="button" className="image-change-btn upload-button">
                            <label style={
                                    {
                                        fontSize: "12px",
                                        cursor: "pointer",
                                        padding: "15px"
                                    }
                                }

                                htmlFor="logoImage">
                                Upload
                                <input id="logoImage" type="file"
                                    hidden={true}
                                    name="logo"
                                    accept="image/*"
                                    onChange={
                                        (e) => handleLogoChange(e)
                                    }/>
                            </label>
                        </button>
                    </MDBox>
                    <MDBox pt={4}
                        pb={3}
                        px={3}>
                        <MDBox component="form" role="form">
                            <MDBox mb={3}>
                                <FormControl sx={
                                    {width: "100%"}
                                }>
                                    <MDInput sx={
                                            {height: "44.125px"}
                                        }
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        name="name"
                                        value={
                                            state.name
                                        }
                                        label="Name"
                                        fullWidth
                                        error={
                                            !!error.fileType
                                        }
                                        onChange={handleChange}/> {
                                    error.status && error.type === "name" && (
                                        <MDTypography variant="button" color="error">
                                            {
                                            error.message
                                        } </MDTypography>
                                    )
                                } </FormControl>
                            </MDBox>
                            <MDBox mt={4}
                                mb={1}>
                                <MDButton onClick={handleSubmit}
                                    variant="gradient"
                                    color="info"
                                    disabled={loading}
                                    fullWidth>
                                    {
                                    flag === true ? "Save Changes" : "Add"
                                } </MDButton>
                            </MDBox>
                        </MDBox>
                    </MDBox>
                </Box>
            </Modal>
        </>
    );
};

export default AddFormatModal;
