import Home from "../../Assets/Img/home.svg";
import Topics from "../../Assets/Img/topics-d.svg";
import Events from "../../Assets/Img/events-sidebar.svg";
import Teams from "../../Assets/Img/teams-d.svg";
import Rankings from "../../Assets/Img/rankings-sidebar.svg";
import Activity_Log from "../../Assets/Img/activity.svg";
import Settings from "../../Assets/Img/Settings-sidenar.svg";

const SidebarData = [
    {
        title: "Home",
        path: "/dashboard",
        icon: Home,
        cName: "nav-text"
    },
    {
        title: "Topics",
        path: "/topics",
        icon: Topics,
        cName: "nav-text"
    },
    {
        title: "Events",
        path: "/events",
        icon: Events,
        cName: "nav-text"
    },
    {
        title: "Teams",
        path: "/teams",
        icon: Teams,
        cName: "nav-text"
    },
    {
        title: "Rankings",
        path: "/ranking",
        icon: Rankings,
        cName: "nav-text"
    },
    {
        title: "Activity Log",
        path: "/activity-log",
        icon: Activity_Log,
        cName: "nav-text"
    }, {
        title: "Settings",
        path: "/Settings",
        icon: Settings,
        cName: "nav-text"
    },
];

export { SidebarData }