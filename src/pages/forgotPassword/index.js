import React, { useState } from "react";
import styles from "../forgotPassword/forgotPassword.module.css";
import { TbLock } from "react-icons/tb";
import axios from "axios";


const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  console.log('««««« email »»»»»', email);

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3333/users/forgotPassword", {
        email
      });
      alert(response.data.message );
    } catch (error) {
      // Xử lý lỗi nếu có
      console.error("Error sending email:", error.response.data.message );
      alert(error.response.data.message);
    }
  };
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <span className={styles.icon}><TbLock/></span>
        <h2 className={styles.h2}>Quên mật khẩu</h2>
        <p>Nhập địa chỉ email của bạn để lấy lại mật khẩu.</p>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="email">
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Vui lòng nhập Email"
              className={styles.inputField}
              value={email}
              onChange={handleEmailChange}
              required
            />
          </div>
          <button className={styles.submitButton} type="submit">
            Gửi
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
