import React, { useEffect, useMemo, useState } from "react";
import { Modal } from "reactstrap";
import checked from "../../Assets/Img/checked.svg";
import ReviewQuestions from "./modal/ReviewQuestions";
import "./modal/modal.scss";
import "../DashBoard/DashBoard.scss";
import { useMediaQuery } from "react-responsive";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axiosInstanceAuth from "../../apiServices/axiosInstanceAuth";
import { toast } from "react-toastify";
import useEncryption from "../../customHook/useEncryption";
import Sidebar from "../Sidebar/sidebar";
import PromiseLoader from "../../common/Loader/PromiseLoader";

const Eevee = ({
  setWonOpen,
  result,
  isWinner,
  isAccessCode,
  setIsAccessCode,
  setIsReportIssue,
  isReportIssue,
  flag,
}) => {
  const [queID, setQueID] = useState();
  const isWide = useMediaQuery({ minWidth: "767px" });
  const { encryptData, decryptData } = useEncryption();
  let userData = decryptData(localStorage.getItem("user"));
  const [review, setReview] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isReport, setIsReport] = useState(false);
  const [winner, setWinner] = useState("");
  const navigate = useNavigate();
  const { pathname, state } = useLocation();
  const [detail, setDetail] = useState({});
  const [is_bot, setIs_bot] = useState(null);
  const [fields, setFields] = useState({
    access_code: "",
    wrong_answer: false,
    too_short_time_to_answer: false,
    off_topic: false,
    other: false,
    otherTitle: "",
    title: "",
  });
  const [error, setError] = useState({
    status: false,
    type: "",
    message: "",
  });

  const reviewQuestion = () => {
    setReview(!review);
  };

  const data = useMemo(() => {
    if (result) {
      return result;
    }
    if (state) {
      return state.resultData;
    }
  }, [state, result]);

  const getDetail = async () => {
    const quiz_id = localStorage.getItem("quiz_id");
    await axiosInstanceAuth
      .get(`quiz/get-detail/${quiz_id}`)
      .then((res) => {
        const data = decryptData(res.data.data);
        if (res?.data?.status) {
          setDetail(data);
          setWinner(
            userData.id === data.winner_id
              ? "You Won"
              : data.winner_id !== 0
              ? "You Lost"
              : data.winner_id === 0 && data.is_draw === 1
              ? "Draw"
              : "pending"
          );
          setIs_bot(data?.is_bot);
        } else {
          toast.error(res?.data?.message);
        }
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  const onChangeAccess = (e) => {
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
    } else if (detail.top_access_code !== value) {
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

  const onChange = (e) => {
    const value = e.target.value.replace(/^\s+|\s+$/gm, " ");
    const name = e.target.name;
    const checked = e.target.checked;
    if (name === "wrong_answer") {
      if (checked) {
        setError({
          ...error,
          status: false,
          type: "",
          message: "",
        });
        setFields({
          wrong_answer: checked,
          title: "Wrong answer",
          otherTitle: "",
        });
      } else {
        setError({
          ...error,
          status: true,
          type: "terms",
          message: "please check terms",
        });
        setFields({
          wrong_answer: checked,
          title: "",
          otherTitle: "",
        });
      }
    }
    if (name === "too_short_time_to_answer") {
      if (checked) {
        setError({
          ...error,
          status: false,
          type: "",
          message: "",
        });
        setFields({
          too_short_time_to_answer: checked,
          title: "Insufficient time to answer",
          otherTitle: "",
        });
      } else {
        setError({
          ...error,
          status: true,
          type: "terms",
          message: "please check terms",
        });
        setFields({
          too_short_time_to_answer: checked,
          title: "",
          otherTitle: "",
        });
      }
    }
    if (name === "off_topic") {
      if (checked) {
        setError({
          ...error,
          status: false,
          type: "",
          message: "",
        });
        setFields({
          off_topic: checked,
          title: "Off topic",
          otherTitle: "",
        });
      } else {
        setError({
          ...error,
          status: true,
          type: "terms",
          message: "please check terms",
        });
        setFields({
          off_topic: checked,
          title: "",
          otherTitle: "",
        });
      }
    }
    if (name === "other") {
      if (checked) {
        setError({
          ...error,
          status: false,
          type: "",
          message: "",
        });
        setFields({
          other: checked,
          title: "",
          otherTitle: "",
        });
      } else {
        setError({
          ...error,
          status: true,
          type: "terms",
          message: "please check terms",
        });
        setFields({
          other: checked,
          title: "",
          otherTitle: "",
        });
      }
    }
    if (name === "otherTitle") {
      if (value.length > 1) {
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
          type: "terms",
          message: "please check terms",
        });
        setFields({
          ...fields,
          [name]: value,
        });
      }
    }
  };

  const onReport = (d) => {
    setQueID(d.question_id);
    if (state) {
      setIsReport(true);
    } else {
      setIsReportIssue(true);
    }
  };

  const onNavigate = (id) => {
    if (detail.opponent_id === id && detail?.top_access === "Close") {
      if (state) {
        setIsOpen(true);
      } else {
        setIsAccessCode(true);
      }
    } else if (is_bot === 1) {
      localStorage.setItem("is_bot", 1);
      navigate("/select-opponent", {
        state: { ...data, ...data.topic, isModal: true },
      });
    } else {
      navigate("/online-friends", {
        state: { ...data, ...data.topic, isModal: true },
      });
    }
  };

  const handleSubmit = () => {
    navigate("/online-friends", {
      state: { ...data, ...data.topic, isModal: true },
    });
  };

  const postReport = async () => {
    if ((fields.other && fields?.otherTitle?.length) <= 0) {
      toast.error("Please fill input");
    } else if (!fields.other && fields?.title?.length <= 0) {
      toast.error("Please select report");
    } else {
      const encryptedData = encryptData(
        JSON.stringify({
          question_id: queID,
          report_reason: fields.other ? fields.otherTitle : fields.title,
        })
      );
      await axiosInstanceAuth
        .post("questions/report", {
          data: encryptedData,
        })
        .then((res) => {
          const data = decryptData(res.data.data);
          if (res?.data?.status) {
            if (state) {
              setIsReport(false);
            } else {
              setIsReportIssue(false);
            }
            setFields({});
            toast.success(res?.data?.message);
          } else {
            toast.error(res?.data?.message);
          }
        })
        .catch((err) => {
          toast.error(err);
        });
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (winner.length <= 0 || winner === "pending") {
        getDetail();
      }
    }, 100);
    return () => {
      clearInterval(interval);
    };
  });

  useEffect(() => {
    localStorage.removeItem("is_bot");
  }, []);

  return (
    <>
      <div>
        {/* {state && <Sidebar />} */}
        <div className="modal-page">
          <div className="close-icon-wrapper">
            <img
              type="button"
              onClick={() => {
                flag === true
                  ? setWonOpen(false)
                  : isWide
                  ? setWonOpen(false)
                  : navigate(-1);
              }}
              src={require("../../Assets/Img/close-icon.svg").default}
              alt=""
              className="img-fluid"
            />
          </div>
          <div className="modal-root">
            <div className="won-lost-contend-start">
              <div className="d-flex align-items-center title-icon">
                {data?.topic?.top_icon && (
                  <img
                    src={data?.topic?.top_icon}
                    alt=""
                    className="img-fluid title-img"
                  />
                )}
                <h1
                  style={{ color: data?.topic?.top_color_code }}
                  className="wen-lost-title"
                >
                  {data?.topic?.top_name}
                </h1>
              </div>
              <div className="side-back-array">
                <img
                  onClick={() => navigate("/activity-log")}
                  src={require("../../Assets/Img/close-icon.svg").default}
                  alt=""
                />
              </div>
            </div>
            <div className="you-won-button">
              {winner === "You Won" ? (
                <button className="button-won">You Won</button>
              ) : winner === "You Lost" ? (
                <button className="button-loss">You Lost</button>
              ) : winner === "pending" ? (
                <button className="awaiting-opponent-button">
                  Awaiting opponent
                </button>
              ) : winner === "Draw" ? (
                <button className="button-draw">Draw</button>
              ) : (
                <PromiseLoader />
              )}
            </div>
            <div className="challenge-img-wrapper">
              <img
                src={data.isMe.avatar}
                alt=""
                className="img-fluid user-first-img"
              />
              <img
                src={require("../../Assets/Img/lineLogo.svg").default}
                alt=""
                className="img-fluid logo"
              />
              {/* <div className="center-line"></div>
              <img
                src={require("../../Assets/Img/logo.svg").default}
                alt=""
                className="img-fluid logo"
              />
              <div className="center-line"></div> */}
              <img
                src={data?.opponentUser?.avatar}
                alt=""
                className="img-fluid user-first-img"
              />
            </div>

            <div className="title-wrapper">
              <div className="">
                <div className="d-flex justify-content-between">
                  <p className="user">{data?.isMe?.user_name}</p>
                  <img
                    src={data?.isMe?.country_flag}
                    alt=""
                    className="img-fluid"
                  />
                </div>
                <div className="d-flex justify-content-between">
                  <p className="user-xp">XP</p>
                  <p className="user-xp">
                    {winner === "pending"
                      ? "---"
                      : detail.player_id !== userData.id
                      ? detail.xp_opponent
                      : detail.xp_player}
                  </p>
                </div>
              </div>
              <div className="">
                <div className="d-flex justify-content-between">
                  <p className="user">{data?.opponentUser?.user_name}</p>
                  <img
                    src={data?.opponentUser?.country_flag}
                    alt=""
                    className="img-fluid"
                  />
                </div>
                <div className="d-flex justify-content-between">
                  <p className="user-xp">XP</p>
                  <p className="user-xp">
                    {winner === "pending"
                      ? "---"
                      : detail.player_id === userData.id
                      ? detail.xp_opponent
                      : detail.xp_player}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <div className="details-wrapper-reward d-flex justify-content-center">
                <div className="reward-box">
                  <div className="d-flex justify-content-center align-items-center">
                    <img
                      src={require("../../Assets/Img/book-icon.svg").default}
                      alt=""
                      className="img-fluid"
                    />
                    <p className="reward">
                      {winner === "You Won"
                        ? `+ ${
                            detail.win_learning_token
                              ? detail.win_learning_token
                              : ""
                          }`
                        : winner === "Draw"
                        ? `+ ${
                            detail.spent_learning_token !== undefined
                              ? detail.spent_learning_token
                              : ""
                          }`
                        : winner === "pending"
                        ? "?"
                        : 0}{" "}
                      Reward
                    </p>
                  </div>
                </div>
              </div>
              <div className="d-flex  justify-content-between won-option">
                <button
                  className="won-opponent"
                  onClick={() =>
                    navigate("/online-friends", {
                      state: { ...data, ...data.topic, isModal: false },
                    })
                  }
                >
                  New opponent
                </button>
                <button
                  className="won-pay-again"
                  onClick={() => onNavigate(data?.isMe?.id)}
                >
                  Play again
                </button>
              </div>

              <div className="d-flex justify-content-center review-button-wrap">
                {/* {isWide && ( */}
                <button className="review-button" onClick={reviewQuestion}>
                  Review questions{" "}
                  <img
                    className={review ? "down-arrow" : "up-arrow"}
                    src={require("../../Assets/Img/arrow-down.svg").default}
                    alt="arrow"
                  />
                </button>
                {/* )} */}
              </div>
            </div>
          </div>
          <div className="questions-root">
            <div className="questions">
              {review && (
                <>
                  {/* <h3 className="questions-title">Review Questions</h3> */}
                  <ReviewQuestions
                    result={data}
                    setQueID={setQueID}
                    onReport={onReport}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal
        className="access-code-modal"
        autoFocus={true}
        centered={true}
        backdrop="static"
        isOpen={state ? isOpen : isAccessCode}
      >
        <div className="access-code-wrapper">
          <div className="close-icon-wrapper">
            <img
              onClick={() => {
                state ? setIsOpen(false) : setIsAccessCode(false);
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
            onChange={onChangeAccess}
            className={`${
              error.status && error.type === "access_code" ? "" : "mb-69"
            } access_code-input`}
            name="access_code"
            value={fields.access_code}
            placeholder="Enter Access Code"
          />
          {error.status && error.type === "access_code" && (
            <div className="input-access_code-error">{error.message}</div>
          )}
          <button onClick={handleSubmit}>Play</button>
        </div>
      </Modal>

      <Modal
        className="report-issue-modal"
        autoFocus={true}
        centered={true}
        backdrop="static"
        isOpen={isReport || isReportIssue}
      >
        <div className="report-issue-wrapper">
          <div className="close-icon-wrapper">
            <img
              onClick={() => {
                if (state) {
                  setIsReport(false);
                } else {
                  setIsReportIssue(false);
                }
                setFields({});
              }}
              src={require("../../Assets/Img/close-icon.svg").default}
              alt=""
              className="img-fluid"
            />
          </div>
          <h1 className="report-title">Report Issue</h1>
          <div className="report-check-box-wrapper">
            <div className="report-item-checkbox">
              <input
                type="checkbox"
                name="wrong_answer"
                checked={fields.wrong_answer ? true : false}
                onChange={onChange}
                id="wrong_answer"
              />
              <label htmlFor="wrong_answer">Wrong answer</label>
            </div>
            <div className="report-item-checkbox">
              <input
                type="checkbox"
                name="too_short_time_to_answer"
                checked={fields.too_short_time_to_answer ? true : false}
                onChange={onChange}
                id="too_short_time_to_answer"
              />
              <label htmlFor="too_short_time_to_answer">
                Insufficient time to answer
              </label>
            </div>
            <div className="report-item-checkbox">
              <input
                type="checkbox"
                name="off_topic"
                checked={fields.off_topic ? true : false}
                onChange={onChange}
                id="off_topic"
              />
              <label htmlFor="off_topic">Off topic</label>
            </div>
            <div
              style={{ marginBottom: "15px" }}
              className="report-item-checkbox"
            >
              <input
                type="checkbox"
                name="other"
                checked={fields.other ? true : false}
                onChange={onChange}
                id="other"
              />
              <label htmlFor="other">Other</label>
            </div>
            <div className="report-item-input">
              <input
                disabled={!fields.other}
                type="text"
                name="otherTitle"
                placeholder="If other type here"
                value={fields.otherTitle}
                onChange={onChange}
                id="otherTitle"
              />
            </div>
          </div>
          <div className="text-center">
            <button onClick={postReport} className="cancel-btn">
              Submit
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Eevee;
