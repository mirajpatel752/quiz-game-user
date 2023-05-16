import "./style.scss";
import * as React from "react";
import {
  Button,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Modal,
  Tooltip,
  UncontrolledDropdown,
} from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstanceAuth from "../../apiServices/axiosInstanceAuth";
import useEncryption from "../../customHook/useEncryption";
const UserDetails = ({ flag, fields }) => {
  const [conform, setConform] = React.useState(false);
  const [userData, setUserData] = React.useState();
  const navigate = useNavigate();
  const { decryptData } = useEncryption();

  const getUser = async () => {
    await axiosInstanceAuth
      .get("user/get")
      .then((res) => {
        const data = decryptData(res.data.data);
        if (res?.data?.status) {
          setUserData(data);
        } else {
          toast.error(res?.data?.message);
        }
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  React.useEffect(() => {
    if (!flag) {
      getUser();
    }
  }, []);

  const logOutConform = () => {
    setConform(true);
  };
  const conformLogOut = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <>
      <div className="header-user">
        <div className="user-profile">
          <div>
            <img
              src={flag === true ? fields.avatar : userData?.avatar}
              alt=""
              className=""
            />
          </div>
          <div className="d-flex align-items-center user-name position-relative">
            <UncontrolledDropdown setActiveFromChild>
              <DropdownToggle tag="a" className="nav-link" caret>
                {flag === true ? fields.full_name : userData?.user_name}{" "}
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem>
                  <Link
                    to="/settings"
                    style={{
                      color: "#1a2b51",
                      textDecoration: "none",
                    }}
                  >
                    <img
                      src={require("../../Assets/Img/Settings-sidenar.svg").default}
                      alt=""
                      className=""
                    />
                    Settings
                  </Link>
                </DropdownItem>
                <DropdownItem tag="a" onClick={logOutConform}>
                  <img
                    src={require("../../Assets/Img/logout.svg").default}
                    alt=""
                    className=""
                  />
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </div>
        </div>
      </div>

      <Modal
        className="conform-modal"
        autoFocus={true}
        centered={true}
        backdrop="static"
        isOpen={conform}
      >
        <div className="conform-modal-wrapper">
          <h4>Are you sure you want to log out?</h4>
          <Button className="conform-button" onClick={conformLogOut}>
            YES
          </Button>
          <Button className="no-button" onClick={() => setConform(false)}>
            NO
          </Button>
        </div>
      </Modal>
    </>
  );
};
export default UserDetails;
