import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Input } from "antd";
import { IoMdArrowRoundBack } from "react-icons/io";

const DoctorList = () => {
  const [doctors, setDoctors] = useState("");
  const [nameDoctor, setNameDoctor] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const getDoctors = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3333/users/getall-doctor?name=${nameDoctor}`
        );
        setDoctors(response.data.payload);
        console.log("««««« response.data.payload »»»»»", response.data.payload);
      } catch (error) {
        console.error("Error searching products:", error);
      }
    };
    getDoctors();
  }, [nameDoctor]);

  const handleClick = async (id) => {
    navigate(`/detail-doctor/${id}`);
  };

  const handleClickBack = async (id) => {
    navigate(`/`);
  };

  return (
    <div className="doctor-list container">
      <div className="doctor-list-top">
        <span className="icon-back" onClick={handleClickBack}>
          <IoMdArrowRoundBack />
        </span>
      </div>
      <div className="doctor-list-content">
        <div className="doctor-list-heading">
          <h4>Danh sách bác sĩ nổi bật</h4>
          <Input
            className="input-search"
            placeholder="Tìm kiếm bác sĩ"
            onChange={(e) => setNameDoctor(e.target.value)}
          />
        </div>
        {doctors &&
          doctors.map((item) => (
            <div
              className="doctor-item"
              key={item.id}
              onClick={() => handleClick(item.id)}
            >
              <img src={`http://localhost:3333/${item.image}`} />
              <div>
                <p>
                  {item.positionData.valueVi} {item.firstName} {item.lastName}
                </p>
                <span>{item.Doctor_Infor.specialtyData.name}</span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default DoctorList;
