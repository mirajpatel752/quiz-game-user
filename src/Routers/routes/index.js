import { lazy } from "react";

const RoutesPaths = [
  {
    path: "/",
    component: lazy(() => import("../../Pages/LandingPage")),
    meta: {
      authRoute: false,
    },
  },
  {
    path: "/contact",
    component: lazy(() => import("../../Pages/Contact/Contact")),
    meta: {
      authRoute: false,
    },
  },
  {
    path: "/signup",
    component: lazy(() => import("../../Pages/SignUp/SignUp")),
    meta: {
      authRoute: false,
    },
  },
  {
    path: "/login",
    component: lazy(() => import("../../Pages/LogIn/LogIn")),
    meta: {
      authRoute: false,
    },
  },
  {
    path: "/account-type",
    component: lazy(() => import("../../Pages/AccountType/AccountType")),
    meta: {
      authRoute: true,
    },
  },
  {
    path: "/interested:id",
    component: lazy(() => import("../../Pages/Interested/Interested")),
    meta: {
      authRoute: true,
    },
  },
  {
    path: "/forgot-password",
    component: lazy(() => import("../../Pages/ForgotPassword/ForgotPassword")),
    meta: {
      authRoute: false,
    },
  },
  {
    path: "/reset-password",
    component: lazy(() => import("../../Pages/ResetPassword/ResetPassword")),
    meta: {
      authRoute: false,
    },
  },
  {
    path: "/dashboard",
    component: lazy(() => import("../../Pages/DashBoard/DashBoard")),
    meta: {
      authRoute: true,
    },
  },
  {
    path: "/dashboard/play",
    component: lazy(() => import("../../Pages/DashBoard/DeshBoardPlay")),
    meta: {
      authRoute: true,
    },
  },
  {
    path: "/topics",
    component: lazy(() => import("../../Pages/Topics/index")),
    meta: {
      authRoute: true,
    },
  },
  {
    path: "/events",
    component: lazy(() => import("../../Pages/Events/index")),
    meta: {
      authRoute: true,
    },
  },
  {
    path: "/teams",
    component: lazy(() => import("../../Pages/Teams/index")),
    meta: {
      authRoute: true,
    },
  },
  {
    path: "/ranking",
    component: lazy(() => import("../../Pages/RankingGeneral/index")),
    meta: {
      authRoute: true,
    },
  },
  {
    path: "/select-opponent",
    component: lazy(() => import("../../Pages/SelectOpponent/SelectOpponent")),
    meta: {
      authRoute: true,
    },
  },
  {
    path: "/online-friends",
    component: lazy(() => import("../../Pages/OnlineFriends/OnlineFriends")),
    meta: {
      authRoute: true,
    },
  },
  {
    path: "/question",
    component: lazy(() => import("../../Pages/Question/Question")),
    meta: {
      authRoute: true,
    },
  },
  {
    path: "/won",
    component: lazy(() => import("../../Pages/Question/Eevee")),
    meta: {
      authRoute: true,
    },
  },
  {
    path: "/ranking:name",
    component: lazy(() =>
      import("../../Pages/RankingGeneral/ranking-general-1")
    ),
    meta: {
      authRoute: true,
    },
  },
  {
    path: "/settings",
    component: lazy(() => import("../../Pages/Settings/index")),
    meta: {
      authRoute: true,
    },
  },
  {
    path: "/activity-log",
    component: lazy(() => import("../../Pages/ActivityLog/ActivityLog_2")),
    meta: {
      authRoute: true,
    },
  },

];

export { RoutesPaths };
