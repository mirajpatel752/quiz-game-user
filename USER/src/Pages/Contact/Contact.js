import React, { useState } from "react";
import "./Contact.scss";
import Header from "../../common/Header";
import useEncryption from "../../customHook/useEncryption";
import axiosInstanceAuth from "../../apiServices/axiosInstanceAuth";
import { toast } from "react-toastify";
import PromiseLoader from "../../common/Loader/PromiseLoader";

const Contact = () => {
  const [error, setError] = useState({ status: false, type: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState({
    fullName: "",
    email: "",
    phone: "",
    message: "",
  });
  const { encryptData, decryptData } = useEncryption();

  const emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const onChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    if (name === "fullName") {
      if (value.length === 0) {
        setError({
          ...error,
          status: true,
          type: "fullName",
          message: "fullName is required",
        });
        setFields({
          ...fields,
          [name]: value.replace(/^\s+|\s+$/gm, ""),
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
          [name]: value.replace(/^\s+|\s+$/gm, ""),
        });
      }
    }
    if (name === "phone") {
      if (value.length === 0) {
        setError({
          ...error,
          status: true,
          type: "phone",
          message: "phone is required",
        });
        setFields({
          ...fields,
          [name]: value.replace(/^\s+|\s+$/gm, ""),
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
          [name]: value.replace(/^\s+|\s+$/gm, ""),
        });
      }
    }
    if (name === "email") {
      if (!emailRegex.test(value)) {
        setError({
          ...error,
          status: true,
          type: "email",
          message: "email is required",
        });
        setFields({
          ...fields,
          [name]: value.replace(/^\s+|\s+$/gm, ""),
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
          [name]: value.replace(/^\s+|\s+$/gm, ""),
        });
      }
    }
    if (name === "message") {
      if (value.length === 0) {
        setError({
          ...error,
          status: true,
          type: "message",
          message: "message is required",
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
    }
  };

  const postContact = async () => {
    if (fields.fullName.length === 0) {
      toast.error("FullName is required");
    } else if (!emailRegex.test(fields.email)) {
      toast.error("Invalid Email ID");
    } else if (fields.phone.length === 0) {
      toast.error("Phone is required");
    } else if (fields.message.length === 0) {
      toast.error("Message is required");
    } else {
      setLoading(true);
      const encryptedData = encryptData(
        JSON.stringify({
          name: fields.fullName,
          contact_no: fields.phone,
          email: fields.email,
          message: fields.message,
        })
      );
      await axiosInstanceAuth
        .post("contact-us", {
          data: encryptedData,
        })
        .then((res) => {
          setLoading(false);
          const data = decryptData(res.data.data);
          if (res?.data?.status) {
            setFields({
              fullName: "",
              email: "",
              phone: "",
              message: "",
            });
            toast.success(res?.data?.message);
          } else {
            toast.error(res?.data?.message);
          }
        })
        .catch((err) => {
          toast.error(err);
        });
    }
  };
  return (
    <>
      <Header />
      <div className="contact-page">
        <div className="contact-banner">
          <div className="container">
            <h1 className="heading">Contact Us</h1>
            <p>
              Have a question or need assistance? We are here to help you with
              anything you need!
            </p>
          </div>
          <div className="contact-form">
            <div className="contact-address">
              <div>
                <div className="d-flex align-items-start mb-4">
                  <img
                    src={require("../../Assets/Img/Address.svg").default}
                    className="address-img"
                  />
                  <div>
                    <h5>Address</h5>
                    <p>16 N School Street, Honolulu,hi, 96813 </p>
                  </div>
                </div>
                <div className="d-flex align-items-start mb-4">
                  <img
                    src={require("../../Assets/Img/Phone.svg").default}
                    className="address-img"
                  />
                  <div>
                    <h5>Phone</h5>
                    <p>234-843-373</p>
                  </div>
                </div>
                <div className="d-flex align-items-start mb-4">
                  <img
                    src={require("../../Assets/Img/Email.svg").default}
                    className="address-img"
                  />
                  <div>
                    <h5>Email</h5>
                    <p>contact@zleetz.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="contact-input-wrapper">
              <h3>Send a message</h3>
              <input
                className="full-name-input"
                name="fullName"
                placeholder="Full Name"
                value={fields.fullName}
                onChange={onChange}
              />
              <div className="d-flex justify-content-between">
                <input
                  className="email-input"
                  name="email"
                  placeholder="Email"
                  value={fields.email}
                  onChange={onChange}
                />
                <input
                  className="phone-input"
                  name="phone"
                  type="number"
                  placeholder="Phone"
                  value={fields.phone}
                  onChange={onChange}
                />
              </div>
              <textarea
                className="textarea-input"
                name="message"
                placeholder="Message"
                value={fields.message}
                onChange={onChange}
              />
              <div className="d-flex justify-content-center">
                {loading ? (
                  <PromiseLoader />
                ) : (
                  <button onClick={postContact}>Send Message</button>
                )}
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

export default Contact;
