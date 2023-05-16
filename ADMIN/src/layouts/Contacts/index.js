/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
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
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { useEffect, useState } from "react";
import {
  IconButton,
  Pagination,
  Tooltip,
} from "@mui/material";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import Loader from "common/Loader/loader";
import ViewContacts from "./modal/ViewContacts";

function Contacts() {
  const [dataSource, setDataSource] = useState([]);
  const [fields, setFields] = useState({ page_no: "1" });
  const [count, setCount] = useState([0]);
  const [page, setPage] = useState(1);
  const { encryptData, decryptData } = useEncryption();
  const [loading, setLoading] = useState(false);
  const [viewModel, setViewModel] = useState(false);
  const [viewData, setViewData] = useState({});
  const navigate = useNavigate();
  const PlayersColumns = [
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
      // width: "20%",
    },
    {
      Header: "contact no",
      accessor: "contact_no",
      align: "left",
      // width: "10%",
    },
    {
      Header: "email",
      accessor: "email",
      align: "left",
      // width: "25%",
    },
    {
      Header: "message",
      accessor: "message",
      align: "left",
      // width: "20%",
    },
    {
      Header: "Contact Date",
      accessor: "contact_date",
      align: "left",
      // width: "20%",
    }, {
      Header: "action",
      accessor: "action",
      align: "center",
      // width: "20%",
    },
  ];

  const onPagination = (event, value) => {
    setPage(value);
    getViewFileFormat({ page_no: value });
  };

  useEffect(() => {
    getViewFileFormat(fields);
  }, []);



  const getViewAccount = async (id) => {
    await axiosInstanceAuth
      .get(`admin/read-contact-us/${id}`)
      .then((res) => {
        if (res.data.status) {
          getViewFileFormat({ page_no: page });
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
        toast.error(err);
      });
  };

  const onSelectData = (data) => {
    const id = data.values.id.props.children.props.children[0].props.children;
    if (id[1] === 0) {
      getViewAccount(id[0]);
    }
  };

  const removeRedEyeIcon = (event, data) => {
    setViewData(data)
    setViewModel(true)
    
  };

  const getViewFileFormat = async (data) => {
    setLoading(true);
    const encryptedData = encryptData(JSON.stringify(data));
    await axiosInstanceAuth
      .post("/admin/get-contact-us", { data: encryptedData })
      .then((res) => {
        const decryptedData = decryptData(res.data.data);
        if (res.data.status) {
          const count = Math.ceil(res.data.count / 10);
          setCount(count);
          const data = decryptedData;
          const temp = [];
          localStorage.setItem("unread_message", res.data.unread_message);
          data?.map((d, i) => {
            temp.push({
              id: (
                <MDBox lineHeight={1} keys={i}>
                  <MDTypography
                    display="block"
                    variant="button"
                    fontWeight="medium"
                    className="id-flex"
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    <span style={{ display: "none" }}>
                      {d.id}
                      {d.is_read}
                    </span>
                    {d.is_read === 0 ? (
                      <div className="read_button"></div>
                    ) : (
                      <div className="view_button"></div>
                    )}
                    {i + 1}
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
                    {d.name}{" "}
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
                    {d?.email}{" "}
                  </MDTypography>
                </MDBox>
              ),
              message: (
                <MDBox lineHeight={1}>
                  <Tooltip title={d.message}>
                    <Tooltip title={d.message}>
                      <MDTypography
                        display="block"
                        variant="button"
                        fontWeight="medium"
                      >
                        {d?.message.slice(0, 60)}
                        {d?.message.length > 60 && "..."}{" "}
                      </MDTypography>
                    </Tooltip>
                  </Tooltip>
                </MDBox>
              ),
              contact_no: (
                <MDBox lineHeight={1}>
                  <MDTypography
                    display="block"
                    variant="button"
                    fontWeight="medium"
                  >
                    {d?.contact_no.slice(0, 13)}
                    {d?.contact_no.length > 13 && "..."}{" "}
                  </MDTypography>
                </MDBox>
              ),
              contact_date: (
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
          }else if (!localStorage.getItem("token")){
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
          {loading === false ? (
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
                        Contact Us
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
                          canSearch={false}
                          clickable={true}
                          onSelectData={onSelectData}
                        />
                      </MDBox>
                      {count >= 2 && (
                        <MDBox p={2}>
                          <Pagination
                            color="info"
                            count={count}
                            page={page}
                            onChange={onPagination}
                          />
                        </MDBox>
                      )}
                    </Card>
                  </Grid>
                </Grid>
              </MDBox>
            </>
          ) : (
            <Loader />
          )}
        </MDBox>
        {viewModel && (
          <ViewContacts
            categoryData={viewData}
            editData={viewModel}
            onConfirmClose={() => setViewModel(false)}
            open={viewModel}
            onClose={() => setViewModel(false)}
          />
        )}
        <Footer />
      </DashboardLayout>
    </>
  );
}

export default Contacts;
