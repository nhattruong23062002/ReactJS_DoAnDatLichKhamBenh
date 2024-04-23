import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "./section.scss";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "./../../utils/apiConfig";

const Specialty = () => {
  const [specialty, setSpecialty] = useState("");
  const [slidesToShow, setSlidesToShow] = useState(4);
  const navigate = useNavigate();

  useEffect(() => {
    const getAllUser = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/specialty?name=`);
        setSpecialty(response.data.payload);
        console.log("««««« response.data.payload »»»»»", response.data.payload);
      } catch (error) {
        console.error("Error searching products:", error);
      }
    };
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

  var settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: slidesToShow,
    slidesToScroll: slidesToShow,
    //variableWidth: true,
    infinite: false,
  };

  const handleSpecialtyDetail = async (id) => {
    navigate(`/detail-specialty/${id}`);
  };
  const handleSpecialtyList = async (id) => {
    navigate(`/specialty-list`);
  };

  return (
    <div className="section specialty" /*  style={{height:'450px'}} */>
      <div className="section-content container" style={{ paddingTop: "80px" }}>
        <div className="section-header">
          <h2>Chuyên khoa phổ biến</h2>
          <button onClick={handleSpecialtyList}>Xem thêm</button>
        </div>
        <Slider {...settings}>
          {specialty &&
            specialty.map((p) => (
              <div
                className="section-item"
                key={p.id}
                onClick={() => handleSpecialtyDetail(p.id)}
              >
                <img src={`${BASE_URL}/${p.image}`} />
                <h3>{p.name}</h3>
              </div>
            ))}
        </Slider>
      </div>
    </div>
  );
};

export default Specialty;
