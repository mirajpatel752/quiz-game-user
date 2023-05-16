import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Icon from "@mui/material/Icon";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import GameTime from "layouts/dashboard/gameTime";
import { useState } from "react";

function ComplexStatisticsCard({
  color,
  title,
  getRegions,
  count,
  percentage,
  icon,
  path,
  flag,
}) {
  const navigate = useNavigate();
  const [isEditRegions, setIsEditRegions] = useState(false);
  const [editData, setEditData] = useState(null);
  const onCloseRegionsModal = () => {
    setIsEditRegions(false);
  };
  return (
    <>
      <Card onClick={() => navigate(path)}>
        <MDBox display="flex" justifyContent="space-between" pt={1} px={2}>
          <MDBox
            variant="gradient"
            bgColor={color}
            color={"white"}
            coloredShadow={color}
            borderRadius="xl"
            display="flex"
            justifyContent="center"
            alignItems="center"
            width="4rem"
            height="4rem"
            mt={-3}
            className="box-icon"
          >
            <Icon
              fontSize="medium"
              color="inherit"
              className="dash-board-icon"
              sx={{ fontSize: 28 }}
            >
              {icon}
            </Icon>
          </MDBox>
          <MDBox textAlign="right" lineHeight={1.25}>
            <MDTypography variant="button" fontWeight="light" color="text ">
              {title}
            </MDTypography>
            <MDTypography variant="h4">{count}</MDTypography>
          </MDBox>
        </MDBox>
        <Divider />
        <MDBox pb={flag === true ? 1.5 : 2} px={2}>
          <MDTypography
            component="p"
            variant="button"
            color="text"
            display="flex"
          >
            <MDTypography
              component="span"
              variant="button"
              fontWeight="bold"
              color={percentage.color}
            >
              {percentage.amount}
              {flag && (
                <EditIcon
                  onClick={() => {
                    setIsEditRegions(true);
                    setEditData(count);
                  }}
                />
              )}
            </MDTypography>
            &nbsp;{percentage.label}
          </MDTypography>
        </MDBox>
      </Card>
      <GameTime
        getRegions={getRegions}
        open={isEditRegions}
        close={() => setIsEditRegions(false)}
        defaultData={editData}
      />
    </>
  );
}

// Setting default values for the props of ComplexStatisticsCard
ComplexStatisticsCard.defaultProps = {
  color: "info",
  percentage: {
    color: "success",
    text: "",
    label: "",
  },
};

// Typechecking props for the ComplexStatisticsCard
ComplexStatisticsCard.propTypes = {
  color: PropTypes.oneOf([
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
    "light",
    "dark",
  ]),
  title: PropTypes.string.isRequired,
  count: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  percentage: PropTypes.shape({
    color: PropTypes.oneOf([
      "primary",
      "secondary",
      "info",
      "success",
      "warning",
      "error",
      "dark",
      "white",
    ]),
    amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    label: PropTypes.string,
  }),
  icon: PropTypes.node.isRequired,
};

export default ComplexStatisticsCard;
