import React from "react";
import "./InformationVideo.scss"
const InformationVideo = () => {
  return (
    <div className="wrapper container">
        <h2 style={{fontSize:'30px'}}>Truyền thông nói gì về HealthCare</h2>
        <div className="wrapper-content">
        <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/7tiR7SI4CkI?si=VO2f_U5q_7yx9Plj"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
        ></iframe>
        <div className="logoTV">
            <div>
            <img src="https://bookingcare.vn/assets/truyenthong/suckhoedoisong.png"/>
            <img src=" https://bookingcare.vn/assets/truyenthong/vtv1.png"/>
            <img src="https://bookingcare.vn/assets/truyenthong/ictnews.png"/>
            <img src=" https://bookingcare.vn/assets/truyenthong/vnexpress.png"/>
            <img src=" https://bookingcare.vn/assets/truyenthong/cuc-cong-nghe-thong-tin-bo-y-te-2.png"/>
            <img src=" https://bookingcare.vn/assets/truyenthong/infonet.png"/>
            <img style={{backgroundColor:"blue"}}  src="https://bookingcare.vn/assets/truyenthong/vtcgo.png"/>
            </div>
        </div>
        </div>
    </div>
  );
};

export default InformationVideo;
