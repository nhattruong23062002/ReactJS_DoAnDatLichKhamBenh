import React, { useState, useEffect } from "react";
import jwt_decode from "jwt-decode";

import { IoMdArrowRoundBack } from "react-icons/io";
import { getTokenFromLocalStorage } from "./../../../utils/tokenUtils";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BreadcrumbComponent from "../../../component/Breadcrumb";
import { BASE_URL } from "../../../utils/apiConfig";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const Profile = () => {
  const [userId, setUserId] = useState(null);
  const [tempAvatarFile, setTempAvatarFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const token = getTokenFromLocalStorage();
  var fileName;

  const signUpSchema = yup.object().shape({
    firstName: yup.string().required("Vui lòng nhập họ"),
    lastName: yup.string().required("Vui lòng nhập tên"),
    email: yup
      .string()
      .email("Email phải đúng định dạng")
      .required("Vui lòng nhập email"),
    phoneNumber: yup
      .string()
      .matches(/^[0-9]{10}$/, "Số điện thoại phải đủ 10 số")
      .required("Vui lòng nhập số điện thoại"),
    address: yup.string().required("Vui lòng nhập địa chỉ"),
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signUpSchema),
  });

  useEffect(() => {
    if (token) {
      try {
        // Giải mã token để lấy thông tin customerId
        const decodedToken = jwt_decode(token);
        const { id: userId } = decodedToken;
        setUserId(userId);
      } catch (error) {
        console.error("Error decoding token:", error);
        setUserId(null);
      }
    }
  }, []);

  useEffect(() => {
    const getProfileData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const profileData = response.data.payload;
        setValue("firstName", profileData.firstName);
        setValue("lastName", profileData.lastName);
        setValue("email", profileData.email);
        setValue("phoneNumber", profileData.phoneNumber);
        setValue("address", profileData.address);
        setValue("image", profileData.image);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    getProfileData();
  }, [userId, setValue, token]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      // Lấy đường dẫn base64 của ảnh đã chọn
      const base64Image = reader.result;
      setTempAvatarFile(file);
      // Cập nhật lại src của thẻ img với ảnh mới
      const imgElement = document.getElementById("avatarImg");
      imgElement.src = base64Image;
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (data) => {
    if (!isSubmitting) {
      setIsSubmitting(true);
      try {
        const formData = new FormData();
        formData.append("file", tempAvatarFile);
        if (tempAvatarFile != null) {
          const response = await axios.post(
            `${BASE_URL}/users/upload-single`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const uploadedImage = response.data.payload.location;
          fileName = uploadedImage;
        } else if (tempAvatarFile == null) {
          fileName = "check";
        }

        const imageValue =
          (await fileName) !== "check" ? fileName : watch("image");

        console.log("Image to be updated:", imageValue);

        await axios.patch(
          `${BASE_URL}/users/${userId}`,
          {
            ...data,
            image: imageValue,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setIsSubmitting(false);
        alert("Bạn đã cập nhật thông tin thành công");
      } catch (error) {
        setIsSubmitting(false);
        alert("Cập nhật thông tin thất bại");
        console.error("Error updating profile:", error);
        throw error;
      }
    }
  };

  return (
    <div className="container">
      <div className="specialty-list-top">
        <BreadcrumbComponent currentPage={`Thông tin cá nhân`} />
      </div>
      <div className="specialty-list-content">
        <div
          style={{ textAlign: "center", marginBottom: "30px" }}
          className="specialty-list-heading"
        >
          <h4 style={{ fontSize: "28px" }}>Thông tin cá nhân</h4>
        </div>
        <div className="profile-container">
          <div className="profile-avatar">
            <img
              id="avatarImg"
              src={
                watch("image")
                  ? `${BASE_URL}/${watch("image")}`
                  : "https://banner2.cleanpng.com/20180514/gre/kisspng-computer-icons-avatar-user-profile-clip-art-5af95fab3b2d13.0220186015262923952424.jpg"
              }
              alt="avatar"
              className="image-avatar"
            />
            <input
              type="file"
              className="input-file"
              accept="image/*"
              onChange={handleAvatarChange}
            />
          </div>
          <div className="profile-content">
            <form onSubmit={handleSubmit(handleSave)}>
              <div>
                <div className="row">
                  <div className="form-group col-md-6">
                    <label className="control-label">Họ</label>
                    <input
                      className="form-control"
                      type="text"
                      name="firstName"
                      required
                      {...register("firstName")}
                    />
                    {errors.firstName && (
                      <p style={{ color: "red" }} className="error-yup">
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>
                  <div className="form-group col-md-6">
                    <label className="control-label">Tên</label>
                    <input
                      className="form-control"
                      type="text"
                      name="lastName"
                      required
                      {...register("lastName")}
                    />
                    {errors.lastName && (
                      <p style={{ color: "red" }} className="error-yup">
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>
                  <div className="form-group  col-md-6">
                    <label className="control-label">Số điện thoại</label>
                    <input
                      className="form-control"
                      type="number"
                      required
                      name="phoneNumber"
                      {...register("phoneNumber")}
                    />
                    {errors.phoneNumber && (
                      <p style={{ color: "red" }} className="error-yup">
                        {errors.phoneNumber.message}
                      </p>
                    )}
                  </div>
                  <div className="form-group col-md-6">
                    <label className="control-label">Địa chỉ email</label>
                    <input
                      className="form-control"
                      type="text"
                      required
                      name="email"
                      {...register("email")}
                    />
                    {errors.email && (
                      <p style={{ color: "red" }} className="error-yup">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                  <div className="form-group col-md-6">
                    <label className="control-label">Địa chỉ thường trú</label>
                    <input
                      className="form-control"
                      type="text"
                      name="address"
                      {...register("address")}
                    />
                    {errors.address && (
                      <p style={{ color: "red" }} className="error-yup">
                        {errors.address.message}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  className="form-group col-md-2 btn-manageDoctor"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Spin
                      style={{ color: "white" }}
                      indicator={
                        <LoadingOutlined
                          style={{
                            fontSize: 24,
                          }}
                          spin
                        />
                      }
                    />
                  ) : (
                    "Lưu lại"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
