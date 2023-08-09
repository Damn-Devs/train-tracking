import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logOut, selectCurrentUser } from "../../redux/features/authSlice";
import { NavLink, useNavigate } from "react-router-dom";
import navLinks from "../../assets/dummy-data/navLinks";
import "./sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();
  const authUser = useSelector(selectCurrentUser);

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="sidebar">
      <div className="sidebar__top">
        <h2>
          <span>
            <i class="ri-train-fill"></i>
          </span>{" "}
          TrainBooking
        </h2>
      </div>

      <div className="sidebar__content">
        <div className="menu">
          <ul className="nav__list">
            {navLinks
              .filter((nav) =>
                authUser.roles[0] === "Station Master"
                  ? nav.display === "Train Tracking" ||
                    nav.display === "Current Location Changer" ||
                    nav.display === "Delay Train Management"
                  : nav
              )
              .map((item, index) => (
                <li className="nav__item" key={index}>
                  <NavLink
                    to={item.path}
                    className={(navClass) =>
                      navClass.isActive ? "nav__active nav__link" : "nav__link"
                    }
                  >
                    <i className={item.icon}></i>

                    {item.display}
                  </NavLink>
                </li>
              ))}
          </ul>
        </div>

        <div className="sidebar__bottom" onClick={logout}>
          <span>
            <i class="ri-logout-circle-r-line"></i> Logout
          </span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
