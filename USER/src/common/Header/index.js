import React from "react";
import {Link, useLocation, useParams} from "react-router-dom";
import "./style.scss";

const Header = () => {
    const location = useLocation();
    return (
        <>
       
            <header className="main-header">
                <div className="container">
                    <div className="logo">
                        <Link to="/">
                            <img className="img-fluid"
                                src={
                                    require("../../Assets/Img/logo.svg").default
                                }
                                alt=""/>
                        </Link>
                    </div>
                    <div className="header-side">
                        <input type="checkbox" className="menu-btn" id="menu-btn"/>
                        <label htmlFor="menu-btn" className="menu-icon1 hide-mobile"></label>
                        <ul className="nav-links">
                            <li className="nav-link">
                                <Link className={
                                        `${
                                            location ?. pathname === "/" && "active-tab"
                                        }`
                                    }
                                    to="/">
                                    Home
                                </Link>
                            </li>
                            <li className="nav-link">
                                <Link className={
                                        `${
                                            location ?. pathname === "/about" && "active-tab"
                                        }`
                                    }
                                    to="/about">
                                    About Us
                                </Link>
                            </li>
                            <li className="nav-link">
                                <Link className={
                                        `${
                                            location ?. pathname === "/contact" && "active-tab"
                                        }`
                                    }
                                    to="/contact">
                                    Contact Us
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </header>

            {/* Desktop */}

            <div className="d-sm-none">
                <input className="menu-icon" type="checkbox" id="menu-icon" name="menu-icon"/>
                <label htmlFor="menu-icon"></label>
                <nav className="nav">
                    <ul className="pt-5">
                        <li className="nav-item">
                            <Link to="/"
                                className={
                                    `${
                                        location ?. pathname === "/" && "active-tab"
                                    } nav-link`
                            }>
                                Home
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className={
                                    `${
                                        location ?. pathname === "/about" && "active-tab"
                                    } nav-link`
                                }
                                to="/about">
                                About Us
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className={
                                    `${
                                        location ?. pathname === "/contact" && "active-tab"
                                    } nav-link`
                                }
                                to="/contact">
                                Contact Us
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>

           
        </>
    );
};

export default Header;
