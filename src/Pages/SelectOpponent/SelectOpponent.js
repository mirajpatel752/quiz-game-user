import React, { useEffect, useMemo, useState } from "react";
import "./SelectOpponent.scss";
import "../OnlineFriends/OnlineFriends.scss";
import Sidebar from "../Sidebar/sidebar";
import winLogo from "../../Assets/Img/winLogo.svg";
import whatsapp from "../../Assets/Img/whatsapp.svg";
import facebook from "../../Assets/Img/facebook.svg";
import twitter from "../../Assets/Img/twitter.svg";
import mail from "../../Assets/Img/mail.svg";
import { Modal } from "reactstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axiosInstanceAuth from "../../apiServices/axiosInstanceAuth";
import useEncryption from "../../customHook/useEncryption";
import { toast } from "react-toastify";
import CopyToClipboard from "react-copy-to-clipboard";
import UserDetails from "../../common/Header/userDetails";
import { useDebounce } from "../../customHook/useDebounce";
import PromiseLoader from "../../common/Loader/PromiseLoader";
import TimerModal from "../../Modal/TimerModal";
import { useMediaQuery } from "react-responsive";

const SelectOpponent = () => {
  const { state } = useLocation();
  const [isInvite, setIsInvite] = useState(false);
  const [training, setTraining] = useState([]);
  const [isDeclined, setIsDeclined] = useState(false);
  const [isAccept, setIsAccept] = useState(false);
  const [search, setSearch] = useState("");
  const [debounced] = useDebounce(search, 500);
  const [opponents, setOpponents] = useState([]);
  const [question, setQuestion] = useState([]);
  const [isChallenge, setIsChallenge] = useState(false);
  const [selectedUser, setSelectedUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [withdraw, setWithdraw] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [isStartBtn, setIsStartBtn] = useState(false);
  const [isQuizIsRandomUserStart, setIsQuizIsRandomUserStart] = useState(0);
  const [isOpponent, setIsOpponent] = useState(false);
  const [opponentCount, setOpponentCount] = useState(1);
  const [isBotOpponent, setIsBotOpponent] = useState(false);
  const [isBotOpponentUser, setIsBotOpponentUser] = useState({});
  const [userBalance, setUserBalance] = useState({});
  const [randomOpponent, setRandomOpponent] = useState({
    entry_fee: "",
    options: "",
    topic_id: "",
    win_reward: "",
  });
  const [isStatus, setIsStatus] = useState(false);
  const { encryptData, decryptData } = useEncryption();
  const navigate = useNavigate();
  let topicDetails = decryptData(localStorage.getItem("topicDetails"));
  let userData = decryptData(localStorage.getItem("user"));
  const isWide = useMediaQuery({ minWidth: "651px" });
  const shareLink = [
    {
      icon: whatsapp,
      link: "",
    },
    {
      icon: facebook,
      link: "",
    },
    {
      icon: twitter,
      link: "",
    },
    {
      icon: mail,
      link: "",
    },
  ];

  const matchTokenTraining = async () => {
    await axiosInstanceAuth
      .get(`match-fees-rewards/${topicDetailsMemo.id}`)
      .then((res) => {
        const data = decryptData(res.data.data);
        if (res?.data?.status) {
          setTraining(data);
        } else {
          toast.error(res?.data?.message);
          setTraining([]);
        }
      })
      .catch((err) => {
        toast.error(err);
      });
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
        opponent_id: selectedUser.id,
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

  const quizIsRandomUserStart = async () => {
    setLoading(true);
    const encryptedData = encryptData(
      JSON.stringify({
        topic_id: randomOpponent?.topic_id,
        level: randomOpponent?.options,
      })
    );
    await axiosInstanceAuth
      .post("quiz/is-random-user-start", {
        data: encryptedData,
      })
      .then((res) => {
        const data = decryptData(res.data.data);
        if (res?.data?.status) {
          if (data === 1) {
            setLoading(false);
            setIsQuizIsRandomUserStart(data);
            quizPlayRandomly();
          }
        }
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  const quizPlayRandomly = async () => {
    setLoading(true);
    localStorage.removeItem("spent_time");
    localStorage.removeItem("allQuestions");
    localStorage.removeItem("currentInd");
    setLoading(true);
    const encryptedData = encryptData(
      JSON.stringify({
        topic_id: randomOpponent?.topic_id,
        opponent_id: isBotOpponentUser?.id,
        spent_learning_token: randomOpponent?.entry_fee,
        level: randomOpponent?.options,
      })
    );
    await axiosInstanceAuth
      .post("quiz/play-randomly", {
        data: encryptedData,
      })
      .then((res) => {
        setLoading(false);
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
              question_id: d.question_id,
              bot_time: d?.bot_time,
              bot_answer_key: d?.bot_answer_key,
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
              question_id: d.question_id,
              question: d.question,
              correct_answer: d.correct_answer,
              bot_time: d?.bot_time,
              bot_answer_key: d?.bot_answer_key,
              question_time: d.question_time,
              question_image: d.question_image,
              options: d.options
                .map((value) => ({ value, sort: Math.random() }))
                .sort((a, b) => a.sort - b.sort)
                .map(({ value }) => value),
            })
          );
          localStorage.setItem("quiz_id", res?.data?.quiz_id);
          localStorage.setItem(
            "allQuestions",
            encryptData(JSON.stringify(finalData))
          );
          localStorage.setItem("spent_time", finalData[0].question_time);
          localStorage.setItem("currentInd", 0);
          setQuestion(data);
          setIsBotOpponent(false);
          setIsAccept(true);
        } else {
          toast.error(res?.data?.message);
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  const handleSubmitBotUser = async () => {
    setIsStartBtn(true);
    if (isStatus) {
      quizIsRandomUserStart();
    } else {
      quizPlayRandomly();
    }
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

  const onRandomOpponent = (data) => {
    setRandomOpponent(data);
    if (userBalance?.lt >= data?.entry_fee) {
      setIsOpponent(true);
    } else {
      toast.error("you don't have enough learning token for play the quiz");
    }
  };

  const opponentFindRandomBot = async () => {
    const encryptedData = encryptData(
      JSON.stringify({
        level: randomOpponent?.options,
        topic_id: topicDetailsMemo?.id,
      })
    );
    await axiosInstanceAuth
      .post("opponents/find-random-bot", {
        data: encryptedData,
      })
      .then((res) => {
        const data = decryptData(res.data.data);
        if (res?.data?.status) {
          setIsBotOpponent(true);
          localStorage.setItem("is_bot", data?.is_bot);
          setIsBotOpponentUser(data);
        } else {
          toast.error(res?.data?.message);
        }
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  const opponentFindRandom = async () => {
    const encryptedData = encryptData(
      JSON.stringify({
        topic_id: topicDetailsMemo?.id,
        level: randomOpponent?.options,
      })
    );
    await axiosInstanceAuth
      .post("opponents/find-random", {
        data: encryptedData,
      })
      .then((res) => {
        const data = decryptData(res.data.data);
        if (res?.data?.status) {
          setIsStatus(res?.data?.status);
          setIsOpponent(false);
          setIsBotOpponent(true);
          setIsBotOpponentUser(data);
          // opponentFindRandom()
        }
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  const topicDetailsMemo = useMemo(() => {
    let topicDetailsMemo = {};
    if (state?.isModal) {
      setIsBotOpponentUser({
        id: state?.opponentUser?.id,
        avatar: state?.opponentUser?.avatar,
        user_name: state?.opponentUser?.user_name,
        country_flag: state?.opponentUser?.country_flag,
      });
      setRandomOpponent({
        entry_fee: state?.is_bot?.spent_learning_token,
        win_reward: state?.is_bot?.win_learning_token,
        options: state?.is_bot?.level,
        topic_id: state?.topic?.topic_id,
      });
      setIsBotOpponent(true);
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

  const timeCancel = () => {
    setWithdraw(true);
  };

  const getUser = async () => {
    await axiosInstanceAuth
      .get("user/get")
      .then((res) => {
        const data = decryptData(res.data.data);
        if (res?.data?.status) {
          setUserBalance(data);
        } else {
          toast.error(res?.data?.message);
        }
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  useEffect(() => {
    matchTokenTraining();
    getUser();
  }, []);

  useEffect(() => {
    if (debounced.length > 0) {
      getRandomOpponents();
    }
    if (debounced.length === 0) {
      setOpponents([]);
    }
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

  useEffect(() => {
    const interval = setInterval(() => {
      if (isOpponent) {
        setOpponentCount(opponentCount + 1);
        if (opponentCount === 15) {
          setOpponentCount(1);
          setIsOpponent(false);
          opponentFindRandomBot();
        }
        if (opponentCount < 15) {
          if (Object.keys(isBotOpponentUser).length === 0) {
            opponentFindRandom();
          }
        }
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  });

  useEffect(() => {
    const interval = setInterval(() => {
      if (isStatus) {
        if (isQuizIsRandomUserStart === 0 && isBotOpponent && isStartBtn) {
          quizIsRandomUserStart();
        }
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  });

  return (
    <>
      <div className="d-flex">
        {isWide && <Sidebar />}
        <div className="side-bar-outside">
          <div className="select-opponent-wrapper">
            <div className="select-opponent-card">
              <div className="select-opponent-title-wrapper">
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
              <div className="online-friends-btn-wrapper">
                <button
                  onClick={() => setIsInvite(true)}
                  className="button-invite"
                >
                  Invite others to play
                </button>
                <button
                  onClick={() => navigate("/online-friends")}
                  className="button-online"
                >
                  Online Friends
                </button>
              </div>
              <div className="random-opponent">
                <h3 className="random-title">Random Opponent</h3>
                {opponents.length === 0 ? (
                  <div className="row">
                    {training.map((d, i) => (
                      <div key={i} className="col-6">
                        <div
                          style={{
                            cursor: d.is_lock !== 1 ? "pointer" : "not-allowed",
                          }}
                          onClick={() => d.is_lock !== 1 && onRandomOpponent(d)}
                          className="random-opponent-card position-relative"
                        >
                          <div className="win-img-wrapper">
                            <h4 className="win-title">Win</h4>
                            <img src={winLogo} alt="" className="img-fluid" />
                            <h4 className="count">{d.win_reward}</h4>
                          </div>

                          <div className="random-card-title-wrapper">
                            <img src={d.icon} alt="" className="img-fluid" />
                            <h2
                              className="title"
                              style={{ color: d.color_code }}
                            >
                              {d.options}{" "}
                            </h2>
                          </div>
                          <div
                            style={{ background: d.color_code }}
                            className="random-card-footer"
                          >
                            <h5 className="status">Play</h5>
                            <img
                              src={d.playLogo}
                              alt=""
                              className="img-fluid"
                            />
                            <h5 className="status">{d.entry_fee}</h5>
                          </div>
                          {d.is_lock !== 0 && (
                            <div className="random-opponent-lock-wrapper">
                              <img
                                src={
                                  require("../../Assets/Img/card-lock.svg")
                                    .default
                                }
                                alt=""
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}{" "}
                  </div>
                ) : (
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
                          src={
                            require("../../Assets/Img/not-found.svg").default
                          }
                          alt=""
                          className="img-fluid"
                        />
                        <p>Record not found</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            <UserDetails />
          </div>
        </div>
      </div>
      <Modal
        className="invite-modal"
        autoFocus={true}
        centered={true}
        backdrop="static"
        isOpen={isInvite}
      >
        <div className="invite-detail-wrapper">
          <div className="close-icon-wrapper">
            <img
              onClick={() => setIsInvite(false)}
              src={require("../../Assets/Img/close-icon.svg").default}
              alt=""
              className="img-fluid"
            />
          </div>
          <div className="details-wrapper">
            <h1>Invite others to play</h1>
            <div className="share-link-wrapper">
              <h5>Share this link via</h5>
              <div className="img-share-wrapper">
                {shareLink.map((d, i) => (
                  <img key={i} src={d.icon} alt="" className="img-fluid" />
                ))}{" "}
              </div>
            </div>
            <div className="share-link-wrapper">
              <h5>Or copy link</h5>
              <div className="input-wrapper">
                <input disabled name="copy" value="https://zleetz.com/" />
                <CopyToClipboard
                  text="https://zleetz.com/"
                  onCopy={() => toast.success("Copied")}
                >
                  <img
                    src={require("../../Assets/Img/copy-icon.svg").default}
                    alt=""
                    className="img-fluid"
                  />
                </CopyToClipboard>
              </div>
            </div>
          </div>
        </div>
      </Modal>

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
            <h1>{topicDetailsMemo?.name}</h1>
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

      {isOpponent && (
        <Modal
          className="looking-opponent-modal"
          autoFocus={true}
          centered={true}
          backdrop="static"
          isOpen={isOpponent}
        >
          <div className="waiting-user-wrapper">
            <div className="close-icon-wrapper">
              <img
                onClick={() => setIsOpponent(false)}
                src={require("../../Assets/Img/close-icon.svg").default}
                alt=""
                className="img-fluid"
              />
            </div>
            <h1>Looking for an opponent</h1>
            <div className="user-data">
              <img
                src={require("../../Assets/Img/userdata.svg").default}
                alt=""
                className="img-fluid"
              />
            </div>
            <div className="position-relative text-center">
              <img
                className="random-user"
                src={require("../../Assets/Img/random-user.svg").default}
              />
              <div className="earth-routed"></div>
            </div>

            <div className="text-center">
              <button
                onClick={() => setIsOpponent(false)}
                className="cancel-btn"
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}

      <Modal
        className="challenge-modal"
        autoFocus={true}
        centered={true}
        backdrop="static"
        isOpen={isBotOpponent}
      >
        <div className="challenge-modal-wrapper">
          <div className="close-icon-wrapper">
            <img
              onClick={() => {
                setIsBotOpponent(false);
                setIsBotOpponentUser({});
                setLoading(false);
              }}
              src={require("../../Assets/Img/close-icon.svg").default}
              alt=""
              className="img-fluid"
            />
          </div>
          <div className="blockchain-wrapper">
            <img src={topicDetailsMemo?.icon} alt="" className="img-fluid" />
            <h1>{topicDetailsMemo?.name}</h1>
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
            <img
              src={isBotOpponentUser?.avatar}
              alt=""
              className="img-fluid user-first-img"
            />
          </div>
          <div className="title-wrapper">
            <div className="d-flex align-items-center">
              <p className="user">{userData?.user_name}</p>
              <img src={userData?.country_flag} alt="" className="img-fluid" />
            </div>
            <div className="d-flex align-items-center">
              <p className="user">{isBotOpponentUser?.user_name}</p>
              <img
                src={isBotOpponentUser?.country_flag}
                alt=""
                className="img-fluid"
              />
            </div>
          </div>

          <div className="modal-footer">
            {loading ? (
              <PromiseLoader />
            ) : (
              <button onClick={handleSubmitBotUser}>
                <span>START</span>
                <img
                  src={require("../../Assets/Img/start.svg").default}
                  alt=""
                  className="img-fluid"
                />
                <span>
                  {randomOpponent?.entry_fee !== 0 && "-"}{" "}
                  {randomOpponent?.entry_fee}
                </span>
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
              <p>+ {randomOpponent?.win_reward} Reward</p>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default SelectOpponent;
