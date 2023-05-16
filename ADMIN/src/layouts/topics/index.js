import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import "./index.css";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import cageyTableData from "layouts/topics/data/topicTableData";
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
  InputLabel,
  MenuItem,
  Modal,
  Pagination,
  Select,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import SearchIcon from "@mui/icons-material/Search";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import EditTopic from "./modal/EditTopic";
import AddTopics from "./modal/addTopics";
import { useTheme } from "@mui/material/styles";
import MDButton from "components/MDButton";
import Loader from "common/Loader/loader";
import UploadLoader from "common/UploadLoader/UploadLoader";
import { Close } from "@mui/icons-material";
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

function Topics() {
  const theme = useTheme();

  const { columns } = cageyTableData();
  const [isAdd, setIsAdd] = useState(false);
  const [categoryData, SetCategotyData] = useState([]);
  const [editData, setEditData] = useState({});
  const [data, setData] = useState({
    access: "All",
    regional_relevance: "All",
    page_no: "1",
    category: "",
    search: "",
  });
  const [topicList, setTopicList] = useState([]);
  const [isEditCountries, setIsEditCountries] = useState(false);
  const [url, setUrl] = useState();
  const navigate = useNavigate();
  const [viewTopic, setViewTopic] = useState(false);
  const [oldDataSource, setOldDataSource] = useState([]);
  const [newDataSource, setNewDataSource] = useState([]);
  const { encryptData, decryptData } = useEncryption();
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [country, setCountry] = useState([]);
  const [countries, setCountries] = useState([]);
  const [personName, setPersonName] = useState([]);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [count, setCount] = useState([0]);
  const [page, setPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState({});
  const [categorydata, setCategorydata] = useState({ title: "", id: "" });
  const [loading, setLoading] = useState(false);
  const [debounced] = useDebounce(data.search, 500);
  const [searchApi, setSearchApi] = useState(false);

  const onPagination = (event, value) => {
    setPage(value);
    onSearChrist({
      access: "All",
      regional_relevance: "All",
      countries:
        data.regional_relevance === "Local"
          ? JSON.stringify(personName.map((d) => d.id))
          : [],
      category_id: categorydata ? categorydata.id : "",
      page_no: value.toString(),
      search: data.search,
    });
    setPage(value);
  };

  const getViewFileFormat = async () => {
    await axiosInstanceAuth
      .get("/admin/categories/get-all")
      .then((res) => {
        const decryptedData = decryptData(res.data.data);
        setUrl(res.data.filePath);
        if (res.data.status) {
          const data = decryptedData;
          SetCategotyData(data);
        } else {
          toast.error(res.data?.message);
          SetCategotyData([]);
          if (res.data.isAuth === false) {
            localStorage.clear();
            navigate("/sign-in");
          }else if (!localStorage.getItem("token")){
            navigate("/sign-in");
          }
        }
      })
      .catch((err) => {
        SetCategotyData([]);
        toast.error(err);
      });
  };

  const getCountries = async () => {
    await axiosInstanceAuth
      .get("admin/countries/get")
      .then((res) => {
        const data = decryptData(res.data.data);
        if (res.data.status) {
          setCountries(data.data);
        } else {
          setCountries([]);
          toast.error(res?.data?.message);
          if (res.data.isAuth === false) {
            localStorage.clear();
            navigate("/sign-in");
          }else if (!localStorage.getItem("token")){
            navigate("/sign-in");
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const countryside = JSON.stringify(country.map((d) => d.id));


  const addFormat = () => {
    setIsAdd(true);
  };

  const onConfirmClose = () => {
    setIsEditCountries(false);
    onSearChrist({
      access: "All",
      regional_relevance: "All",
      countries: JSON.stringify(personName.map((d) => d.id)),
      category_id: categorydata.id,
      page_no: Object.keys(categorydata).length > 0 ? "1" : page.toString(),
      search: data.search,
    });
  };

  const onEditContactInfo = (event, data) => {
    viewDataEdit(data.id, "edit");
  };

  const removeRedEyeIcon = (event, data) => {
    viewDataEdit(data.id, "view");
  };

  const settingsTopic = (e, data) => {
    navigate("/match-fees-rewards", {
      state: { data, back: true },
    });
  };

  const onDeleteList = (event, data) => {
    setEditData(data);
    setIsDeleteModal(true);
  };

  const viewDataEdit = async (id, type) => {
    await axiosInstanceAuth
      .get(`admin/topics/view/${id}`)
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
          setEditData({});
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

  // onChange
  const handleChange = (event) => {
    const { name, value } = event.target;
    setData({
      ...data,
      [name]: value,
    });
    if (name === "Local") {
      onSearChrist({
        access: name === "access" ? value : data.access,
        regional_relevance:   name === "regional_relevance" ? value : data.regional_relevance,
        countries: name === "countries" ? value : JSON.stringify(personName.map((d) => d.id)),   
        category_id: categorydata  ? name === "category" ? value : categoryFilter.id  : "",
        page_no: page.toString(),
        search: data.search,
      });
    } else {
      onSearChrist({
        access: name === "access" ? value : data.access,
        regional_relevance:
          name === "regional_relevance" ? value : data.regional_relevance,
        countries: [],
        category_id: categorydata
          ? name === "category"
            ? value
            : categoryFilter.id
          : "",
        page_no: page.toString(),
        search: data.search,
      });
    }
    setCountry([]);
  };

  const handleChangeCountries = (event, value) => {
    setCountry([]);
    setPersonName(value);
  };

  const handleChangecategoryData = (event, value) => {
    setCategoryFilter(value);
    setCategorydata(value);
    onSearChrist({
      access: data.access,
      regional_relevance: data.regional_relevance,
      countries:  data.regional_relevance === "Local" ? JSON.stringify(personName.map((d) => d.id))   : [],
      category_id: value ?  value.id : "",
      page_no: "1",
      search: data.search,
    });
  };

  const searchButton = () => {
    onSearChrist({
      access: data.access,
      regional_relevance: data.regional_relevance,
      countries: JSON.stringify(personName.map((d) => d.id)),
      category_id: categorydata ? categorydata.id : "",
      page_no: page.toString(),
      search: data.search,
    });
  };

  const onSearChrist = async (dataFilter,type) => {
    if (data.access.length === 0) {
      toast.error("Please select access Type ");
    } else {
      setLoading(type === true ? true :false);
      const encryptedData = encryptData(JSON.stringify(dataFilter));
      await axiosInstanceAuth
        .post(`/admin/topics/get`, { data: encryptedData })
        .then((res) => {
          const decryptedData = decryptData(res.data.data);
          const data = decryptedData;
          const count = Math.ceil(res.data.count / 10);
          setCount(count);
          if (res.data.status) {
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
                        src={`${
                          d?.icon === undefined ? "/broken-image.jpg" : d.icon
                        }`}
                      />
                    </MDTypography>
                  </MDBox>
                ),
                name: (
                  <MDBox lineHeight={1}>
                    <MDTypography
                      display="block"
                      variant="button"
                      fontWeight="medium"
                    >
                      {d?.name?.slice(0, 25)}
                      {d?.name?.length > 25 && "..."}{" "}
                    </MDTypography>
                  </MDBox>
                ),
                category: (
                  <MDBox lineHeight={1}>
                    <Tooltip title={d?.category_list?.replaceAll(";", " , ")}>
                      <MDTypography
                        display="block"
                        variant="button"
                        fontWeight="medium"
                        className="description_title-topic"
                      >
                   
                        {d?.category_list?.replaceAll(";", " , ")}
                      </MDTypography>
                    </Tooltip>
                  </MDBox>
                ),
                access: (
                  <MDBox lineHeight={1}>
                    <MDTypography
                      display="block"
                      variant="button"
                      fontWeight="medium"
                    >
                      {d?.access }{" "}
                    </MDTypography>
                  </MDBox>
                ),
                regional_relevance: (
                  <MDBox lineHeight={1}>
                    <MDTypography
                      display="block"
                      variant="button"
                      fontWeight="medium"
                    >
                      {d?.regional_relevance}{" "}
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
                      onClick={(e) => onEditContactInfo(e, d)}
                    >
                      <Icon>edit</Icon>
                    </IconButton>
                    <IconButton
                      size="small"
                      disableRipple
                      color="action"
                      sx={{ border: 1, margin: "0px 10px 0px 0px" }}
                      onClick={(e) => removeRedEyeIcon(e, d)}
                    >
                      <RemoveRedEyeIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      disableRipple
                      color="error"
                      sx={{
                        border: 1,
                        margin: "0px 10px 0px 0px",
                      }}
                      onClick={(e) => onDeleteList(e, d)}
                    >
                      <Icon>delete_forever</Icon>
                    </IconButton>
                    <IconButton
                      size="small"
                      disableRipple
                      color="action"
                      sx={{
                        border: 1,
                        margin: "5px 0px",
                      }}
                      onClick={(e) => settingsTopic(e, d)}
                    >
                      <Icon>settings</Icon>
                    </IconButton>
                  </>
                ),
              });
            });
            setLoading(false)
            setTopicList(temp);
            setOldDataSource(temp);
            setNewDataSource(temp);
          } else {
            setTopicList([]);
            setLoading(false)
            setOldDataSource([]);
            setNewDataSource([]);
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
          toast.error(err);
        });
    }
  };

  // header search function
  const requestSearch = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
    if (name === "access") {
      if (value !== "All") {
        const searchData = oldDataSource.filter((i) => {
          return i.access.props.children.props.children[0]
            .toLowerCase()
            .includes(e.target.value.toLowerCase());
        });
        setTopicList(searchData);
      } else if (value === "All") {
        setTopicList(newDataSource);
      } else {
        setTopicList(oldDataSource);
      }
    } else if (name === "regional_relevance") {
      if (value !== "All") {
        const searchData = oldDataSource.filter((i) => {
          return i.regional_relevance.props.children.props.children[0]
            .toLowerCase()
            .includes(e.target.value.toLowerCase());
        });
        setTopicList(searchData);
      } else if (value === "All") {
        setTopicList(newDataSource);
      } else {
        setTopicList(oldDataSource);
      }
    } else {
      if (value !== "All") {
        const searchData = oldDataSource.filter((i) => {
          return i.name.props.children.props.children[0]
            .toLowerCase()
            .includes(e.target.value.toLowerCase());
        });
        setTopicList(searchData);
      } else {
        setTopicList(oldDataSource);
      }
    }
  };

  const searchTabel = (event) => {
    const { name, value } = event.target;
    setData({
      ...data,
      [name]: value,
    });
    setPage(1);
    setSearchApi(true)
  };


  useEffect(() => {
    const  value = debounced.trim()
    if(searchApi === true ){
      onSearChrist({
        access: data.access,
        regional_relevance: data.regional_relevance,
        countries: JSON.stringify(personName.map((d) => d.id)),
        category_id: categorydata ? categorydata.id : "",
        page_no: "1",
        search: value,
      });
    }else{
      getViewFileFormat();
      getCountries();
      onSearChrist({
        access: "All",
        regional_relevance: "All",
        countries: JSON.stringify(personName.map((d) => d.id)),
        category_id: categoryFilter.id,
        page_no: page.toString(),
        search: data.search,
      },true);
      if (!localStorage.getItem("token")) {
        navigate("/sign-in");
      }
    }
   
  }, [debounced]);

  // delete category info
  const onDeleteInfoData = async () => {
    await axiosInstanceAuth
      .delete(`admin/topics/delete/${editData.id}`)
      .then((res) => {
        const decryptedData = decryptData(res.data);
        if (res.data.status) {
          setIsDeleteModal(false);
          const  prevPage = topicList.length  === 1 ? page - 1 :  page.toString()
          onSearChrist({
            access: "All",
            regional_relevance: "All",
            countries: countryside,
            page_no: prevPage.toString(),
            search: data.search,
          });
          setPage(topicList.length  === 1 ? page -1 : page)
          toast.success(res.data.message);
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
    reader.onloadend = () => {};
    reader.readAsDataURL(file);
    fileUpload(file);
  };

  const fileUpload = async (data) => {
    setUploadLoading(true);
    const formData = new FormData();
    formData.append("file", data);
    await axiosInstanceAuth
      .post(`/admin/topics/upload-bulk-data`, formData)
      .then((res) => {
        setUploadLoading(false);
        if (res.data.status) {
          toast.success(res.data.message);
          onSearChrist({
            access: "All",
            regional_relevance: "All",
            countries: JSON.stringify(personName.map((d) => d.id)),
            category_id: data.category,
            page_no: page.toString(),
            search: data.search,
          });
        } else {
          toast.error(res.data.message);
          if (!localStorage.getItem("token")) {
            navigate("/sign-in");
          }
        }
      })
      .catch((err) => {
        toast.error("Error", err);
      });
  };

  const clearAuto = () => {
    setCategorydata({ title: "", id: "" });
    onSearChrist({
      access: data.access,
      regional_relevance: data.regional_relevance,
      countries: data.regional_relevance === "Local" ? JSON.stringify(personName.map((d) => d.id)) : [],
      category_id: "",
      page_no: "1",
      search: data.search,
    });
    setData({
      ...data,
      topic_id: "",
    });
    setCategorydata({ title: "", id: "" });
    setPage(1);
  };

  const clear = <Close fontSize="small" onClick={clearAuto} />;

  return (
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
                    <button className="download-file-button ">
                      <i className="fa fa-download"></i>&nbsp;&nbsp;
                      <a
                        href={`${process.env.REACT_APP_BASE_DEV_URL}admin/topics/download-data`}
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
                  <button className="download-file-button">
                    <i className="fa fa-download"></i>&nbsp;&nbsp;
                    <a
                      href={`${process.env.REACT_APP_BASE_DEV_URL}admin/topics/download-sample-file`}
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
                    <Grid container columnSpacing={{ xs: 1, sm: 1, md: 2 }}>
                      {/* Access */}
                      <Grid item xs={1.5}>
                        <MDBox sx={{ height: "42.125px" }}>
                          <FormControl sx={{ width: "100%" }}>
                            <InputLabel id="demo-simple-select-label">
                              Access
                            </InputLabel>
                            <Select
                              sx={{ height: "42.125px" }}
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              label="Access"
                              name="access"
                              value={data.access}
                              onChange={handleChange}
                            >
                              <MenuItem value="All">All</MenuItem>
                              <MenuItem value="Open">Open</MenuItem>
                              <MenuItem value="Close">Closed</MenuItem>
                            </Select>
                          </FormControl>
                        </MDBox>
                      </Grid>
                      {/* Regional Relevance */}
                      <Grid item xs={1.5}>
                        <MDBox sx={{ height: "42.125px" }}>
                          <FormControl sx={{ width: "100%" }}>
                            <InputLabel id="demo-simple-select-label">
                              Regional Relevance
                            </InputLabel>
                            <Select
                              sx={{ height: "42.125px" }}
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              name="regional_relevance"
                              value={data.regional_relevance}
                              label="Regional Relevance"
                              fullWidth
                              onChange={handleChange}
                            >
                              <MenuItem value="All">All</MenuItem>
                              <MenuItem value="Local">Local</MenuItem>
                              <MenuItem value="Global">Global</MenuItem>
                            </Select>
                          </FormControl>
                        </MDBox>
                      </Grid>
                      {/* Search */}
                      <Grid item xs={2}>
                        <MDBox sx={{ height: "38.125px" }}>
                          <FormControl sx={{ width: "100%" }}>
                            <TextField
                              sx={{ height: "38.125px" }}
                              onChange={searchTabel}
                              name="search"
                              value={data.search}
                              id="demo-simple-select-label"
                              label="Search"
                              placeholder=""
                            />
                          </FormControl>
                        </MDBox>
                      </Grid>
                      {/* Select Category */}
                      <Grid item xs={2}>
                        <MDBox>
                          <FormControl sx={{ width: "100%" }}>
                            <Autocomplete
                              className="backgroundColor-autocomplete"
                              id="multiple-limit-tags"
                              options={categoryData}
                              clearIcon={clear}
                              value={categorydata}
                              onChange={handleChangecategoryData}
                              getOptionLabel={(option) => option.title}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Select Category"
                                />
                              )}
                              sx={{ height: "40px" }}
                            />
                          </FormControl>
                        </MDBox>
                      </Grid>
                      {/* Countries */}
                      {data.regional_relevance === "Local" && (
                        <>
                          <Grid item xs={3}>
                            <MDBox>
                              <FormControl sx={{ width: "100%" }}>
                                <div className="background-color">
                                  <Autocomplete
                                    multiple
                                    className="backgroundColor-autocomplete"
                                    limitTags={1}
                                    id="multiple-limit-tags"
                                    options={countries}
                                    onChange={handleChangeCountries}
                                    getOptionLabel={(option) => option.name}
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        label="Countries"
                                      />
                                    )}
                                    sx={{
                                      // width: "270px",
                                      height: "40px",
                                      backgroundColor: "#fff",
                                    }}
                                  />
                                </div>
                              </FormControl>
                            </MDBox>
                          </Grid>

                          {/* Search button */}
                          <Grid xs={2} item>
                            <MDBox>
                              <MDButton
                                onClick={searchButton}
                                variant="contained"
                                color="info"
                                startIcon={<SearchIcon />}
                              >
                                Search
                              </MDButton>
                            </MDBox>
                          </Grid>
                        </>
                      )}{" "}
                    </Grid>
                  </div>

                  <Button
                    variant="contained"
                    onClick={addFormat}
                    color="success"
                    sx={{
                      padding: "0px 35px",
                    }}
                    className="button"
                    startIcon={<AddCircleIcon />}
                  >
                    Add Topics
                  </Button>
                </MDBox>
                <MDBox pt={3}>
                  {uploadLoading ? (
                    <UploadLoader />
                  ) : (
                    <DataTable
                      table={{ columns, rows: topicList }}
                      isSorted={false}
                      entriesPerPage={false}
                      showTotalEntries={false}
                      noEndBorder
                      
                    />
                  )}
                </MDBox>
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

      {/* *** add topic Modal *** */}

      {isAdd && (
        <AddTopics
          open={isAdd}
          onClose={() => setIsAdd(false)}
          onConfirmClose={onConfirmClose}
          categoryData={categoryData}
        />
      )}
      {/* *** add EditTopic  Modal *** */}
      {isEditCountries && (
        <EditTopic
          open={isEditCountries}
          onClose={() => setIsEditCountries(false)}
          getViewFileFormat={getViewFileFormat}
          onConfirmClose={onConfirmClose}
          editData={editData}
          url={url}
          categoryData={categoryData}
          SetCategotyData={SetCategotyData}
        />
      )}
      {/* *** add viewTopic  Modal *** */}
      {viewTopic && (
        <EditTopic
          open={viewTopic}
          onClose={() => setViewTopic(false)}
          flag={true}
          getViewFileFormat={getViewFileFormat}
          onConfirmClose={onConfirmClose}
          editData={editData}
          url={url}
          categoryData={categoryData}
        />
      )}

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
              Delete Topic
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Are you  sure you  want to delete this topic ?
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
      <Footer />
    </DashboardLayout>
  );
}

export default Topics;
