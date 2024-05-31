import { useState, useEffect } from "react";
import { FaGoogle, FaFacebook, FaGithub } from "react-icons/fa6";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { setTokenToLocalStorage } from "../../utils/tokenUtils";
import styles from "./login.module.css";
import { BASE_URL } from "./../../utils/apiConfig";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const LoginForm = () => {
  const navigate = useNavigate();

  const loginSchema = yup.object().shape({
    /*     email: yup
      .string()
      .email("Email phải đúng định dạng")
      .required("Vui lòng nhập email"), */
    password: yup
      .string()
      .min(6, "Password phải tối thiểu 6 ký tự")
      .required("Vui lòng nhập Password"),
  });

  const signUpSchema = yup.object().shape({
    /*     firstName: yup.string().required("First name is required"),
    lastName: yup.string().required("Last name is required"), */
    email: yup
      .string()
      .email("Email phải đúng định dạng")
      .required("Vui lòng nhập email"),
    phoneNumber: yup
      .string()
      .matches(/^[0-9]{10}$/, "Số điện thoại phải đủ 10 số")
      .required("Vui lòng nhập số điện thoại"),
    address: yup.string().required("Vui lòng nhập địa chỉ"),
    password: yup
      .string()
      .min(6, "Password phải tối thiểu 6 ký tự")
      .required("Vui lòng nhập Password"),
  });

  const {
    register: loginRegister,
    handleSubmit: handleSubmitLoginForm,
    formState: { errors: loginErrors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signUpSchema),
  });

  useEffect(() => {
    const signUpButton = document.getElementById("signUp");
    const signInButton = document.getElementById("signIn");
    const container = document.getElementById("container");

    // switch between login and signup
    signUpButton.addEventListener("click", () => {
      container.classList.add(styles.rightPanelActive);
    });

    signInButton.addEventListener("click", () => {
      container.classList.remove(styles.rightPanelActive);
    });

    // Clean up event listeners when component unmounts
    return () => {
      signUpButton.removeEventListener("click", () => {
        container.classList.add(styles.rightPanelActive);
      });

      signInButton.removeEventListener("click", () => {
        container.classList.remove(styles.rightPanelActive);
      });
    };
  }, []);

  const handleLogin = async (data) => {
    try {
      const response = await axios.post(`${BASE_URL}/users/login`, data);

      // Kiểm tra phản hồi có chứa token hay không
      if (response.data.token) {
        // Lưu token vào localStorage
        const token = response.data.token;
        setTokenToLocalStorage(token);

        const decodedToken = jwt_decode(token);
        const { roleId: roleId } = decodedToken;

        if (roleId === "R3") {
          navigate("/");
        } else {
          navigate("/admin");
        }
      } else {
        alert("Email hoặc mật khẩu không đúng");
      }
    } catch (error) {
      alert("Email hoặc mật khẩu không đúng");
      console.error("Error logging in:", error);
    }
  };

  const handleSignUp = async (data) => {
    try {
      const response = await axios.post(`${BASE_URL}/users`, {
        roleId: "R3",
        ...data,
      });

      if (response.data.payload) {
        alert("Đăng ký thành công");
        reset();
      } else {
        alert("Đăng ký không thành công");
      }
    } catch (errors) {
      alert("Đã có lỗi thông tin đăng ký", errors);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container} id="container">
        <div className={`${styles.formWrap} ${styles.signUp}`}>
          <form
            className={styles.form}
            onSubmit={handleSubmit(handleSignUp)}
            action="#"
          >
            <h1 className={styles.h1}>Create An Account</h1>

            <div className={styles.socialContainer}>
              <a href="#">
                <i className={styles.a}>
                  <FaFacebook />
                </i>
              </a>
              <a href="#">
                <i className={styles.a}>
                  <FaGoogle />
                </i>
              </a>
              <a href="#">
                <i className={styles.a}>
                  <FaGithub />
                </i>
              </a>
            </div>
            <span className={styles.span}>use email for registration</span>
            <div style={{ display: "flex", gap: "10px" }}>
              <input
                className={styles.input}
                {...register("firstName")}
                type="text"
                placeholder="First Name"
              />
              {errors.firstName && (
                <p className="error-yup">{errors.firstName.message}</p>
              )}
              <input
                className={styles.input}
                {...register("lastName")}
                type="text"
                placeholder="Last Name"
              />
              {errors.lastName && (
                <p className="error-yup">{errors.lastName.message}</p>
              )}
            </div>
            <input
              className={styles.input}
              {...register("email")}
              type="email"
              placeholder="Email"
            />
            {errors.email && (
              <p className="error-yup">{errors.email.message}</p>
            )}
            <input
              className={styles.input}
              {...register("phoneNumber")}
              type="text"
              placeholder="Phone Number"
            />
            {errors.phoneNumber && (
              <p className="error-yup">{errors.phoneNumber.message}</p>
            )}
            <input
              className={styles.input}
              {...register("address")}
              type="text"
              placeholder="Address"
            />
            {errors.address && (
              <p className="error-yup">{errors.address.message}</p>
            )}
            <input
              className={styles.input}
              {...register("password")}
              type="password"
              placeholder="Password"
            />
            {errors.password && (
              <p className="error-yup">{errors.password.message}</p>
            )}
            <button className={styles.button} type="submit">
              Create Account
            </button>
          </form>
        </div>

        <div className={`${styles.formWrap} ${styles.signIn}`}>
          <form
            className={styles.form}
            onSubmit={handleSubmitLoginForm(handleLogin)}
            action="#"
          >
            <h1 className={styles.h1}>Login In</h1>
            <div className={styles.socialContainer}>
              <a href="#">
                <i className={styles.a}>
                  <FaFacebook />
                </i>
              </a>
              <a href="#">
                <i className={styles.a}>
                  <FaGoogle />
                </i>
              </a>
              <a href="#">
                <i className={styles.a}>
                  <FaGithub />
                </i>
              </a>
            </div>
            <span>Login with your Account</span>
            <input
              {...loginRegister("email")}
              className={styles.input}
              /*     type="email" */
              placeholder="Email"
            />
            {loginErrors.email && (
              <p className="error-yup">{loginErrors.email.message}</p>
            )}
            <input
              {...loginRegister("password")}
              className={styles.input}
              type="password"
              placeholder="Password"
            />
            {loginErrors.password && (
              <p className="error-yup">{loginErrors.password.message}</p>
            )}
            <span className={styles.span}>
              Forgot your{" "}
              <a href="/forgotPassword" className={styles.forgot}>
                password?
              </a>
            </span>
            <button type="submit" className={styles.button}>
              Login
            </button>
          </form>
        </div>

        <div className={styles.overlayContainer}>
          <div className={styles.overlay}>
            <div className={`${styles.overlayPannel} ${styles.overlayLeft}`}>
              <h1 className={styles.h1}>Already have an account</h1>
              <p className={styles.p}>Please Login</p>
              <button id="signIn" className={styles.button}>
                Sign In
              </button>
            </div>
            <div className={`${styles.overlayPannel} ${styles.overlayRight}`}>
              <h1 className={styles.h1}>Create Account</h1>
              <p className={styles.p}>Start Your Journey with Us</p>
              <button id="signUp" className={styles.button}>
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
