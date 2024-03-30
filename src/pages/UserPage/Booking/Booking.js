import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Collapse } from "antd";
import jwt_decode from "jwt-decode";
import { getTokenFromLocalStorage,getIdUser } from "../../../utils/tokenUtils";
import UpdateUser from "../../AdminPage/UserManager/UpdateUser";
import ChangeInfor from "./ChangeInfor";
import { useNavigate } from "react-router-dom";


const Booking = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [show, setShow] = useState(false);

  const [doctor, setDoctor] = useState("");
  const [schedule, setSchedule] = useState("");
  const [patient, setPatient] = useState("");
  const [description, setDescription] = useState("");

  const { timeId } = useParams();
  const navigate = useNavigate();

  const token = getTokenFromLocalStorage();
  const IdUser = getIdUser();
  const date = new Date(schedule.date);

  // Lấy ngày tháng năm
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dayOfWeek = date.getDay();
  const daysOfWeek = [
    "Chủ Nhật",
    "Thứ Hai",
    "Thứ Ba",
    "Thứ Tư",
    "Thứ Năm",
    "Thứ Sáu",
    "Thứ Bảy",
  ];
  const dayName = daysOfWeek[dayOfWeek];

  useEffect(() => {
    const getSchedule = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3333/schedule/${timeId}`
        );
        setSchedule(response.data.payload);
      } catch (error) {
        console.error("Error searching products:", error);
      }
    };
    getSchedule();
  }, []);

  useEffect(() => {
    const getDoctor = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3333/users/${schedule.doctorId}`
        );
        setDoctor(response.data.payload);
      } catch (error) {
        console.error("Lỗi khi tìm kiếm sản phẩm:", error);
      }
    };

    getDoctor(); // Gọi hàm ở đây
  }, [schedule]);

  useEffect(() => {
    getPatient();
  }, []);

  const getPatient = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3333/users/${IdUser}`
      );
      setPatient(response.data.payload);
    } catch (error) {
      console.error("Error searching products:", error);
    }
  };

  const handleSubmit = async () => {
    try {
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);

      const response = await axios.post(
        `http://localhost:3333/booking`,
        {
          statusId: "S1",
          doctorId: doctor.id,
          patientId: patient.id,
          date: currentDate,
          description: description,
          timeType: schedule.timeType,
          scheduleId: timeId,

          patientFirstName: patient.firstName,
          patientLastName: patient.lastName,
          timeTypeValue: schedule.timeTypeData.valueVi,
          dayName: dayName,
          day: day,
          month: month,
          year: year,
          doctorFirstName: doctor.firstName ,
          doctorLastName: doctor.lastName,
          doctorPosition: doctor.positionData.valueVi
        },

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("««««« response.data.payload »»»»»", response.data.payload);
      navigate(`/bookingSuccess`);
    } catch (error) {
      alert("Đã có lỗi")
      console.error("Error searching products:", error);
    }
  };

  const handleSubmitUpdate = async (idUpdate) => {
    try {
      const response = await axios.patch(
        `http://localhost:3333/users/${idUpdate}`,
        {
          firstName,
          lastName,
          email,
          address,
          phoneNumber,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setShow(false);
      getPatient();
      console.log("Response from server:", response.data);
    } catch (error) {
      console.error("Error:", error);
      alert('Có lỗi thông tin muốn cập nhật')
      setShow(false);
    }
  };

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);


  const items = [
    {
      key: "1",
      label: "Hồ sơ bệnh nhân",
      children: (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <p>Họ và tên:</p>
            <p>
              {patient.firstName} {patient.lastName}
            </p>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <p>Số điện thoại:</p>
            <p>{patient.phoneNumber}</p>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <p>Email:</p>
            <p>{patient.email}</p>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <p>Địa chỉ:</p>
            <p>{patient.address}</p>
          </div>
          <button className="update-infor-booking" onClick={() => handleShowModal(patient)}>Điều chỉnh</button>
          <ChangeInfor
              handleSubmitUpdate={() => {
                handleSubmitUpdate(patient.id);
              }}
              show={show}
              handleClose={handleClose}
              firstName={firstName}
              lastName={lastName}
              phoneNumber={phoneNumber}
              email={email}
              address={address}
              setEmail={setEmail}
              setLastName={setLastName}
              setPhoneNumber={setPhoneNumber}
              setFirstName={setFirstName}
              setAddress={setAddress}
            />
        </div>
      ),
    },
  ];

  const handleShowModal = (patient) => {
      handleShow();
      setFirstName(patient.firstName);
      setLastName(patient.lastName);
      setPhoneNumber(patient.phoneNumber);
      setEmail(patient.email);
      setAddress(patient.address);
  };




  return (
    <>
      {doctor && schedule && (
        <div className="booking-container">
          <div className="booking-heading">
            <div className="content-left">
              <img src={`http://localhost:3333/${doctor.image}`} />
            </div>
            <div className="content-right">
              <h6>Đặt lịch khám</h6>
              <p>
                {doctor.positionData.valueVi} {doctor.firstName}{" "}
                {doctor.lastName}{" "}
              </p>
              <span>
                {schedule.timeTypeData.valueVi} - {dayName}- {day}/{month}/
                {year}
              </span>
            </div>
          </div>
          <div className="booking-infor">
            <div className="booking-infor-price">
              Giá khám: {doctor.Doctor_Infor.priceData.valueVi}đ
            </div>
            <Collapse items={items} defaultActiveKey={["1"]} />
            <form className="row">
              <div
                style={{ marginTop: "20px" }}
                className="form-group col-md-12"
              >
                <label className="control-label">Ghi chú</label>
                <textarea
                  onChange={(e) => setDescription(e.target.value)}
                  style={{ height: "60px" }}
                  className="form-control"
                  type="text"
                  placeholder="Triệu chứng, thuốc đang dùng, tiền sử..."
                  required
                />
              </div>
            </form>
            <div className="booking-button">
              <button onClick={handleSubmit}>Xác nhận đặt khám</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Booking;
