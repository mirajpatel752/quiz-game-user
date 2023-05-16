import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  Card,
  FormControl,
  Grid,
  Icon,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Select,
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
import { useLocation, useNavigate } from "react-router-dom";
import AddMatchModal from "./modal/AddModal";
import EditMatchModal from "./modal/editMatchModal";
import Loader from "common/Loader/loader";
import MDButton from "components/MDButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Close } from "@mui/icons-material";

const MatchTokenExtra = () => {
  const [countriesData, setCountriesData] = useState([]);
  const [isEditRegions, setIsEditRegions] = useState(false);
  const [addMatch, setAddMatch] = useState(false);
  const [editData, setEditData] = useState(null);
  const { encryptData, decryptData } = useEncryption();
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [topicList, setTopicList] = useState([]);
  const [topicId, setTopicId] = useState(0);
  const [formdata, setformdata] = useState("Training");
  const [loading, setLoading] = useState(false);
  const { state } = useLocation();

  let navigate = useNavigate();

  const countriesColumns = [
    {
      Header: "id",
      accessor: "id",
      align: "left",
      width: "5%",
    },
    {
      Header: "image",
      accessor: "image",
      align: "left",
      width: "5%",
    },
    {
      Header: "name",
      accessor: "options",
      align: "left",
      width: "65%",
    },

    {
      Header: "Entry Fee",
      accessor: "amount",
      align: "left",
      width: "10%"
    },
    {
      Header: " reward",
      accessor: "win_reward",
      align: "left",
      width: "10%"
    },
    {
      Header: "action",
      accessor: "action",
      align: "left",
      width: "5%",
    },
  ];

  // *** countries *** .get(`admin/questionnaires/view/${id}`)
  const getCountries = async (id) => {
    setLoading(true)
    await axiosInstanceAuth
      .get(`admin/default-match-fees-rewards`)
      .then((res) => {
        const data = decryptData(res.data.data);
        if (res.data?.status) {
          const temp = [];
          data?.map((d, i) => {
            temp.push({
              id: (
                <MDBox lineHeight={1}>
                  <MDTypography
                    display="block"
                    variant="button"
                    fontWeight="medium"
                  >
                    {i + 1}
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
                        d?.icon === undefined ? "/broken-image.jpg" : d?.icon
                      }`}
                    />
                  </MDTypography>
                </MDBox>
              ),
              comments: (
                <MDBox lineHeight={1}>
                  <MDTypography
                    display="block"
                    variant="button"
                    fontWeight="medium"
                  >
                    {d?.comments?.slice(0, 12)}
                    {d?.comments?.length > 12 && "..."}{" "}
                  </MDTypography>
                </MDBox>
              ),

              options: (
                // d?.options.slice(0, 12)
                <MDBox lineHeight={1}>
                  <MDTypography
                    display="block"
                    variant="button"
                    fontWeight="medium"
                  >
                    {d?.options?.slice(0, 12)}
                    {d?.options?.length > 12 && "..."}{" "}
                  </MDTypography>
                </MDBox>
              ),

              is_free: (
                <MDBox lineHeight={1}>
                  <MDTypography
                    display="block"
                    variant="button"
                    fontWeight="medium"
                  >
                    {d?.is_free === 0 ? "NO" : "YES"}{" "}
                  </MDTypography>
                </MDBox>
              ),

              amount: (
                // d.entry_fee
                <MDBox lineHeight={1}>
                  <MDTypography
                    display="block"
                    variant="button"
                    fontWeight="medium"
                  >
                    {d?.entry_fee} LT
                  </MDTypography>
                </MDBox>
              ),
              win_reward: (
                // d.win_reward
                <MDBox lineHeight={1}>
                  <MDTypography
                    display="block"
                    variant="button"
                    fontWeight="medium"
                  >
                    {d?.win_reward} LT
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
                    onClick={(e) => onDeleteList(e, d)}
                  >
                    <Icon>delete_forever</Icon>
                  </IconButton>
                </>
              ),
            });
          });

          setCountriesData(temp);
          setLoading(false)
        } else {
          setCountriesData([]);
          setLoading(false)
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
        setLoading(false)
      });
  };

  const onEditCountries = (event, data) => {
    setEditData(data);
    setIsEditRegions(true);
  };
  const onDeleteList = (event, data) => {
    setEditData(data);
    setIsDeleteModal(true);
  };
  // delete category info
  const onDeleteInfoData = async () => {
    await axiosInstanceAuth
      .delete(`/admin/default-match-fees-rewards/${editData.id}`)
      .then((res) => {
        const decryptedData = decryptData(res.data);
        if (res.data.status) {
          getCountries(topicId.id);
          setIsDeleteModal(false);
          toast.success(res.data.message);
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

  const onConfirmClose = () => {
    setAddMatch(false);
    getCountries(topicId.id);
    setIsEditRegions(false);
  };

  useEffect(() => {
    if (state && topicId) {
      getCountries(state.data.id);
      setTopicId(state.data);
    } else if (topicId) {
      getCountries(topicId.id);
    }
  }, [topicId]);

  useEffect(() => {
    onSearChrist({
      access: "All",
      regional_relevance: "All",
      countries: "",
    });
  }, []);

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

  const onSearChrist = async (dataFilter) => {
    const formData = new FormData();
    formData.append("data", encryptData(JSON.stringify(dataFilter)));
    await axiosInstanceAuth
      .post(`/admin/topics/get`, formData)
      .then((res) => {
        const decryptedData = decryptData(res.data.data);
        if (res.data.status) {
          setTopicList(decryptedData);
          setTopicId(decryptedData[0]);
          if (state) {
          } else {
          }
        } else {
          setTopicList([]);
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
  };



  const clearAuto = () => {
    getCountries(topicId.id);
    setTopicId();
  };

  const clear = <Close fontSize="small" onClick={clearAuto} />;

  return (
    <>
    {loading === false ? (
            <>
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
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
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="text">
                  Default Match Fees & Rewards
                </MDTypography>
                <Button
                  variant="contained"
                  onClick={() => setAddMatch(true)}
                  color="success"
                  startIcon={<AddCircleIcon />}
                >
                  Add
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
                  canSearch={false}
                  className={"table-padding"}
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      </>
          ) : (
            <Loader />
          )}
      {/* <Footer /> */}
      {addMatch && (
        <AddMatchModal
          open={addMatch}
          onClose={() => setAddMatch(false)}
          topicId={topicId}
          onConfirmClose={onConfirmClose}
        />
      )}
      {isEditRegions && (
        <EditMatchModal
          open={isEditRegions}
          topicId={topicId}
          onClose={() => setIsEditRegions(false)}
          editData={editData}
          onConfirmClose={onConfirmClose}
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
              Delete MatchToken
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Are you sure you want to delete this MatchToken ?
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
      )}{" "}
    </>
  );
};

export default MatchTokenExtra;
