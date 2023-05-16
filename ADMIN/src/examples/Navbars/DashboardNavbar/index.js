import { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import Icon from "@mui/material/Icon";
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import Breadcrumbs from "examples/Breadcrumbs";
import NotificationItem from "examples/Items/NotificationItem";
import CloseIcon from "@mui/icons-material/Close";

import {
  navbar,
  navbarContainer,
  navbarRow,
  navbarIconButton,
  navbarMobileMenu,
} from "examples/Navbars/DashboardNavbar/styles";

import {
  useMaterialUIController,
  setTransparentNavbar,
  setMiniSidenav,
  setOpenConfigurator,
} from "context";
import { Modal } from "@mui/material";
import { Box } from "@mui/system";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import useEncryption from "customHook/useEncryption";
import { toast } from "react-toastify";
import axiosInstanceAuth from "apiServices/axiosInstanceAuth";

function DashboardNavbar({ absolute, light, isMini }) {
  const [navbarType, setNavbarType] = useState();
  const [controller, dispatch] = useMaterialUIController();
  const { encryptData, decryptData } = useEncryption();
  const {
    miniSidenav,
    transparentNavbar,
    fixedNavbar,
    openConfigurator,
    darkMode,
  } = controller;
  const [openMenu, setOpenMenu] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const route = useLocation().pathname.split("/").slice(1);
  const [error, setError] = useState({ status: false, type: "", message: "" });
  const [fields, setFields] = useState({
    password: "",
    old_password: "",
  });

  const authExpired = "Something is wrong in Authentication.Please try again.";
  const navigate = useNavigate();

  useEffect(() => {
    if (fixedNavbar) {
      setNavbarType("sticky");
    } else {
      setNavbarType("static");
    }

    function handleTransparentNavbar() {
      setTransparentNavbar(
        dispatch,
        (fixedNavbar && window.scrollY === 0) || !fixedNavbar
      );
    }


    window.addEventListener("scroll", handleTransparentNavbar);

    handleTransparentNavbar();

    return () => window.removeEventListener("scroll", handleTransparentNavbar);
  }, [dispatch, fixedNavbar]);

  const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);
  const handleConfiguratorOpen = () =>
    setOpenConfigurator(dispatch, !openConfigurator);
  const handleOpenMenu = (event) => setOpenMenu(event.currentTarget);
  const handleCloseMenu = () => setOpenMenu(false);

  const renderMenu = () => (
    <Menu
      anchorEl={openMenu}
      anchorReference={null}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      open={Boolean(openMenu)}
      onClose={handleCloseMenu}
      sx={{ mt: 2 }}
    >
      <NotificationItem
        onClick={() => {
          setIsUpdate(true);
          handleCloseMenu();
        }}
        icon={<Icon>lock</Icon>}
        title="Update Password"
      />
    </Menu>
  );

  // Styles for the navbar icons
  const iconsStyle = ({
    palette: { dark, white, text },
    functions: { rgba },
  }) => ({
    color: () => {
      let colorValue = light || darkMode ? white.main : dark.main;

      if (transparentNavbar && !light) {
        colorValue = darkMode ? rgba(text.main, 0.6) : text.main;
      }

      return colorValue;
    },
  });

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    bgcolor: "background.paper",
    border: "0px solid #000",
    boxShadow: 24,
    borderRadius: 4,
    p: 4,
  };

  const onChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    if (name === "password") {
      if (value.length > 5) {
        setError({
          ...error,
          status: false,
          type: "",
          message: "",
        });
        setFields({
          ...fields,
          [name]: value,
        });
      } else {
        setError({
          ...error,
          status: true,
          type: "password",
          message: "must be 6 character",
        });
        setFields({
          ...fields,
          [name]: value,
        });
      }
    }
    if (name === "old_password") {
      if (value.length > 5) {
        setError({
          ...error,
          status: false,
          type: "",
          message: "",
        });
        setFields({
          ...fields,
          [name]: value,
        });
      } else {
        setError({
          ...error,
          status: true,
          type: "old_password",
          message: "must be 6 character",
        });
        setFields({
          ...fields,
          [name]: value,
        });
      }
    }
  };

  const handleSubmit = async () => {
    if (fields.password.length < 6) {
      setError({
        ...error,
        status: true,
        type: "password",
        message: "must be 6 character",
      });
    } else if (fields.old_password.length < 6) {
      setError({
        ...error,
        status: true,
        type: "old_password",
        message: "must be 6 character",
      });
    } else {
      const encryptedData = encryptData(
        JSON.stringify({
          password: fields.password,
          old_password: fields.old_password,
        })
      );
      await axiosInstanceAuth
        .post("admin/update-password", {
          data: encryptedData,
        })
        .then((res) => {
          const data = decryptData(res.data.data);
          if (res?.data?.status) {
            toast.success(res?.data?.message);
            onUpdateClose();
          } else {
            toast.error(res?.data?.message);
            if (res.data.message === authExpired) {
              localStorage.clear();
              navigate("/sign-in");
            }
          }
        })
        .catch((err) => {
          toast.error(err);
        });
    }
  };

  const onUpdateClose = () => {
    setIsUpdate(false);
    setFields({
      password: "",
      old_password: "",
    });
  };

  const onCloseEditModal = (event, reason) => {
    if (reason && reason == "backdropClick") return;
    else onUpdateClose();
  };


  return (
    <AppBar
      position={absolute ? "absolute" : navbarType}
      color="inherit"
      sx={(theme) =>
        navbar(theme, { transparentNavbar, absolute, light, darkMode })
      }
    >
      <Toolbar sx={(theme) => navbarContainer(theme)}>
        <MDBox
          color="inherit"
          mb={{ xs: 1, md: 0 }}
          sx={(theme) => navbarRow(theme, { isMini })}
        >
          <Breadcrumbs
            icon="home"
            title={
              route[route.length - 1] === "match-fees-rewards" ? "Match Fees & Rewards" : route[route.length - 1] === "contacts" ? "Contact Us"
                  : route[route.length - 1]
            }
            route={route}
            light={light}
          />
        </MDBox>
        {isMini ? null : (
          <MDBox sx={(theme) => navbarRow(theme, { isMini })}>
            <MDBox pr={1}>{/* <MDInput label="Search here" /> */}</MDBox>
            <MDBox color={light ? "white" : "inherit"}>
              {/* <Link to="/authentication/sign-in/basic"> */}
              <IconButton
                onClick={handleOpenMenu}
                sx={navbarIconButton}
                size="small"
                disableRipple
              >
                <Icon sx={iconsStyle}>account_circle</Icon>
              </IconButton>
              {/* </Link> */}
              <IconButton
                size="small"
                disableRipple
                color="inherit"
                sx={navbarMobileMenu}
                onClick={handleMiniSidenav}
              >
                <Icon sx={iconsStyle} fontSize="medium">
                  {miniSidenav ? "menu_open" : "menu"}
                </Icon>
              </IconButton>

              <IconButton
                size="small"
                disableRipple
                color="inherit"
                sx={navbarIconButton}
                aria-controls="notification-menu"
                aria-haspopup="true"
                variant="contained"
              >
                <Icon sx={iconsStyle}>notifications</Icon>
              </IconButton>
              {renderMenu()}

              <Modal open={isUpdate} onClose={onCloseEditModal}>
                <Box sx={modalStyle}>
                  <button className="icon-end-close" onClick={onUpdateClose}>
                    <div className="close-icon">
                      <CloseIcon />
                    </div>
                  </button>
                  <MDBox mx={2} p={1} textAlign="center">
                    <MDTypography variant="h4" fontWeight="medium">
                      Update Password
                    </MDTypography>
                  </MDBox>
                  <MDBox pt={4} pb={3} px={3}>
                    <MDBox component="form" role="form">
                      <MDBox mb={2}>
                        <MDBox mb={2}>
                          <MDInput
                            type="text"
                            className="old-password"
                            label="Old Password"
                            name="old_password"
                            error={!!error.message}
                            onChange={onChange}
                            value={fields.old_password}
                            variant="standard"
                            fullWidth
                          />
                          {error.status && error.type === "old_password" && (
                            <MDTypography variant="button" color="error">
                              {error.message}
                            </MDTypography>
                          )}
                        </MDBox>
                        <MDInput
                          type="text"
                          label="Password"
                          name="password"
                          onChange={onChange}
                          error={!!error.message}
                          value={fields.password}
                          variant="standard"
                          fullWidth
                        />
                        {error.status && error.type === "password" && (
                          <MDTypography variant="button" color="error">
                            {error.message}
                          </MDTypography>
                        )}
                      </MDBox>
                      <MDBox mt={4} mb={1}>
                        <MDButton
                          onClick={handleSubmit}
                          variant="gradient"
                          color="info"
                          fullWidth
                        >
                          Update
                        </MDButton>
                      </MDBox>
                    </MDBox>
                  </MDBox>
                </Box>
              </Modal>
            </MDBox>
          </MDBox>
        )}
      </Toolbar>
    </AppBar>
  );
}

// Setting default values for the props of DashboardNavbar
DashboardNavbar.defaultProps = {
  absolute: false,
  light: false,
  isMini: false,
};

// Typechecking props for the DashboardNavbar
DashboardNavbar.propTypes = {
  absolute: PropTypes.bool,
  light: PropTypes.bool,
  isMini: PropTypes.bool,
};

export default DashboardNavbar;
