import React from "react";
import Slider from "react-slick";
import "./section.scss";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Handbook = () => {
  var settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 4,
    //variableWidth: true,
    infinite: false,
  };
  return (
    <div className="section handbook">
      <div className="section-content container">
        <div className="section-header">
        <h2>Cẩm nang</h2>
        <button>Tất cả bài viết</button>
        </div>
        <Slider {...settings}>
          <div className="section-item">
            <div className="flex-handbook">
            <img src="	https://cdn.bookingcare.vn/fr/w300/2022/04/27/145030-benh-tieu-duong.jpg"/>
            <h3>Bệnh tiểu đường là gì? Nguyên nhân, dấu hiệu nhận biết và hướng điều trị</h3>
            </div>
          </div>
          <div className="section-item">
            <div className="flex-handbook">
            <img src="https://cdn.bookingcare.vn/fr/w300/2023/09/15/113905-dieu-tri-phuc-hoi-chung-nang-bv-hong-ngoc.jpg"/>
            <h3>Điều trị phục hồi chức năng cho bệnh nhân đột quỵ tại Bệnh viện Hồng Ngọc</h3>
            </div>
          </div>
          <div className="section-item">
            <div className="flex-handbook">
            <img src="	https://cdn.bookingcare.vn/fr/w300/2023/09/15/152725-bs-hung-01-01.jpg"/>
            <h3>Bác sĩ chuyên khoa II Bùi Tiến Hùng - Phẫu thuật viên hàng đầu về Phakic ICL</h3>
            </div>
          </div>
          <div className="section-item">
            <div className="flex-handbook">
            <img src="	https://cdn.bookingcare.vn/fr/w300/2023/09/14/170228-thoai-hoa-khop-cot-song-hong-ngoc.png"/>
            <h3>Review điều trị thoái hóa khớp, cột sống tại Khoa Cơ xương khớp </h3>
            </div>
          </div>
        </Slider>
      </div>
    </div>
  );
};

export default Handbook;
