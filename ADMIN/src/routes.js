import Dashboard from "layouts/dashboard";
import ForgotPassword from "layouts/authentication/forgot-password";
import SignIn from "layouts/authentication/sign-in";

// @mui icons
import Icon from "@mui/material/Icon";
import Category from "layouts/category";
import Topics from "layouts/topics";
import Settings from "layouts/Settings";
import LogOutConfirmation from "layouts/authentication/sign-in/confirmation";
import Questionnaires from "layouts/questionnaires";
import AccountTypes from "layouts/accountTypes";
import MatchToken from "layouts/MatchToken";
import Players from "layouts/Players";
import ReportedQuestions from "layouts/ReportedQuestions";
import Contacts from "layouts/Contacts";

const routes = [
  {
    type: "collapse",
    auth: true,
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
  },
  {
    type: "collapse",
    auth: true,
    name: "Account Types",
    key: "account-types",
    icon: <Icon fontSize="small">Account</Icon>,
    route: "/account-types",
    component: <AccountTypes />,
  },

  {
    auth: false,
    route: "/authentication/forgot-password",
    component: <ForgotPassword />,
  },
  {
    type: "collapse",
    auth: true,
    name: "Categories",
    key: "categories",
    icon: <Icon fontSize="small">category</Icon>,
    route: "/categories",
    component: <Category />,
  },

  {
    type: "collapse",
    auth: true,
    name: "Topics",
    key: "topics",
    icon: <Icon fontSize="small">topics</Icon>,
    route: "/topics",
    component: <Topics />,
  },
  {
    type: "collapse",
    auth: true,
    name: "Questions",
    key: "questions",
    icon: <Icon fontSize="small">Questions</Icon>,
    route: "/questions",
    component: <Questionnaires />,
  },
  {
    type: "collapse",
    auth: true,
    name: "Match Fees & Rewards",
    key: "match-fees-rewards",
    icon: <Icon fontSize="small">TokenIcon</Icon>,
    route: "/match-fees-rewards",
    component: <MatchToken />,
  },
  {
    type: "collapse",
    auth: true,
    name: "Players",
    key: "players",
    icon: <Icon fontSize="small">Players</Icon>,
    route: "/players",
    component: <Players />,
  },

  {
    type: "collapse",
    auth: true,
    name: "Reported Questions",
    key: "reported-questions",
    icon: <Icon fontSize="small">reported_questions</Icon>,
    route: "/reported-questions",
    component: <ReportedQuestions />,
  },
  {
    type: "collapse",
    auth: true,
    name: "Contact Us",
    key: "contacts",
    icon: <Icon fontSize="small">Contact</Icon>,
    route: "/contacts",
    component: <Contacts />,
  },


  {
    type: "collapse",
    auth: true,
    name: "Extra",
    key: "extra",
    icon: <Icon fontSize="small">settings</Icon>,
    route: "/extra",
    component: <Settings />,
  },

  {
    route: "/sign-in",
    component: <SignIn />,
  },

  {
    type: "collapse",
    auth: false,
    name: "Log out",
    key: "Log out",
    icon: <Icon fontSize="small">logout</Icon>,
    route: "/logout",
    component: <LogOutConfirmation />,
  },
];

export default routes;
