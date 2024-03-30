import React, { useState, useEffect } from "react";
import jwt_decode from "jwt-decode";

import { IoMdArrowRoundBack } from "react-icons/io";
import { getTokenFromLocalStorage } from "./../../../utils/tokenUtils";
import axios from "axios";
import { useNavigate } from "react-router-dom";



const Profile = () => {
  const [userId, setUserId] = useState(null);
  const [tempAvatarFile, setTempAvatarFile] = useState(null);
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
  });
  const [newProfile, setNewProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
  });

  const navigate = useNavigate();
  const token = getTokenFromLocalStorage();

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
        const response = await axios.get(
          `http://localhost:3333/users/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const profileData = response.data.payload;
        // Cập nhật state với thông tin profile nhận được từ API
        setProfile({
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          email: profileData.email,
          phoneNumber: profileData.phoneNumber,
          image: profileData.image,
          address: profileData.address,
        });
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    getProfileData();
  }, [userId]);

  useEffect(() => {
    setNewProfile(profile);
  }, [profile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProfile((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

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

  const handleSave = async (e) => {
    try {
      e.preventDefault();
  
      const formData = new FormData();
      formData.append("file", tempAvatarFile);
  
      // Upload avatar
      const uploadAvatarResponse = await axios.post("http://localhost:3333/users/upload-single",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      // Extract the image URL from the response
      const uploadedImage = uploadAvatarResponse.data.payload.location;

      // Update profile with the new image URL
      await axios.patch(`http://localhost:3333/users/${userId}`,
        {
          newProfile,
          image: uploadedImage,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      // Update local profile state with the new image URL
      setProfile((prevState) => ({
        ...prevState,
        ...newProfile,
        image: uploadedImage,
      }));
  
      alert("Bạn đã cập nhật thông tin thành công");
      return uploadedImage; // Return the uploaded image URL
    } catch (error) {
      alert("Cập nhật thông tin thất bại");
      console.error("Error updating profile:", error);
      throw error; // Re-throw the error to be caught by the caller if needed
    }
  };

  const handleClickBack = async () => {
    navigate(`/`);
  };
  

  return (
    <div className="container">
      <div className="specialty-list-top">
        <span className="icon-back"  onClick={handleClickBack}>
          <IoMdArrowRoundBack />
        </span>
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
                profile.image
                  ? `http://localhost:3333/${profile.image}`
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
            <form onSubmit={handleSave}>
              <div>
                <div className="row">
                  <div className="form-group col-md-6">
                    <label className="control-label">Họ</label>
                    <input
                      className="form-control"
                      type="text"
                      name="firstName"
                      required
                      value={newProfile.firstName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group col-md-6">
                    <label className="control-label">Tên</label>
                    <input
                      className="form-control"
                      type="text"
                      name="lastName"
                      required
                      value={newProfile.lastName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group  col-md-6">
                    <label className="control-label">Số điện thoại</label>
                    <input
                      className="form-control"
                      type="number"
                      required
                      name="phoneNumber"
                      value={newProfile.phoneNumber}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group col-md-6">
                    <label className="control-label">Địa chỉ email</label>
                    <input
                      className="form-control"
                      type="text"
                      required
                      name="email"
                      value={newProfile.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group col-md-6">
                    <label className="control-label">Địa chỉ thường trú</label>
                    <input
                      className="form-control"
                      type="text"
                      name="address"
                      value={newProfile.address}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <button
                  className="form-group col-md-2 btn-manageDoctor"
                  type="submit"
                >
                  Lưu lại
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
