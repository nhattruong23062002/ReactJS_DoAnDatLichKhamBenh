import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "./section.scss";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "./../../utils/apiConfig";

const OutstandingDoctor = () => {
  const [user, setUser] = useState("");
  const [slidesToShow, setSlidesToShow] = useState(4);
  const navigate = useNavigate();

  const getAllUser = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/users/getall-doctor?name=`);
      setUser(response.data.payload);
      console.log("««««« response.data.payload »»»»»", response.data.payload);
    } catch (error) {
      console.error("Error searching products:", error);
    }
  };
  useEffect(() => {
    getAllUser();
  }, []);

  useEffect(() => {
    const updateSlidesToShow = () => {
      if (window.innerWidth < 570) {
        setSlidesToShow(2.5);
      } else {
        setSlidesToShow(4);
      }
    };

    window.addEventListener("resize", updateSlidesToShow);

    updateSlidesToShow();
    return () => {
      window.removeEventListener("resize", updateSlidesToShow);
    };
  }, []);

  const handleDoctorDetail = async (id) => {
    navigate(`/detail-doctor/${id}`);
  };

  const handleDoctorList = async (id) => {
    navigate(`/doctor-list`);
  };

  var settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: slidesToShow,
    slidesToScroll: slidesToShow,
    //variableWidth: true,
    infinite: false,
  };
  return (
    <div className="section outstanding-doctor">
      <div className="section-content container">
        <div className="section-header">
          <h2>Bác sĩ nổi bật tuần qua</h2>
          <button onClick={handleDoctorList}>Tìm kiếm</button>
        </div>
        <Slider {...settings}>
          {user &&
            user.map((p) => (
              <div
                className="section-item"
                key={p.id}
                onClick={() => handleDoctorDetail(p.id)}
              >
                <div className="customize-border">
                  <img src={`${BASE_URL}/${p.image}`} />
                  <div className="info-doctor">
                    <h3>
                      {p.positionData.valueVi} {p.firstName} {p.lastName}
                    </h3>
                    <p>{p.Doctor_Infor.specialtyData.name}</p>
                  </div>
                </div>
              </div>
            ))}
        </Slider>
      </div>
    </div>
  );
};

export default OutstandingDoctor;
