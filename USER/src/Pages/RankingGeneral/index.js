import React, { useEffect, useState } from "react";
import "./rankingGeneral.scss";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar/sidebar";
import UserDetails from "../../common/Header/userDetails";
import useEncryption from "../../customHook/useEncryption";
import axiosInstanceAuth from "../../apiServices/axiosInstanceAuth";
import { toast } from "react-toastify";
const RankingGeneral = () => {
  const navigate = useNavigate();
  const { encryptData, decryptData } = useEncryption();
  const [rankings, setRankings] = useState([]);

  const getRankings = async () => {
    await axiosInstanceAuth
      .get("topics/list")
      .then((res) => {
        const data = decryptData(res.data.data);
        if (res?.data?.status) {
          setRankings(data);
        } else {
          toast.error(res?.data?.message);
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
  useEffect(() => {
    getRankings();
    getOngoing();
  }, []);

  return (
    <>
      <div className="d-flex">
        <Sidebar />
        <div className="side-bar-outside">
          <div className="ranking-general-wrapper">
            <div className="ranking-general-card">
              <div className="ranking-general-card-title-wrapper">
                <img
                  src={require("../../Assets/Img/left-arrow.svg").default}
                  alt=""
                  onClick={() => navigate(-1)}
                  className="img-fluid"
                />
                <div className="question-title-wrapper">
                  <h3>Rankings</h3>
                </div>
              </div>
              <div className="ranking-user-count-wrapper">
                <div className="d-flex align-items-center">
                  <button className="general-button">General - XP</button>
                  <button className="tournament-button">Tournament</button>
                </div>
              </div>
              <div className="ranking-contend">
                {rankings.map((d, i) => (
                  <div
                    className="ranking-wrapper"
                    key={i}
                    onClick={() => {
                      localStorage.setItem(
                        "topicDetails",
                        encryptData(JSON.stringify(d))
                      );
                      navigate(
                        `/ranking-${d?.name.replace(/\s+/g, "-").toLowerCase()}`
                      );
                    }}
                  >
                    <div className="d-flex align-items-center">
                      <img src={d.icon} alt="" className="ranking-game-img" />
                      <h3 style={{ color: d.color_code }}>{d.name}</h3>
                    </div>
                    <hr className="ranking-line" />
                  </div>
                ))}{" "}
              </div>
            </div>
            <UserDetails />
          </div>
        </div>
      </div>
    </>
  );
};

export default RankingGeneral;
