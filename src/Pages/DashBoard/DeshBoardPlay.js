import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useEncryption from "../../customHook/useEncryption";
import "../DashBoard/DashBoard.scss";
import Sidebar from "../Sidebar/sidebar";
import ShowMoreText from "react-show-more-text";
import { Modal } from "reactstrap";
import { useMediaQuery } from "react-responsive";
import axiosInstanceAuth from "../../apiServices/axiosInstanceAuth";
import { toast } from "react-toastify";
import { useEffect } from "react";

const DeshBoardPlay = ({ setIsPlay, view, openAccess }) => {
  const [fields, setFields] = useState({
    access_code: "",
  });
  const [error, setError] = useState({
    status: false,
    type: "",
    message: "",
  });
  const [accessCode, setAccessCode] = useState("");
  const [isAccessCode, setIsAccessCode] = useState(false);
  const [is, setIs] = useState(false);
  const { decryptData } = useEncryption();
  // let userData = decryptData(localStorage.getItem("user"));
  const [userData, setUserData] = React.useState({});
  let topicDetails = decryptData(localStorage.getItem("topicDetails"));
  let topicName = topicDetails?.name.replace(/\s+/g, "-").toLowerCase();
  const navigate = useNavigate();
  const { state } = useLocation();
  const isWide = useMediaQuery({ minWidth: "800px" });

  const data = useMemo(() => {
    if (view) {
      return view;
    }
    if (state) {
      return state;
    }
  }, [state, view]);

  useEffect(() => {
    if (is) {
      if (isWide) {
        if (topicDetails?.access === "Close") {
          setAccessCode(topicDetails?.access_code);
          setIsPlay(false);
          openAccess(true);
        } else {
          navigate("/select-opponent");
        }
      } else {
        if (topicDetails?.access === "Close") {
          setAccessCode(topicDetails?.access_code);
          setIsAccessCode(true);
        } else {
          navigate("/select-opponent");
        }
      }
    }
  }, [is]);

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

  const onChange = (e) => {
    const value = e.target.value.replace(/^\s+|\s+$/gm, "");
    const name = e.target.name;
    if (value.length === 0) {
      setError({
        ...error,
        status: true,
        type: "access_code",
        message: "access code is required",
      });
      setFields({
        ...fields,
        [name]: value,
      });
    } else if (accessCode !== value) {
      setError({
        ...error,
        status: true,
        type: "access_code",
        message: "Invalid access code",
      });
      setFields({
        ...fields,
        [name]: value,
      });
    } else {
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
    }
  };

  const handleSubmit = () => {
    if (accessCode !== fields.access_code) {
      setError({
        ...error,
        status: true,
        type: "access_code",
        message: "Invalid access code",
      });
    } else if (fields.access_code.length <= 0) {
      setError({
        ...error,
        status: true,
        type: "access_code",
        message: "Invalid access code",
      });
    } else {
      navigate("/select-opponent");
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <>
      <div className="d-flex">

        <div className="blockchain-term w-100">
          <div className="close-icon-wrapper">
            <img
              onClick={() => setIsPlay(false)}
              src={require("../../Assets/Img/close-icon.svg").default}
              alt=""
              className="img-fluid"
            />
          </div>
          <div className="details-wrapper">
            <div className="d-flex mobile-view">
              <img
                src={require("../../Assets/Img/left-arrow.svg").default}
                alt=""
                onClick={() => navigate("/dashboard")}
                className="img-back-modal-icon"
              />
              <h1 style={{ color: data.color_code }}> {data?.name}</h1>
            </div>

            <div className="description-wrapper">
              <img
                onClick={() => setIsPlay(false)}
                src={data?.icon}
                alt=""
                className="img-fluid"
              />
          
              <ShowMoreText
                className="description-modal"
                lines={2}
                anchorClass="show-more-text"
                more="show more"
                less=" show less"
                expanded={false}
                width={0}
              >
                {data?.description}
              </ShowMoreText>
            </div>
            <div className="button-wrapper">
              <button onClick={() => navigate(`/ranking-${topicName}`)}>
                {" "}
                Rankings
              </button>
              <div className="avatar-wrapper">
                <img src={userData?.avatar} alt="" className="img-fluid" />
                <p>XP : {data.topic_xp}</p>
              </div>
            </div>
            <div className="progress-wrapper">
              <div className="progress-track">
                <div
                  className="current-progress"
                  style={{
                    width: `${
                      data.user_que !== 0 && data.all_que !== 0
                        ? ((data.user_que / data.all_que) * 100).toFixed(2)
                        : 0
                    }%`,
                    background: data.color_code,
                  }}
                ></div>
              </div>
              <div className="title-wrapper">
                <p>Questions Completed</p>
                <h6>
                  {data.user_que !== 0 && data.all_que !== 0
                    ? ((data.user_que / data.all_que) * 100).toFixed(2)
                    : 0}{" "}
                  %
                </h6>
              </div>
            </div>
            <div className="team-info-card">
              <div className="term-title-wrapper">
                <img
                  src={require("../../Assets/Img/blockchain.svg").default}
                  alt=""
                  className="img-fluid"
                />
                <h4>TEAM INFO</h4>
                <img
                  src={require("../../Assets/Img/term.svg").default}
                  alt=""
                  className="img-fluid"
                />
              </div>
              <p>You are currently not a member of any team.</p>
              <div className="button-wrapper">
                <button className="join-button">Join a team</button>
                <button className="create-button">Create a team</button>
              </div>
              <div className="team-info-card-lock-wrapper">
                <img src={require("../../Assets/Img/card-lock.svg").default} />
              </div>
            </div>
            <div className="paly-btn">
              <button onClick={() => setIs(!is)}>
                <img
                  src={require("../../Assets/Img/play.svg").default}
                  alt=""
                  className="img-fluid"
                />
                <span>Play</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal
        className="access-code-modal"
        autoFocus={true}
        centered={true}
        backdrop="static"
        isOpen={isAccessCode}
      >
        <div className="access-code-wrapper">
          <div className="close-icon-wrapper">
            <img
              onClick={() => {
                setIsAccessCode(false);
                setIs(!is);
              }}
              src={require("../../Assets/Img/close-icon.svg").default}
              alt=""
              className="img-fluid"
            />
          </div>
          <img
            src={require("../../Assets/Img/access-code.svg").default}
            alt=""
            className="img-fluid"
          />
          <h4>Access Code</h4>
          <p>Please Enter Access Code to play closed topics</p>
          <input
            onChange={onChange}
            className={`${
              error.status && error.type === "access_code" ? "" : "mb-69"
            } access_code-input`}
            name="access_code"
            value={fields.access_code}
            placeholder="Enter Access Code"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSubmit(e);
              }
            }}
          />
          {error.status && error.type === "access_code" && (
            <div className="input-access_code-error">{error.message}</div>
          )}
          <button onClick={handleSubmit}>Play</button>
        </div>
      </Modal>
    </>
  );
};

export default DeshBoardPlay;
