import React from "react";
import "../Pages/OnlineFriends/OnlineFriends.scss";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { useMediaQuery } from "react-responsive";
import { Modal } from "reactstrap";

const TimerModal = ({
  open,
  close,
  cancel = null,
  duration,
  renderTime,
  userName,
  isShow = false,
}) => {
  const isWide = useMediaQuery({ minWidth: "500px" });

  return (
    <>
      <Modal
        className="waiting-user-modal"
        style={{ display: isShow ? "none" : "flex" }}
        autoFocus={true}
        centered={true}
        backdrop="static"
        isOpen={open}
      >
        <div className="waiting-user-wrapper">
          <div className="close-icon-wrapper">
            <img
              onClick={cancel === null ? close : cancel}
              src={require("../Assets/Img/close-icon.svg").default}
              alt=""
              className="img-fluid"
            />
          </div>
          <h1 className="waiting-title">
            {cancel === null ? `Challenge accepted`
              : `Waiting for ${userName} to accept your challenge`}
          </h1>
          <p className="starting-title">{cancel === null && `Starting in...`}</p>
          <div className="d-flex justify-content-center align-items-center">
            <div className="count-down-timer-wrapper">
              <CountdownCircleTimer
                isPlaying
                duration={duration}
                size={isWide ? 180 : 150}
                colors="#1A2B51"
                onComplete={() => [true, 1000]}
              >
                {renderTime}
              </CountdownCircleTimer>
            </div>
          </div>
          <div className="text-center">
            <button onClick={close} className="cancel-btn">
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default TimerModal;
