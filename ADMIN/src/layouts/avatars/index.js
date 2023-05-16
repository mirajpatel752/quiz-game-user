import "./index.css";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DataTable from "examples/Tables/DataTable";
import useEncryption from "customHook/useEncryption";
import axiosInstanceAuth from "apiServices/axiosInstanceAuth";
import { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Icon,
  IconButton,
  Modal,
  Typography,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import AddFormatModal from "./modal/AddCategoryModal";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Loader from "common/Loader/loader";

function Avatars() {

const   columns =  [
  {
      Header: "id",
      accessor: "id",
      align: "left",
      width: "10%"
  }, {
      Header: "Avatar",
      accessor: "avatar",
      align: "left",
      width: "10%"
  }, {
      Header: "Name",
      accessor: "name",
      align: "left",
      width: "50%"
  }, {
      Header: "action",
      accessor: "action",
      align: "left",
      width: "20%"
  },
]


  const [isAdd, setIsAdd] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editData, setEditData] = useState({});
  const [isEditModal, setIsEditModal] = useState(false);
  const {  decryptData } = useEncryption();
  const navigate = useNavigate();

  // delete category info
  const onDeleteInfoData = async () => {
    await axiosInstanceAuth
      .delete(`admin/avatars/delete/${editData.id}`)
      .then((res) => {
        if (res.data.status) {
          getViewFileFormat();
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



  // Add category
  const addFormat = () => {
    setIsAdd(true);
  };
  const onConfirmClose = () => {
    getViewFileFormat();
    setIsAdd(false);
  };
  const onCloseDeleteModal = () => {
    setIsDeleteModal(false);
    getViewFileFormat();
  };

  const onEditCountries = (event, data) => {
    setIsEditModal(true);
    setEditData(data);
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

  const getViewFileFormat = async () => {
    setLoading(true)
    await axiosInstanceAuth
      .get("/admin/avatars/get")
      .then((res) => {
        const decryptedData = decryptData(res.data.data);
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
              name: (
                <MDBox lineHeight={1}>
                  <MDTypography
                    display="block"
                    variant="button"
                    fontWeight="medium"
                    className="description_title_extra"
                  >
                    {d?.name.slice(0, 90)}
                    {d?.name.length > 90 && "..."}{" "}
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
          setDataSource(temp);
          setLoading(false)
        } else {
          toast.error(res.data?.message);
          setLoading(false)
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

  useEffect(() => {
    getViewFileFormat();
  }, []);


  return (
    <>
      {" "}
      {loading !== true  ? (
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
                  // bgColor="info"
                  borderRadius="lg"
                  coloredShadow="info"
                >
                  <MDTypography variant="h6" color="text">
                    Avatar
                  </MDTypography>
                  <Button
                    sx={{ marginLeft: "20px" }}
                    variant="contained"
                    onClick={addFormat}
                    color="success"
                    startIcon={<AddCircleIcon />}
                  >
                    Add Avatar
                  </Button>
                </MDBox>
                <MDBox pt={3}>
                  <DataTable
                    table={{ columns, rows: dataSource }}
                    isSorted={false}
                    entriesPerPage={false}
                    showTotalEntries={false}
                    noEndBorder
                  />
                </MDBox>
              </Card>
            </Grid>
          </Grid>
        </MDBox>
      ) : (
        <Loader />
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
              Are you sure you want to delete this Avatar ?
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
      {isEditModal && (
        <AddFormatModal
          open={isEditModal}
          flag={true}
          editData={editData}
          onClose={() => setIsEditModal(false)}
          onConfirmClose={onConfirmClose}
        />
      )}{" "}
    </>
  );
}

export default Avatars;
