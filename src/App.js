import "react-toastify/dist/ReactToastify.css";
import React, { useContext, useEffect, useState } from "react";
import Router from "./Routers/router";
import { toast, ToastContainer } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import AuthVerify from "./common/AuthVerify";
import { UNSAFE_NavigationContext } from "react-router-dom";


const App = () => {
  const navigate = useNavigate();

  const logOut = () => {
    localStorage.clear();
    navigate("/", { replace: true });
    toast.error("Session Expired, Please Login Again");
  };

  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  const useBackListener = (callback) => {
    const navigator = useContext(UNSAFE_NavigationContext).navigator;
    useEffect(() => {
      const listener = ({ location, action }) => {
        if (action === "POP") {
          callback({ location, action });
        }
      };

      const unlisten = navigator.listen(listener);
      return unlisten;
    }, [callback, navigator]);
  };

  useBackListener(
    ({ location }) => pathname === "/won" && navigate("/activity-log")
  );

  // toast.error(window.innerWidth)
  return (
    <>
      <AuthVerify logOut={logOut} />
      <Router />
      <ToastContainer
        limit={3}
        autoClose={1200}
        hideProgressBar={true}
        newestOnTop={true}
        closeOnClick
        draggable
        pauseOnHover
        pauseOnFocusLoss={false}
      />
    </>
  );
};

export default App;
