// css file
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
  Autocomplete,
  Avatar,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Pagination,
  Select,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { toast } from "react-toastify";
import MDButton from "components/MDButton";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import AddBotModal from "./modal/AddModal";
import { useDebounce } from "customHook/useDebounce";
import Loader from "common/Loader/loader";

function Players() {
  const [dataSource, setDataSource] = useState([]);
  const [dataCheng, setDataCheng] = useState();
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [editData, setEditData] = useState({});
  const [isEditModal, setIsEditModal] = useState(false);
  const [switchIs, setswitchIs] = useState(false);
  const [addBot, satAddBot] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState({
    search: "",
    page_no: "1",
    is_bot: "0",
  });
  const [count, setCount] = useState([0]);
  const [page, setPage] = useState(1);
  const [type, setType] = useState("");
  const { encryptData, decryptData } = useEncryption();
  const navigate = useNavigate();
  const [level, setLevel] = useState([]);
  const [levelId, setLevelId] = useState({ options: "", id: "" });
  const [debounced] = useDebounce(fields.search, 500);
  const [searchApi, setSearchApi] = useState(false);

  const PlayersColumns = [
    {
      Header: "id",
      accessor: "id",
      align: "left",
      width: "5%",
    },
    {
      Header: "Avatar",
      accessor: "avatar",
      align: "left",
      width: "5%",
    },
    {
      Header: "user name",
      accessor: "user_name",
      align: "left",
    },
    {
      Header: "email",
      accessor: "email",
      align: "left",
    },
    {
      Header: "lt",
      accessor: "lt",
      align: "left",
    },
    {
      Header: "xp",
      accessor: "xp",
      align: "left",
    },
    {
      Header: "lp",
      accessor: "lp",
      align: "left",
    },
    {
      Header: "sign up date",
      accessor: "sign_up_date",
      align: "left",
    },
    {
      Header: "Block",
      accessor: "Block",
      align: "left",
    },
    {
      Header: "verify",
      accessor: "is_email_verify",
      align: "left",
    },
  ];

  const onPagination = (event, value) => {
    setPage(value);
    getViewFileFormat({
      search: "",
      page_no: value.toString(),
      is_bot: fields.is_bot,
    });
  };

  // delete category info
  const onDeleteInfoData = async () => {
    await axiosInstanceAuth
      .delete(`admin/players/delete/${editData.id}`)
      .then((res) => {
        if (res.data.status) {
          onCloseDeleteModal();
          toast.success(res.data.message);
          getViewFileFormat({
            page_no: page.toString(),
            search: fields.search,
            is_bot: fields.is_bot,
          });
        } else {
          toast.error(res.data.message);
          if (!localStorage.getItem("token")) {
            navigate("/sign-in");
          }
        }
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  // onChange
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFields({
      ...fields,
      [name]: value,
    });
    if (name === "is_bot" && value === "0") {
      getViewFileFormat({
        search: fields.search,
        page_no: "1",
        is_bot: name === "is_bot" ? value : fields.is_bot,
      });
      setLevelId({ options: "", id: "" });
    } else {
      getViewFileFormat({
        search: fields.search,
        page_no: "1",
        is_bot: name === "is_bot" ? value : fields.is_bot,
        level: levelId.id,
      });
    }
    setPage(1);
  };

  const handleChangeWait = (event) => {
    const { name, value } = event.target;
    setFields({
      ...fields,
      [name]: value,
    });
    setSearchApi(true);
    setPage(1);
  };

  useEffect(() => {
    const value = debounced.trim();
    if (searchApi === true) {
      getViewFileFormat({
        search: value,
        page_no: "1",
        is_bot: fields.is_bot,
        level: levelId.id,
      });
    } else {
      getViewFileFormat(fields, true);
      getCountries();
    }
  }, [debounced]);

  // Add category

  const onCloseDeleteModal = () => {
    setIsDeleteModal(false);
  };

  const onCloseEditModal = () => {};

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

  const isModal = (e, type) => {
    if (type === "Block") {
      setswitchIs(true);
    } else {
    }
    setType(type);
    setIsEditModal(true);
    setDataCheng(e);
  };

  const closeButton = () => {
    setIsEditModal(false);
  };

  const getViewFileFormat = async (data, type) => {
    setLoading(type === true ? true : false);
    const encryptedData = encryptData(JSON.stringify(data));
    await axiosInstanceAuth
      .post("/admin/players/get", { data: encryptedData })
      .then((res) => {
        const decryptedData = decryptData(res.data.data);
        if (res.data.status) {
          const count = Math.ceil(res.data.count / 10);
          setCount(count);
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
                    {i + 1}{" "}
                  </MDTypography>
                </MDBox>
              ),
              avatar: (
                <MDBox lineHeight={1}>
                  <MDTypography
                    display="block"
                    variant="button"
                    fontWeight="medium"
                  >
                    <Avatar
                      src={`${
                        d.avatar === undefined ? "/broken-image.jpg" : d.avatar
                      }`}
                    />
                  </MDTypography>
                </MDBox>
              ),
              user_name: (
                <MDBox lineHeight={1}>
                  <MDTypography
                    display="block"
                    variant="button"
                    fontWeight="medium"
                  >
                    {d.full_name === null ? d.user_name : d.full_name}
                  </MDTypography>
                </MDBox>
              ),
              email: (
                <MDBox lineHeight={1}>
                  <MDTypography
                    display="block"
                    variant="button"
                    fontWeight="medium"
                  >
                    {d?.email.slice(0, 120)}
                    {d?.email.length > 120 && "..."}{" "}
                  </MDTypography>
                </MDBox>
              ),
              lt: (
                <MDBox lineHeight={1}>
                  <MDTypography
                    display="block"
                    variant="button"
                    fontWeight="medium"
                  >
                    {d.lt}{" "}
                  </MDTypography>
                </MDBox>
              ),
              xp: (
                <MDBox lineHeight={1}>
                  <MDTypography
                    display="block"
                    variant="button"
                    fontWeight="medium"
                  >
                    {d.xp}{" "}
                  </MDTypography>
                </MDBox>
              ),
              lp: (
                <MDBox lineHeight={1}>
                  <MDTypography
                    display="block"
                    variant="button"
                    fontWeight="medium"
                  >
                    {d.lp}{" "}
                  </MDTypography>
                </MDBox>
              ),
              sign_up_date: (
                <MDBox lineHeight={1}>
                  <MDTypography
                    display="block"
                    variant="button"
                    fontWeight="medium"
                  >
                    {moment(d?.created_at).format("DD/MM/YYYY  H:mm")}
                  </MDTypography>
                </MDBox>
              ),
              is_email_verify: (
                <MDBox lineHeight={1}>
                  {d.is_email_verify === 1 ? (
                    <MDButton
                      variant="contained"
                      color="success"
                      onClick={(e) => isModal(d, "verify")}
                    >
                      YES
                    </MDButton>
                  ) : (
                    <MDButton
                      variant="contained"
                      color="error"
                      onClick={(e) => isModal(d, "verify")}
                    >
                      NO
                    </MDButton>
                  )}{" "}
                </MDBox>
              ),
              Block: (
                <>
                  <Switch
                    variant="button"
                    onClick={(e) => isModal(d, "Block")}
                    checked={d.user_block == "Yes" ? true : false}
                  />
                </>
              ),
            });
          });
          setLoading(false);
          setDataSource(temp);
        } else {
          setDataSource([]);
          setLoading(false);
          toast.error(res.data?.message);
          if (res.data.isAuth === false) {
            localStorage.clear();
            navigate("/sign-in");
          } else if (!localStorage.getItem("token")) {
            navigate("/sign-in");
          }
        }
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  const onChengInfoData = (d) => {
    if (type === "verify") {
      onChengData({
        user_id: dataCheng.id,
        email_verify: dataCheng.is_email_verify === 1 ? 0 : 1,
      });
    } else {
      onChengDataBlock({
        user_id: dataCheng.id,
        status: dataCheng.status === 1 ? 0 : 1,
      });
    }
  };

  const onChengData = async (data) => {
    const encryptedData = encryptData(JSON.stringify(data));
    await axiosInstanceAuth
      .post("/admin/players/verify", { data: encryptedData })
      .then((res) => {
        const decryptedData = decryptData(res.data.data);
        if (res.data.status) {
          setIsEditModal(false);
          getViewFileFormat({
            page_no: page.toString(),
            search: fields.search,
            is_bot: fields.is_bot,
          });
          toast.success(res.data.message);
        } else {
          toast.error(res.data?.message);
          setIsEditModal(false);
          if (!localStorage.getItem("token")) {
            navigate("/sign-in");
          }
        }
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  const onChengDataBlock = async (data) => {
    const encryptedData = encryptData(JSON.stringify(data));
    await axiosInstanceAuth
      .post("/admin/players/block", { data: encryptedData })
      .then((res) => {
        const decryptedData = decryptData(res.data.data);
        if (res.data.status) {
          setIsEditModal(false);
          getViewFileFormat({
            page_no: page.toString(),
            search: fields.search,
            is_bot: fields.is_bot,
          });

          toast.success(res.data.message);
        } else {
          toast.error(res.data?.message);
          setIsEditModal(false);
          if (!localStorage.getItem("token")) {
            navigate("/sign-in");
          }
        }
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  const addBotHeandel = () => {
    satAddBot(true);
  };
  const onConfirmClose = () => {
    satAddBot(false);
    getViewFileFormat({
      page_no: page.toString(),
      search: fields.search,
      is_bot: fields.is_bot,
    });
  };

  const getCountries = async (id) => {
    await axiosInstanceAuth
      .get(`admin/default-match-fees-rewards`)
      .then((res) => {
        const data = decryptData(res.data.data);
        if (res.data?.status) {
          setLevel(data);
        } else {
          toast.error(res?.data?.message);
          if (res.data.isAuth === false) {
            localStorage.clear();
            navigate("/sign-in");
          } else if (!localStorage.getItem("token")) {
            navigate("/sign-in");
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleChangemarchData = (event, value) => {
    setLevelId(value);
    getViewFileFormat({
      search: fields.search,
      page_no: "1",
      is_bot: fields.is_bot,
      level: value.id,
    });
  };

  return (
    <>
      <DashboardLayout>
        <MDBox className="dashboard_wrapper">
          {loading === true ? (
            <Loader />
          ) : (
            <>
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
                      <MDBox sx={{ marginRight: "15px" }}>
                        <div>
                          <button className="download-file-button">
                            <i className="fa fa-download"></i>&nbsp;&nbsp;
                            <a
                              href={`${process.env.REACT_APP_BASE_DEV_URL}admin/players/download-data`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Download Data
                            </a>
                          </button>
                        </div>
                      </MDBox>
                      <MDBox sx={{ marginRight: "15px" }}>
                        <button
                          className="download-file-button"
                          onClick={addBotHeandel}
                        >
                          Add Bot
                        </button>
                      </MDBox>
                    </MDBox>
                    <Card>
                      <MDBox
                        py={2}
                        px={2}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                        }}
                        variant="gradient"
                        borderRadius="lg"
                        coloredShadow="info"
                      >
                        <Grid container columnSpacing={{ xs: 1, sm: 1, md: 2 }}>
                          <Grid item xs={2}>
                            <MDBox>
                              <FormControl sx={{ width: "100%" }}>
                                <TextField
                                  onChange={handleChangeWait}
                                  value={fields.search}
                                  name="search"
                                  id="demo-simple-select-label"
                                  label="Search"
                                  placeholder=""
                                />
                              </FormControl>
                            </MDBox>
                          </Grid>
                          <Grid item xs={2}>
                            <MDBox>
                              <FormControl sx={{ width: "100%" }}>
                                <InputLabel>Players</InputLabel>
                                <Select
                                  sx={{ height: "43.125px" }}
                                  id="demo-simple-select"
                                  name="is_bot"
                                  value={fields.is_bot}
                                  label="Players"
                                  onChange={handleChange}
                                >
                                  <MenuItem value="0">Real Players</MenuItem>
                                  <MenuItem value="1">Bot Players</MenuItem>
                                </Select>
                              </FormControl>
                            </MDBox>
                          </Grid>
                          {fields.is_bot === "1" ? (
                            <Grid item xs={2}>
                              <MDBox>
                                <FormControl sx={{ width: "100%" }}>
                                  <Autocomplete
                                    className="backgroundColor-autocomplete"
                                    id="multiple-limit-tags"
                                    options={level}
                                    name="description"
                                    clearIcon={false}
                                    value={levelId}
                                    onChange={handleChangemarchData}
                                    getOptionLabel={(option) => option.options}
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        label="Select Level"
                                      />
                                    )}
                                  />
                                </FormControl>
                              </MDBox>
                            </Grid>
                          ) : null}
                        </Grid>
                      </MDBox>
                      <MDBox pt={3}>
                        <DataTable
                          table={{
                            columns: PlayersColumns,
                            rows: dataSource,
                          }}
                          isSorted={false}
                          entriesPerPage={false}
                          showTotalEntries={false}
                          noEndBorder
                          className={"table-padding"}
                          PaginationCustom={count / 10}
                        />
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
            </>
          )}
        </MDBox>

        {addBot && (
          <AddBotModal
            open={addBot}
            onClose={() => satAddBot(false)}
            onConfirmClose={onConfirmClose}
          />
        )}

        {isEditModal && (
          <Modal
            open={isEditModal}
            onClose={onCloseEditModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={modalStyleDelete}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                {type === "verify" ? (
                  <>
                    {" "}
                    {dataCheng.is_email_verify === 0
                      ? "Verify User "
                      : "  UnVerify User"}
                  </>
                ) : dataCheng.user_block === "Yes" ? (
                  "UnBlock"
                ) : (
                  "Block"
                )}{" "}
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                {type === "verify" ? (
                  <>
                    {dataCheng.is_email_verify === 0
                      ? "Are you sure want to verify the User ?"
                      : "Are you sure want to unVerify the User ?"}
                  </>
                ) : dataCheng.user_block === "Yes" ? (
                  "Are you sure you want to this un-Block ?"
                ) : (
                  "Are you sure you want to this Block ?"
                )}
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
                  onClick={onChengInfoData}
                  variant="contained"
                >
                  Yes
                </Button>
                <Button
                  sx={{ color: "#000" }}
                  onClick={() => closeButton()}
                  variant="outlined"
                >
                  No
                </Button>
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
                Delete Avatar
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                Are you sure want to delete User ?
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

        <Footer />
      </DashboardLayout>
    </>
  );
}

export default Players;
