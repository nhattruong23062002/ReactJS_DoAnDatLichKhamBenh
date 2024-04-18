import React, { useEffect, useState } from "react";
import "../../../styles/dashboard.css";
import { FaClinicMedical, FaBookMedical } from "react-icons/fa";
import BarChart from "../../../component/dashboard/BarChart";
import PolarAreaChart from "../../../component/dashboard/PolarAreaChart";
import { FaUserDoctor } from "react-icons/fa6";
import { IoIosPeople } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "./../../../utils/apiConfig";


const MainDashboardAdmin = () => {
  const [totalDoctor, setTotalDoctor] = useState("");
  const [totalPatient, setTotalPatient] = useState("");
  const [totalClinic, setTotalClinic] = useState("");
  const [totalSpecialty, setTotalSpecialty] = useState("");
  const [topPatient, setTopPatient] = useState("");
  const [topDoctor, setTopDoctor] = useState("");
  const [totalBookingCurrentWeek, setTotalBookingCurrentWeek] = useState("");

  const navigate = useNavigate();

  const getAllDoctor = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/users/getall-doctor?name=`
      );
      setTotalDoctor(response.data.payload.length);
    } catch (error) {
      console.error("Error searching products:", error);
    }
  };

  const getAllPatient = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/users/getall-patient`
      );
      setTotalPatient(response.data.payload.length);
    } catch (error) {
      console.error("Error searching products:", error);
    }
  };

  const getAllClinic = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/clinic?name=`);
      setTotalClinic(response.data.payload.length);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getAllSpecialty = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/specialty?name=`);
      setTotalSpecialty(response.data.payload.length);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getTopPatient = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/users/outstanding-patient`
      );
      setTopPatient(response.data.payload);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getTopDoctor = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/users/outstanding-doctor`
      );
      setTopDoctor(response.data.payload);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getTotalBookingCurrentWeek = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/booking/getAll-booking-currentWeek`
      );
      console.log('««««« response »»»»»',response);
      setTotalBookingCurrentWeek(response.data.payload);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    getAllDoctor();
    getAllPatient();
    getAllClinic();
    getAllSpecialty();
    getTopPatient();
    getTopDoctor();
    getTotalBookingCurrentWeek();
  }, []);

  function formatNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  return (
    <main className="app-content">
      <div className="row">
        <div className="col-md-12">
          <div className="app-title">
            <ul className="app-breadcrumb breadcrumb">
              <li className="breadcrumb-item">
                <a href="#">
                  <b>Bảng điều khiển</b>
                </a>
              </li>
            </ul>
            <div id="clock"></div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12 col-lg-6">
          <div className="row">
            <div className="col-md-6">
              <div className="widget-small primary coloured-icon" onClick={() => navigate("/admin/user-manage?query=R2")}>
                <div className="iicon">
                  <i className="icon">
                    <FaUserDoctor />
                  </i>
                </div>
                <div className="info">
                  <h4>Tổng số bác sĩ</h4>
                  <p>
                    <b>{totalDoctor} bác sĩ</b>
                  </p>
                  <p className="info-tong">Tổng số bác sĩ được quản lý.</p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="widget-small info coloured-icon" onClick={() => navigate("/admin/user-manage?query=R3")}>
                <div className="iicon">
                  <i className="icon">
                    <IoIosPeople />
                  </i>
                </div>
                <div className="info">
                  <h4>Tổng số bệnh nhận</h4>
                  <p>
                    <b>{totalPatient} bệnh nhân</b>
                  </p>
                  <p className="info-tong">Tổng số bệnh nhân được quản lý.</p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="widget-small warning coloured-icon"  onClick={() => navigate("/admin/clinic-manager")}>
                <div className="iicon">
                  <i className="icon">
                    <FaClinicMedical />
                  </i>
                </div>
                <div className="info">
                  <h4>Tổng số phòng khám</h4>
                  <p>
                    <b>{totalClinic} phòng khám</b>
                  </p>
                  <p className="info-tong">Tổng số phòng khám được quản lý.</p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="widget-small danger coloured-icon" onClick={() => navigate("/admin/specialty-manager")}>
                <div className="iicon">
                  <i className="icon">
                    <FaBookMedical />
                  </i>
                </div>
                <div className="info">
                  <h4>Tổng số chuyên khoa</h4>
                  <p>
                    <b>{totalSpecialty} chuyên khoa</b>
                  </p>
                  <p className="info-tong">Tổng số chuyên khoa được quản lý.</p>
                </div>
              </div>
            </div>
            <div className="col-md-12">
              <div className="tile">
                <h3 className="tile-title">
                  Top bệnh nhân đã đặt lịch nhiều nhất
                </h3>
                <div>
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Tên bệnh nhân</th>
                        <th>Số lượt book</th>
                        <th>Tổng tiền</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topPatient &&
                        topPatient.map(
                          (e) =>
                            e.firstName && (
                              <tr key={e.id}>
                                <td>{e.id}</td>
                                <td>
                                  {e.firstName} {e.lastName}
                                </td>
                                <td>{e.bookingCount} lần book</td>
                                <td>{formatNumber(e.totalPrice)} đ</td>
                              </tr>
                            )
                        )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="col-md-12">
              <div className="tile">
                <h3 className="tile-title">Khách hàng mới</h3>
                <div>
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Họ và tên</th>
                        <th>Địa chỉ</th>
                        <th>SĐT</th>
                      </tr>
                    </thead>
                    <tbody></tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-12 col-lg-6">
          <div className="row">
            <div className="col-md-12">
              <div className="tile">
                <h3 className="tile-title">Top 5 bác sĩ nổi bật nhất</h3>
                <div className="embed-responsive embed-responsive-16by9">
                  <PolarAreaChart  data = {topDoctor}/>
                </div>
              </div>
            </div>
            <div className="col-md-12">
              <div className="tile">
                <h3 className="tile-title">
                  Thống kê lượt booking trong tuần hiện tại
                </h3>
                <div className="embed-responsive embed-responsive-16by9">
                   <BarChart
                    weekDays={["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]}
                    totalBookingCurrentWeek={totalBookingCurrentWeek}
                    />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default MainDashboardAdmin;
