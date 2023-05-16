import {
  Avatar,
  Box,
  Button,
  Card,
  FormControl,
  Grid,
  Icon,
  IconButton,
  Modal,
  Pagination,
  TextField,
  Typography,
} from "@mui/material";
import axiosInstanceAuth from "apiServices/axiosInstanceAuth";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import useEncryption from "customHook/useEncryption";
import Footer from "examples/Footer";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditConfirmation from "./EditConfirmation";
import EditCountriesModal from "./EditCountriesModal";
import EditRegionsModal from "./EditRegionsModal";
import { useNavigate } from "react-router-dom";
import Loader from "common/Loader/loader";
import Avatars from "layouts/avatars";
import MatchTokenExtra from "./MatchToken";
import { useDebounce } from "customHook/useDebounce";

const Settings = () => {
  const [countriesData, setCountriesData] = useState([]);
  const [regionsData, setRegionsData] = useState([]);
  const [isEditCountries, setIsEditCountries] = useState(false);
  const [isEditRegions, setIsEditRegions] = useState(false);
  const [isEditConfirmation, setIsEditConfirmation] = useState(false);
  const [editData, setEditData] = useState(null);
  const { encryptData, decryptData } = useEncryption();
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState([0]);
  const [page, setPage] = useState(1);
  const [Search, setSearch] = useState("");
  const [debounced] = useDebounce(Search, 500);
  const [searchApi, setSearchApi] = useState(false);

  const onPagination = (event, value) => {
    setPage(value);
    getCountries({ search: "", page_no: value.toString() });
    setPage(value);
  };

  const [type, setType] = useState();
  let navigate = useNavigate();

  const countriesColumns = [
    {
      Header: "id",
      accessor: "id",
      align: "left",
      width: "5%",
    },
    {
      Header: "flag",
      accessor: "flag",
      align: "left",
      width: "5%",
    },
    {
      Header: "name",
      accessor: "name",
      align: "left",
    },
    {
      Header: "action",
      accessor: "action",
      align: "left",
      width: "5%",
    },
  ];

  const regionsColumns = [
    {
      Header: "id",
      accessor: "id",
      align: "left",
      width: "5%",
    },
    {
      Header: "name",
      accessor: "name",
      align: "left",
    },
    {
      Header: "action",
      accessor: "action",
      align: "left",
      width: "5%",
    },
  ];
  const authExpired = "Something is wrong in Authentication.Please try again.";

  // *** countries ***
  const getCountries = async (data, type) => {
    setLoading(type === true ? true : false);
    const encryptedData = encryptData(JSON.stringify(data));
    await axiosInstanceAuth
      .post("admin/countries/get-list", { data: encryptedData })
      .then((res) => {
        const data = decryptData(res.data.data);
        const count = Math.ceil(res.data.count / 10);
        setCount(count);
        if (data?.status) {
          const temp = [];
          data?.data?.map((d, i) => {
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
              name: (
                <MDBox lineHeight={1}>
                  <MDTypography
                    display="block"
                    variant="button"
                    fontWeight="medium"
                  >
                    {d?.name}{" "}
                  </MDTypography>
                </MDBox>
              ),
              flag: (
                <MDBox lineHeight={1}>
                  <MDTypography
                    display="block"
                    variant="button"
                    fontWeight="medium"
                  >
                    <Avatar
                      src={`${
                        d?.flag === undefined ? "/broken-image.jpg" : d?.flag
                      }`}
                    />
                  </MDTypography>
                </MDBox>
              ),
              country_code: (
                <MDBox lineHeight={1}>
                  <MDTypography
                    display="block"
                    variant="button"
                    fontWeight="medium"
                  >
                    {d?.country_code}{" "}
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
                    onClick={(e) => onEditCountries(e, d)}
                  >
                    <Icon>edit</Icon>
                  </IconButton>
                  <IconButton
                    size="small"
                    disableRipple
                    color="error"
                    sx={{ border: 1 }}
                    onClick={(e) => onDeleteList("countries", d)}
                  >
                    <Icon>delete_forever</Icon>
                  </IconButton>
                </>
              ),
            });
          });
          setCountriesData(temp);
          setLoading(false);
        } else {
          setCountriesData([]);
          setLoading(false);
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

  const onEditCountries = (event, data) => {
    setEditData(data);
    setIsEditCountries(true);
  };

  const onEditModal = () => {
    setIsEditConfirmation(false);
    // setIsEditCountries(true)
  };

  const onCloseCountriesModal = () => {
    setEditData(null);
    setIsEditCountries(false);
    getCountries({ search: Search, page_no: page.toString() });
    // setSearch("")
  };

  // *** regions ***

  const getRegions = async (id) => {
    await axiosInstanceAuth
      .get(`admin/difficulty_levels/get`)
      .then((res) => {
        const data = decryptData(res.data.data);
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
                    {i + 1}{" "}
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
                    {d?.name}{" "}
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
                    onClick={(e) => onEditRegions(e, d)}
                  >
                    <Icon>edit</Icon>
                  </IconButton>
                  <IconButton
                    size="small"
                    disableRipple
                    color="error"
                    sx={{ border: 1 }}
                    onClick={(e) => onDeleteList("difficulty", d)}
                  >
                    <Icon>delete_forever</Icon>
                  </IconButton>
                </>
              ),
            });
          });
          setRegionsData(temp);
        } else {
          setRegionsData([]);
          toast.error(data?.message);
        }
      })
      .catch((err) => {
        setRegionsData([]);
        console.log(err);
      });
  };

  const onEditRegions = (event, data) => {
    setEditData(data);
    setIsEditRegions(true);
  };

  const onDeleteList = (type, data) => {
    setType(type);
    setEditData(data);
    setIsDeleteModal(true);
  };

  const onCloseRegionsModal = () => {
    setEditData(null);
    setIsEditRegions(false);
  };

  const onCloseDeleteModal = () => {
    setIsDeleteModal(false);
    setEditData(null);
  };

  // delete category info
  const onDeleteInfoData = async () => {
    if (type === "difficulty") {
      const encryptedData = encryptData(
        JSON.stringify({ name: editData.name, id: editData.id, status: 0 })
      );
      await axiosInstanceAuth
        .put("admin/difficulty_levels/edit", { data: encryptedData })
        .then((res) => {
          if (res?.data?.status) {
            toast.success(res?.data?.message);
            getRegions();
            onCloseDeleteModal();
          } else {
            toast.error(res?.data?.message);
            if (res.data.message === authExpired) {
              localStorage.clear();
              navigate("/sign-in");
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      const encryptedData = encryptData(
        JSON.stringify({ name: editData.name, id: editData.id, status: 0 })
      );
      await axiosInstanceAuth
        .put("admin/countries/edit", { data: encryptedData })
        .then((res) => {
          if (res?.data?.status) {
            toast.success(res?.data?.message);
            const prevPage =
              countriesData.length === 1 ? page - 1 : page.toString();
            getCountries({ search: Search, page_no: prevPage.toString() });
            setPage(countriesData.length === 1 ? page - 1 : page);
            onCloseDeleteModal();
          } else {
            toast.error(res?.data?.message);
            if (res.data.message === authExpired) {
              localStorage.clear();
              navigate("/sign-in");
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
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
    const formData = new FormData();
    formData.append("file", data);
    await axiosInstanceAuth
      .post(`/admin/categories/upload-bulk-data`, formData)
      .then((res) => {
        const decryptedData = decryptData(res.data);
        if (res.data.status) {
          toast.success(res.data.message);
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

  const requestSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
    setSearchApi(true);
  };

  useEffect(() => {
    const value = debounced.trim();
    if (searchApi === true) {
      getCountries({ search: value, page_no: "1" });
    } else {
      getCountries(
        {
          search: "",
          page_no: page.toString(),
        },
        true
      );
      getRegions();
    }
  }, [debounced]);

  return (
    <>
      <DashboardLayout>
        <MDBox className="dashboard_wrapper">
          <DashboardNavbar />
          <MDBox pt={6} pb={3}>
            <Grid container spacing={6}>
              <Grid item xs={6}>
                {loading === true ? (
                  <Loader />
                ) : (
                  <>
                    <Card>
                      <MDBox
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                        mt={-3}
                        py={2}
                        px={2}
                        variant="gradient"
                        // bgColor="info"
                        borderRadius="lg"
                        coloredShadow="info"
                      >
                        <Grid item xs={3}>
                          <MDBox sx={{ height: "38.125px" }}>
                            <FormControl sx={{ width: "100%" }}>
                              <TextField
                                sx={{ height: "38.125px" }}
                                onChange={requestSearch}
                                name="search"
                                id="demo-simple-select-label"
                                label="Search"
                                value={Search}
                              />
                            </FormControl>
                          </MDBox>
                        </Grid>
                        <Button
                          variant="contained"
                          onClick={() => setIsEditCountries(true)}
                          color="success"
                          startIcon={<AddCircleIcon />}
                        >
                          Add Country
                        </Button>
                      </MDBox>

                      <MDBox pt={3}>
                        <DataTable
                          table={{
                            columns: countriesColumns,
                            rows: countriesData,
                          }}
                          isSorted={false}
                          entriesPerPage={false}
                          showTotalEntries={false}
                          noEndBorder
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
                  </>
                )}

                <MatchTokenExtra />
              </Grid>
              <Grid item xs={6}>
                {regionsData.length > 0 ? (
                  <Card>
                    <MDBox
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                      mt={-3}
                      py={2}
                      px={2}
                      variant="gradient"
                      // bgColor="info"
                      borderRadius="lg"
                      coloredShadow="info"
                    >
                      <MDTypography variant="h6" color="text">
                        Difficulty Level
                      </MDTypography>
                      <Button
                        variant="contained"
                        color="success"
                        startIcon={<AddCircleIcon />}
                        onClick={() => setIsEditRegions(true)}
                      >
                        Add Difficulty Level
                      </Button>
                    </MDBox>
                    <MDBox pt={3}>
                      <DataTable
                        table={{
                          columns: regionsColumns,
                          rows: regionsData,
                        }}
                        isSorted={false}
                        entriesPerPage={false}
                        showTotalEntries={false}
                        noEndBorder
                        canSearch={false}
                      />
                    </MDBox>
                  </Card>
                ) : (
                  <Loader />
                )}
                <Avatars />
              </Grid>
            </Grid>
          </MDBox>

          <Footer />
        </MDBox>
      </DashboardLayout>
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
              {type === "countries"
                ? "Delete Country"
                : "Delete Difficulty Level"}{" "}
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              {type === "countries"
                ? " Are you sure you want to delete this Country ?"
                : " Are you sure you want to delete this  Difficulty Level ?"}{" "}
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
      {/* *** Edit Confirmation Modal *** */}
      {isEditConfirmation && (
        <EditConfirmation
          open={isEditConfirmation}
          close={() => setIsEditConfirmation(false)}
          confirm={onEditModal}
        />
      )}
      {/* *** Edit Countries Modal *** */}
      {isEditCountries && (
        <EditCountriesModal
          open={isEditCountries}
          close={onCloseCountriesModal}
          data={editData}
          setCountriesData={setCountriesData}
          countriesData={countriesData}
        />
      )}
      {isEditRegions && (
        <EditRegionsModal
          getRegions={getRegions}
          open={isEditRegions}
          close={onCloseRegionsModal}
          defaultData={editData}
        />
      )}{" "}
    </>
  );
};

export default Settings;
