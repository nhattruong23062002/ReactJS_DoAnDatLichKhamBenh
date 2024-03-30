import React from "react";
import { NavLink } from "react-router-dom";
import { AiOutlineDashboard } from "react-icons/ai";
import { FaRegCalendarAlt } from "react-icons/fa";


const SideBarDoctor = () => {
  return (
    <div>
      <div className="sidebar-brand">
        <h3>
          <span className="lab la-accusoft icon-logo" />{" "}
          <b className="logo">Management System</b>{" "}
        </h3>
      </div>
      <div className="sidebar-menu">
        <ul>
          <li>
            <NavLink to="/doctor/manage-schedule" className="active1">
              <AiOutlineDashboard className="icon-sidebar"/>
              <span>Quản lý lịch trình</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/doctor/manage-patient" className="active1">
              <FaRegCalendarAlt className="icon-sidebar"/>
              <span>Quản lý lịch khám</span>
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SideBarDoctor;
