import React, { useEffect, useState } from "react";
import "./rankingGeneral.scss";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar/sidebar";
import one from "../../Assets/Img/Gold1.svg";
import three from "../../Assets/Img/Bronze3.svg";
import two from "../../Assets/Img/Silver2.svg";
import useEncryption from "../../customHook/useEncryption";
import axiosInstanceAuth from "../../apiServices/axiosInstanceAuth";
import { toast } from "react-toastify";
import UserDetails from "../../common/Header/userDetails";
const RankingGeneral_1 = () => {
  const navigate = useNavigate();

  const [ranking, setRanking] = useState([]);
  const { encryptData, decryptData } = useEncryption();
  let topicDetails = decryptData(localStorage.getItem("topicDetails"));

  const getRanking = async () => {
    const encryptedData = encryptData(
      JSON.stringify({
        page_no: "1",
        topic_id: topicDetails?.id,
      })
    );
    await axiosInstanceAuth
      .post("opponents/get-ranking", {
        data: encryptedData,
      })
      .then((res) => {
        const data = decryptData(res.data.data);
        if (res?.data?.status) {
          setRanking(data);
        } else {
          toast.error(res?.data?.message);
          setRanking([]);
        }
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  useEffect(() => {
    getRanking();
  }, []);

  return (
    <>
      <div className="d-flex">
        <Sidebar />

        <div className="side-bar-outside">
          <div className=" ranking-general-wrapper">
            <div className="ranking-general-card">
              <div className="ranking-general-card-title-wrapper">
                <img
                  src={require("../../Assets/Img/left-arrow.svg").default}
                  alt=""
                  onClick={() => navigate(-1)}
                  className="img-fluid"
                />
                <div className="question-title-wrapper d-flex align-items-center">
                  <img src={topicDetails?.icon} alt="" className="img-fluid" />
                  <h3>{topicDetails?.name}</h3>
                </div>
              </div>
              <div className="ranking-general-filter">
                <div className="form-general d-flex justify-content-between">
                  <form>
                    <select
                      disabled
                      name="cars"
                      id="cars"
                      className="select-league "
                    >
                      <option className="option-select" value="League">
                        League
                      </option>
                    </select>
                  </form>
                  <form>
                    <select
                      disabled
                      name="cars"
                      id="cars"
                      className="select-league"
                    >
                      <option value="Individual">Individual</option>
                    </select>
                  </form>
                  <form>
                    <select
                      disabled
                      name="cars"
                      id="cars"
                      className="select-league"
                    >
                      <option value="This Week">All Time</option>
                    </select>
                  </form>
                </div>
              </div>
              <div className="online-store">
                <p className="online-store-title">Online Users</p>
              </div>
              <div className="ranking-contend-wrapper">
                {ranking.map((d, i) => (
                  <div className="ranking-wrapper-number" key={i}>
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center">
                        {i === 0 ? (
                          <img src={one} alt="" className="ranking-medal" />
                        ) : i === 1 ? (
                          <img src={two} alt="" className="ranking-medal" />
                        ) : i === 2 ? (
                          <img src={three} alt="" className="ranking-medal" />
                        ) : (
                          <div className="index-ranking">{i + 1}</div>
                        )}
                        <img src={d.avatar} alt="" className="ranking-avatar" />
                        <h4>{d.user_name}</h4>
                        {d.country_flag && (
                          <img
                            src={d.country_flag}
                            alt=""
                            className="ranking-country"
                          />
                        )}
                      </div>
                      <div>
                        <button className="ranking-xp">{d.xp} XP </button>
                      </div>
                    </div>
                    <hr className="ranking-line" />
                  </div>
                ))}{" "}
              </div>
            </div>
          </div>
          <UserDetails />
        </div>
      </div>
    </>
  );
};

export default RankingGeneral_1;
