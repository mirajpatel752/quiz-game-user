import { Modal } from "reactstrap";
import react, { useState } from "react";
const ReviewQuestions = ({ result, onReport }) => {
  return (
    <>
      {result.result.map((d, i) => (
        <div className="questions-box" key={i}>
          <hr className="hr-box-questions" />
          <div className="d-flex justify-content-between  box-questions-review">
            <div className="d-flex box-side-name align-items-center">
              {d.question_image && (
                <img src={d.question_image} alt="" className="image-que" />
              )}
              <div className="details-que">
                <h5 className="que-name">{d.question}</h5>
                <p
                  style={{
                    color: d.player_answer === 1 ? "#00B050" : "#EC4648",
                  }}
                  className={
                    d.checked === true ? "que-subtitle" : "que-subtitle-calor"
                  }
                >
                  {d?.player_time_out === 1 ? "time out" : d.player_answer_key}
                </p>
              </div>
            </div>
            <div className="d-flex box-side-info align-items-center">
              <div className="image-box">
                {d.player_answer === 1 ? (
                  <img
                    src={require("../../../Assets/Img/checked.svg").default}
                    alt=""
                    className="image-check"
                  />
                ) : (
                  <img
                    src={require("../../../Assets/Img/close.svg").default}
                    alt=""
                    className="image-check"
                  />
                )}

                <p className="check-pr">{d.player_spent_time}s</p>
              </div>
              <div className="tooltip-wrapper">
                <img
                  onClick={() => onReport(d)}
                  src={require("../../../Assets/Img/info.svg").default}
                  alt=""
                  className="image-info"
                />
              </div>
            </div>
          </div>
        </div>
      ))
      }
    </>
  );
};
export default ReviewQuestions;
