import React, { useEffect, useState } from "react";
import Sidebar from "../Sidebar/sidebar";
import "./DashBoard.scss";
import ShowMoreText from "react-show-more-text";
// Import css files
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { Modal } from "reactstrap";
import axiosInstanceAuth from "../../apiServices/axiosInstanceAuth";
import { toast } from "react-toastify";
import useEncryption from "../../customHook/useEncryption";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import DeshBoardPlay from "./DeshBoardPlay.js";
import UserDetails from "../../common/Header/userDetails";
import Loader from "../../common/Loader/loader";

const DashBoard = () => {
  const [fields, setFields] = useState({
    access_code: "",
  });
  const [error, setError] = useState({ status: false, type: "", message: "" });
  const [accessCode, setAccessCode] = useState("");
  const [isPlay, setIsPlay] = useState(false);
  const [isAccessCode, setIsAccessCode] = useState(false);
  const [view, setView] = useState({});
  const [isId, setIsIs] = useState();
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const { encryptData, decryptData } = useEncryption();
  const navigate = useNavigate();
  const isWide = useMediaQuery({ minWidth: "800px" });
  let [userData, setUserData] = useState({});
  let topicDetails = decryptData(localStorage.getItem("topicDetails"));

  let settings = {
    infinite: true,
    speed: 1000,
    slidesToShow: categories.length >= 6 ? 6 : categories.length,
    slidesToScroll: 6,
    cssEase: "linear",
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: categories.length >= 4 ? 4 : categories.length,
          slidesToScroll: 4,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: categories.length >= 3 ? 3 : categories.length,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: categories.length >= 2 ? 2 : categories.length,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: categories.length >= 1 ? 1 : categories.length,
          slidesToScroll: 1,
        },
      },
    ],
  };

  let TournamentsSettings = {
    infinite: true,
    // swipe: false,
    speed: 1000,
    slidesToShow: subCategories.length >= 5 ? 5 : subCategories.length,
    slidesToScroll: 5,
    cssEase: "linear",
    responsive: [
      {
        breakpoint: 1700,
        settings: {
          slidesToShow: subCategories.length >= 4 ? 4 : subCategories.length,
          slidesToScroll: 4,
        },
      },
      {
        breakpoint: 1400,
        settings: {
          slidesToShow: subCategories.length >= 3 ? 3 : subCategories.length,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 1000,
        settings: {
          slidesToShow: subCategories.length >= 2 ? 2 : subCategories.length,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 650,
        settings: {
          slidesToShow: subCategories.length >= 1 ? 1 : subCategories.length,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const getAllCategories = async () => {
    await axiosInstanceAuth
      .get("categories/get-user-category")
      .then((res) => {
        const data = decryptData(res.data.data);
        if (res?.data?.status) {
          setCategories(data);
          getSubCategories(data[0].id);
        } else {
          toast.error(res?.data?.message);
          setCategories([]);
        }
      })
      .catch((err) => {
        toast.error(err);
      });
  };

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

  const viewModal = (data) => {
    localStorage.setItem("topicDetails", encryptData(JSON.stringify(data)));
    localStorage.setItem(
      "topicNameIcon",
      encryptData(JSON.stringify({ name: data.name, icon: data.icon }))
    );
    if (isWide) {
      setView(data);
      setIsPlay(true);
    } else {
      navigate("/dashboard/play", { state: data });
    }
  };

  const getSubCategories = async (id) => {
    setIsIs(id);
    await axiosInstanceAuth
      .get(`topics/get-by-categories/${id}`)
      .then((res) => {
        const data = decryptData(res.data.data);
        if (res?.data?.status) {
          setSubCategories(data);
        } else {
          setSubCategories([]);
        }
      })
      .catch((err) => {
        toast.error(err);
      });
  };

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

  useEffect(() => {
    getAllCategories();
    getUser();
    getOngoing();
  }, []);

  // Progress
  const ProgressBar = ({
    children,
    strokeWidth,
    percentage,
    img,
    fillColor,
  }) => {
    const radius = 50 - strokeWidth / 2;
    const pathDescription = `
      M 50,50 m 0,-${radius}
      a ${radius},${radius} 0 1 1 0,${2 * radius}
      a ${radius},${radius} 0 1 1 0,-${2 * radius}
    `;
    const diameter = Math.PI * 2 * radius;
    const progressStyle = {
      stroke: fillColor,
      strokeLinecap: "round",
      strokeDasharray: `${diameter}px ${diameter}px`,
      strokeDashoffset: `${((100 - percentage) / 100) * diameter}px`,
    };

    return (
      <svg
        className={"CircularProgressbar"}
        viewBox="0 0 100 100"
        width={100}
        height={100}
      >
        <path
          className="CircularProgressbar-trail"
          d={pathDescription}
          strokeWidth={strokeWidth}
          fillOpacity={0}
          style={{
            stroke: "#D8D8D8",
          }}
        />

        <path
          className="CircularProgressbar-path"
          d={pathDescription}
          strokeWidth={strokeWidth}
          fillOpacity={0}
          style={progressStyle}
        />
      </svg>
    );
  };

  const onChange = (e) => {
    const value = e.target.value.replace(/^\s+|\s+$/gm, "");
    const name = e.target.name;
    setAccessCode(topicDetails?.access_code);
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

  return (
    <>
      <div className="d-flex">
        <Sidebar />
        {categories.length > 0 ? (
          <div className="side-bar-outside">
            <div className="custom-container">
              <div className="top-count-wrapper">
                <div className="row mb-5">
                  <div className="col-xl-4 col-0"></div>
                  <div className="col-xl-8 col-12 d-flex justify-content-md-between justify-content-center align-items-center">
                    <div className="d-flex">
                      <div className="counter-wrapper d-flex align-items-center">
                        <img
                          src={
                            require("../../Assets/Img/lt-round-img.svg").default
                          }
                          alt=""
                          style={{ width: "30px" }}
                          className="img-fluid"
                        />
                        <h5 className="counter-lt-title text-orange">
                          {userData.lt}
                        </h5>
                      </div>
                      <div className="counter-wrapper position-relative ml-50">
                        <img
                          src={
                            require("../../Assets/Img/second-madal.svg").default
                          }
                          alt=""
                          className="img-fluid"
                        />
                        <h5 className="counter-title text-blue">00</h5>
                      </div>
                      <div className="counter-wrapper position-relative ml-50 ">
                        <img
                          src={
                            require("../../Assets/Img/third-madal.svg").default
                          }
                          alt=""
                          className="img-fluid"
                        />
                        <h5 className="counter-title text-coffee">00</h5>
                      </div>
                    </div>
                    <div className="d-md-flex d-none">
                      <div className="d-flex align-items-center">
                        {/* <div className="input-search-wrapper">
                        <input name="user" id="user" placeholder="" />
                        <img
                          src={require("../../Assets/Img/search.svg").default}
                          alt=""
                          className="img-fluid"
                        />
                      </div> */}
                      </div>
                    </div>
                    <UserDetails />
                  </div>
                </div>
              </div>
              <div className="mb-40">
                <div className="first-slider ">
                  <Slider {...settings}>
                    {categories.map((d, i) => (
                      <div key={i} className="p-2">
                        <div
                          onClick={() => getSubCategories(d.id)}
                          className="top-card-wrapper"
                        >
                          <div
                            style={{
                              border:
                                isId === d.id && `2px solid ${d.color_code}`,
                              borderRadius: "14px 14px 0 0",
                            }}
                            className="p-3 default-border"
                          >
                            <img src={d?.icon} alt="" className="img-fluid" />
                          </div>
                          <div
                            style={{ background: d.color_code }}
                            className="title-wrapper"
                          >
                            <h3>{d.title}</h3>
                          </div>
                          <div
                            style={{
                              backgroundColor: `${d.color_code}3c`,
                              color: d.color_code,
                            }}
                            className="chip-wrapper"
                          >
                            {d?.account_types.map((data, i) => (
                              <React.Fragment key={i}>
                                {data.account_type
                                  .substring(0, 3)
                                  .toUpperCase()}
                                {d.account_types?.length - 1 === i ? "" : "/"}
                              </React.Fragment>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </Slider>
                </div>
              </div>
              <div className="tournaments-wrapper">
                <h2>Training</h2>
                <div className="tournaments-card-wrapper">
                  {subCategories.length > 0 ? (
                    <Slider {...TournamentsSettings}>
                      {subCategories.map((d, i) => (
                        <div className="p-2" key={i}>
                          <div
                            className="tournaments-card"
                            onClick={() => viewModal(d)}
                          >
                            {d.match_format === "Blitz" ? (
                              <img
                                src={
                                  require("../../Assets/Img/Blitz_format.svg")
                                    .default
                                }
                                alt=""
                                className="img-fluid m-auto top-left-img"
                              />
                            ) : (
                              <img
                                src={
                                  require("../../Assets/Img/Classic_format.svg")
                                    .default
                                }
                                alt=""
                                className="img-fluid m-auto top-left-img"
                              />
                            )}

                            {d.access === "Close" && (
                              <img
                                src={
                                  require("../../Assets/Img/card-lock.svg")
                                    .default
                                }
                                alt=""
                                className="img-fluid m-auto top-right-img"
                              />
                            )}

                            <div className="text-center position-relative">
                              <ProgressBar
                                strokeWidth={8}
                                percentage={
                                  d.user_que !== 0 && d.all_que !== 0
                                    ? ((d.user_que / d.all_que) * 100).toFixed(
                                        2
                                      )
                                    : 0
                                }
                                img={d.icon}
                                fillColor={d.color_code}
                              />
                              <img
                                src={d.icon}
                                alt=""
                                className="img-fluid m-auto fill-img-dashboard"
                              />
                            </div>
                            <div className="title-wrapper mt-2">
                              <h3 style={{ color: d.color_code }}>{d.name}</h3>
                              {/* <h5>
                              {d?.description.slice(0, 200)}
                              {d?.description.length > 200 && "..."}
                            </h5> */}
                              <ShowMoreText
                                className="description"
                                lines={3}
                                more="Show more"
                                less=" Show less"
                                anchorClass="d-none"
                                expanded={false}
                                width={0}
                              >
                                {d?.description}
                              </ShowMoreText>
                              <p
                                style={{
                                  color: d.color_code,
                                  backgroundColor: `${d.color_code}3c`,
                                }}
                              >
                                {d.regional_relevance}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </Slider>
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
          </div>
        ) : (
          <Loader />
        )}
      </div>
      <Modal
        className="blockchain-term-info-modal"
        autoFocus={true}
        centered={true}
        backdrop="static"
        isOpen={isPlay}
      >
        <div className="blockchain-term w-100">
          <DeshBoardPlay
            view={view}
            setIsPlay={setIsPlay}
            setView={setView}
            openAccess={setIsAccessCode}
            subCategories={subCategories}
          />
        </div>
      </Modal>
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
              onClick={() => setIsAccessCode(false)}
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

export default DashBoard;
