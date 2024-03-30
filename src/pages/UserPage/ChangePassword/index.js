import React, { useState, useEffect } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";

import styles from "./ChangePassword.module.css";
import { getTokenFromLocalStorage } from "../../../utils/tokenUtils";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();


  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "currentPassword") {
      setCurrentPassword(value);
    } else if (name === "newPassword") {
      setNewPassword(value);
    } else if (name === "confirmPassword") {
      setConfirmPassword(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = getTokenFromLocalStorage();
    if (newPassword !== confirmPassword) {
      alert("Xác nhận mật khẩu mới không khớp. Vui lòng thử lại.");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:3333/users/changePassword/${token}`,
        { newPassword, currentPassword }
      );
      console.log("Response from Backend:", response.data);
      alert("Mật khẩu đã được đặt lại thành công.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Error resetting password:", error.response);
      alert("Đã có lỗi xảy ra khi đặt lại mật khẩu. Vui lòng thử lại sau.");
    }
  };

  const handleClickBack = async () => {
    navigate(`/`);
  };

  return (
    <div>
      <main className={styles.main}>
        <div style={{ display: "flex" }} className="container">
          <div className={styles.wrapperContent}>
            <span className={`${styles.iconBack} icon-back`} onClick={handleClickBack}>
                <IoMdArrowRoundBack />
            </span>
              <div>
                <h2 className={styles.h2}>Đổi mật khẩu</h2>
              </div>
              <div className={styles.wrapperForm}>
              <form className={styles.form} onSubmit={handleSubmit}>
                <div className="row" >
                  <div className="form-group col-md-12">
                    <input
                      className="form-control"
                      placeholder="Nhập mật khẩu cũ..."
                      type="password"
                      name="currentPassword"
                      required
                      value={currentPassword}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="row" >
                  <div className="form-group col-md-12">
                    <input
                      className="form-control"
                      placeholder="Nhập mật khẩu mới..."
                      type="password"
                      name="newPassword"
                      required
                      value={newPassword}
                      onChange={handleInputChange}
                    />
                  </div>
                  </div>
                <div className="row" >
                  <div className="form-group  col-md-12">
                    <input
                      className="form-control"
                      placeholder="Xác nhận mật khẩu mới..."
                      type="password"
                      name="confirmPassword"
                      required
                      value={confirmPassword}
                      onChange={handleInputChange}
                    />           
                  </div>
                </div>
                <button className="btn-manageDoctor" type="submit">
                  Lưu lại
                </button>
              </form>
              </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChangePassword;
