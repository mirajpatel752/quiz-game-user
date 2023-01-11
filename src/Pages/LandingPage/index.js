import React, { useEffect } from "react";
import "./LandingPage.scss";
import against from "../../Assets/Img/against.svg";
import customMade from "../../Assets/Img/custom-made.svg";
import interest from "../../Assets/Img/interest.svg";
import teams from "../../Assets/Img/teams.svg";
import Header from "../../common/Header";
import { useLocation, useNavigate } from "react-router-dom";
const LandingPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const playSuccess = [
    {
      icon: interest,
      title: "Topics for any interest",
      subTitle:
        "Ranging from general to specialized knowledge, continuous training and development",
      color: "#FF5050",
    },
    {
      icon: against,
      title: "Play with or against",
      subTitle:
        "family, friends, colleagues or new people sharing similar interests, hobbies and activities",
      color: "#00B0F0",
    },
    {
      icon: customMade,
      title: "Custom-made content",
      subTitle:
        "for different businesses and organisations, for different learning and training needs",
      color: "#FF9900",
    },
    {
      icon: teams,
      title: "Play solo or in teams",
      subTitle:
        "for self-improvement, progress, fun, increased motivation, high team spirit and focus",
      color: "#66FF33",
    },
  ];
  const auth = localStorage.getItem("token");

  useEffect(() => {
    if (auth) {
      navigate("/dashboard");
    }
  }, [auth]);

  return (
    <>
      <Header />
      <div className="landing-page ">
        <div className="landing-banner">
          <div className="container">
            <div className="row full-height align-items-center">
              <div className="col-lg-6 col-12">
                <h1 className="heading">
                  Shaping the future of competitive knowledge games
                </h1>
                <p className="px-sm-0 px-2">
                  “There is nothing better than a good competition to push us
                  forward at a faster pace!”
                </p>
                <button className="sign-up" onClick={() => navigate("/signup")}>
                  Sign up
                </button>
                <button className="sign-out" onClick={() => navigate("/login")}>
                  Log In
                </button>
              </div>
              <div className="col-lg-6 col-12 text-center">
                <img
                  className="img-fluid"
                  src={require("../../Assets/Img/card-home.svg").default}
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="landing-container">
            <div className="pay-success">
              <h4 className="title">Play your way to success</h4>
              <div className="row ">
                {playSuccess.map((d, i) => (
                  <div key={i} className="col-lg-6 px-2 py-3 mx-auto box-width">
                    <div
                      style={{ border: `1px solid ${d.color}` }}
                      className="pay-card"
                    >
                      <img src={d.icon} className="img-fluid" alt="logo" />
                      <h6 className="heading-title" style={{ color: d.color }}>
                        {d.title}
                      </h6>
                      <p className="heading-subtitle">{d.subTitle}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="accounts-every-need">
              <h4 className="title">Accounts for every need</h4>
              <div className="row align-items-center accounts-card  p-sm-5">
                <div className="row align-items-center pl-1">
                  <div className="col-lg-6 col-12 p-2  p-sm-5 ">
                    <h6>General</h6>
                    <p>
                      Create a free account and access countless number of
                      topics covering a wide range of hobbies and interests,
                      useful general knowledge facts and information, with
                      constant addition of high quality content.
                    </p>
                  </div>
                  <div className="col-lg-6 col-12 text-center p-2 p-sm-5">
                    <img
                      src={
                        require("../../Assets/Img/accounts-every.svg").default
                      }
                      alt=""
                      className="img-fluid"
                    />
                  </div>
                </div>
              </div>
              <div className="row align-items-center accounts-card p-sm-5 flex-change ">
                <div className="row align-items-center px-5">
                  <div className="col-lg-6 col-12 text-center p-2 p-sm-5 order_2">
                    <img
                      src={
                        require("../../Assets/Img/Educational-1.svg").default
                      }
                      alt=""
                      className="img-fluid"
                    />
                  </div>
                  <div className="col-lg-6 col-12 p-2 p-sm-5 order_1">
                    <h6>Educational</h6>
                    <p>
                      Intended primarily for educational institutions, such as
                      schools and universities, this account provides access to
                      topics covering a number of study fields, with tailor-made
                      content being continuously added.
                    </p>
                  </div>
                </div>
              </div>
              <div className="row align-items-center accounts-card p-sm-5 ">
                <div className="row align-items-center p-sm-5">
                  <div className="col-lg-6 col-12 p-2 px-5">
                    <h6>Professional</h6>
                    <p>
                      Intended primarily for businesses and organisations, this
                      account provides access to topics covering specialized
                      knowledge areas, continuing professional development and
                      trainings, with tailor-made content being continuously
                      added.
                    </p>
                  </div>
                  <div className="col-lg-6 col-12 text-center p-2 p-sm-5">
                    <img
                      src={
                        require("../../Assets/Img/Professional-2.svg").default
                      }
                      alt=""
                      className="img-fluid"
                    />
                  </div>
                </div>
              </div>
              <div className="row align-items-center accounts-card p-sm-5 flex-change ">
                <div className="row align-items-center px-5">
                  <div className="col-lg-6 col-12 text-center p-2 p-sm-5 order_2">
                    <img
                      src={require("../../Assets/Img/all-in-one.svg").default}
                      alt=""
                      className="img-fluid"
                    />
                  </div>
                  <div className="col-lg-6 col-12 p-2 p-sm-5 order_1">
                    <h6>All in one</h6>
                    <p>
                      As the name suggests, this account provides unlimited
                      access to all the topics, including general, educational
                      and professional content. Moreover, you can request
                      additions of specialized content meeting your
                      organisation’s specific needs.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="landing-footer">
          <p>Copyright</p>&nbsp;
          <img
            src={require("../../Assets/Img/copyright.svg").default}
            alt=""
            className="img-fluid"
          />
          &nbsp;
          <p>2022 Zleetz</p>
        </div>
      </div>
    </>
  );
};

export default LandingPage;
