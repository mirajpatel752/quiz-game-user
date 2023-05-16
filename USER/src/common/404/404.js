import React from "react"
import "./404.scss"
import { Link } from "react-router-dom"

const Error = () => {
  return (
    <>
      <div className="container">
        <div className="error-not-found">
          <div className="logo-wrapper">
            <Link to="/dashboard">
              <img className="img-fluid " src={require('../../Assets/Img/logo.svg').default} alt="logo" />
            </Link>
          </div>
          <div className="d-flex justify-content-center">
            <img className="img-fluid" src={require('../../Assets/Img/404.svg').default} alt="404" />
          </div>
        </div>
      </div>
    </>
  )
}

export default Error
