import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Input } from "antd";
import { IoMdArrowRoundBack } from "react-icons/io";


const ClinicList = () => {
  const [clinics, setClinics] = useState("");
  const [nameClinic, setNameClinic] = useState("");


  const navigate = useNavigate();

  useEffect(() => {
    const getClinics = async () => {
      try {
        const response = await axios.get(`http://localhost:3333/clinic?name=${nameClinic}`);
        setClinics(response.data.payload);
      } catch (error) {
        console.error("Error searching products:", error);
      }
    };
    getClinics();
  }, [nameClinic]);

  const handleClick = async (id) => {
    navigate(`/detail-Clinic/${id}`);
  };

  const handleClickBack = async (id) => {
    navigate(`/`);
  };

  return (
    <div className="specialty-list container">
      <div className="specialty-list-top">
      <span className="icon-back" onClick={handleClickBack}><IoMdArrowRoundBack/></span>
      </div>
      <div className="specialty-list-content">
        <div className="specialty-list-heading">
          <h4>Danh sách phòng khám</h4>
          <Input className="input-search" placeholder="Tìm kiếm phòng khám" onChange={(e) => setNameClinic(e.target.value)}/>
        </div>
        {clinics &&
          clinics.map((item) => (
            <div
              className="specialty-item"
              key={item.id}
              onClick={() => handleClick(item.id)}
            >
              <img src={`http://localhost:3333/${item.image}`} />
              <p>{item.name}</p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ClinicList;
