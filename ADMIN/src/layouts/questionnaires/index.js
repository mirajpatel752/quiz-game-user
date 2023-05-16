
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import "./index.css";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import cageyTableData from "layouts/questionnaires/data/questionTableData";
import useEncryption from "customHook/useEncryption";
import axiosInstanceAuth from "apiServices/axiosInstanceAuth";
import { useEffect, useState } from "react";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  FormControl,
  Icon,
  IconButton,
  Modal,
  Pagination,
  TextField,
  Typography,
  Tooltip,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import EditQuestion from "./modal/editQuestion";
import AddQuestion from "./modal/addQuestion";
import { useTheme } from "@mui/material/styles";
import Loader from "common/Loader/loader";
import { Close  } from "@mui/icons-material";
import UploadLoader from "common/UploadLoader/UploadLoader";
import { useDebounce } from "customHook/useDebounce";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

function Questionnaires() {
  const theme = useTheme();

  const { columns } = cageyTableData();
  const [isAdd, setIsAdd] = useState(false);
  const [categoryData, SetCategotyData] = useState([]);
  const [editData, setEditData] = useState({});
  const [data, setData] = useState({
    topic_id: "",
    regional_relevance: "All",
    page_no: "1",
    search: "",
  });
  const [questionList, setQuestionList] = useState([]);
  const [isEditCountries, setIsEditCountries] = useState(false);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [count, setCount] = useState([0]);
  const [url, setUrl] = useState();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [viewTopic, setViewTopic] = useState(false);
  const [topics, setTopics] = useState([]);
  const [personName, setPersonName] = useState({});
  const [loading, setLoading] = useState(false);
  const { encryptData, decryptData } = useEncryption();
  const [uploadLoading, setUploadLoading] = useState(false);
  const [debounced] = useDebounce(data.search, 500);
  const [searchApi, setSearchApi] = useState(false);


  const getTopic = async (dataFilter) => {
    const formData = new FormData();
    formData.append("data", encryptData(JSON.stringify(dataFilter)));
    await axiosInstanceAuth
      .post(`/admin/topics/get`, formData)
      .then((res) => {
        const decryptedData = decryptData(res.data.data);
        if (res.data.status) {
          const data = decryptedData;
          setTopics(data);
        } else {
          toast.error(res.data?.message);
          setTopics([]);
          if (!localStorage.getItem("token")) {
            navigate("/sign-in");
          }
        }
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  const onEditContactInfo = (event, data) => {
    viewDataEdit(data.id, "edit");
  };

  const removeRedEyeIcon = (event, data) => {
    viewDataEdit(data.id, "view");
  };

  const viewDataEdit = async (id, type) => {
    await axiosInstanceAuth
      .get(`admin/questionnaires/view/${id}`)
      .then((res) => {
        const decryptedData = decryptData(res.data.data);
        if (res.data.status) {
          setEditData(decryptedData);
          if (type === "edit") {
            setIsEditCountries(true);
          } else {
            setViewTopic(true);
          }
        } else {
          toast.error(res.data.message);
          if (decryptedData.data.sessionExpired) {
            localStorage.clear();
          }
        }
      })
      .catch((err) => {
        toast.error("Error");
      });
  };

  const onDeleteList = (event, data) => {
    setEditData(data);
    setIsDeleteModal(true);
  };

  const addFormat = () => {
    setIsAdd(true);
  };

  const onConfirmClose = () => {
    setIsEditCountries(false);
    onSearChrist({
      topic_id: data.topic_id.toString(),
      page_no: data.topic_id.length > 0 ? "1" : page.toString(),
      search: data.search,
    });

  };
  const handleChangeCountries = (event, value) => {
    if (value) {
      setPersonName(value);
      onSearChrist({
        topic_id: value.id.toString(),
        page_no: "1",
        search: data.search,
      });
      setData({
        ...data,
        topic_id: value.id.toString(),
      });
    }
  };



  // onChange
  const handleChange = (event) => {
    const { name, value } = event.target;
    setData({
      ...data,
      [name]: value,
    });
    setPage(1)
    setSearchApi(true)
  };

  useEffect(() => {
    const value = debounced.trim()
    if (searchApi === true) {
      onSearChrist({
        search: value,
        page_no: "1",
      });
    } else {
      onSearChrist({
        topic_id: "",
        page_no: page.toString(),
        search: "",
      }, true);
      getTopic({
        access: "All",
        countries: "",
        page_no: "",
      });

    }

  }, [debounced]);

  const onSearChrist = async (dataFilter, type) => {
    const formData = new FormData();
    formData.append("data", encryptData(JSON.stringify(dataFilter)));
    setLoading(type === true ? true : false);
    await axiosInstanceAuth
      .post(`/admin/questionnaires/get`, formData)
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
                    <Avatar
                      src={`${d?.icon === undefined
                        ? d?.question_image
                        : "/broken-image.jpg"
                        }`}
                    />
                  </MDTypography>
                </MDBox>
              ),
              topic: (
                <MDBox lineHeight={1}>
                  <Tooltip title={d?.topic_list?.replaceAll(";", " , ")}>
                    <MDTypography
                      display="block"
                      variant="button"
                      fontWeight="medium"
                    >
                      {d?.topic_list?.slice(0, 50).replaceAll(";", " , ")}
                      {d?.topic_list?.length > 50 && "..."}{" "}
                    </MDTypography>
                  </Tooltip>
                </MDBox>
              ),
              question: (
                <MDBox lineHeight={1}>
                  <Tooltip title={d?.question}>
                    <MDTypography
                      display="block"
                      variant="button"
                      fontWeight="medium"
                      className="description_title"
                    >
                      {d?.question}
                      {/* {d?.question?.slice(0, 100)}
                      {d?.question?.length > 100 && "..."}{" "} */}
                    </MDTypography>
                  </Tooltip>
                </MDBox>
              ),
              regional_relevance: (
                <MDBox lineHeight={1}>
                  <MDTypography
                    display="block"
                    variant="button"
                    fontWeight="medium"
                  >
                    {d.regional_relevance}{" "}
                  </MDTypography>
                </MDBox>
              ),
              difficulty_level: (
                <MDBox lineHeight={1}>
                  <MDTypography
                    display="block"
                    variant="button"
                    fontWeight="medium"
                  >
                    {d?.difficulty_level}{" "}
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
                    sx={{ border: 1, margin: "0px 10px 0px 0px", }}
                    disableRipple
                    // color="action"
                    onClick={(e) => onEditContactInfo(e, d)}
                  >
                    <Icon>edit</Icon>
                  </IconButton>
                  <IconButton
                    size="small"
                    disableRipple
                    color="action"
                    sx={{
                      margin: "0px 10px 0px 0px",
                      border: 1,
                    }}
                    onClick={(e) => removeRedEyeIcon(e, d)}
                  >
                    <RemoveRedEyeIcon />
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
          setQuestionList(temp);
          setLoading(false);
        } else {
          toast.error(res.data?.message);
          setQuestionList([]);
          setLoading(false);
          if (!localStorage.getItem("token")) {
            navigate("/sign-in");
          }
        }
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  // delete category info
  const onDeleteInfoData = async () => {
    await axiosInstanceAuth
      .delete(`admin/questionnaires/delete/${editData.id}`)
      .then((res) => {
        const decryptedData = decryptData(res.data);
        if (res.data.status) {
          setIsDeleteModal(false);
          const prevPage = questionList.length === 1 ? page - 1 : page.toString()
          onSearChrist({
            topic_id: data.topic_id.toString(),
            page_no: data.topic_id.length > 0 ? "1" : prevPage.toString(),
            search: data.search,
          });
          setPage(questionList.length === 1 ? page - 1 : page)
          toast.success(res.data.message);
        } else {
          toast.error(res.data.message);
          if (decryptedData?.data?.sessionExpired) {
            localStorage.clear();
          }
        }
      })
      .catch((err) => {
        toast.error(err);
      });
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

  const handleLogoChange = (e) => {
    e.preventDefault();
    let file = e.target.files[0];
    let reader = new FileReader();
    reader.onloadend = () => {
      // setFiles(file)
    };
    reader.readAsDataURL(file);
    fileUpload(file);
  };

  const fileUpload = async (data) => {
    setUploadLoading(true)
    const formData = new FormData();
    formData.append("file", data);
    await axiosInstanceAuth
      .post(`/admin/questionnaires/upload-bulk-data`, formData)
      .then((res) => {
        setUploadLoading(false)
        const decryptedData = decryptData(res.data);
        if (res.data.status) {
          toast.success(res.data.message);
          onSearChrist({
            topic_id: "",
            page_no: page.toString(),
            search: "",
          });
        } else {
          toast.error(res.data.message);
          if (!localStorage.getItem("token")) {
            navigate("/sign-in");
          }
        }
      })
      .catch((err) => {
        toast.error("Error");
      });
  };
  const clearAuto = () => {
    setPersonName({});
    onSearChrist({
      topic_id: "",
      page_no: "1",
      search: data.search,
    });
    setData({
      ...data,
      topic_id: "",
    });
    setPage(1)
  };

  const onPagination = (event, value) => {

    setPage(value);
    onSearChrist({
      topic_id: personName?.id,
      page_no: value.toString(),
      search: data.search,
    });
    setData({
      topic_id: personName?.id,
      page_no: value.toString(),
      search: data.search,
    });
    setPage(value);
  };



  const clear = <Close fontSize="small" onClick={clearAuto} />;


  return (
    <DashboardLayout>
      
      <MDBox className="dashboard_wrapper">
        {
          loading === true ? <Loader /> : (<>
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
                            href={`${process.env.REACT_APP_BASE_DEV_URL}admin/questionnaires/download-data`}
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
                        <input
                          id="input-file"
                          type="file"
                          accept=".xlsx"
                          onChange={handleLogoChange}
                          onClick={(event) => (event.target.value = null)}
                        />
                      </div>
                    </div>
                    <div>
                      <button className="download-file-button ">
                        <i className="fa fa-download"></i>&nbsp;&nbsp;
                        <a
                          href={`${process.env.REACT_APP_BASE_DEV_URL}admin/questionnaires/download-sample-file`}
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
                      borderRadius="lg"
                      coloredShadow="info"
                    >
                      <div className="header-topic">
                        <Grid container spacing={6}>
                          <Grid item xs={3}>
                            <MDBox >
                              <FormControl sx={{ width: "100%" }}>
                                <Autocomplete
                                  className="backgroundColor-autocomplete"
                                  id="multiple-limit-tags"
                                  options={topics}
                                  clearIcon={clear}
                                  onChange={handleChangeCountries}
                                  getOptionLabel={(option) => option.name}
                                  renderInput={(params) => (
                                    <TextField {...params} label="Topic" />
                                  )}
                                  sx={{ height: "40px" }}
                                />
                              </FormControl>
                            </MDBox>
                          </Grid>
                          <Grid item xs={3}>
                            <MDBox>
                              <FormControl sx={{ width: "100%" }}>
                                <TextField
                                  onChange={handleChange}
                                  value={data.search}
                                  name="search"
                                  id="demo-simple-select-label"
                                  label="Search"
                                  placeholder=""
                                  autoComplete="off"
                                />
                              </FormControl>
                            </MDBox>
                          </Grid>
                        </Grid>
                      </div>

                      <Button
                        variant="contained"
                        onClick={addFormat}
                        color="success"
                        className="button"
                        sx={{
                          marginRight: "15px",
                          padding: "0px 35px",
                        }}
                        startIcon={<AddCircleIcon />}
                      >
                        Add Question
                      </Button>
                    </MDBox>

                    <MDBox pt={3}>
                      {uploadLoading ? (
                        < UploadLoader />
                      ) :
                        <DataTable
                          table={{ columns, rows: questionList }}
                          isSorted={false}
                          entriesPerPage={false}
                          showTotalEntries={false}
                          noEndBorder
                          PaginationCustom={count / 10}
                        />
                      }
                      <MDBox p={2}>
                        <Pagination
                          color="info"
                          count={count}
                          page={page}
                          onChange={onPagination}
                        />
                      </MDBox>
                    </MDBox>
                  </Card>
                </Grid>
              </Grid>
            </MDBox>
          </>)
        }
      </MDBox>


      {/* Delete menu */}
      {isDeleteModal && (
        <Modal
          open={isDeleteModal}
          onClose={() => setIsDeleteModal(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={modalStyleDelete}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Delete Question
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Are you sure you want to  delete  this question ?
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
                onClick={() => setIsDeleteModal(false)}
                variant="outlined"
              >
                No
              </Button>
            </MDBox>
          </Box>
        </Modal>
      )}

      {/* *** add Question  Modal *** */}

      {isAdd && (
        <AddQuestion
          open={isAdd}
          onClose={() => setIsAdd(false)}
          onConfirmClose={onConfirmClose}
          categoryData={categoryData}
          topics={topics}
        />
      )}
      {/* *** add EditQuestion   Modal *** */}
      {isEditCountries && (
        <EditQuestion
          open={isEditCountries}
          onClose={() => setIsEditCountries(false)}
          onConfirmClose={onConfirmClose}
          editData={editData}
          url={url}
          categoryData={categoryData}
          topics={topics}

        />
      )}
      {/* *** add viewQuestion   Modal *** */}
      {viewTopic && (
        <EditQuestion
          open={viewTopic}
          onClose={() => setViewTopic(false)}
          flag={true}
          onConfirmClose={onConfirmClose}
          editData={editData}
          url={url}
          categoryData={categoryData}
          topics={topics}
        />
      )}
      <Footer />
    </DashboardLayout>
  );
}

export default Questionnaires;
