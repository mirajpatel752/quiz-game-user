/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from "prop-types";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Icon from "@mui/material/Icon";
import MDBox from "components/MDBox";
import {
  collapseItem,
  collapseIconBox,
  collapseIcon,
  collapseText,
} from "examples/Sidenav/styles/sidenavCollapse";
import { useMaterialUIController } from "context";
import { useMemo } from "react";
function SidenavCollapse({ icon, name, active, ...rest }) {
  const [controller] = useMaterialUIController();
  const {
    miniSidenav,
    transparentSidenav,
    whiteSidenav,
    darkMode,
    sidenavColor,
  } = controller;

  const unread_message = useMemo(() => {
    let unread_message = localStorage.getItem("unread_message");
    return unread_message;
  });

  return (
    <ListItem component="li">
      <MDBox
        className={`${active && "active-side"}`}
        {...rest}
        sx={(theme) =>
          collapseItem(theme, {
            // active,
            transparentSidenav,
            whiteSidenav,
            darkMode,
            sidenavColor,
          })
        }
      >
        <ListItemIcon
          sx={(theme) =>
            collapseIconBox(theme, {
              transparentSidenav,
              whiteSidenav,
              darkMode,
              active,
            })
          }
          className="big-icon-box-color"
        >
          {typeof icon === "string" ? (
            <Icon sx={(theme) => collapseIcon(theme, { active })}>{icon}</Icon>
          ) : (
            icon
          )}
        </ListItemIcon>

        <ListItemText
          primary={
            name === "Contact Us" ? (
              <div className="count-round" style={{ display: "flex", justifyContent: "space-between" ,textAlign:"center",alignItems:"center" }}>
                <span>Contact Us</span>
                {unread_message != 0 && (
                  <span
                  className="round"
                  >
                    <span>{unread_message}</span>
                  </span>
                )}
              </div>
            ) : (
              name
            )
          }
          sx={(theme) =>
            collapseText(theme, {
              miniSidenav,
              transparentSidenav,
              whiteSidenav,
              active,
            })
          }
        />
      </MDBox>
    </ListItem>
  );
}

// Setting default values for the props of SidenavCollapse
SidenavCollapse.defaultProps = {
  active: false,
};

// Typechecking props for the SidenavCollapse
SidenavCollapse.propTypes = {
  icon: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired,
  active: PropTypes.bool,
};

export default SidenavCollapse;
