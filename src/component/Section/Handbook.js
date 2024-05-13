import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "./section.scss";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "./../../utils/apiConfig";

const Handbook = () => {
  const [handbook, setHandbook] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const getAllHandbook = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/handbook`);
        setHandbook(response.data.payload);
      } catch (error) {
        console.error("Error searching products:", error);
      }
    };
    getAllHandbook();
  }, []);

  const handleHandBookDetail = async (id) => {
    navigate(`/detail-handbook/${id}`);
  };
  const handleClick = async (id) => {
    navigate(`/handbook-list`);
  };
  var settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 2,
    //variableWidth: true,
    infinite: false,
  };
  return (
    <div className="section handbook">
      <div className="section-content container">
        <div className="section-header">
          <h2>Cẩm nang</h2>
          <button onClick={() => handleClick()}>Tất cả bài viết</button>
        </div>
        <Slider {...settings}>
          {handbook &&
            handbook.map((c) => (
              <div
                className="section-item"
                key={c.id}
                onClick={() => handleHandBookDetail(c.id)}
              >
                <div className="flex-handbook">
                  <img src={`${BASE_URL}/${c.image}`} />
                  <h3>{c.title}</h3>
                </div>
              </div>
            ))}
        </Slider>
      </div>
    </div>
  );
};

export default Handbook;
