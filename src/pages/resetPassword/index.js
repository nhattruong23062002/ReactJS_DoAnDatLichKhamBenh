// Trang "pages/reset-password/[token].jsx"
import React, { useState,useEffect } from "react";
import styles from "./resetPassword.module.css"
import axios from "axios";
import {useNavigate} from 'react-router-dom';
import queryString from 'query-string';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Lấy giá trị token từ query parameters
    const { token: urlToken } = queryString.parse(window.location.search);

    setToken(urlToken);
  }, []);

  
  console.log('««««« token »»»»»', token);
  console.log('««««« password »»»»»', password);

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Mật khẩu xác nhận không khớp.");
      return;
    }

    try {
      const response = await axios.post(`http://localhost:3333/users/resetPassword`, { password ,token});
      console.log("Response from Backend:", response);
      alert("Mật khẩu đã được đặt lại thành công.");
      navigate('/login');
    } catch (error) {
      console.error("Error resetting password:", error.response.data);
      alert("Đã có lỗi xảy ra khi đặt lại mật khẩu. Vui lòng thử lại sau.");
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <h2>Đặt lại mật khẩu</h2>
        <form onSubmit={handleResetPassword}>
          <div className={styles.formGroup}>
            <label htmlFor="password">Mật khẩu mới:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword">Xác nhận mật khẩu:</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className={styles.submitButton}>
            Đặt lại mật khẩu
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
