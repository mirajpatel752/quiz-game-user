import "./index.css";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import categyTableData from "layouts/category/data/categoryTableData";
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
import AddFormatModal from "./modal/AddCategoryModal";
import { toast } from "react-toastify";
import moment from "moment/moment";
import { useNavigate } from "react-router-dom";
import EditCategoryModal from "./modal/editCategoryModal";
import Loader from "common/Loader/loader";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import UploadLoader from "common/UploadLoader/UploadLoader";
import { useDebounce } from "customHook/useDebounce";


function Category() {
  const { columns } = categyTableData();
  const [isAdd, setIsAdd] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [editData, setEditData] = useState({});
  const [isEditModal, setIsEditModal] = useState(false);
  const { encryptData, decryptData } = useEncryption();
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [viewModal, setViewModal] = useState(false);
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
      search:"",
      page_no:value.toString(),
    });
    setPage(value);
  };

  const getViewFileFormat = async (data,type) => {
    setLoading(type === true ? true :false)
    const encryptedData = encryptData(JSON.stringify(data))
    await axiosInstanceAuth
      .post("/admin/categories/get-list",{data:encryptedData})
      .then((res) => {
        const decryptedData = decryptData(res.data.data);
        const count = Math.ceil(res.data.count / 10);
        setCount(count);
        if (res.data.status) {
          setLoading(false);
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
                      style={{ height: "40px", width: '40px', borderRadius: "50%" }}
                      src={`${d.icon === undefined ? "/broken-image.jpg" : d.icon
                        }`} alt=""
                    />
                  </MDTypography>
                </MDBox>
              ),
              accountTypes: (
                <MDBox lineHeight={1}>
                  <Tooltip title={d.account_type_list.replaceAll(";", " , ")}>
                    <MDTypography
                      display="block"
                      variant="button"
                      fontWeight="medium"
                    >
                      {d.account_type_list.slice(0, 50).replaceAll(";", " , ")}
                      {d.account_type_list.length > 50 && "..."}{" "}
                    </MDTypography>
                  </Tooltip>
                </MDBox>
              ),
              title: (
                <MDBox lineHeight={1}>
                  <MDTypography
                    display="block"
                    variant="button"
                    fontWeight="medium"
                    className="description_title"
                  >
                    {d?.title}
                  </MDTypography>
                </MDBox>
              ),

              date: (
                <MDBox lineHeight={1}>
                  <MDTypography
                    display="block"
                    variant="button"
                    fontWeight="medium"
                  >
                    {moment(d?.created_at).format("MMM,Do,YY")}{" "}
                  </MDTypography>
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
                    color="action"
                    sx={{ border: 1 }}
                    onClick={(e) => removeRedEyeIcon(e, d)}
                  >
                    <RemoveRedEyeIcon />
                  </IconButton>

                  <IconButton
                    size="small"
                    disableRipple
                    color="error"
                    sx={{ border: 1, margin: "5px 10px" }}
                    onClick={(e) => onDeleteList(e, d)}
                  >
                    <Icon>delete_forever</Icon>
                  </IconButton>
                </>
              ),
            });
          });
          setDataSource(temp);
        } else {
          setLoading(false);
          setDataSource([]);
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
        setDataSource([]);
      });
  };

  // delete category info
  const onDeleteInfoData = async () => {
    await axiosInstanceAuth
      .delete(`admin/categories/delete/${editData.id}`)
      .then((res) => {
        const decryptedData = decryptData(res.data);
        if (res.data.status) {
          const  prevPage = dataSource.length  === 1 ? page - 1 :  page.toString()
          getViewFileFormat({
            search:"",
            page_no:prevPage.toString(),
          });
          setPage(dataSource.length  === 1 ? page -1 : page)
          setSearch("")
          onCloseDeleteModal();
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
        toast.error("Error");
      });
  };

  const onEditContactInfo = (event, data) => {
    setEditData(data);
    setIsEditModal(true);
  };

  const removeRedEyeIcon = (event, data) => {
    setEditData(data);
    setViewModal(true);
  };


  // Add category
  const addFormat = () => {
    setIsAdd(true);
  };
  const onConfirmClose = () => {
    getViewFileFormat({
      search:"",
      page_no:page.toString(),
    });
    setIsAdd(false);
  };
  const onCloseDeleteModal = () => {
    setIsDeleteModal(false);
  };
  const onCloseEditModal = () => {
    setIsEditModal(false);
    getViewFileFormat({
      search:Search,
      page_no: Search.length > 0 ? "1" : page.toString(),
    });

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

  const requestSearch = (e) => {
    setSearch(e.target.value)
    setPage(1);
    setSearchApi(true)
  };

  useEffect(() => {
    const  value = debounced.trim()
    if(searchApi === true){
      getViewFileFormat({
        search: value,
        page_no: "1",
      });
    }else{
      getViewFileFormat({
        search:"",
        page_no:page.toString(),
      },true);
    }
     
  }, [debounced]);



  const handleLogoChange = (e) => {
    e.preventDefault();
    let file = e.target.files[0];
    let reader = new FileReader();
    reader.onloadend = () => {
      setFiles(file);
    };
    reader.readAsDataURL(file);
    fileUpload(file);
  };

  const fileUpload = async (data) => {
    setUploadLoading(true)
    const formData = new FormData();
    formData.append("file", data);
    await axiosInstanceAuth
      .post(`/admin/categories/upload-bulk-data`, formData)
      .then((res) => {
        setUploadLoading(false)
        if (res.data.status) {
          toast.success(res.data.message);
          getViewFileFormat();
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
        toast.error("Error");
      });
  };

  return (
    <>
      <DashboardLayout>
        <MDBox className="dashboard_wrapper">
        {
          loading === true ? <Loader /> : ( 
          <>
             <DashboardNavbar />
            <MDBox pt={2} pb={3}>
              <Grid container spacing={6}>
                <Grid item xs={12}>
                  <MDBox
                    sx={{
                      display: "flex",
                      background: "",
                      color: "#000",
                      justifyContent: "end",
                      alignItems: "end",
                    }}
                    borderRadius="lg"
                    pb={2}
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
                            href={`${process.env.REACT_APP_BASE_DEV_URL}admin/categories/download-data`}
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
                        onChange={handleLogoChange}
                        onClick={(event) => (event.target.value = null)} />
                      </div>
                    </div>
                    <div>
                      <button className="download-file-button ">
                        <i className="fa fa-download"></i>&nbsp;&nbsp;
                        <a
                          href={`${process.env.REACT_APP_BASE_DEV_URL}admin/categories/download-sample-file`}
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
                      py={2}
                      px={2}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                      variant="gradient"
                      borderRadius="lg"
                      coloredShadow="info"
                    >
                      <Grid item xs={2}>
                        <MDBox sx={{ height: "38.125px" }}>
                          <FormControl sx={{ width: "100%" }}>
                            <TextField
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
                      <MDBox
                        sx={{
                          display: "flex",
                          background: "#fff",
                          color: "#000",
                          alignItems: "center",
                        }}
                      >
                        <Button
                          variant="contained"
                          sx={{ marginRight: "15px" }}
                          onClick={addFormat}
                          color="success"
                          startIcon={<AddCircleIcon />}
                        >
                          Add Category
                        </Button>
                      </MDBox>
                    </MDBox>
                    <MDBox pt={3}>
                      {uploadLoading ? (
                        < UploadLoader />
                      ) :
                        <DataTable
                          table={{ columns, rows: dataSource }}
                          isSorted={false}
                          entriesPerPage={false}
                          showTotalEntries={false}
                          canSearch={false}
                          noEndBorder
                        />
                      }
                    </MDBox>
                    <MDBox p={2}>
                    <Pagination
                      color="info"
                      count={count || 0}
                      page={page}
                      onChange={onPagination}
                    />
                    </MDBox>
                  </Card>
                </Grid>
              </Grid>
            </MDBox>
            </>
            )
          }
        </MDBox>

        {isEditModal && (
          <EditCategoryModal
            open={isEditModal}
            onClose={() => setIsEditModal(false)}
            onConfirmClose={onCloseEditModal}
            editData={editData}
          />
        )}
        {viewModal && (
          <EditCategoryModal
            open={viewModal}
            flag={true}
            onClose={() => setViewModal(false)}
            onConfirmClose={onCloseEditModal}
            editData={editData}
          />
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
                Delete Categories
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                Are you  sure you  want to delete this Categories ?
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

export default Category;
