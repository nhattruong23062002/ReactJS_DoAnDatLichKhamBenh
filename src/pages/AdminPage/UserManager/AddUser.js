import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import { getTokenFromLocalStorage } from "../../../utils/tokenUtils";
import { BASE_URL } from "../../../utils/apiConfig";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const AddUser = () => {
  const [gender, setGender] = useState("");
  const [roleId, setRole] = useState("");
  const [positionId, setPosition] = useState("");
  const [tempAvatarFile, setTempAvatarFile] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [data, setData] = useState("");
  const navigate = useNavigate();

  const token = getTokenFromLocalStorage();

  const updateUserSchema = yup.object().shape({
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
    password: yup
      .string()
      .min(6, "Password phải tối thiểu 6 ký tự")
      .required("Vui lòng nhập Password"),
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
    resolver: yupResolver(updateUserSchema),
  });

  const mapGenderToValue = (selectedGender) => {
    if (selectedGender === "Nam") {
      return "M";
    } else if (selectedGender === "Nữ") {
      return "F";
    } else {
      return "O";
    }
  };

  const mapRoleToValue = (selectedRole) => {
    if (selectedRole === "Quản trị viên") {
      return "R1";
    } else if (selectedRole === "Bác sĩ") {
      return "R2";
    } else {
      return "R3";
    }
  };

  const mapRolePosition = (selectedPosition) => {
    if (selectedPosition === "Bác sĩ") {
      return "P0";
    } else if (selectedPosition === "Thạc sĩ") {
      return "P1";
    } else if (selectedPosition === "Tiến sĩ") {
      return "P2";
    } else if (selectedPosition === "Phó giáo sư") {
      return "P3";
    } else if (selectedPosition === "Giáo sư") {
      return "P4";
    }
  };

  const handleAvatarChange = async (e) => {
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
  const handleUploadAvatar = async () => {
    if (tempAvatarFile) {
      // Tiến hành tải lên ảnh nếu đã chọn ảnh
      const token = getTokenFromLocalStorage();
      const formData = new FormData();
      formData.append("file", tempAvatarFile);

      try {
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

        const uploadedFileName = response.data.payload.location;
        setFileName(uploadedFileName); // Cập nhật giá trị fileName sau khi tải lên thành công
        console.log("Upload success:", response.data);
      } catch (error) {
        console.error("Upload failed:", error);
      }
    }
  };

  const postOtherInfo = async () => {
    try {
      if (fileName) {
        const response = await axios.post(
          `${BASE_URL}/users`,
          {
            ...data,
            gender: mapGenderToValue(gender),
            positionId: mapRolePosition(positionId),
            image: `${fileName}`,
            roleId: mapRoleToValue(roleId),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        alert("Thêm mới thành công");
        navigate("/admin/user-manage");
        console.log("Response from server:", response.data);
        return true;
      } else {
        console.error("fileName is not updated.");
      }
    } catch (error) {
      console.log("««««« error »»»»»", error);
    }
    return false;
  };

  useEffect(() => {
    if (fileName) {
      // Call the postOtherInfo function
      postOtherInfo()
        .then((isPostSuccessful) => {
          // Check if the post was successful before resetting the state
          if (isPostSuccessful) {
            reset();
            setTempAvatarFile(null);
            setPosition("");
            setGender("");
            setRole("");
            setTempAvatarFile(null);
            const defaultImageSrc = `https://w7.pngwing.com/pngs/390/453/png-transparent-basic-add-new-create-plus-user-avatar-office-icon.png`;
            const imgElement = document.getElementById("avatarImg");
            imgElement.src = defaultImageSrc;
          }
        })
        .catch((error) => {
          // Handle any errors here
          console.error("Error:", error.message);
        });
    }
  }, [fileName]);

  const handleSubmitUser = useCallback(
    async (data) => {
      try {
        setData(data);
        if (!tempAvatarFile) {
          alert("Vui lòng chọn ảnh");
        }
        await handleUploadAvatar();
      } catch (error) {
        console.error("Error in handleSubmit:", error);
      }
    },
    [gender, roleId, positionId, tempAvatarFile]
  );

  return (
    <main className="app-content">
      <div className="app-title">
        <ul className="app-breadcrumb breadcrumb ">
          <li className="breadcrumb-item">
            <NavLink to="/admin/user-manage">Danh sách User</NavLink>
          </li>
          <li className="breadcrumb-item">
            <a href="#">Thêm mới User</a>
          </li>
        </ul>
      </div>
      <div className="row">
        <div className="col-md-12">
          <div className="tile">
            <h3 className="tile-title">Tạo mới User</h3>
            <div className="tile-body">
              <form className="row" onSubmit={handleSubmit(handleSubmitUser)}>
                <div className="form-group col-md-4">
                  <label className="control-label">Họ</label>
                  <input
                    className="form-control"
                    type="text"
                    required
                    {...register("firstName")}
                  />
                </div>
                <div className="form-group col-md-4">
                  <label className="control-label">Tên</label>
                  <input
                    className="form-control"
                    type="text"
                    required
                    {...register("lastName")}
                  />
                </div>
                <div className="form-group col-md-4">
                  <label className="control-label">Địa chỉ email</label>
                  <input
                    className="form-control"
                    type="text"
                    required
                    {...register("email")}
                  />
                  {errors.email && (
                    <p style={{ color: "red" }} className="error-yup">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div className="form-group col-md-4">
                  <label className="control-label">Địa chỉ thường trú</label>
                  <input
                    className="form-control"
                    type="text"
                    required
                    {...register("address")}
                  />
                </div>
                <div className="form-group  col-md-4">
                  <label className="control-label">Số điện thoại</label>
                  <input
                    className="form-control"
                    type="number"
                    required
                    {...register("phoneNumber")}
                  />
                  {errors.phoneNumber && (
                    <p style={{ color: "red" }} className="error-yup">
                      {errors.phoneNumber.message}
                    </p>
                  )}
                </div>
                <div className="form-group col-md-4">
                  <label className="control-label">Mật khẩu</label>
                  <input
                    className="form-control"
                    type="password"
                    required
                    {...register("password")}
                  />
                  {errors.password && (
                    <p style={{ color: "red" }} className="error-yup">
                      {errors.password.message}
                    </p>
                  )}
                </div>
                <div className="form-group col-md-4">
                  <label className="control-label">Giới tính</label>
                  <select
                    className="form-control"
                    id="exampleSelect2"
                    required
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <option>-- Chọn giới tính --</option>
                    <option>Nam</option>
                    <option>Nữ</option>
                    <option>Khác</option>
                  </select>
                </div>
                <div className="form-group col-md-4">
                  <label className="control-label">Vai trò</label>
                  <select
                    className="form-control"
                    id="exampleSelect2"
                    required
                    value={roleId}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option>-- Chọn vai trò --</option>
                    <option>Quản trị viên</option>
                    <option>Bác sĩ</option>
                    <option>Bệnh nhân</option>
                  </select>
                </div>
                <div className="form-group  col-md-4">
                  <label for="exampleSelect1" className="control-label">
                    Chức vụ
                  </label>
                  <select
                    className="form-control"
                    id="exampleSelect1"
                    required
                    value={positionId}
                    onChange={(e) => setPosition(e.target.value)}
                  >
                    <option>-- Chọn chức vụ --</option>
                    <option>Bác sĩ</option>
                    <option>Thạc sĩ</option>
                    <option>Tiến sĩ</option>
                    <option>Phó giáo sư</option>
                    <option>Giáo sư</option>
                  </select>
                </div>
                <div className="form-group  col-md-12">
                  <div className="wrapper-upload">
                    <img
                      id="avatarImg"
                      src={`https://w7.pngwing.com/pngs/390/453/png-transparent-basic-add-new-create-plus-user-avatar-office-icon.png`}
                      alt=""
                    />
                    <input
                      style={{ fontSize: "12px" }}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                    />
                  </div>
                </div>
                <div className="btn-addUser">
                  <button className="btn btn-info" type="submit">
                    Lưu lại
                  </button>
                  <button className="btn btn-danger" type="button">
                    Trở về
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AddUser;
