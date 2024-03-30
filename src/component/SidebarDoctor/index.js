import React from "react";
import { NavLink } from "react-router-dom";
import { AiOutlineDashboard } from "react-icons/ai";
import { BsFillPeopleFill,BsBookHalf } from "react-icons/bs";
import { FaUserDoctor } from "react-icons/fa6";
import { FaClinicMedical } from "react-icons/fa";
import { MdHomeRepairService } from "react-icons/md";


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
              <BsFillPeopleFill className="icon-sidebar"/>
              <span>Quản lý lịch khám</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/doctor" className="active1">
              <FaUserDoctor className="icon-sidebar"/>
              <span>Profile</span>
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SideBarDoctor;
