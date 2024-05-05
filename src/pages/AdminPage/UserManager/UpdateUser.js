import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { getTokenFromLocalStorage } from "../../../utils/tokenUtils";
import Select from "react-select";
import { BASE_URL } from "../../../utils/apiConfig";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const UpdateUser = () => {
  const [gender, setGender] = useState("");
  const [roleId, setRole] = useState("");
  const [positionId, setPosition] = useState("");
  const [tempAvatarFile, setTempAvatarFile] = useState(null);
  const [selectGender, setSelectGender] = useState("");
  const [selectRole, setSelectRole] = useState("");
  const [selectPosition, setSelectPosition] = useState("");
  const [data, setData] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();
  const token = getTokenFromLocalStorage();
  var fileName;

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

  const getAllSelect = async () => {
    try {
      const response1 = await axios.get(`${BASE_URL}/allcode?type=GENDER`);
      const response2 = await axios.get(`${BASE_URL}/allcode?type=POSITION`);
      const response3 = await axios.get(`${BASE_URL}/allcode?type=ROLE`);
      setSelectGender(response1.data.payload);
      setSelectPosition(response2.data.payload);
      setSelectRole(response3.data.payload);
    } catch (error) {
      console.error("Error", error);
    }
  };

  const getUserDetail = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/users/${id}=`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setValue("firstName", response.data.payload.firstName);
      setValue("lastName", response.data.payload.lastName);
      setValue("email", response.data.payload.email);
      setValue("phoneNumber", response.data.payload.phoneNumber);
      setValue("address", response.data.payload.address);
      setValue("image", response.data.payload.image);

      setGender(response.data.payload.gender);
      setPosition(response.data.payload.positionId);
      setRole(response.data.payload.roleId);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    getUserDetail();
    getAllSelect();
  }, []);

  const BuildDataInputSelect = (inputData) => {
    const result = [];
    if (inputData && inputData.length > 0) {
      inputData.map((item, index) => {
        let object = {};
        let allName;
        allName = item.valueVi;
        object.value = item.keyMap;
        object.label = allName;
        result.push(object);
      });
      return result;
    }
  };

  const BuildValueSelectGender = (inputData) => {
    let object = {};
    if (inputData === "M") {
      object.value = "M";
      object.label = "Nam";
    } else if (inputData === "F") {
      object.value = "F";
      object.label = "Nữ";
    } else if (inputData === "O") {
      object.value = "O";
      object.label = "Khác";
    }
    return object;
  };

  const BuildValueSelectPosition = (inputData) => {
    let object = {};
    if (inputData === "P0") {
      object.value = "P0";
      object.label = "Bác sĩ";
    } else if (inputData === "P1") {
      object.value = "P1";
      object.label = "Thạc sĩ";
    } else if (inputData === "P2") {
      object.value = "P2";
      object.label = "Tiến sĩ";
    } else if (inputData === "P3") {
      object.value = "P3";
      object.label = "Phó giáo sư";
    } else if (inputData === "P4") {
      object.value = "P4";
      object.label = "Giáo sư";
    }
    return object;
  };

  const BuildValueSelectRole = (inputData) => {
    let object = {};
    if (inputData === "R1") {
      object.value = "R1";
      object.label = "Quản trị viên";
    } else if (inputData === "R2") {
      object.value = "R2";
      object.label = "Bác sĩ";
    } else if (inputData === "R3") {
      object.value = "R3";
      object.label = "Bệnh nhân";
    }
    return object;
  };

  const valueGender = BuildValueSelectGender(gender);
  const valuePosition = BuildValueSelectPosition(positionId);
  const valueRole = BuildValueSelectRole(roleId);

  const dataSelectRole = BuildDataInputSelect(selectRole);
  const dataSelectPosition = BuildDataInputSelect(selectPosition);
  const dataSelectGender = BuildDataInputSelect(selectGender);

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      const base64Image = reader.result;
      setTempAvatarFile(file);

      const imgElement = document.getElementById("avatarImg");
      imgElement.src = base64Image;
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (data) => {
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

      const imageValue = fileName !== "check" ? fileName : watch("image");

      console.log("Image to be updated:", imageValue);

      await axios.patch(
        `${BASE_URL}/users/${id}`,
        {
          ...data,
          gender: gender,
          positionId: positionId,
          image: imageValue,
          roleId: roleId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Bạn đã cập nhật thông tin thành công");
      navigate("/admin/user-manage");
    } catch (error) {
      alert("Cập nhật thông tin thất bại");
      console.log("Error:", error);
      throw error;
    }
  };

  return (
    <main className="app-content">
      <div className="app-title">
        <ul className="app-breadcrumb breadcrumb ">
          <li className="breadcrumb-item">
            <NavLink to="/admin/user-manage">Danh sách User</NavLink>
          </li>
          <li className="breadcrumb-item">
            <a href="#">Update User</a>
          </li>
        </ul>
      </div>
      <div className="row">
        <div className="col-md-12">
          <div className="tile">
            <h3 className="tile-title">Update User</h3>
            <div className="tile-body">
              <form className="row" onSubmit={handleSubmit(handleSave)}>
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
                  <label className="control-label">Giới tính</label>
                  <Select
                    className=""
                    id="exampleSelect2"
                    required
                    value={valueGender}
                    options={dataSelectGender}
                    onChange={(e) => setGender(e.value)}
                  ></Select>
                </div>
                <div className="form-group col-md-4">
                  <label className="control-label">Vai trò</label>
                  <Select
                    className=""
                    id="exampleSelect2"
                    required
                    options={dataSelectRole}
                    value={valueRole}
                    onChange={(e) => setRole(e.value)}
                  ></Select>
                </div>
                <div className="form-group  col-md-4">
                  <label for="exampleSelect1" className="control-label">
                    Chức vụ
                  </label>
                  <Select
                    className=""
                    id="exampleSelect1"
                    required
                    value={valuePosition}
                    options={dataSelectPosition}
                    onChange={(e) => setPosition(e.value)}
                  ></Select>
                </div>
                <div className="form-group  col-md-12">
                  <div className="wrapper-upload">
                    <img
                      id="avatarImg"
                      src={
                        watch("image")
                          ? `${BASE_URL}/${watch("image")}`
                          : "https://banner2.cleanpng.com/20180514/gre/kisspng-computer-icons-avatar-user-profile-clip-art-5af95fab3b2d13.0220186015262923952424.jpg"
                      }
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

export default UpdateUser;
