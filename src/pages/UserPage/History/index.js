import React, { useState, useEffect } from "react";
import axios from "axios";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { FaRegClock, FaRegCalendarAlt, FaCheckCircle } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { getIdUser } from "../../../utils/tokenUtils";
import { MdNewReleases } from "react-icons/md";
import moment from "moment";
import BreadcrumbComponent from "../../../component/Breadcrumb";

const History = () => {
  const [patient, setPatient] = useState("");
  const [allHistoryBooking, setAllHistoryBooking] = useState("");
  const navigate = useNavigate();
  const IdPatient = getIdUser();

  useEffect(() => {
    getPatient();
    getHistoryBooking();
  }, []);

  const getPatient = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3333/users/${IdPatient}`
      );
      setPatient(response.data.payload);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getHistoryBooking = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3333/booking/history-booking?patientId=${IdPatient}`
      );
      setAllHistoryBooking(response.data.payload);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="container" style={{ minHeight: "720px" }}>
      <div className="specialty-list-top">
        <BreadcrumbComponent currentPage={`Lịch sử đặt lịch`} />
      </div>
      <div style={{ padding: "10px 0px 20px 0px" }}>
        <h4>Lịch sử đặt lịch</h4>
      </div>
      <div className="container-history">
        {allHistoryBooking &&
          allHistoryBooking.map((e) => (
            <div className="wrapper-item-history">
              <div className="wrapper-content-history">
                <div className="wrapper-history-left">
                  <div className="wrapper-history-icon">
                    <img
                      src="https://bookingcare.vn/_next/static/media/ic_kham.b8b58dd8.png"
                      alt=""
                    />
                  </div>
                  <h6>KHÁM</h6>
                  <div className="wrapper-time-history">
                    <div>
                      <FaRegClock className="icon-history" />
                      <span>{e["timeTypeDataPatient.valueVi"]}</span>
                    </div>
                    <div>
                      <FaRegCalendarAlt className="icon-history" />
                      <span>
                        {moment(e["scheduleData.date"]).format("DD/MM/YYYY")}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="wrapper-history-right">
                  <h5>
                    Bệnh nhân: {patient.firstName} {patient.lastName}
                  </h5>
                  <p>
                    Bác sĩ:{" "}
                    <b>
                      {e["doctorData.positionData.valueVi "]}{" "}
                      {e["doctorData.firstName"]} {e["doctorData.lastName"]}
                    </b>
                  </p>
                  <p>Nơi khám: {e["doctorDataInfo.clinicData.name"]}</p>
                  <p>Lý do khám: {e.description}</p>
                  <div>
                    {e["statusDataPatient.valueVi"] === "Đã khám xong" ? (
                      <FaCheckCircle className="icon-status" />
                    ) : e["statusDataPatient.valueVi"] === "Lịch hẹn mới" ? (
                      <MdNewReleases className="icon-status-new" />
                    ) : (
                      <MdCancel className="icon-status-cancel" />
                    )}
                    {e["statusDataPatient.valueVi"]}
                  </div>
                  <i>Giá: {e["doctorDataInfo.priceData.valueVi"]}đ</i>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default History;
