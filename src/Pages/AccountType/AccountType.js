import React, { useEffect, useState } from "react";
import "./AccountType.scss";
import { useNavigate } from "react-router-dom";
import axiosInstanceAuth from "../../apiServices/axiosInstanceAuth";
import { toast } from "react-toastify";
import useEncryption from "../../customHook/useEncryption";

const AccountType = () => {
  const [accountTypes, setAccountTypes] = useState([]);
  const { encryptData, decryptData } = useEncryption();
  const [select, setSelect] = useState(null);

  const selectClicked = (data) => {
    setSelect(data);
  };

  const navigate = useNavigate();

  const getAccountTypes = async () => {
    await axiosInstanceAuth
      .get("account-types/get")
      .then((res) => {
        const data = decryptData(res.data.data);
        if (res?.data?.status) {
          setAccountTypes(data);
        } else {
          toast.error(res?.data?.message);
        }
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  useEffect(() => {
    getAccountTypes();
  }, []);

  return (
    <div className="d-flex justify-content-center align-items-center">
      <div className="account-type-wrapper">
        <h1>Choose Account Type</h1>
        <div className="row card-wrapper-div">
          {accountTypes.map((d, i) => (
            <div key={i} className="col-6  mb-4">
              <div
                onClick={() => selectClicked(d.id)}
                className={`${
                  select === d.id ? "active-border" : ""
                } card-wrapper`}
              >
                {select === d.id ? (
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h4 className="m-0 wrap-text">
                        {d?.account_type.slice(0, 15)}
                        {d?.account_type.length > 15 && "..."}{" "}
                      </h4>
                      <img
                        src={require("../../Assets/Img/right.svg").default}
                        alt=""
                        className="img-fluid"
                      />
                    </div>
                    <div className="selected-wrapper">
                      <p>{d.description?.slice(0, 90)}</p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="img-wrapper">
                      <img
                        className="h-100 w-100"
                        src={d?.icon}
                        alt="profile-img"
                      />
                    </div>
                    <h4>
                      {d?.account_type.slice(0, 15)}
                      {d?.account_type.length > 15 && "..."}{" "}
                    </h4>
                  </div>
                )}
              </div>
            </div>
          ))}
          <div className="col-6  mb-4">
            <div
              onClick={() => selectClicked(0)}
              className={`${select === 0 ? "active-border" : ""} card-wrapper`}
            >
              {select === 0 ? (
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-3 text-align-center">
                    <h4 className="m-0">All in one</h4>
                    <img
                      src={require("../../Assets/Img/right.svg").default}
                      alt=""
                      className="img-fluid"
                    />
                  </div>
                  <div className="selected-wrapper">
                    <p>All in one</p>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="img-wrapper">
                    <img
                      src={require("../../Assets/Img/open-box1.svg").default}
                      alt=""
                      className="img-fluid"
                    />
                  </div>
                  <h4>All in one</h4>
                </div>
              )}
            </div>
          </div>
        </div>
        <button
          onClick={() => navigate(`/interested${select}`)}
          className="continue-footer-btn"
          disabled={select === null}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default AccountType;
