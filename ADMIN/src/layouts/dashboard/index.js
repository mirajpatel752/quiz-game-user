
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useEncryption from "customHook/useEncryption";
import axiosInstanceAuth from "apiServices/axiosInstanceAuth";
import Loader from "common/Loader/loader";
import HistoryToggleOffSharpIcon from '@mui/icons-material/HistoryToggleOffSharp';

function Dashboard() {
  const {  decryptData } = useEncryption();
  const [loader ,setLoader]=useState(false)
  const [data, setData] = useState({
    account_types:0,
    categories:0,
    topics:0,
    questions:0,
    players:0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    getRegions();
  }, []);

  const getRegions = async () => {
    setLoader(true)
    await axiosInstanceAuth
      .get(`admin/dashboard`)
      .then((res) => {
        if (res.data.status) {
          const data = decryptData(res.data.data);
          setData(data);
          setLoader(false)
          localStorage.setItem("unread_message", data.unread_message);
        } else {
          toast.error(data?.message);
          setLoader(false)
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
        console.log(err);
      });
  };

  return (

    <DashboardLayout>
      <MDBox className="dashboard_wrapper">
        <DashboardNavbar />
        {loader === true ? (
          <Loader />
        ) : (
          <MDBox py={3}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6} lg={3}>
                <MDBox mb={1.5}>
                  <ComplexStatisticsCard
                    color="primary"
                    icon="Account"
                    title="Account Types"
                    count={data?.account_types}
                    path={"/account-types"}
                  />
                </MDBox>
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <MDBox mb={1.5}>
                  <ComplexStatisticsCard
                    color="dark"
                    icon="category"
                    title="Total Categories"
                    count={data?.categories}
                    path={"/categories"}
                  />
                </MDBox>
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <MDBox mb={1.5}>
                  <ComplexStatisticsCard
                    color="secondary"
                    icon="topics"
                    title="Total Topics"
                    count={data?.topics}
                    path={"/topics"}
                  />
                </MDBox>
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <MDBox mb={1.5}>
                  <ComplexStatisticsCard
                    color="success"
                    icon="Questions"
                    title="Total Questions"
                    count={data?.questions}
                    path={"/questions"}
                  />
                </MDBox>
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <MDBox mb={1.5}>
                  <ComplexStatisticsCard
                     color="warning"
                    icon="Players"
                    title="Players"
                    count={data.players}
                    path={"/players"}
                  />
                </MDBox>
              </Grid>
              <Grid item xs={12} md={5} lg={3}>
                <MDBox mb={1.5}>
                  <ComplexStatisticsCard
                     color="error"
                     icon={<HistoryToggleOffSharpIcon style={{fontSize:"35px" ,minHeight:"35px",minWidth:"30px"}} />}
                    title="Game Time"
                    count={data.game_time}
                    flag={true}
                    getRegions={()=>getRegions()}
                  />
                  
                </MDBox>
                
              </Grid>
            </Grid>
          </MDBox>
        )}
        <Footer />
      </MDBox >
    </DashboardLayout>

  );
}

export default Dashboard;
