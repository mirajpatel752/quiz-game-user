import "./index.css";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import useEncryption from "customHook/useEncryption";
import axiosInstanceAuth from "apiServices/axiosInstanceAuth";
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  Icon,
  IconButton,
  Modal,
  Pagination,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import AddFormatModal from "./modal/AddModal";
import { toast } from "react-toastify";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import { useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import Loader from "common/Loader/loader";
import UploadLoader from "common/UploadLoader/UploadLoader";
import { useDebounce } from "customHook/useDebounce";


function AccountTypes() {

 const  columns = [
            {
                Header: "id",
                accessor: "id",
                align: "left",
                width: "5%"
            },
            {
                Header: "image",
                accessor: "image",
                align: "left",
                width: "5%"
            },
            {
                Header: "Account Type",
                accessor: "account_type",
                align: "left",
                width: "20%"
            },
            {
                Header: "description",
                accessor: "description",
                align: "left",
                width: "65%"
            }, {
                Header: "action",
                accessor: "action",
                align: "left",
                width: "5%"
            },
        ]

  const [isAdd, setIsAdd] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [editData, setEditData] = useState({});
  const [isEditModal, setIsEditModal] = useState(false);
  const [fields, setFields] = useState({ account_type: "", description: "" });
  const [preview, setPreview] = useState([]);
  const [logo, setLogo] = useState();
  const { encryptData, decryptData } = useEncryption();
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [count, setCount] = useState([0]);
  const [page, setPage] = useState(1);
  const [Search, setSearch] = useState("");
  const [debounced] = useDebounce(Search, 500);
  const [searchApi, setSearchApi] = useState(false);

  const onPagination = (event, value) => {
    setPage(value);
    getViewFileFormat({
      search: "",
      page_no: value.toString(),
    });
    setPage(value);
  };

  const navigate = useNavigate();

  const getViewFileFormat = async (data,type) => {
      setLoading(type === true ? true :false);
    const encryptedData = encryptData(JSON.stringify(data));
    await axiosInstanceAuth
      .post("/admin/account-types/get-list", { data: encryptedData })
      .then((res) => {
        const decryptedData = decryptData(res.data.data);
        const count = Math.ceil(res.data.count / 10);
        setCount(count);
        if (res.data.status) {
          const data = decryptedData;
          const temp = [];
          data?.map((d, i) => {
            temp.push({
              id: (
                <MDBox lineHeight={1} keys={i}>
                  <MDTypography
                    display="block"
                    variant="button"
                    fontWeight="medium"
                  >
                    {d.id}
                  </MDTypography>
                </MDBox>
              ),
              image: (
                <MDBox lineHeight={1}>
                  <MDTypography
                    display="block"
                    variant="button"
                    fontWeight="medium"
                  >
                    <img
                      style={{
                        height: "40px",
                        width: "40px",
                        borderRadius: "50%",
                      }}
                      src={`${
                        d.icon === undefined ? "/broken-image.jpg" : d.icon
                      }`}
                      alt=""
                    />
                  </MDTypography>
                </MDBox>
              ),
              account_type: (
                <MDBox lineHeight={1}>
                  <Tooltip title={d.account_type.replace(";", " , ")}>
                    <MDTypography
                      display="block"
                      variant="button"
                      fontWeight="medium"
                    >
                      {d?.account_type.slice(0, 25).replaceAll(";", " , ")}
                      {d?.account_type.length > 25 && "..."}{" "}
                    </MDTypography>
                  </Tooltip>
                </MDBox>
              ),
              description: (
                <MDBox lineHeight={1}>
                  <Tooltip title={d.description}>
                    <MDTypography
                      className="description_title"
                      display="block"
                      variant="button"
                      fontWeight="medium"
                    >
                      {d?.description}
                      {/* {d?.description.slice(0, 80)}
                        {d?.description.length > 80 && "..."}{" "} */}
                    </MDTypography>
                  </Tooltip>
                </MDBox>
              ),
              action: (
                <>
                  <IconButton
                    size="small"
                    sx={{
                      margin: "0px 10px 0px 0px",
                      border: 1,
                    }}
                    disableRipple
                    color="action"
                    onClick={(e) => onEditContactInfo(e, d)}
                  >
                    <Icon>edit</Icon>
                  </IconButton>
                  <IconButton
                    size="small"
                    disableRipple
                    color="error"
                    sx={{ border: 1 }}
                    onClick={(e) => onDeleteList(e, d)}
                  >
                    <Icon>delete_forever</Icon>
                  </IconButton>
                </>
              ),
            });
          });
          setLoading(false);
          setDataSource(temp);
        } else {
          setLoading(false);
          setDataSource([]);
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
        if (err.status === 498) {
          localStorage.clear();
          navigate("/sign-in");
        }
        toast.error(err);
      });
  };

  // delete category info
  const onDeleteInfoData = async () => {
    const encrypt = {
      account_type: editData.account_type,
      description: editData.description,
      id: editData.id,
      status: 0,
    };
    const formData = new FormData();
    formData.append("data", encryptData(JSON.stringify(encrypt)));
    logo && formData.append("file", logo);
    await axiosInstanceAuth
      .put(`admin/account-types/edit`, formData)
      .then((res) => {
        if (res.data.status) {
          const  prevPage = dataSource.length  === 1 ? page - 1 :  page.toString()
          getViewFileFormat({
            search: "",
            page_no: prevPage.toString(),
          });
          setPage(dataSource.length  === 1 ? page -1 : page)
          setSearch("");
          onCloseDeleteModal();
          toast.success(res.data.message);
        } else {
          toast.error(res.data.message);
          if (res.data.isAuth === false) {
            localStorage.clear();
            navigate("/sign-in");
          }
          if (!localStorage.getItem("token")) {
            navigate("/sign-in");
          }
        }
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  // category submit edit
  const handleSubmit = async () => {
    setPreview([]);
    if (fields.account_type.length === 0) {
      toast.error("Please add Account Type ");
    } else {
      const encrypt = {
        account_type: fields.account_type,
        description: fields.description,
        id: editData.id,
        status: 1,
      };
      const formData = new FormData();
      formData.append("data", encryptData(JSON.stringify(encrypt)));
      logo && formData.append("file", logo);
      await axiosInstanceAuth
        .put(`admin/account-types/edit`, formData)
        .then((res) => {
          if (res.data.status) {
            getViewFileFormat({
              search: Search,
              page_no: Search.length > 0 ? "1" : page.toString(),
            });
            onCloseEditModal();
            toast.success(res.data.message);
            setLogo();
          } else {
            toast.error(res.data.message);
            setLogo();
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

  const onEditContactInfo = (event, data) => {
    setEditData(data);
    setIsEditModal(true);
  };

  // onChange
  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "description") {
      if (value) {
        setFields({
          ...fields,
          [name]: value.slice(0,120),
        });
      } else {
        setFields({
          ...fields,
          [name]: value.slice(0,120),
        });
      }
    } else {
      setFields({
        ...fields,
        [name]: value.slice(0,120),
      });
    }
  };

  useEffect(() => {
    if (isEditModal) {
      setFields({
        account_type: editData?.account_type,
        description: editData?.description,
        id: editData?.id,
      });
      setPreview(editData.icon);
    }
  }, [isEditModal]);

  // Add category
  const addFormat = () => {
    setIsAdd(true);
  };

  const onConfirmClose = () => {
    getViewFileFormat({
      search: "",
      page_no: page.toString(),
    });
    setIsAdd(false);
  };

  const onCloseDeleteModal = () => {
    setIsDeleteModal(false);
  };

  const onCloseEditModal = (event, reason) => {
    if (reason && reason == "backdropClick") {
      return;
    } else {
      setIsEditModal(false);
    }
  };

  const onDeleteList = (event, data) => {
      setEditData(data);
      setIsDeleteModal(true);
  };

  const modalStyleDelete = {
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

  const modalStyle = {
    position: "absolute",
    top: "15%",
    left: "50%",
    transform: "translate(-50%, 0%)",
    width: 500,
    bgcolor: "background.paper",
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

  const handleLogoChangeupload = (e) => {
    e.preventDefault();
    let file = e.target.files[0];
    let reader = new FileReader();
    reader.onloadend = () => {
      // setLogo(file);
      // setPreview(reader.result);
    };
    reader.readAsDataURL(file);
    fileUpload(file);
  };

  const fileUpload = async (data) => {
    setUploadLoading(true);
    const formData = new FormData();
    formData.append("file", data);
    await axiosInstanceAuth
      .post(`/admin/account-types/upload-bulk-data`, formData)
      .then((res) => {
        setUploadLoading(false);
        if (res.data.status) {
          toast.success(res.data.message);
          getViewFileFormat({
            search: "",
            page_no: page.toString(),
          });
        } else {
          toast.error(res.data.message);
          if (res.data.isAuth === false) {
            localStorage.clear();
            navigate("/sign-in");
          }
          if (!localStorage.getItem("token")) {
            navigate("/sign-in");
          }
        }
      })
      .catch((err) => {
        toast.error("Error", err);
      });
  };

  const requestSearch = (e) => {
    setSearch(e.target.value);
    setSearchApi(true)
    setPage(1);
  };

  useEffect(() => {
    if(searchApi === true){
      const  value = debounced.trim()
      getViewFileFormat({
        search: value,
        page_no: "1",
      });
    }else{
      getViewFileFormat({
        search: "",
        page_no: page.toString(),
      },true);
    }
  }, [debounced]);

  const modal = {
    overflow: "scroll",
  };

  return (
    <>
      <DashboardLayout>
        <MDBox className="dashboard_wrapper">
        {
          loading === true ? <Loader /> : (   <>
            <DashboardNavbar />
            <MDBox pt={2} pb={3}>
              <Grid container spacing={2}>
                <Grid item xs={12} pt={4}>
                  <MDBox
                    sx={{
                      display: "flex",
                      background: "",
                      color: "#000",
                      justifyContent: "end",
                      alignItems: "end",
                    }}
                    pb={2}
                    borderRadius="lg"
                  >
                    <MDBox
                      sx={{
                        marginRight: "15px",
                      }}
                    >
                      <div>
                        <button className="download-file-button">
                          <i className="fa fa-download"></i>&nbsp;&nbsp;
                          <a
                            href={`${process.env.REACT_APP_BASE_DEV_URL}admin/account-types/download-data`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Download Data
                          </a>
                        </button>
                      </div>
                    </MDBox>
                    <div className="variants">
                      <div className="file file--upload">
                        <label htmlFor="input-file">
                          <i className="fa fa-upload upload"></i>&nbsp;Upload
                        </label>
                        <input id="input-file" type="file"  accept=".xlsx"
                        onChange={handleLogoChangeupload}
                        onClick={(event) => (event.target.value = null)} />
                      </div>
                    </div>
                    <div>
                      <button className="download-file-button ">
                        <i className="fa fa-download"></i>&nbsp;&nbsp;
                        <a
                          href={`${process.env.REACT_APP_BASE_DEV_URL}admin/account-types/download-sample-file`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Download Template
                        </a>
                      </button>
                    </div>
                  </MDBox>
                  <Card>
                    <MDBox
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                      py={2}
                      px={2}
                      variant="gradient"
                      borderRadius="lg"
                      coloredShadow="info"
                    >
                      <Grid item xs={2}>
                        <MDBox sx={{ height: "38.125px" }}>
                          <FormControl sx={{ width: "100%" }}>
                            <TextField
                              autoComplete="off"
                              sx={{ height: "38.125px" }}
                              onChange={requestSearch}
                              name="search"
                              value={Search}
                              id="demo-simple-select-label"
                              label="Search"
                              placeholder=""
                            />
                          </FormControl>
                        </MDBox>
                      </Grid>
                      <Button
                        variant="contained"
                        sx={{ marginRight: "15px" }}
                        onClick={addFormat}
                        color="success"
                        startIcon={<AddCircleIcon />}
                      >
                        Add Account
                      </Button>
                    </MDBox>
                    {uploadLoading ? (
                      <UploadLoader />
                    ) : (
                      <MDBox pt={3}>
                        <DataTable
                          table={{ columns, rows: dataSource }}
                          isSorted={false}
                          entriesPerPage={false}
                          showTotalEntries={false}
                          noEndBorder
                          PaginationCustom={count / 10}
                        />
                      </MDBox>
                    )}
                    <MDBox p={2}>
                      <Pagination
                        color="info"
                        count={count}
                        page={page}
                        onChange={onPagination}
                      />
                    </MDBox>
                  </Card>
                </Grid>
              </Grid>
            </MDBox>
          </>)
        }
       
        </MDBox>

        {isEditModal && (
          <Modal
            open={isEditModal}
            sx={modal}
            onClose={onCloseEditModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={modalStyle}>
              <button
                className="icon-end-close"
                onClick={() => setIsEditModal(false)}
              >
                <div className="close-icon">
                  <CloseIcon />
                </div>
              </button>
              <MDBox mx={2} p={1} textAlign="center">
                <MDTypography variant="h4" fontWeight="medium">
                  Edit Account
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
                <button
                  type="button"
                  className="image-change-btn upload-button"
                >
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
                        name="account_type"
                        value={fields.account_type}
                        label="Account Type"
                        fullWidth
                        onChange={handleChange}
                      />
                    </FormControl>
                  </MDBox>
                  <MDBox mb={3}>
                    <MDInput
                      type="text"
                      rows={2}
                      multiline
                      onChange={handleChange}
                      name="description"
                      value={fields.description}
                      className="description-text"
                      label="Description"
                      fullWidth
                    />
                  </MDBox>
                  <MDBox mt={4} mb={1}>
                    <MDButton
                      onClick={handleSubmit}
                      variant="gradient"
                      color="info"
                      pt-1
                      fullWidth
                    >
                      Save Changes
                    </MDButton>
                  </MDBox>
                </MDBox>
              </MDBox>
            </Box>
          </Modal>
        )}

        {/* Delete menu */}
        {isDeleteModal && (
          <Modal
            open={isDeleteModal}
            onClose={onCloseDeleteModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={modalStyleDelete}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Delete Account Type
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                Are you sure you want to delete this Account Type ?
              </Typography>

              <MDBox
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
                mt={3}
                mb={1}
              >
                <Button
                  sx={{
                    marginRight: "20px",
                    color: "#fff",
                  }}
                  onClick={onDeleteInfoData}
                  variant="contained"
                >
                  Yes
                </Button>
                <Button
                  sx={{ color: "#000" }}
                  onClick={onCloseDeleteModal}
                  variant="outlined"
                >
                  No
                </Button>
              </MDBox>
            </Box>
          </Modal>
        )}

        {/* add categories */}

        {isAdd && (
          <AddFormatModal
            open={isAdd}
            onClose={() => setIsAdd(false)}
            onConfirmClose={onConfirmClose}
          />
        )}
        <Footer />
      </DashboardLayout>
    </>
  );
}

export default AccountTypes;
