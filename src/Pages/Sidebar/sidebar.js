import "./style.scss";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import logo from "../../Assets/Img/logo.svg";
import {
  Button,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Modal,
  UncontrolledDropdown,
} from "reactstrap";
import { useEffect, useMemo, useState } from "react";
import { useMediaQuery } from "react-responsive";
import UserDetails from "../../common/Header/userDetails";
import useEncryption from "../../customHook/useEncryption";
import Home from "../../Assets/Img/home.svg";
import HomeActive from "../../Assets/Img/home-active.svg";
import Topics from "../../Assets/Img/topics-d.svg";
import TopicsActive from "../../Assets/Img/topic-active.svg";
import Events from "../../Assets/Img/events-sidebar.svg";
import EventsActive from "../../Assets/Img/events-active.svg";
import Teams from "../../Assets/Img/teams-d.svg";
import TeamsActive from "../../Assets/Img/teams-active.svg";
import Rankings from "../../Assets/Img/rankings-sidebar.svg";
import RankingsActive from "../../Assets/Img/rankings-active.svg";
import Activity from "../../Assets/Img/activity.svg";
import ActivityActive from "../../Assets/Img/activity-active.svg";
import Settings from "../../Assets/Img/settings.svg";
import SettingsActive from "../../Assets/Img/settings-active.svg";
import { toast } from "react-toastify";

function Sidebar() {
  const { pathname } = useLocation();
  const { decryptData } = useEncryption();
  const [menu, setMenu] = useState(false);
  const [conform, setConform] = useState(false);
  let sidebar = document.querySelector(".sidebar");
  let closeBtn = document.querySelector("#btn");
  const isWide = useMediaQuery({ minWidth: "768px" });
  const isMobile = useMediaQuery({ maxWidth: "768px" });
  const navigate = useNavigate();
  const [isSideBar, setIsSideBar] = useState(
    parseInt(localStorage.getItem("isSideBar"))
  );

  const onToggle = () => {
    if (isSideBar === 1) {
      setIsSideBar(0);
      localStorage.setItem("isSideBar", 0);
    } else {
      setIsSideBar(1);
      localStorage.setItem("isSideBar", 1);
    }
    // sidebar.classList.toggle("open");
  };
  function menuBtnChange() {
    if (sidebar.classList.contains("open")) {
      closeBtn.classList.replace("bx-menu", "bx-menu-alt-right");
    } else {
      closeBtn.classList.replace("bx-menu-alt-right", "bx-menu");
    }
  }

  const SidebarData = [
    {
      title: "Home",
      path: "/dashboard",
      icon: pathname === "/dashboard" ? HomeActive : Home,
      cName: "nav-text",
    },
    {
      title: "Topics",
      path: "/topics",
      icon: pathname === "/topics" ? TopicsActive : Topics,
      cName: "nav-text",
    },
    {
      title: "Events",
      path: "/events",
      icon: pathname === "/events" ? EventsActive : Events,
      cName: "nav-text",
    },
    {
      title: "Teams",
      path: "/teams",
      icon: pathname === "/teams" ? TeamsActive : Teams,
      cName: "nav-text",
    },
    {
      title: "Rankings",
      path: "/ranking",
      icon:
        window.location.href.indexOf("/ranking") > -1
          ? RankingsActive
          : Rankings,
      cName: "nav-text",
    },
    {
      title: "Activity Log",
      path: "/activity-log",
      icon: pathname === "/activity-log" ? ActivityActive : Activity,
      cName: "nav-text",
    },

    {
      title: "Settings",
      path: "/settings",
      icon: pathname === "/settings" ? SettingsActive : Settings,
      cName: "nav-text",
    },
  ];
  const last3 = SidebarData.slice(-3);
  const Again = SidebarData.slice(0, -1);

  const data = useMemo(() => {
    if (menu) {
      return last3;
    } else if (isWide === false) {
      return Again;
    } else {
      return SidebarData;
    }
  }, [menu, isWide]);

  const conformLogOut = () => {
    localStorage.clear();
    navigate("/");
  };
  let userData = decryptData(localStorage.getItem("user"));
  useEffect(() => {
    if (isMobile) {
      localStorage.removeItem("isSideBar");
    }
  });

  return (
    <>
      {pathname === "/dashboard" && (
        <div className="mobile-view-logout">
          <UncontrolledDropdown setActiveFromChild>
            <DropdownToggle tag="a" className="nav-link-mobile" caret>
              <img src={userData?.avatar} alt="" className="log-out-user" />
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
                    src={
                      require("../../Assets/Img/Settings-sidenar.svg").default
                    }
                    alt=""
                    className="log-out-arrow"
                  />
                  Settings
                </Link>
              </DropdownItem>
              <DropdownItem tag="a" onClick={() => setConform(true)}>
                <img
                  src={require("../../Assets/Img/logout.svg").default}
                  alt=""
                  className="log-out-arrow"
                />
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </div>
      )}
      <div className={`sidebar ${isSideBar === 1 ? "open" : ""}`}>
        <div className="logo-details">
          <Link to="/dashboard">
            <img src={logo} className="img-fluid" alt="" />
          </Link>
        </div>
        <div onClick={onToggle} id="btn">
          <img
            src={require("../../Assets/Img/expand.svg").default}
            className="img-fluid"
            alt=""
          />
        </div>
        <ul className="nav-list">
          <>
            {" "}
            {data.map((d, i) => (
              <li key={i}>
                {d.path === "/topics" ||
                d.path === "/events" ||
                d.path === "/teams" ? (
                  <a
                    className={`disable-link ${
                      pathname === d.path ? "active-link" : ""
                    }`}
                    to={d.path}
                  >
                    <img src={d.icon} className="side-text-icon" alt="" />
                    <span
                      className={
                        pathname === d.path ? "links_name" : "links_name-mobile"
                      }
                    >
                      {d.title}{" "}
                    </span>
                  </a>
                ) : (
                  <Link
                    className={`${pathname === d.path ? "active-link" : ""}`}
                    to={d.path}
                  >
                    <img src={d.icon} className="side-text-icon" alt="" />
                    <span
                      className={
                        window.location.href.indexOf(d.path) > -1
                          ? "links_name"
                          : "links_name-mobile"
                      }
                    >
                      {d.title}{" "}
                    </span>
                  </Link>
                )}

                <span className="tooltip">{d.title}</span>
              </li>
            ))}{" "}
          </>
          {/* <li className="menuDot">
            <div className="logout-img" onClick={
                            () => setConform(true)
                        }>
              <img
                src={require("../../Assets/Img/logout.svg").default}
                alt=""
                className="logout-icon"
              />
            </div>
          </li> */}
          {/* <li className="menuDot">
            {menu === false ? (
              <div onClick={() => setMenu(!menu)}>
                <img src={menuDot} className="side-menuDot" alt="" />
              </div>
            ) : (
              <img
                onClick={() => setMenu(!menu)}
                src={close}
                alt=""
                className="img-fluid"
              />
            )}{" "}
          </li> */}
        </ul>
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
}
export default Sidebar;
