import React, { useEffect, useState } from "react";
import { FiMenu } from "react-icons/fi";
import { AiFillQuestionCircle } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import {
  getTokenFromLocalStorage,
  removeTokenFromLocalStorage,
} from "../../../utils/tokenUtils";
import axios from "axios";
import { Input, QRCode, Space } from "antd";
import { BASE_URL } from "../../../utils/apiConfig";

const Header = () => {
  const [role, setRole] = useState("");
  const [id, setId] = useState("");
  const [doctor, setDoctor] = useState("");
  const [isCheck, setIsCheck] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = getTokenFromLocalStorage();
    if (token) {
      try {
        // Giải mã token để lấy thông tin customerId
        const decodedToken = jwt_decode(token);
        const { roleId: roleId, id: id } = decodedToken;
        setId(id);
        setRole(roleId);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  useEffect(() => {
    const getDoctor = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/users/${id}`);
        setDoctor(response.data.payload);
      } catch (error) {
        console.error("Error searching products:", error);
      }
    };
    getDoctor();
  }, [role, id]);

  const handleLogin = async () => {
    navigate("/login");
  };

  const handleShowHistory = async () => {
    navigate("/history");
  };

  const handleChangePassword = async () => {
    navigate("/changePassword");
  };

  const handleDirect = async () => {
    navigate("/profile");
  };

  const handleFacialRecognition = async () => {
    navigate("/facialRecognition");
  };

  const handleLogout = () => {
    if (role === "R3") {
      removeTokenFromLocalStorage();
      window.location.reload();
    }
  };

  const handleImageError = (event) => {
    // Thay đổi nguồn ảnh khi xảy ra lỗi
    event.target.src =
      "https://banner2.cleanpng.com/20180514/gre/kisspng-computer-icons-avatar-user-profile-clip-art-5af95fab3b2d13.0220186015262923952424.jpg";
  };

  return (
    <div className="home-header-container">
      <div className="home-header-content container">
        <div className="left-content">
          {/* <FiMenu className="menu-homepage" /> */}
          <div className="header-logo" onClick={() => navigate("/")}>
            <img src="https://png.pngtree.com/png-clipart/20230823/original/pngtree-medical-logo-template-vector-illustration-picture-image_8251825.png" />
          </div>
        </div>
        <div className="center-content">
          <div className="child-content">
            <div>
              <b>Chuyên khoa</b>
            </div>
            <div className="sub-title">Tìm bác sĩ theo chuyên khoa</div>
          </div>
          <div className="child-content">
            <div>
              <b>Cơ sở y tế</b>
            </div>
            <div className="sub-title">Chọn bệnh viện phòng khám</div>
          </div>
          <div className="child-content">
            <div>
              <b>Bác sĩ</b>
            </div>
            <div className="sub-title">Chọn bác sĩ giỏi</div>
          </div>
          <div className="child-content">
            <div>
              <b>Gói khám</b>
            </div>
            <div className="sub-title">Khám sức khỏe tổng quát</div>
          </div>
        </div>
        <div className="right-content">
          <div className="support" onClick={() => setIsCheck(!isCheck)}>
            <AiFillQuestionCircle style={{ marginRight: "5px" }} />
            Hỗ trợ
            {isCheck && (
              <div className="QRcode">
                <Space direction="vertical" align="center">
                  <QRCode value={"0353639495"} />
                </Space>
              </div>
            )}
          </div>
          {role === "R3" ? (
            <div className="has-dropdown">
              <img
                className="avatar"
                src={`${BASE_URL}/${doctor.image}`}
                onError={handleImageError}
              />
              <ul className="sub-menu">
                <li>
                  <p onClick={handleDirect}>Tài khoản của tôi</p>
                </li>
                <li>
                  <p onClick={handleChangePassword}>Đổi mật khẩu</p>
                </li>
                <li>
                  <p onClick={handleShowHistory}>Lịch hẹn đã đặt</p>
                </li>
                <li>
                  <p onClick={handleFacialRecognition}>Webcam</p>
                </li>
                <li>
                  <p onClick={handleLogout}>Đăng xuất</p>
                </li>
              </ul>
            </div>
          ) : (
            <div className="language-vi" onClick={handleLogin}>
              Đăng Nhập
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
