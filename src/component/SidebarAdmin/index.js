import React from "react";
import { NavLink } from "react-router-dom";
import { AiOutlineDashboard } from "react-icons/ai";
import { BsFillPeopleFill, BsBookHalf } from "react-icons/bs";
import { FaUserDoctor } from "react-icons/fa6";
import { FaClinicMedical, FaRegCalendarAlt } from "react-icons/fa";
import { MdHomeRepairService } from "react-icons/md";
import { IoChatbubbleEllipses } from "react-icons/io5";

const SideBar = () => {
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
            <NavLink to="/admin/dashboard" className="active1">
              <AiOutlineDashboard className="icon-sidebar" />
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li className="menu">
            <b>User Management</b>
          </li>
          <li>
            <NavLink to="/admin/user-manage" className="active1">
              <BsFillPeopleFill className="icon-sidebar" />
              <span>User</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/doctor-manage" className="active1">
              <FaUserDoctor className="icon-sidebar" />
              <span>Quản lý bác sĩ</span>
            </NavLink>
          </li>
          <li className="menu">
            <b>Orther</b>
          </li>
          <li>
            <NavLink to="/doctor/manage-schedule" className="active1">
              <FaRegCalendarAlt className="icon-sidebar" />
              <span>Quản lý lịch trình</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/clinic-manager" className="active1">
              <FaClinicMedical className="icon-sidebar" />
              <span>Phòng khám</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/specialty-manager" className="active1">
              <MdHomeRepairService className="icon-sidebar" />
              <span>Chuyên khoa</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/handbook-manager" className="active1">
              <BsBookHalf className="icon-sidebar" />
              <span>Cẩm nang</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/chat" className="active1">
              <IoChatbubbleEllipses className="icon-sidebar" />
              <span>Chat</span>
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SideBar;
