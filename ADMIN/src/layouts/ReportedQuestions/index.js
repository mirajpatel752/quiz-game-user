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
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";

import {
  Avatar,
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
import { toast } from "react-toastify";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import { useNavigate } from "react-router-dom";
import Loader from "common/Loader/loader";
import moment from "moment";
import ViewQuestion from "./modal/ReportedQuestions";

function ReportedQuestions() {
  const [dataSource, setDataSource] = useState([]);
  const [dataCheng, setDataCheng] = useState();
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [editData, setEditData] = useState({});
  const [isEditModal, setIsEditModal] = useState(false);
  const [fields, setFields] = useState({ page_no: "1" });
  const [count, setCount] = useState([0]);
  const [page, setPage] = useState(1);
  const [viewQuestionData, setviewQuestionData] = useState(false);
  const { encryptData, decryptData } = useEncryption();
  const navigate = useNavigate();
  const [viewDate, setViewData] = useState();
  const [loading, setLoading] = useState(false);

  const PlayersColumns = [
    {
      Header: "id",
      accessor: "id",
      align: "left",
      width: "5%",
    },
    {
      Header: "question image",
      accessor: "question_image",
      align: "left",
      width: "5%",
    },
    {
      Header: "question",
      accessor: "question",
      align: "left",
      // width: '34%'
    },
    {
      Header: "report reason",
      accessor: "report_reason",
      align: "left",
      // width: '32%'
    },
    {
      Header: "user name",
      accessor: "user_name",
      align: "left",
      width: "12%",
    },
    {
      Header: "reported date",
      accessor: "reported_date",
      align: "left",
      width: "10%",
    },
    {
      Header: "action",
      accessor: "action",
      align: "left",
      width: "5%",
    },
  ];

  const onPagination = (event, value) => {
    setPage(value);
    getViewFileFormat({ page_no: value });
  };

  useEffect(() => {
    getViewFileFormat(fields, true);
  }, []);



  // onChange
  const onEditCountries = (event, data) => {
    viewDataEdit(data.question_id, "edit");
  };

  const removeRedEyeIcon = (event, data) => {
    viewDataEdit(data.question_id, "view");
  };



  const viewDataEdit = async (id, type) => {
    await axiosInstanceAuth
      .get(`admin/questionnaires/view/${id}`)
      .then((res) => {
        const decryptedData = decryptData(res.data.data);
        if (res.data.status) {
          setEditData(decryptedData);
          if (type === "edit") {
            setIsEditModal(true);
          } else {
            setviewQuestionData(true);
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

  const getViewFileFormat = async (data, type) => {
    setLoading(type === true ? true : false);
    const encryptedData = encryptData(JSON.stringify(data));
    await axiosInstanceAuth
      .post("/admin/questionnaires/get-report-questions", {
        data: encryptedData,
      })
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
                    {d.question_id}{" "}
                  </MDTypography>
                </MDBox>
              ),
              question_image: (
                <MDBox lineHeight={1}>
                  <MDTypography
                    display="block"
                    variant="button"
                    fontWeight="medium"
                  >
                    <Avatar
                      src={`${
                        d.question_image === undefined
                          ? "/broken-image.jpg"
                          : d.question_image
                      }`}
                    />
                  </MDTypography>
                </MDBox>
              ),
              question: (
                <MDBox lineHeight={1}>
                  <Tooltip title={d.question}>
                    <MDTypography
                      display="block"
                      variant="button"
                      fontWeight="medium"
                      className="description_title-reported"
                    >
                      {d.question}
                      {/* {d?.question.slice(0, 90)}
                      {d?.question.length > 90 && "..."}{" "} */}{" "}
                    </MDTypography>
                  </Tooltip>
                </MDBox>
              ),
              report_reason: (
                <MDBox lineHeight={1}>
                  <MDTypography
                    display="block"
                    variant="button"
                    fontWeight="medium"
                    className="description_title-reported"
                  >
                    {d?.report_reason}
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
                    {d.user_name}{" "}
                  </MDTypography>
                </MDBox>
              ),
              reported_date: (
                <MDBox lineHeight={1}>
                  <MDTypography
                    display="block"
                    variant="button"
                    fontWeight="medium"
                  >
                    {moment(d?.created_at).format("DD/MM/YYYY  H:mm")}{" "}
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
                    color="action"
                    sx={{
                      border: 1,
                      margin: "0px 10px 0px 0px",
                    }}
                    onClick={(e) => removeRedEyeIcon(e, d)}
                  >
                    <RemoveRedEyeIcon />
                  </IconButton>
                </>
              ),
            });
          });
          setDataSource(temp);
          setLoading(false);
        } else {
          setLoading(false);
          toast.error(res.data.message);
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



  return (
    <>
      <DashboardLayout>
        <MDBox className="dashboard_wrapper">
          {loading === true ? (
            <Loader />
          ) : (
            <>
              <DashboardNavbar />
              <MDBox pt={6} pb={3}>
                <Grid container spacing={6}>
                  <Grid item xs={12}>
                    <Card>
                      <MDBox
                        mt={-3}
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
                        <MDTypography variant="h6" color="text">
                          Reported Questions
                        </MDTypography>
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
          )}{" "}
        </MDBox>

        {viewQuestionData && (
          <ViewQuestion
            categoryData={"categoryData"}
            flag={true}
            editData={editData}
            onConfirmClose={() => setviewQuestionData(false)}
            open={viewQuestionData}
            onClose={() => setviewQuestionData(false)}
          />
        )}
        {isEditModal && (
          <ViewQuestion
            categoryData={"categoryData"}
            editData={editData}
            onConfirmClose={() => setIsEditModal(false)}
            open={isEditModal}
            onClose={() => setIsEditModal(false)}
          />
        )}

        <Footer />
      </DashboardLayout>
    </>
  );
}

export default ReportedQuestions;
