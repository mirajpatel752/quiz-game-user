import React, { useEffect, useState } from "react";
import "./ActivityLog_2.scss";
import "./activityLog.scss";
import "../Question/Question.scss";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar/sidebar";
import bookOrange from "../../Assets/Img/bookOreng.svg";
import useEncryption from "../../customHook/useEncryption";
import axiosInstanceAuth from "../../apiServices/axiosInstanceAuth";
import { toast } from "react-toastify";
import UserDetails from "../../common/Header/userDetails";
import TimerModal from "../../Modal/TimerModal";
import { Modal } from "reactstrap";
import moment from "moment";
import WonLostModal from "../Question/modal/WonLoastModal";
import "../Question/Question.scss";
import { useMediaQuery } from "react-responsive";
import Pagination from "@mui/material/Pagination";

const ActivityLog_2 = () => {
  const isWide = useMediaQuery({ minWidth: "768px" });
  const [isDecline, setIsDecline] = useState(false);
  const [withdraw, setWithdraw] = useState(false);
  const [isModal, SetIsModal] = useState(false);
  const [totalPage, setTotalPage] = useState(0);
  const [allNotifications, setAllNotifications] = useState([]);
  const [isWaiting, setIsWaiting] = useState(false);
  const [isStatus, setIsStatus] = useState(false);
  const [isWinner, setISWinner] = useState();
  const [resultData, setResultData] = useState({
    result: [],
    opponentUser: {},
    isMe: {},
    topic: {},
  });

  const { pathname, state } = useLocation();
  const [selected, setSelected] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const { encryptData, decryptData } = useEncryption();
  let userData = decryptData(localStorage.getItem("user"));
  const navigate = useNavigate();

  const handleChange = (event, value) => {
    setCurrentPage(value);
  };



  console.log(123333)

  const getOngoing = async () => {
    await axiosInstanceAuth
      .get("quiz/ongoing-quiz")
      .then((res) => {
        const data = decryptData(res.data.data);
        if (res?.data?.status) {
        } else {
          toast.error(res?.data?.message);
        }
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  const getAllNotifications = async () => {
    const encryptedData = encryptData(
      JSON.stringify({
        page_no: currentPage.toString(),
      })
    );
    await axiosInstanceAuth
      .post("notifications/get-all", {
        data: encryptedData,
      })
      .then((res) => {
        const data = decryptData(res.data.data);
        if (res?.data?.status) {
          setTotalPage(res?.data?.count / 10);
          // setAllNotifications([...allNotifications, ...data])
          setAllNotifications(data);
        } else {
          toast.error(res?.data?.message);
          // setAllNotifications([...allNotifications])
          setAllNotifications([]);
        }
      })
      .catch((err) => {
        toast.error(err);
      });
  };
  // *** time count ***
  const formatRemainingTime = (time) => {
    var seconds = time % 60;
    return `${seconds}`;
  };
  const renderTime = ({ remainingTime }) => {
    if (remainingTime === 0) {
      setIsWaiting(false);
      navigate("/question", { state: true });
    } else {
      return (
        <div className="time-count-second">
          {formatRemainingTime(remainingTime)}
        </div>
      );
    }
  };
  // Accept BTN
  const acceptRequest = async (user, userName, userImg, country) => {
    localStorage.setItem(
      "topicNameIcon",
      encryptData(
        JSON.stringify({ name: user.topic_name, icon: user.topic_icon })
      )
    );
    user.userName = userName;
    user.userImg = userImg;
    user.type = "accept";
    user.country_flag = country;
    localStorage.setItem("quiz_id", user.quiz_id);
    setSelected(user);
    SetIsModal(true);
  };

  const playRequested = async (user, userName, userImg, country) => {
    localStorage.setItem(
      "topicNameIcon",
      encryptData(
        JSON.stringify({ name: user.topic_name, icon: user.topic_icon })
      )
    );
    user.userName = userName;
    user.userImg = userImg;
    user.type = "play";
    user.country_flag = country;
    localStorage.setItem("quiz_id", user.quiz_id);
    setSelected(user);
    SetIsModal(true);
  };
  const getQuizQuestions = async () => {
    const encryptedData = encryptData(
      JSON.stringify({
        quiz_id: selected.quiz_id,
      })
    );
    await axiosInstanceAuth
      .post("quiz/get-quiz-questions", {
        data: encryptedData,
      })
      .then((res) => {
        const data = decryptData(res.data.data);
        if (res?.data?.status) {
          let filterData = [];
          let finalData = [];
          data.map((d, i) =>
            filterData.push({
              id: d.id,
              question: d.question,
              correct_answer: d.correct_answer,
              question_time: d.question_time,
              question_image: d.question_image,
              options: [
                {
                  id: d.id,
                  title: d.wrong_answer_1,
                  correctTitle: d.correct_answer,
                  correctInd: 3,
                  index: 0,
                  fieldName: "wrong_answer_1",
                  is_first: i === 0 ? 1 : 0,
                  is_last: data.length - 1 === i ? 1 : 0,
                },
                {
                  id: d.id,
                  title: d.wrong_answer_2,
                  correctTitle: d.correct_answer,
                  correctInd: 3,
                  index: 1,
                  fieldName: "wrong_answer_2",
                  is_first: i === 0 ? 1 : 0,
                  is_last: data.length - 1 === i ? 1 : 0,
                },
                {
                  id: d.id,
                  title: d.wrong_answer_3,
                  correctTitle: d.correct_answer,
                  correctInd: 3,
                  index: 2,
                  fieldName: "wrong_answer_3",
                  is_first: i === 0 ? 1 : 0,
                  is_last: data.length - 1 === i ? 1 : 0,
                },
                {
                  id: d.id,
                  title: d.correct_answer,
                  correctTitle: d.correct_answer,
                  correctInd: 3,
                  index: 3,
                  fieldName: "correct_answer",
                  is_first: i === 0 ? 1 : 0,
                  is_last: data.length - 1 === i ? 1 : 0,
                },
              ],
            })
          );
          filterData.map((d, i) =>
            finalData.push({
              id: d.id,
              question: d.question,
              correct_answer: d.correct_answer,
              question_time: d.question_time,
              question_image: d.question_image,
              options: d.options
                .map((value) => ({ value, sort: Math.random() }))
                .sort((a, b) => a.sort - b.sort)
                .map(({ value }) => value),
            })
          );
          localStorage.setItem(
            "allQuestions",
            encryptData(JSON.stringify(finalData))
          );
          localStorage.setItem("spent_time", finalData[0].question_time);
          localStorage.setItem("currentInd", 0);
          SetIsModal(false);
          setIsWaiting(true);
        } else {
          toast.error(res?.data?.message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const onStartGame = async () => {
    localStorage.removeItem("spent_time");
    localStorage.removeItem("allQuestions");
    localStorage.removeItem("currentInd");
    if (selected.type === "accept") {
      const encryptedData = encryptData(
        JSON.stringify({
          quiz_id: selected.quiz_id,
        })
      );
      await axiosInstanceAuth
        .post("quiz/accept-request", {
          data: encryptedData,
        })
        .then((res) => {
          const data = decryptData(res.data.data);
          if (res?.data?.status) {
            // getQuizQuestions()
            SetIsModal(false);
            setIsWaiting(true);
          } else {
            toast.error(res?.data?.message);
          }
        })
        .catch((err) => {
          toast.error(err);
        });
    } else if (selected.type === "play") {
      const encryptedData = encryptData(
        JSON.stringify({
          quiz_id: selected.quiz_id,
        })
      );
      await axiosInstanceAuth
        .post("quiz/play-requested-quiz", {
          data: encryptedData,
        })
        .then((res) => {
          const data = decryptData(res.data.data);
          if (res?.data?.status) {
            // getQuizQuestions()
            SetIsModal(false);
            setIsWaiting(true);
          } else {
            toast.error(res?.data?.message);
          }
        })
        .catch((err) => {
          toast.error(err);
        });
    }
  };
  const declineRequest = async () => {
    const encryptedData = encryptData(
      JSON.stringify({
        quiz_id: selected.quiz_id,
      })
    );
    await axiosInstanceAuth
      .post("quiz/decline-request", {
        data: encryptedData,
      })
      .then((res) => {
        const data = decryptData(res.data.data);
        if (res?.data?.status) {
          getAllNotifications();
          setIsDecline(false);
        } else {
          toast.error(res?.data?.message);
          setIsDecline(false);
        }
      })
      .catch((err) => {
        setIsDecline(false);
        toast.error(err);
      });
  };
  const withdrawRequest = async (data) => {
    const encryptedData = encryptData(
      JSON.stringify({
        quiz_id: selected.quiz_id,
      })
    );
    await axiosInstanceAuth
      .post("quiz/withdraw-request", {
        data: encryptedData,
      })
      .then((res) => {
        const data = decryptData(res.data.data);
        if (res?.data?.status) {
          toast.success(res?.data?.message);
          getAllNotifications();
          setWithdraw(false);
        } else {
          toast.error(res?.data?.message);
        }
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  const getResultData = async (user, result) => {
    await axiosInstanceAuth
      .get(`quiz/get-result-data/${user.quiz_id}`)
      .then((res) => {
        const data = decryptData(res.data.data);
        if (res?.data?.status) {
          localStorage.setItem("quiz_id", user.quiz_id);
          setResultData({
            ...resultData,
            result: data,
            opponentUser: {
              id:
                userData.id === user.sender_id
                  ? user.receiver_id
                  : user.sender_id,
              avatar:
                userData.id === user.sender_id
                  ? user.receiver_avatar
                  : user.sender_avatar,
              country_id:
                userData.id === user.sender_id
                  ? user.receiver_country_id
                  : user.sender_country_id,
              country_flag:
                userData.id === user.sender_id
                  ? user.receiver_country_flag
                  : user.sender_country_flag,
              full_name:
                userData.id === user.sender_id
                  ? user.receiver_full_name
                  : user.sender_full_name,
              user_name:
                userData.id === user.sender_id
                  ? user.receiver_user_name
                  : user.sender_user_name,
              xp:
                userData.id === user.sender_id
                  ? user.receiver_xp
                  : user.sender_xp,
            },
            isMe: {
              id:
                userData.id !== user.sender_id
                  ? user.receiver_id
                  : user.sender_id,
              avatar:
                userData.id !== user.sender_id
                  ? user.receiver_avatar
                  : user.sender_avatar,
              country_id:
                userData.id !== user.sender_id
                  ? user.receiver_country_id
                  : user.sender_country_id,
              country_flag:
                userData.id !== user.sender_id
                  ? user.receiver_country_flag
                  : user.sender_country_flag,
              full_name:
                userData.id !== user.sender_id
                  ? user.receiver_full_name
                  : user.sender_full_name,
              user_name:
                userData.id !== user.sender_id
                  ? user.receiver_user_name
                  : user.sender_user_name,
              xp:
                userData.id !== user.sender_id
                  ? user.receiver_xp
                  : user.sender_xp,
            },
            topic: {
              top_name: user.topic_name,
              top_icon: user.topic_icon,
              topic_id: user.topic_id,
              spent_learning_token: user.spent_learning_token,
              top_color_code: user.topic_color_code,
              opponent_id:
                userData.id === user.sender_id
                  ? user.receiver_id
                  : user.sender_id,
            },
            is_bot: {
              level: user?.options,
              is_bot: user?.is_bot,
              spent_learning_token: user?.spent_learning_token,
              win_learning_token: user?.win_learning_token,
            },
          });
          setIsStatus(true);
       
          setISWinner(result);
        } else {
          toast.error(res?.data?.message);
        }
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  const onDelete = async (data) => {
    const encryptedData = encryptData(
      JSON.stringify({
        id: data.id,
      })
    );
    await axiosInstanceAuth
      .get(`notification/delete/${data.id}`, {
        data: encryptedData,
      })
      .then((res) => {
        const data = decryptData(res.data.data);
        if (res?.data?.status) {
          getAllNotifications();
        } else {
          toast.error(res?.data?.message);
        }
      })
      .catch((err) => {
        toast.error(err);
      });
  };
  useEffect(() => {
    getAllNotifications();
  }, [currentPage]);

  useEffect(() => {
    const interval = setInterval(() => {
      getAllNotifications();
    }, 2000);
    return () => {
      clearInterval(interval);
    };
  });

  useEffect(() => {
    getOngoing();
    if (state?.isOpen) {
      setIsStatus(state?.isOpen);
      setResultData(state?.result);
    }
  }, [state]);

  return (
    <>
      <div className="d-flex">
        <Sidebar />
        <UserDetails />
        <div className="side-bar-outside">
          <div className="activity-log-page-wrapper">
            <div className="activity-log-card">
              <div className="activity-card-title-wrapper">
                <p id="demo"></p>
                <img
                  src={require("../../Assets/Img/left-arrow.svg").default}
                  alt=""
                  onClick={() => navigate(-1)}
                  className="img-fluid"
                />
                <div className="activity-log-title-wrapper">
                  <h3>Activity Log</h3>
                </div>
              </div>

              {allNotifications.map((d, i) => {
                var endDate = new Date(
                  new Date(d.request_time).getTime() + 60 * 60 * 24 * 1000
                );
                var end_date = moment(endDate);
                var start_date = moment(
                  moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
                );
                var hoursint = moment
                  .duration(end_date.diff(start_date))
                  .get("hours");
                var minutes = moment
                  .duration(end_date.diff(start_date))
                  .get("minutes");
                var timer_data = { hours: hoursint, minutes: minutes };

                if (userData?.id === d.sender_id) {
                  /* ** sender-user ** */
                  return (
                    <div>
                      {d.sender_status === 9 ||
                      d.sender_status === 10 ||
                      d.sender_status === 12 ? (
                        <div
                          className="won-loss-draw-card"
                          onClick={() => {
                            getResultData(
                              d,
                              d.sender_status === 9
                                ? "You Won"
                                : d.sender_status === 10
                                ? "You Lost"
                                : d.sender_status === 12
                                ? "Draw"
                                : "pending"
                            );
                          }}
                        >
                          <div className="topic-wrapper">
                            <img src={d.topic_icon} className="topic-img" />
                            <h3 className="topic-name">{d.topic_name}</h3>
                          </div>
                          <div className="lt-wrapper">
                            <img
                              src={
                                require("../../Assets/Img/winLogo.svg").default
                              }
                              alt=""
                              className="img-fluid"
                            />
                            <span>
                              {d.sender_status === 9
                                ? `+${d.win_learning_token}`
                                : d.sender_status === 10
                                ? 0
                                : d.sender_status === 12
                                ? `+${d.spent_learning_token}`
                                : `+${d.spent_learning_token}`}
                            </span>
                            {/* <span>+{d.win_learning_token}</span> */}
                          </div>
                          <div className="result-button">
                            {d.sender_status === 9 ? (
                              <button className="won-button">You won</button>
                            ) : d.sender_status === 10 ? (
                              <button className="lost-button">You lost</button>
                            ) : d.sender_status === 12 ? (
                              <button className="draw-button">Draw</button>
                            ) : null}
                          </div>
                          <div className="opponent-user-wrapper">
                            <p>
                              VS. <span>{d.receiver_user_name}</span>
                            </p>
                            <p>
                              {moment(d.request_time).format("DD MMM YYYY")}
                            </p>
                          </div>
                        </div>
                      ) : null}

                      {d.sender_status === 5 ||
                      d.sender_status === 11 ||
                      d.sender_status === 7 ? (
                        <div className="declined-expired-withdrawn-card">
                          <div className="d-flex justify-content-between">
                            <div className="topic-wrapper">
                              <img src={d.topic_icon} className="topic-img" />
                              <h3 className="topic-name">{d.topic_name}</h3>
                            </div>
                            <img
                              onClick={() => onDelete(d)}
                              src={
                                require("../../Assets/Img/close-notification.svg")
                                  .default
                              }
                              alt=""
                              className="img-fluid close-notification"
                            />
                          </div>
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <div className="result-button">
                              {d.sender_status === 5 && (
                                <button className="declined-button">
                                  Declined
                                </button>
                              )}
                              {d.sender_status === 11 && (
                                <button className="expired-button">
                                  Expired
                                </button>
                              )}
                              {d.sender_status === 7 && (
                                <button className="withdrawn-button">
                                  Withdrawn
                                </button>
                              )}
                            </div>
                            <div className="lt-wrapper-loss-won">
                              <span className="loss_learning_token">
                                {d.spent_learning_token}
                              </span>
                              <img
                                src={
                                  require("../../Assets/Img/declined-lt-img.svg")
                                    .default
                                }
                                alt=""
                                className="img-fluid"
                              />
                              <span className="won_learning_token">
                                {d.win_learning_token}
                              </span>
                            </div>
                          </div>
                          <div className="opponent-user-wrapper">
                            <p>
                              VS. <span>{d.receiver_user_name}</span>
                            </p>
                            <p>
                              {moment(d.request_time).format("DD MMM YYYY")}
                            </p>
                          </div>
                        </div>
                      ) : null}

                      {d.sender_status === 1 || d.sender_status === 3 ? (
                        <div className="withdraw-play-accept-decline-card">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <div className="topic-wrapper">
                              <img src={d.topic_icon} className="topic-img" />
                              <h3 className="topic-name">{d.topic_name}</h3>
                            </div>
                            <div className="lt-wrapper-loss-won">
                              <span className="loss_learning_token">
                                {d.spent_learning_token}
                              </span>
                              <img
                                src={
                                  require("../../Assets/Img/declined-lt-img.svg")
                                    .default
                                }
                                alt=""
                                className="img-fluid"
                              />
                              <span className="won_learning_token">
                                {d.win_learning_token}
                              </span>
                            </div>
                          </div>
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            {d.sender_status === 1 && (
                              <p className="challenge-sent">Challenge sent</p>
                            )}
                            {d.sender_status === 1 && (
                              <button
                                className="withdraw-button"
                                onClick={() => {
                                  setSelected(d);
                                  setWithdraw(true);
                                }}
                              >
                                Withdraw
                              </button>
                            )}
                            {d.sender_status === 3 && (
                              <p className="challenge-accepted">
                                Challenge accepted
                              </p>
                            )}
                            {d.sender_status === 3 && (
                              <button
                                className="play-button"
                                onClick={() =>
                                  playRequested(
                                    d,
                                    d.receiver_user_name,
                                    d.receiver_avatar,
                                    d?.receiver_country_flag
                                  )
                                }
                              >
                                Play
                              </button>
                            )}
                          </div>
                          <div className="opponent-user-wrapper">
                            <p>
                              VS. <span>{d.receiver_user_name}</span>
                            </p>
                            <p>
                              {moment(d.request_time).format("DD MMM YYYY")}{" "}
                              {timer_data?.hours}h:{timer_data?.minutes}m
                            </p>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  );
                } else {
                  /* ** receiver-user ** */
                  return (
                    <div>
                      {d.receiver_status === 9 ||
                      d.receiver_status === 10 ||
                      d.receiver_status === 12 ? (
                        <div
                          className="won-loss-draw-card"
                          onClick={() => {
                            getResultData(
                              d,
                              d.receiver_status === 9
                                ? "You Won"
                                : d.receiver_status === 10
                                ? "You Lost"
                                : d.receiver_status === 12
                                ? "Draw"
                                : "pending"
                            );
                          }}
                        >
                          <div className="topic-wrapper">
                            <img src={d.topic_icon} className="topic-img" />
                            <h3 className="topic-name">{d.topic_name}</h3>
                          </div>
                          <div className="lt-wrapper">
                            <img
                              src={
                                require("../../Assets/Img/winLogo.svg").default
                              }
                              alt=""
                              className="img-fluid"
                            />
                            <span>
                              {d.receiver_status === 9
                                ? `+${d.win_learning_token}`
                                : d.receiver_status === 10
                                ? 0
                                : d.receiver_status === 12
                                ? `+${d.spent_learning_token}`
                                : `+${d.spent_learning_token}`}
                            </span>
                          </div>
                          <div className="result-button">
                            {d.receiver_status === 9 ? (
                              <button className="won-button">You won</button>
                            ) : d.receiver_status === 10 ? (
                              <button className="lost-button">You lost</button>
                            ) : d.receiver_status === 12 ? (
                              <button className="draw-button">Draw</button>
                            ) : null}
                          </div>
                          <div className="opponent-user-wrapper">
                            <p>
                              VS. <span>{d.sender_user_name}</span>
                            </p>
                            <p>
                              {moment(d.request_time).format("DD MMM YYYY")}
                            </p>
                          </div>
                        </div>
                      ) : null}
                      {d.receiver_status === 6 ||
                      d.receiver_status === 11 ||
                      d.receiver_status === 8 ? (
                        <div className="declined-expired-withdrawn-card">
                          <div className="d-flex justify-content-between">
                            <div className="topic-wrapper">
                              <img src={d.topic_icon} className="topic-img" />
                              <h3 className="topic-name">{d.topic_name}</h3>
                            </div>
                            <img
                              onClick={() => onDelete(d)}
                              src={
                                require("../../Assets/Img/close-notification.svg")
                                  .default
                              }
                              alt=""
                              className="img-fluid close-notification"
                            />
                          </div>
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <div className="result-button">
                              {d.receiver_status === 6 && (
                                <button className="declined-button">
                                  Declined
                                </button>
                              )}
                              {d.receiver_status === 11 && (
                                <button className="expired-button">
                                  Expired
                                </button>
                              )}
                              {d.receiver_status === 8 && (
                                <button className="withdrawn-button">
                                  Withdrawn
                                </button>
                              )}
                            </div>
                            <div className="lt-wrapper-loss-won">
                              <span className="loss_learning_token">
                                {d.spent_learning_token}
                              </span>
                              <img
                                src={
                                  require("../../Assets/Img/declined-lt-img.svg")
                                    .default
                                }
                                alt=""
                                className="img-fluid"
                              />
                              <span className="won_learning_token">
                                {d.win_learning_token}
                              </span>
                            </div>
                          </div>
                          <div className="opponent-user-wrapper">
                            <p>
                              VS. <span>{d.sender_user_name}</span>
                            </p>
                            <p>
                              {moment(d.request_time).format("DD MMM YYYY")}
                            </p>
                          </div>
                        </div>
                      ) : null}
                      {d.receiver_status === 2 ||
                      d.sender_status === 3 ||
                      d.receiver_status === 4 ? (
                        <div
                          style={{
                            cursor:
                              d.receiver_status === 4 ? "pointer" : "default",
                          }}
                          className="withdraw-play-accept-decline-card"
                          onClick={() => {
                            d.receiver_status === 4 &&
                              getResultData(
                                d,
                                d.receiver_status === 9
                                  ? "You Won"
                                  : d.receiver_status === 10
                                  ? "You Lost"
                                  : d.receiver_status === 12
                                  ? "Draw"
                                  : "pending"
                              );
                          }}
                        >
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <div className="topic-wrapper">
                              <img src={d.topic_icon} className="topic-img" />
                              <h3 className="topic-name">{d.topic_name}</h3>
                            </div>
                            <div className="lt-wrapper-loss-won">
                              <span className="loss_learning_token">
                                {d.spent_learning_token}
                              </span>
                              <img
                                src={
                                  require("../../Assets/Img/declined-lt-img.svg")
                                    .default
                                }
                                alt=""
                                className="img-fluid"
                              />
                              <span className="won_learning_token">
                                {d.win_learning_token}
                              </span>
                            </div>
                          </div>
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            {d.receiver_status === 2 ? (
                              <>
                                <p className="challenge-received">
                                  Challenge received
                                </p>
                                <div>
                                  <button
                                    className="accept-button"
                                    onClick={() =>
                                      acceptRequest(
                                        d,
                                        d.sender_user_name,
                                        d.sender_avatar,
                                        d?.sender_country_flag
                                      )
                                    }
                                  >
                                    Accept
                                  </button>
                                  <button
                                    className="decline-button"
                                    onClick={() => {
                                      setSelected(d);
                                      setIsDecline(true);
                                    }}
                                  >
                                    Decline
                                  </button>
                                </div>
                              </>
                            ) : d.receiver_status === 4 ? (
                              <>
                                <button className="awaiting-opponent">
                                  Awaiting opponent
                                </button>
                                <img
                                  src={
                                    require("../../Assets/Img/awaiting-opponent.svg")
                                      .default
                                  }
                                  alt=""
                                  className="img-fluid awaiting-opponent-img"
                                />
                              </>
                            ) : null}
                          </div>
                          <div className="opponent-user-wrapper">
                            <p>
                              VS. <span>{d.sender_user_name}</span>
                            </p>
                            <p>
                              {moment(d.request_time).format("DD MMM YYYY")}{" "}
                              {timer_data?.hours}h:{timer_data?.minutes}m
                            </p>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  );
                }
              })}

              <div className="d-flex justify-content-center">
                {totalPage >= 1 && (
                  <Pagination
                    size={isWide ? "medium" : "small"}
                    className="text-center"
                    count={
                      totalPage % 1 == 0
                        ? Math.floor(totalPage)
                        : Math.floor(totalPage) + 1
                    }
                    page={currentPage}
                    onChange={handleChange}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {isModal && (
        <Modal
          className="won-lost-modal-activityModal"
          autoFocus={true}
          centered={true}
          backdrop="static"
          isOpen={isModal}
        >
          <div className="won-lost-contend">
            <div className="close-icon-wrapper">
              <img
                onClick={() => SetIsModal(false)}
                src={require("../../Assets/Img/close-icon.svg").default}
                alt=""
                className="img-fluid"
              />
            </div>
            <div className="modal-root">
              <div className="won-lost-contend-start">
                <img src={selected.topic_icon} alt="" className="img-fluid" />
                <h1
                  style={{ color: selected.topic_color_code }}
                  className="wen-lost-title"
                >
                  {selected.topic_name}
                </h1>
              </div>
              <div className="challenge-img-wrapper">
                <img
                  src={userData.avatar}
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
                    className="img-fluid"
                  />
                  <div className="center-line"></div> */}
                <img
                  src={selected.userImg}
                  alt=""
                  className="img-fluid user-first-img"
                />
              </div>
              <div className="title-wrapper">
                <div className="">
                  <div className="d-flex justify-content-between">
                    <p className="user">{userData.user_name}</p>
                    <img
                      src={userData?.country_flag}
                      alt=""
                      className="img-fluid country-logo"
                    />
                  </div>
                </div>
                <div className="">
                  <div className="d-flex justify-content-between">
                    <p className="user">{selected.userName}</p>
                    <img
                      src={selected?.country_flag}
                      alt=""
                      className="img-fluid country-logo"
                    />
                  </div>
                </div>
              </div>
              <div>
                <div className="d-flex justify-content-center">
                  <button className="start-button" onClick={onStartGame}>
                    START
                    <img
                      src={require("../../Assets/Img/book-white.svg").default}
                      alt=""
                      className="img-fluid"
                    />
                    - 5
                  </button>
                </div>
                <div className="details-wrapper-reward d-flex justify-content-center">
                  <div className="reward-box">
                    <div className="d-flex justify-content-center align-items-center">
                      <img
                        src={require("../../Assets/Img/book-icon.svg").default}
                        alt=""
                        className="img-fluid"
                      />
                      <p className="reward">+ 9 Reward</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
      {isWaiting && (
        <TimerModal
          userName={selected.userName}
          open={isWaiting}
          close={() => setIsWaiting(false)}
          duration={3}
          renderTime={renderTime}
        />
      )}

      {isStatus && (
        <WonLostModal
          wonModal={isStatus}
          result={resultData}
          isWinner={isWinner}
          setWonOpen={setIsStatus}
        />
      )}
      {isDecline && (
        <Modal
          className="activity-delete-modal"
          autoFocus={true}
          centered={true}
          backdrop="static"
          isOpen={isDecline}
        >
          <div className="activity-wrapper">
            <div className="close-icon-wrapper">
              <img
                onClick={() => setIsDecline(false)}
                src={require("../../Assets/Img/close-icon.svg").default}
                alt=""
                className="img-fluid"
              />
            </div>
            <div className="activity-contend">
              <div className="d-flex justify-content-center align-items-center">
                <img
                  src={require("../../Assets/Img/decline.svg").default}
                  alt=""
                  className="activity-image"
                />
              </div>
              <h2>Are you sure?</h2>
              <div className="activity-details">
                <p>
                  Do you really want to decline request for{" "}
                  <span>{selected.topic_name}</span> with{" "}
                  {selected.sender_user_name}
                </p>
              </div>
              <div className="activity-button-wrapper">
                <button
                  onClick={() => {
                    setIsDecline(false);
                    setSelected({});
                  }}
                  className="cancel-btn"
                >
                  Cancel
                </button>
                <button onClick={declineRequest} className="delete-btn">
                  Decline
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
      {withdraw && (
        <Modal
          className="activity-delete-modal"
          autoFocus={true}
          centered={true}
          backdrop="static"
          isOpen={withdraw}
        >
          <div className="activity-wrapper">
            <div className="close-icon-wrapper">
              <img
                onClick={() => setWithdraw(false)}
                src={require("../../Assets/Img/close-icon.svg").default}
                alt=""
                className="img-fluid"
              />
            </div>
            <div className="activity-contend">
              <div className="d-flex justify-content-center align-items-center">
                <img
                  src={
                    require("../../Assets/Img/withdraw-modal-icon.svg").default
                  }
                  alt=""
                  className="activity-image"
                />
              </div>
              <h2>Are you sure?</h2>
              <div className="activity-details">
                <p>
                  Do you really want to decline request for{" "}
                  <span>{selected.topic_name}</span> with{" "}
                  {selected.sender_user_name}
                </p>
              </div>
              <div className="activity-button-wrapper">
                <button
                  onClick={() => {
                    setWithdraw(false);
                    setSelected({});
                  }}
                  className="cancel-btn"
                >
                  Cancel
                </button>
                <button onClick={withdrawRequest} className="withdraw-btn">
                  Withdraw
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default ActivityLog_2;
