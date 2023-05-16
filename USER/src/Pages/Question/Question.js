import React, { useEffect, useMemo, useRef } from "react";
import "./Question.scss";
import Sidebar from "../Sidebar/sidebar";
import picnk from "../../Assets/Img/one_Cane.svg";
import purple from "../../Assets/Img/Purple_Circle_Donut.svg";
import two from "../../Assets/Img/Blue_Circle_Gingerbread.svg";
import four from "../../Assets/Img/Orange_Circle_Icecream.svg";
import { useState } from "react";
import WonLostModal from "./modal/WonLoastModal";
import { useMediaQuery } from "react-responsive";
import { useLocation, useNavigate } from "react-router-dom";
import useEncryption from "../../customHook/useEncryption";
import axiosInstanceAuth from "../../apiServices/axiosInstanceAuth";
import { toast } from "react-toastify";
import UserDetails from "../../common/Header/userDetails";
import { Button, Modal } from "reactstrap";

const Question = () => {
  const [isDisable, setIsDisable] = useState(false);
  const [isCorrect, setIsCorrect] = useState({
    isMe: "pending",
    opponent: "pending",
  });
  const [wonModal, setWonOpen] = useState(false);
  const [conform, setConform] = useState(false);
  const [isBack, setIsBack] = useState(false);
  const [opponentDetails, setOpponentDetails] = useState({});
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [isWinner, setISWinner] = useState();
  const [resultData, setResultData] = useState({
    result: [],
    opponentUser: {},
    isMe: {},
    topic: {},
  });

  const [currentInd, setCurrentInd] = useState(
    localStorage.getItem("currentInd")
      ? JSON.parse(localStorage.getItem("currentInd"))
      : 0
  );
  const navigate = useNavigate();

  const { state } = useLocation();

  useEffect(() => {
    if (state) {
    } else {
      setIsBack(!isBack);
      if (isBack) {
        navigate("/activity-log");
      } else {
        navigate(-1);
      }
    }
  });

  const { encryptData, decryptData } = useEncryption();

  const [correct, setCorrect] = useState({
    title: null,
    correctTitle: null,
    correctInd: null,
    index: null,
    fieldName: null,
    id: null,
    is_first: 0,
    is_last: 0,
  });

  const [allQuestions, setAllQuestions] = useState(
    localStorage.getItem("allQuestions")
      ? decryptData(localStorage.getItem("allQuestions"))
      : []
  );

  let userData = decryptData(localStorage.getItem("user"));
  let topicNameIcon = decryptData(localStorage.getItem("topicNameIcon"));

  // ****** Question Timer *******
  const [queTime, setQueTime] = useState(localStorage.getItem("spent_time"));

  const booster = [
    {
      count: 0,
      img: picnk,
      color: "#FF99CC",
      title: "100% Magic",
    },
    {
      count: 0,
      img: two,
      color: "#CCCC00",
      title: "50-50",
    },
    {
      count: 0,
      img: purple,
      color: "#CC99FF",
      title: "1 out",
    },
    {
      count: 0,
      img: four,
      color: "#F4B183",
      title: "2 X chance",
    },
  ];

  const isWide = useMediaQuery({ minWidth: "800px" });
  const isMobile = useMediaQuery({ minWidth: "768px" });

  const selectAnswer = async (e, data, time) => {
    e.preventDefault();
    setIsDisable(true);
    setCorrect({
      title: data.title,
      correctTitle: data.correctTitle,
      correctInd: data.correctInd,
      index: data.index,
      fieldName: data.fieldName,
      id: data.id,
      is_last: data.is_last,
    });
    setIsCorrect({
      ...isCorrect,
      isMe:
        data.fieldName === "correct_answer"
          ? "correct_answer"
          : data.fieldName?.indexOf("wrong_answer") > -1
          ? "wrong_answer"
          : "pending",
    });

    const encryptedData = encryptData(
      JSON.stringify({
        quiz_id: parseInt(localStorage.getItem("quiz_id")),
        answer_key: data.fieldName,
        question_id: data.id,
        spent_time: time - queTime,
        answer: data.title,
        is_first: data.is_first,
        is_last: data.is_last,
      })
    );
    await axiosInstanceAuth
      .post("quiz/submit-quiz-answers", {
        data: encryptedData,
      })
      .then((res) => {
        const data = decryptData(res.data.data);
        if (res?.data?.status) {
          setISWinner(
            userData.id === res?.data?.winner_id
              ? "You Won"
              : res?.data?.winner_id === 0
              ? "pending"
              : "You Lost"
          );
          if (data.length === 0) {
            if (localStorage.getItem("isSimultaneous") === "0") {
              setIsDisable(false);
              setTimeout(() => {
                setCurrentInd(
                  allQuestions.length > currentInd ? currentInd + 1 : ""
                );
                localStorage.setItem(
                  "currentInd",
                  allQuestions.length > currentInd ? currentInd + 1 : ""
                );
                setQueTime(
                  allQuestions[
                    allQuestions.length > currentInd ? currentInd + 1 : 0
                  ].question_time
                );
                setCorrect({
                  title: null,
                  correctTitle: null,
                  correctInd: null,
                  index: null,
                  fieldName: null,
                  id: null,
                  is_first: 0,
                  is_last: 0,
                });
                setIsCorrect({
                  isMe: "pending",
                  opponent: "pending",
                });
              }, 1000);
            }
          } else {
            setResultData({
              ...resultData,
              result: data,
            });
            setQuizAnswers(data);
            if (localStorage.getItem("isSimultaneous") === "0") {
              if (isWide) {
                setWonOpen(true);

                setResultData({
                  ...resultData,
                  result: data,
                  isOpen: true,
                });
                setTimeout(() => {
                  navigate("/activity-log", {
                    state: {
                      resultData,
                      isWinner,
                      ...resultData.result.push(...data),
                    },
                  });
                }, 1000);
              } else {
                navigate("/won", {
                  state: {
                    resultData,
                    isWinner,
                    ...resultData.result.push(...data),
                  },
                });
              }
            }
          }
        } else {
          toast.error(res?.data?.message);
        }
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  const onTimeOut = async (data) => {
    if (!isDisable) {
      const encryptedData = encryptData(
        JSON.stringify({
          quiz_id: parseInt(localStorage.getItem("quiz_id")),
          question_id: data?.id,
          spent_time: data?.question_time,
          is_first: data?.options[0].is_first,
          is_last: data?.options[0].is_last,
        })
      );
      await axiosInstanceAuth
        .post("quiz/submit-time-out-answers", {
          data: encryptedData,
        })
        .then((res) => {
          const data = decryptData(res.data.data);
          if (res?.data?.status) {
            setIsDisable(false);
            setCorrect({
              title: null,
              correctTitle: null,
              correctInd: null,
              index: null,
              fieldName: null,
              id: null,
              is_first: 0,
              is_last: 0,
            });
            if (data.length === 0) {
              setTimeout(() => {
                //   setCurrentInd(
                //     allQuestions.length > currentInd ? currentInd + 1 : ""
                //   );
                //   localStorage.setItem("currentInd", allQuestions.length > currentInd ? currentInd + 1 : "")
                //   setQueTime(
                //     allQuestions[
                //       allQuestions.length > currentInd ? currentInd + 1 : 0
                //     ].question_time
                //   );
                setIsCorrect({
                  isMe: "pending",
                  opponent: "pending",
                });
              }, 1000);
            } else {
              if (isWide) {
                setWonOpen(true);
                setResultData({
                  ...resultData,
                  result: data,
                });
                setTimeout(() => {
                  console.log(2);
                  navigate("/activity-log", {
                    state: {
                      resultData,
                      ...resultData.result.push(...data),
                      isOpen: true,
                    },
                  });
                }, 1000);
              } else {
                setResultData({
                  ...resultData,
                  result: data,
                });
                navigate("/won", {
                  state: { resultData, ...resultData.result.push(...data) },
                });
              }
            }
          } else {
            toast.error(res?.data?.message);
          }
        })
        .catch((err) => {
          toast.error(err);
        });
    }
  };

  const getQuizQuestions = async () => {
    const encryptedData = encryptData(
      JSON.stringify({
        quiz_id: localStorage.getItem("quiz_id"),
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
              question_id: d.question_id,
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
              question_image: d.question_image,
              question_time: d.question_time,
              options: d.options
                .map((value) => ({ value, sort: Math.random() }))
                .sort((a, b) => a.sort - b.sort)
                .map(({ value }) => value),
            })
          );
          setAllQuestions(finalData);
          localStorage.setItem(
            "allQuestions",
            encryptData(JSON.stringify(finalData))
          );
          localStorage.setItem(
            "spent_time",
            finalData[currentInd].question_time
          );
          localStorage.setItem("currentInd", 0);
          setQueTime(finalData[currentInd].question_time);
        } else {
          toast.error(res?.data?.message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getPlayerDone = async () => {
    if (!wonModal) {
      await axiosInstanceAuth
        .get(`quiz/is-player-done/${allQuestions[currentInd]?.question_id}`)
        .then((res) => {
          const data = decryptData(res.data.data);
          if (res?.data?.status) {
            let is_me =
              userData.id === data.player_id
                ? data.player_answer_key
                : data.opponent_answer_key;
            let is_opponent =
              userData.id !== data.player_id
                ? data.player_answer_key
                : data.opponent_answer_key;
            setIsCorrect({
              ...isCorrect,
              isMe:
                is_me === "correct_answer"
                  ? "correct_answer"
                  : is_me?.indexOf("wrong_answer") > -1
                  ? "wrong_answer"
                  : "pending",
              opponent:
                is_opponent === "correct_answer"
                  ? "correct_answer"
                  : is_opponent?.indexOf("wrong_answer") > -1
                  ? "wrong_answer"
                  : "pending",
            });
            let is_player_answered =
              userData.id === data.player_id
                ? data.opponent_answer
                : data.player_answer;

            let is_my_answered =
              userData.id === data.player_id
                ? data.player_answer
                : data.opponent_answer;

            if (is_player_answered !== 0 && is_my_answered !== 0) {
              if (quizAnswers.length === 0) {
                setIsDisable(false);
                setTimeout(() => {
                  setCurrentInd(
                    allQuestions.length > currentInd ? currentInd + 1 : ""
                  );
                  localStorage.setItem(
                    "currentInd",
                    allQuestions.length > currentInd ? currentInd + 1 : ""
                  );
                  setQueTime(
                    allQuestions[
                      allQuestions.length > currentInd ? currentInd + 1 : 0
                    ].question_time
                  );
                  setCorrect({
                    title: null,
                    correctTitle: null,
                    correctInd: null,
                    index: null,
                    fieldName: null,
                    id: null,
                    is_first: 0,
                    is_last: 0,
                  });
                  setIsCorrect({
                    isMe: "pending",
                    opponent: "pending",
                  });
                }, 1000);
              } else {
                if (isWide) {
                  setWonOpen(true);
                  setResultData({
                    ...resultData,
                    result: quizAnswers,
                  });
                  setTimeout(() => {
                    console.log(3);
                    navigate("/activity-log", {
                      state: {
                        result: resultData,
                        isWinner: isWinner,
                        isOpen: true,
                      },
                    });
                  }, 1000);
                } else {
                  navigate("/won", {
                    state: {
                      resultData,
                      isWinner, // ...resultData.result.push(...quizAnswers),
                    },
                  });
                }
              }
            }
            if (
              (data?.player_time_out === 1 || data?.opponent_time_out === 1) &&
              correct.is_last === 1
            ) {
              if (isWide) {
                setWonOpen(true);
                setTimeout(() => {
                  console.log(4);
                  navigate("/activity-log", {
                    // state: { result: resultData, isWinner: isWinner, isOpen: true,
                    // },
                    state: {
                      resultData,
                      isWinner,
                      ...resultData.result.push(...quizAnswers),
                      isOpen: true,
                    },
                  });
                }, 1000);
              } else {
                setResultData({
                  ...resultData,
                  result: data,
                });
                navigate("/won", {
                  state: { resultData },
                });
              }
            }
          } else {
            toast.error(res?.data?.message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const getDetail = async () => {
    const quiz_id = localStorage.getItem("quiz_id");
    await axiosInstanceAuth
      .get(`quiz/get-detail/${quiz_id}`)
      .then((res) => {
        const data = decryptData(res.data.data);
        if (res?.data?.status) {
          setOpponentDetails(data);
          if (allQuestions[currentInd]?.bot_time) {
            localStorage.setItem("isSimultaneous", "1");
          } else {
            localStorage.setItem("isSimultaneous", data.is_timer_on.toString());
          }
          setResultData({
            ...resultData,
            opponentUser: {
              id:
                data.player_id === userData.id
                  ? data.opponent_id
                  : data.player_id,
              avatar:
                data.player_id === userData.id
                  ? data.receiver_avatar
                  : data.sender_avatar,
              country_id:
                data.player_id === userData.id
                  ? data.receiver_country_id
                  : data.sender_country_id,
              country_flag:
                data.player_id === userData.id
                  ? data.receiver_country_flag
                  : data.sender_country_flag,
              full_name:
                data.player_id === userData.id
                  ? data.receiver_full_name
                  : data.sender_full_name,
              user_name:
                data.player_id === userData.id
                  ? data.receiver_user_name
                  : data.sender_user_name,
              xp:
                data.player_id === userData.id
                  ? data.receiver_xp
                  : data.sender_xp,
              opponent_id: data.opponent_id,
              // id: data.opponent_id,
            },
            isMe: {
              id:
                data.player_id !== userData.id
                  ? data.opponent_id
                  : data.player_id,
              avatar:
                data.player_id !== userData.id
                  ? data.receiver_avatar
                  : data.sender_avatar,
              country_id:
                data.player_id !== userData.id
                  ? data.receiver_country_id
                  : data.sender_country_id,
              country_flag:
                data.player_id !== userData.id
                  ? data.receiver_country_flag
                  : data.sender_country_flag,
              full_name:
                data.player_id !== userData.id
                  ? data.receiver_full_name
                  : data.sender_full_name,
              user_name:
                data.player_id !== userData.id
                  ? data.receiver_user_name
                  : data.sender_user_name,
              xp:
                data.player_id !== userData.id
                  ? data.receiver_xp
                  : data.sender_xp,
            },
            topic: {
              top_name: data.top_name,
              top_icon: data.top_icon,
              top_color_code: data.top_color_code,
              topic_id: data.topic_id,
            },
            is_bot: {
              level: data?.options,
              is_bot: data?.is_bot,
              spent_learning_token: data?.spent_learning_token,
              win_learning_token: data?.win_learning_token,
            },
          });
          if (correct.is_last === 1) {
            if (isWide) {
              setWonOpen(true);
              setTimeout(() => {
                console.log(5);
                navigate("/activity-log", {
                  state: {
                    result: resultData,
                    isWinner: isWinner,
                    isOpen: true,
                  },
                });
              }, 1000);
            } else {
              setResultData({
                ...resultData,
                result: data,
              });
              navigate("/won", {
                state: { resultData },
              });
            }
          }
        } else {
          toast.error(res?.data?.message);
        }
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  useEffect(() => {
    if (allQuestions?.length < 1) {
      localStorage.removeItem("spent_time");
      localStorage.removeItem("allQuestions");
      localStorage.removeItem("currentInd");
      getQuizQuestions();
    }
    getDetail();
  }, []);

  useEffect(() => {
    if (allQuestions[currentInd]) {
      let is_bot = localStorage.getItem("is_bot");
      if (!is_bot) {
        getPlayerDone();
      }
    }
    const interval = setInterval(() => {
      if (queTime > 0) {
        setQueTime(queTime - 1);
        localStorage.setItem("spent_time", queTime - 1);
      } else {
        if (parseInt(queTime) === 0) {
          if (!wonModal && !isDisable && allQuestions[currentInd]) {
            onTimeOut(allQuestions[currentInd]);
          }
        }
        getPlayerDone();
        correct.is_last === 1 && getDetail();
        setCorrect({
          title: null,
          correctTitle: null,
          correctInd: null,
          index: null,
          fieldName: null,
          id: null,
          is_first: 0,
          is_last: 0,
        });

        setIsDisable(false);
        setCurrentInd(
          allQuestions.length > currentInd
            ? currentInd + 1
            : allQuestions.length
        );
        localStorage.setItem(
          "currentInd",
          allQuestions.length > currentInd
            ? currentInd + 1
            : allQuestions.length
        );
        setQueTime(
          allQuestions[currentInd]?.question_time
            ? allQuestions[currentInd]?.question_time
            : 0
        );
        localStorage.setItem(
          "spent_time",
          allQuestions[currentInd]?.question_time
            ? allQuestions[currentInd]?.question_time
            : 0
        );
        setIsCorrect({
          isMe: "pending",
          opponent: "pending",
        });
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [queTime]);

  useEffect(() => {
    let total_time = allQuestions[currentInd]?.question_time;
    let ans_time = total_time - queTime;
    if (allQuestions[currentInd]?.bot_time <= ans_time) {
      if (allQuestions[currentInd]?.bot_answer_key) {
        setIsCorrect({
          ...isCorrect,
          opponent:
            allQuestions[currentInd]?.bot_answer_key === "correct_answer"
              ? "correct_answer"
              : allQuestions[currentInd]?.bot_answer_key?.indexOf(
                  "wrong_answer"
                ) > -1
              ? "wrong_answer"
              : "pending",
        });
      }
      setTimeout(() => {
        if (isDisable) {
          if (parseInt(allQuestions[currentInd]?.options[0].is_last) === 1) {
            if (isWide) {
              setWonOpen(true);
              setResultData({
                ...resultData,
                result: quizAnswers,
              });
              console.log(6);
              navigate("/activity-log", {
                state: {
                  result: resultData,
                  isWinner: isWinner,
                  isOpen: true,
                },
              });
            } else {
              navigate("/won", {
                state: {
                  resultData,
                  isWinner,
                },
              });
            }
          } else {
            setIsDisable(false);
            setCurrentInd(
              allQuestions.length > currentInd ? currentInd + 1 : ""
            );
            localStorage.setItem(
              "currentInd",
              allQuestions.length > currentInd ? currentInd + 1 : ""
            );
            setQueTime(
              allQuestions[
                allQuestions.length > currentInd ? currentInd + 1 : 0
              ].question_time
            );
            setIsCorrect({
              isMe: "pending",
              opponent: "pending",
            });
            setCorrect({
              title: null,
              correctTitle: null,
              correctInd: null,
              index: null,
              fieldName: null,
              id: null,
              is_first: 0,
              is_last: 0,
            });
          }
        }
      }, 1000);
      // else if (parseInt(queTime) === 0) {
      //   !isDisable && allQuestions[currentInd] && onTimeOut(allQuestions[currentInd])
      // }
    }
  }, [queTime]);

  const onQuestionBack = () => {
    setConform(true);
  };

  return (
    <>
      <div className="d-flex">
        {isMobile && <Sidebar />}
        <div className="side-bar-outside">
          <div className="question-wrapper">
            <div className="question-card">
              <div className="question-card-title-wrapper">
                {/* <img
                src={require("../../Assets/Img/left-arrow.svg").default}
                alt=""
                className="img-fluid"
                onClick={onQuestionBack}
              /> */}
                <img
                  src={topicNameIcon?.icon}
                  alt=""
                  className="image-header-title"
                />
                <div className="question-title-wrapper">
                  {/* <img src={topicNameIcon?.icon} alt="" className="img-fluid" /> */}
                  <h3>{topicNameIcon?.name}</h3>
                </div>
              </div>
              <div className="d-flex row accept-button-mobile">
                <div className="col-xs-10 col-sm-5">
                  <div className="question-user-count-wrapper">
                    <div className="d-flex align-items-center">
                      <img
                        src={
                          userData?.id === opponentDetails?.player_id
                            ? opponentDetails.sender_avatar
                            : opponentDetails.receiver_avatar
                        }
                        alt=""
                        className="img-fluid first-img-user"
                      />
                      <div className="connect-user">
                        <h4>
                          {(userData.id === opponentDetails.player_id
                            ? opponentDetails.sender_user_name
                            : opponentDetails.receiver_user_name
                          )?.slice(0, 7)}
                          {(userData.id === opponentDetails.player_id
                            ? opponentDetails.sender_user_name
                            : opponentDetails.receiver_user_name
                          )?.length > 7 && "..."}
                        </h4>
                        {isCorrect.isMe === "correct_answer" ? (
                          <p className="correct-text">
                            <img
                              src={
                                require("../../Assets/Img/check.svg").default
                              }
                              alt=""
                              className="img-fluid"
                            />
                            Correct
                          </p>
                        ) : isCorrect.isMe === "wrong_answer" ? (
                          <p className="wrong-text">
                            <img
                              src={
                                require("../../Assets/Img/wrong.svg").default
                              }
                              alt=""
                              className="img-fluid"
                            />{" "}
                            Wrong
                          </p>
                        ) : (
                          <div id="wave">
                            <span className="dot"></span>
                            <span className="dot"></span>
                            <span className="dot"></span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div style={{ width: "30%", maxWidth: "30%" }}>
                      <div className="center-count-wrapper">
                        <p>{queTime}</p>
                      </div>
                      <div className="result-fill-wrapper">
                        <p>
                          {allQuestions.length > currentInd + 1
                            ? currentInd + 1
                            : allQuestions.length}
                          /{allQuestions.length}
                        </p>
                        <div className="result-track">
                          <div
                            style={{
                              width: `${
                                allQuestions.length <= currentInd + 1
                                  ? "100"
                                  : ((currentInd + 1) * 100) /
                                    allQuestions.length
                              }%`,
                            }}
                            className="result-fill"
                          ></div>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex align-items-center">
                      <div className="connect-user">
                        <h4 className="text-end">
                          {(userData.id !== opponentDetails.player_id
                            ? opponentDetails.sender_user_name
                            : opponentDetails.receiver_user_name
                          )?.slice(0, 7)}
                          {(userData.id !== opponentDetails.player_id
                            ? opponentDetails.sender_user_name
                            : opponentDetails.receiver_user_name
                          )?.length > 7 && "..."}
                        </h4>
                        {isCorrect.opponent === "correct_answer" ? (
                          <p className="correct-text">
                            <img
                              src={
                                require("../../Assets/Img/check.svg").default
                              }
                              alt=""
                              className="img-fluid"
                            />
                            Correct
                          </p>
                        ) : isCorrect.opponent === "wrong_answer" ? (
                          <p className="wrong-text">
                            <img
                              src={
                                require("../../Assets/Img/wrong.svg").default
                              }
                              alt=""
                              className="img-fluid"
                            />{" "}
                            Wrong
                          </p>
                        ) : (
                          <div id="wave">
                            <span className="dot"></span>
                            <span className="dot"></span>
                            <span className="dot"></span>
                          </div>
                        )}
                      </div>
                      <img
                        src={
                          userData.id !== opponentDetails.player_id
                            ? opponentDetails.sender_avatar
                            : opponentDetails.receiver_avatar
                        }
                        alt=""
                        className="img-fluid second-img-user"
                      />
                    </div>
                  </div>

                  {allQuestions.map(
                    (d, i) =>
                      currentInd === i && (
                        <>
                          <div className="que-wrapper">
                            <div className="que-deteail">
                              <h3
                                className={
                                  d.question.length <= 210
                                    ? "game-title"
                                    : "game-title-font"
                                }
                              >
                                {d?.question}
                              </h3>
                              {d?.question?.length <= 90 &&
                                d?.options[i]?.title?.length <= 90 && (
                                  <>
                                    {d.question_image && (
                                      <img
                                        className="que-img que-image"
                                        src={d.question_image}
                                        alt={""}
                                      />
                                    )}
                                  </>
                                )}
                            </div>
                          </div>
                        </>
                      )
                  )}
                </div>
                <div className="game-wrapper col-xs-10 col-sm-5">
                  {allQuestions.map(
                    (d, i) =>
                      currentInd === i && (
                        <>
                          <div className="game-btn-wrapper">
                            {d.options.map((data, key) => (
                              <button
                                key={key}
                                disabled={isDisable}
                                className={
                                  correct.correctTitle === data.title &&
                                  correct.correctInd === data.correctInd
                                    ? "right-ans"
                                    : correct.title === data.title &&
                                      correct.index === data.index
                                    ? "wrong-ans"
                                    : ""
                                }
                                onClick={(e) =>
                                  selectAnswer(e, data, d.question_time)
                                }
                              >
                                {data.title}
                              </button>
                            ))}
                          </div>
                        </>
                      )
                  )}
                </div>
                <div className="game-booster-wrapper col-xs-2 col-sm-2">
                  {booster.map((d, i) => (
                    <>
                      <div className="footer-que">
                        <div key={i}>
                          <div className="text-align-center position-relative">
                            <img
                              src={d.img}
                              alt=""
                              className="img-fluid game-img"
                            />
                            <span
                              style={{ backgroundColor: d.color }}
                              className="position-absolute translate-middle badge rounded-pill bg-count"
                            >
                              0<span className="visually-hidden"></span>
                            </span>
                          </div>
                        </div>
                        <div className="que-title">
                          <h4 style={{ color: d.color }}>{d.title}</h4>
                        </div>
                      </div>
                    </>
                  ))}{" "}
                </div>
              </div>
            </div>
            <UserDetails />
          </div>
        </div>
      </div>

      <Modal
        className="conform-modal-question-back"
        autoFocus={true}
        centered={true}
        backdrop="static"
        isOpen={conform}
      >
        <div className="conform-modal-wrapper-back">
          <div className="close-icon-wrapper">
            <img
              type="button"
              onClick={() => setConform(false)}
              src={require("../../Assets/Img/close-icon.svg").default}
              alt=""
              className="img-fluid"
            />
          </div>
          <div className="conformation-back-wrapper">
            <img
              type="button"
              src={require("../../Assets/Img/conformation-back.svg").default}
              alt=""
              className="img-fluid"
            />
          </div>
          <h4>Are you sure?</h4>
          <p>Are you sure you want to quit this quiz. You will lose game.</p>
          <div className="d-flex justify-content-center">
            <Button className="yes-btn" onClick={() => navigate(-1)}>
              YES
            </Button>
            <Button className="no-btn" onClick={() => setConform(false)}>
              NO
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Question;
