import React, { useEffect, useState, useMemo } from "react";
import { toast } from "react-toastify";
import { Modal } from "reactstrap";
import axiosInstanceAuth from "../../apiServices/axiosInstanceAuth";
import useEncryption from "../../customHook/useEncryption";
import Sidebar from "../Sidebar/sidebar";
import { useDebounce } from "../../customHook/useDebounce";
import "./OnlineFriends.scss";
import "../ActivityLog/activityLog.scss";
import { useLocation, useNavigate } from "react-router-dom";
import PromiseLoader from "../../common/Loader/PromiseLoader";
import { useMediaQuery } from "react-responsive";
import UserDetails from "../../common/Header/userDetails";
import TimerModal from "../../Modal/TimerModal";
import { io } from "socket.io-client";
import { Pagination } from "@mui/material";

const OnlineFriends = () => {
  const { state } = useLocation();
  const [withdraw, setWithdraw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isAccept, setIsAccept] = useState(false);
  const [isChallenge, setIsChallenge] = useState(false);
  const [selectedUser, setSelectedUser] = useState({});
  const [isWaiting, setIsWaiting] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [isDeclined, setIsDeclined] = useState(false);
  const [search, setSearch] = useState("");
  const [debounced] = useDebounce(search, 500);
  const [opponents, setOpponents] = useState([]);
  const [totalPage, setTotalPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const { encryptData, decryptData } = useEncryption();
  const navigate = useNavigate();
  let userData = decryptData(localStorage.getItem("user"));
  let topicDetails = decryptData(localStorage.getItem("topicDetails"));
  const isWide = useMediaQuery({ minWidth: "581px" });

  const handleChange = (event, value) => {
    setCurrentPage(value);
  };

  const getRandomOpponents = async () => {
    const encryptedData = encryptData(
      JSON.stringify({
        search: debounced.trim().length > 0 ? debounced : "",
        page_no: "1",
      })
    );
    await axiosInstanceAuth
      .post("opponents/get-friends", {
        data: encryptedData,
      })
      .then((res) => {
        const data = decryptData(res.data.data);
        if (res?.data?.status) {
          setTotalPage(res?.data?.count / 10);
          setOpponents(data);
        } else {
          toast.error(res?.data?.message);
          setOpponents([]);
        }
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  const handleSubmit = async () => {
    localStorage.removeItem("is_bot");
    localStorage.removeItem("spent_time");
    localStorage.removeItem("allQuestions");
    localStorage.removeItem("currentInd");
    setLoading(true);
    const encryptedData = encryptData(
      JSON.stringify({
        topic_id: topicDetailsMemo.id,
        opponent_id:
          selectedUser.id === undefined ? state.opponent_id : selectedUser.id,
        spent_learning_token: "5",
      })
    );
    await axiosInstanceAuth
      .post("quiz/send-request", {
        data: encryptedData,
      })
      .then((res) => {
        setLoading(false);
        const data = decryptData(res.data.data);
        if (res?.data?.status) {
          setIsChallenge(false);
          setIsWaiting(true);
          localStorage.setItem("quiz_id", data.quiz_id);
        } else {
          toast.error(res?.data?.message);
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };
  // *** time count ***
  const formatRemainingTime = (time) => {
    var minutes = Math.floor((time % 3600) / 60);
    var seconds = time % 60;

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    return `${minutes}:${seconds}`;
  };

  const renderTime = ({ remainingTime }) => {
    if (remainingTime === 0) {
      setIsWaiting(false);
      if (isWaiting) {
        setIsPending(true);
      } else if (isAccept) {
        navigate("/question", { state: true });
      }
    } else {
      return (
        <div className="time-count">{formatRemainingTime(remainingTime)}</div>
      );
    }
  };

  const formatRemainingTimeSecond = (time) => {
    var seconds = time % 60;
    return `${seconds}`;
  };

  const renderTimeSecond = ({ remainingTime }) => {
    if (remainingTime === 0) {
      setIsWaiting(false);
      if (isWaiting) {
        setIsPending(true);
      } else if (isAccept) {
        navigate("/question", { state: true });
      }
    } else {
      return (
        <div className="time-count-second">
          {formatRemainingTimeSecond(remainingTime)}
        </div>
      );
    }
  };

  const isAcceptedByOpponent = async () => {
    const encryptedData = encryptData(
      JSON.stringify({
        quiz_id: localStorage.getItem("quiz_id"),
        opponent_id: selectedUser?.id,
      })
    );
    await axiosInstanceAuth
      .post("quiz/is-accepted-by-opponent", {
        data: encryptedData,
      })
      .then((res) => {
        const data = decryptData(res.data.data);
        if (res?.data?.status) {
          if (data === 1) {
            setIsWaiting(false);
            setIsAccept(true);
          } else if (data === 2) {
            setIsWaiting(false);
            setIsDeclined(true);
          }
        } else {
        }
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  const timeCancel = () => {
    setWithdraw(true);
  };

  const getsStopTimer = async () => {
    await axiosInstanceAuth
      .get(`quiz/stop-timer/${localStorage.getItem("quiz_id")}`)
      .then((res) => {
        const data = decryptData(res.data.data);
        if (res?.data?.status) {
          setIsWaiting(false);
        } else {
          toast.error(res?.data?.message);
        }
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  const withdrawRequest = async () => {
    const encryptedData = encryptData(
      JSON.stringify({
        quiz_id: localStorage.getItem("quiz_id"),
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
          setIsWaiting(false);
          setWithdraw(false);
        } else {
          toast.error(res?.data?.message);
        }
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  useEffect(() => {
    getRandomOpponents();
  }, [debounced]);

  useEffect(() => {
    if (isPending) {
      getsStopTimer();
    }
  }, [isPending]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isWaiting) {
        isAcceptedByOpponent();
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  });
  const topicDetailsMemo = useMemo(() => {
    let topicDetailsMemo = {};
    if (state?.isModal) {
      topicDetailsMemo = {
        // icon: state?.result.topic?.top_icon,
        // name: state?.result.topic?.top_name,
        // id: state?.result.topic?.topic_id,
        icon: state?.topic?.top_icon,
        name: state?.topic?.top_name,
        id: state?.topic?.topic_id,
        color: state?.topic?.top_color_code,
      };
      setIsChallenge(true);
      setSelectedUser({
        id: state?.opponentUser.id,
        avatar: state?.opponentUser.avatar,
        user_name: state?.opponentUser?.user_name,
        country_flag: state?.opponentUser?.country_flag,
      });
    } else if (state?.isModal === false) {
      topicDetailsMemo = {
        icon: state?.topic?.top_icon,
        name: state?.topic?.top_name,
        id: state?.topic?.topic_id,
        color: state?.topic?.top_color_code,
      };
    } else {
      topicDetailsMemo = {
        icon: topicDetails?.icon,
        name: topicDetails?.name,
        id: topicDetails?.id,
        color: topicDetails?.color_code,
      };
    }
    return topicDetailsMemo;
  }, [state]);

  return (
    <>
      <div className="d-flex">
        {isWide && <Sidebar />}
        <div className="side-bar-outside">
          <div className="online-friends-wrapper">
            <div className="online-card-wrapper">
              <div className="online-card-title-wrapper">
                <img
                  onClick={() => navigate(-1)}
                  src={require("../../Assets/Img/left-arrow.svg").default}
                  alt=""
                  className="img-fluid"
                />
                <h3>Select Opponent</h3>
              </div>
              <div className="input-wrapper">
                <input
                  name="search"
                  placeholder="Search Opponent by their username"
                  autoComplete="off"
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="online-user">
                <h4>Online Users</h4>
                <div className="row">
                  {opponents.length ? (
                    opponents.map((d, i) => (
                      <div className="col-12" key={i}>
                        <div className="challenge-wrapper">
                          <div className="userName-wrapper">
                            <img
                              src={d?.avatar}
                              alt=""
                              className="img-fluid avatar"
                            />
                            <p>{d.user_name}</p>
                            {d?.country_flag && (
                              <img
                                src={d?.country_flag}
                                alt=""
                                className="img-fluid country-logo"
                              />
                            )}
                          </div>
                          <button
                            onClick={() => {
                              setSelectedUser(d);
                              setIsChallenge(true);
                            }}
                            className="challenge-btn"
                          >
                            CHALLENGE
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="record-not-found">
                      <img
                        src={require("../../Assets/Img/not-found.svg").default}
                        alt=""
                        className="img-fluid"
                      />
                      <p>Record not found</p>
                    </div>
                  )}
                </div>
              </div>
              
            </div>
            <UserDetails />
          </div>
        </div>
      </div>
      <Modal
        className="challenge-modal"
        autoFocus={true}
        centered={true}
        backdrop="static"
        isOpen={isChallenge}
      >
        <div className="challenge-modal-wrapper">
          <div className="close-icon-wrapper">
            <img
              onClick={() => setIsChallenge(false)}
              src={require("../../Assets/Img/close-icon.svg").default}
              alt=""
              className="img-fluid"
            />
          </div>
          <div className="blockchain-wrapper">
            <img src={topicDetailsMemo?.icon} alt="" className="img-fluid" />
            <h1 style={{ color: topicDetailsMemo?.color }}>
              {topicDetailsMemo?.name}
            </h1>
          </div>
          <div className="challenge-img-wrapper">
            <img
              src={userData?.avatar}
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
              className="img-fluid center-logo"
            />
            <div className="center-line"></div> */}
            <img
              src={selectedUser?.avatar}
              alt=""
              className="img-fluid user-first-img"
            />
          </div>
          <div className="title-wrapper">
            <div className="d-flex align-items-center">
              <p className="user">{userData?.user_name}</p>
              {userData?.country_flag && (
                <img
                  src={userData?.country_flag}
                  alt=""
                  className="img-fluid"
                />
              )}
            </div>
            <div className="d-flex align-items-center">
              <p className="user">{selectedUser?.user_name}</p>
              {selectedUser?.country_flag && (
                <img
                  src={selectedUser?.country_flag}
                  alt=""
                  className="img-fluid"
                />
              )}
            </div>
          </div>

          <div className="modal-footer">
            {loading ? (
              <PromiseLoader />
            ) : (
              <button onClick={handleSubmit}>
                <span>START</span>
                <img
                  src={require("../../Assets/Img/start.svg").default}
                  alt=""
                  className="img-fluid"
                />
                <span>- 5</span>
              </button>
            )}
          </div>
          <div className="d-flex justify-content-center align-items-center">
            <div className="reward-wrapper">
              <img
                src={require("../../Assets/Img/winLogo.svg").default}
                alt=""
                className="img-fluid"
              />
              <p>+9 Reward</p>
            </div>
          </div>
        </div>
      </Modal>
      {isWaiting && (
        <div style={{ display: withdraw ? "none" : "block" }}>
          <TimerModal
            isShow={withdraw}
            open={isWaiting}
            userName={selectedUser?.user_name}
            close={timeCancel}
            cancel={getsStopTimer}
            duration={120}
            renderTime={renderTime}
          />
        </div>
      )}
      {isAccept && (
        <TimerModal
          open={isAccept}
          isShow={withdraw}
          userName={selectedUser?.user_name}
          close={() => setIsAccept(false)}
          duration={3}
          renderTime={renderTimeSecond}
        />
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
                  Do you really want to decline request for &nbsp;
                  <span>{topicDetails?.name}</span>
                  &nbsp; with {selectedUser?.user_name}
                </p>
              </div>
              <div className="activity-button-wrapper">
                <button
                  onClick={() => {
                    setWithdraw(false);
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
      {/* Opponent is not available at the moment: challenge is  moved to Activity log */}
      {isPending && (
        <Modal
          className="pending-opponent-modal"
          autoFocus={true}
          centered={true}
          backdrop="static"
          isOpen={isPending}
        >
          <div className="pending-user-wrapper">
            <div className="close-icon-wrapper">
              <img
                onClick={() => setIsPending(false)}
                src={require("../../Assets/Img/close-icon.svg").default}
                alt=""
                className="img-fluid"
              />
            </div>
            <div className="title-wrapper">
              <h1>
                Opponent is not available at the moment: challenge is moved to
                Activity log
              </h1>
            </div>
            <p>
              Unless cancelled, <span>{selectedUser?.user_name}</span> will have
              24 hours to accept the challenge. Once done, you’ll get a
              notification and will have 24 hours to play.
            </p>

            <div className="footer-button-wrapper">
              <button
                onClick={() => setIsPending(false)}
                className="cancel-btn"
              >
                Close
              </button>
              <button
                className="activity-btn"
                onClick={() => navigate("/activity-log")}
              >
                Activity log
              </button>
            </div>
          </div>
        </Modal>
      )}
      {/* decline */}
      {isDeclined && (
        <Modal
          className="declined-opponent-modal"
          autoFocus={true}
          centered={true}
          backdrop="static"
          isOpen={isDeclined}
        >
          <div className="declined-wrapper">
            <div className="close-icon-wrapper">
              <img
                onClick={() => setIsDeclined(false)}
                src={require("../../Assets/Img/close-icon.svg").default}
                alt=""
                className="img-fluid"
              />
            </div>

            <div className="d-flex justify-content-center align-items-center">
              <img
                src={require("../../Assets/Img/decline.svg").default}
                alt=""
                className="img-fluid"
              />
            </div>

            <h2>Declined</h2>
            <p>
              <span>{selectedUser?.user_name}</span> declined the challenge for{" "}
              <span>{topicDetailsMemo?.name}</span>
            </p>

            <div className="footer-button-wrapper">
              <button
                onClick={() => setIsDeclined(false)}
                className="cancel-btn"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default OnlineFriends;
