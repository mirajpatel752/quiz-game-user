import React, { useEffect, useState } from "react";
import worldCuisines from "../../Assets/Img/world-cuisines.svg";
import "./Interested.scss";
import { Modal } from "reactstrap";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axiosInstanceAuth from "../../apiServices/axiosInstanceAuth";
import useEncryption from "../../customHook/useEncryption";
import { toast } from "react-toastify";
import logo from "../../Assets/Img/logo.svg";
const Interested = (props) => {
  const { id } = useParams();
  const { encryptData, decryptData } = useEncryption();
  const [accountDetails, setAccountDetails] = useState([]);

  const navigate = useNavigate();
  const [multiple, setMultiple] = useState([]);

  const selectClicked = (id, e) => {
    const duplicateId = multiple.filter((d) => d === id);
    if (duplicateId.length <= 0) {
      setMultiple((res) => [...res, id]);
    } else {
      setMultiple(multiple.filter((d) => d !== id));
    }
  };

  const getByAccount = async () => {
    await axiosInstanceAuth
      .get(`categories/get-by-account/${id}`)
      .then((res) => {
        const data = decryptData(res.data.data);
        if (res?.data?.status) {
          toast.success(res?.data?.message);
          setAccountDetails(data);
        } else {
          toast.error(res?.data?.message);
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error(err);
      });
  };

  const getCategoriesAll = async () => {
    await axiosInstanceAuth
      .get(`categories/get-all`)
      .then((res) => {
        const data = decryptData(res.data.data);
        if (res?.data?.status) {
          toast.success(res?.data?.message);
          setAccountDetails(data);
        } else {
          toast.error(res?.data?.message);
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error(err);
      });
  };

  const handleSubmit = async () => {
    const categories = JSON.stringify(multiple);
    const encryptedData = encryptData(
      JSON.stringify({
        categories,
      })
    );
    await axiosInstanceAuth
      .post("categories/set-user-category", {
        data: encryptedData,
      })
      .then((res) => {
        const data = decryptData(res.data.data);
        if (res.data.status) {
          navigate("/dashboard");
          toast.success(res?.data?.message);
        } else {
          toast.error(res?.data?.message);
        }
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  useEffect(() => {
    if (id === "0") {
      getCategoriesAll();
    } else {
      getByAccount();
    }
  }, []);

  return (
    <>
      <div className="custom-font interest-wrapper">
        <div className="py-4 position-relative">
          <div className="">
            <div className="d-flex justify-content-center">
              <img src={logo} alt="" className="img-fluid mobile-logo" />
            </div>
            <div className="justify-content-center">
              <h2 className="text-center" id="staticBackdropLabel">
                What are you mostly interested in?
              </h2>
            </div>
            <p className="choose-para">Choose three or more</p>

            {/* Modal body */}
            <div className=" mt-4">
              <div className="fw-normal">
                <div className="row gap-3 justify-content-center py-2 fit-div-scroll">
                  {accountDetails.map((d, key) => (
                    <div
                      className={`${multiple.includes(d.id) ? "active-class" : ""
                        } col-3 shadow rounded d-flex flex-column justify-content-center align-items-center gap-2 py-2 height-width position-relative `}
                      onClick={() => selectClicked(d.id)}
                      key={key}
                    >
                      {multiple.includes(d.id) ? (
                        <i className="fa-sharp fa-solid fa-circle-check border-icon"></i>
                      ) : (
                        ""
                      )}

                      {/* <div className="col-3 shadow rounded d-flex flex-column justify-content-center align-items-center gap-2 py-2 height-width"> */}
                      <div className="">
                        <img
                          src={`${d?.icon}`}
                          alt="profile-img"
                          className="img-wrapper"
                        />
                      </div>
                      <p
                        className="interest-name mt-3 custom-font"
                        style={{ color: `${d.color}` }}
                      >
                        {d.title}
                      </p>

                      {/* <button onClick={removeClass}>remove</button> */}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="mt-4 text-center">
              {multiple.length >= 3 ? (
                <div onClick={handleSubmit} className="footer">
                  Continue
                </div>
              ) : (
                <div className="footer" style={{ backgroundColor: "#B7B7B7" }}>
                  Continue
                </div>
              )}
              <button onClick={() => navigate(-1)} className="back-footer-btn">
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Interested;
