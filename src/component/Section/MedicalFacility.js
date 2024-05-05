import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "./section.scss";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "./../../utils/apiConfig";

const MedicalFacility = () => {
  const [clinic, setClinic] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const getAllClinic = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/clinic?name=`);
        setClinic(response.data.payload);
      } catch (error) {
        console.error("Error searching products:", error);
      }
    };
    getAllClinic();
  }, []);

  const handleClinicDetail = async (id) => {
    navigate(`/detail-clinic/${id}`);
  };
  const handleClick = async (id) => {
    navigate(`/clinic-list`);
  };

  var settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: window.innerWidth < 570 ? 2.5 : 4,
    slidesToScroll: window.innerWidth < 570 ? 2.5 : 4,
    //variableWidth: true,
    infinite: false,
  };
  return (
    <div className="section medical-facility">
      <div className="section-content container">
        <div className="section-header">
          <h2>Cơ sở y tế nổi bật</h2>
          <button onClick={handleClick}>Tìm kiếm</button>
        </div>
        <Slider {...settings}>
          {clinic &&
            clinic.map((c) => (
              <div
                className="section-item "
                key={c.id}
                onClick={() => handleClinicDetail(c.id)}
              >
                <img src={`${BASE_URL}/${c.image}`} />
                <h3>{c.name}</h3>
              </div>
            ))}
        </Slider>
      </div>
    </div>
  );
};

export default MedicalFacility;
