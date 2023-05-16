import { useState } from "react";
import { toast } from "react-toastify";
import { Modal } from "reactstrap";
import axiosInstanceAuth from "../../../apiServices/axiosInstanceAuth";
import checked from "../../../Assets/Img/checked.svg";
import useEncryption from "../../../customHook/useEncryption";
import Eevee from "../Eevee";
import "../modal/modal.scss";

const WonLostModal = (props) => {
  const { wonModal, setWonOpen, result, isWinner } = props;
  
  const { encryptData, decryptData } = useEncryption();
  const [isReportIssue, setIsReportIssue] = useState(false);
  const [fields, setFields] = useState({
    wrong_answer: false,
    too_short_time_to_answer: false,
    off_topic: false,
    other: false,
    otherTitle: "",
    title: "",
  });
  const [isAccessCode, setIsAccessCode] = useState(false);

  const [error, setError] = useState({
    status: false,
    type: "",
    message: "",
  });

  const onChange = (e) => {
    const value = e.target.value.replace(/^\s+|\s+$/gm, "");
    const name = e.target.name;
    const checked = e.target.checked;
    if (name === "wrong_answer") {
      if (checked) {
        setError({
          ...error,
          status: false,
          type: "",
          message: "",
        });
        setFields({
          wrong_answer: checked,
          title: "Wrong answer",
        });
      } else {
        setError({
          ...error,
          status: true,
          type: "terms",
          message: "please check terms",
        });
        setFields({
          wrong_answer: checked,
          title: "",
          otherTitle: "",
        });
      }
    }
    if (name === "too_short_time_to_answer") {
      if (checked) {
        setError({
          ...error,
          status: false,
          type: "",
          message: "",
        });
        setFields({
          too_short_time_to_answer: checked,
          title: "Insufficient time to answer",
        });
      } else {
        setError({
          ...error,
          status: true,
          type: "terms",
          message: "please check terms",
        });
        setFields({
          too_short_time_to_answer: checked,
          title: "",
          otherTitle: "",
        });
      }
    }
    if (name === "off_topic") {
      if (checked) {
        setError({
          ...error,
          status: false,
          type: "",
          message: "",
        });
        setFields({
          off_topic: checked,
          title: "Off topic",
        });
      } else {
        setError({
          ...error,
          status: true,
          type: "terms",
          message: "please check terms",
        });
        setFields({
          off_topic: checked,
          title: "",
          otherTitle: "",
        });
      }
    }
    if (name === "other") {
      if (checked) {
        setError({
          ...error,
          status: false,
          type: "",
          message: "",
        });
        setFields({
          other: checked,
          title: "",
          otherTitle: "",
        });
      } else {
        setError({
          ...error,
          status: true,
          type: "terms",
          message: "please check terms",
        });
        setFields({
          other: checked,
          title: "",
          otherTitle: "",
        });
      }
    }
    if (name === "otherTitle") {
      if (value.length > 1) {
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
      } else {
        setError({
          ...error,
          status: true,
          type: "terms",
          message: "please check terms",
        });
        setFields({
          ...fields,
          [name]: value,
        });
      }
    }
  };

  return (
    <>
      <Modal
        className="won-lost-modal"
        style={{ display: isReportIssue || isAccessCode ? "none" : "block" }}
        autoFocus={true}
        centered={true}
        backdrop="static"
        isOpen={wonModal}
      >
        <div className="won-lost-contend">
          <Eevee
           flag={true}
            result={result}
            isWinner={isWinner}
            setWonOpen={setWonOpen}
            isAccessCode={isAccessCode}
            setIsAccessCode={setIsAccessCode}
            isReportIssue={isReportIssue}
            setIsReportIssue={setIsReportIssue}
          />
        </div>
      </Modal>
    </>
  );
};
export default WonLostModal;
