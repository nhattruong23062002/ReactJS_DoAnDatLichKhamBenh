import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { getTokenFromLocalStorage } from "../../../utils/tokenUtils";
import Select from "react-select";

const UpdateUser = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const [roleId, setRole] = useState("");
  const [positionId, setPosition] = useState("");
  const [tempAvatarFile, setTempAvatarFile] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [phoneNumberErrorMessage, setPhoneNumberErrorMessage] = useState("");
  const [selectGender, setSelectGender] = useState("");
  const [selectRole, setSelectRole] = useState("");
  const [selectPosition, setSelectPosition] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();

  const token = getTokenFromLocalStorage();

  const getAllSelect = async () => {
    try {
      const response1 = await axios.get(
        "http://localhost:3333/allcode?type=GENDER"
      );
      const response2 = await axios.get(
        "http://localhost:3333/allcode?type=POSITION"
      );
      const response3 = await axios.get(
        "http://localhost:3333/allcode?type=ROLE"
      );
      setSelectGender(response1.data.payload);
      setSelectPosition(response2.data.payload);
      setSelectRole(response3.data.payload);
    } catch (error) {
      console.error("Error", error);
    }
  };

  const getUserDetail = async () => {
    try {
      const response = await axios.get(`http://localhost:3333/users/${id}=`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFirstName(response.data.payload.firstName);
      setLastName(response.data.payload.lastName);
      setAddress(response.data.payload.address);
      setEmail(response.data.payload.email);
      setPhoneNumber(response.data.payload.phoneNumber);
      setGender(response.data.payload.gender);
      setPosition(response.data.payload.positionId);
      setRole(response.data.payload.roleId);
      setTempAvatarFile(response.data.payload.image);
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
  const handleUploadAvatar = async () => {
    if (tempAvatarFile) {
      const formData = new FormData();
      formData.append("file", tempAvatarFile);
      try {
        if (typeof tempAvatarFile === "object") {
          const response = await axios.post(
            "http://localhost:3333/users/upload-single",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const uploadedFileName = response.data.payload.location;
          setFileName(uploadedFileName);
        } else {
          setFileName("check");
        }
      } catch (error) {
        console.error("Upload failed:", error);
      }
    }
  };

  const updateOtherInfo = async () => {
    try {
      if (fileName) {
        const response = await axios.patch(
          `http://localhost:3333/users/${id}`,
          {
            firstName,
            lastName,
            email,
            address,
            phoneNumber,
            gender: gender,
            positionId: positionId,
            image: fileName !== "check" ? fileName : tempAvatarFile,
            roleId: roleId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        alert("Update thành công");
        navigate("/admin/user-manage");
        console.log("Response from server:", response.data);
        return true;
      } else {
        console.error("fileName is not updated.");
      }
    } catch (error) {
      const errors = error.response.data.error.errors[0];
      if (errors.path === "email" || error.path === "email_2") {
        setEmailErrorMessage(errors.message);
      } else if (
        errors.path === "phoneNumber" ||
        error.path === "phoneNumber_2"
      ) {
        setPhoneNumberErrorMessage(errors.message);
      }
      return false;
    }
  };

  useEffect(() => {
    if (fileName) {
      updateOtherInfo()
        .then((isPostSuccessful) => {
          if (isPostSuccessful) {
            setFirstName("");
            setLastName("");
            setEmail("");
            setAddress("");
            setPhoneNumber("");
            setPassword("");
            setTempAvatarFile(null);
            setPosition("");
            setGender("");
            setRole("");
            setTempAvatarFile(null);
            /*             const defaultImageSrc = `https://w7.pngwing.com/pngs/390/453/png-transparent-basic-add-new-create-plus-user-avatar-office-icon.png`;
            const imgElement = document.getElementById("avatarImg");
            imgElement.src = defaultImageSrc; */
          }
        })
        .catch((error) => {
          console.error("Error:", error.message);
        });
    }
  }, [fileName]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        if (!tempAvatarFile) {
          alert("Vui lòng chọn ảnh");
        }
        await handleUploadAvatar();
      } catch (error) {
        console.error("Error in handleSubmit:", error);
      }
    },
    [
      firstName,
      lastName,
      email,
      address,
      phoneNumber,
      password,
      gender,
      roleId,
      positionId,
      tempAvatarFile,
    ]
  );

  if (tempAvatarFile && typeof tempAvatarFile !== "object") {
    var dataAvatar = `http://localhost:3333/${tempAvatarFile}`;
  }

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
              <form className="row" onSubmit={handleSubmit}>
                <div className="form-group col-md-4">
                  <label className="control-label">Họ</label>
                  <input
                    className="form-control"
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="form-group col-md-4">
                  <label className="control-label">Tên</label>
                  <input
                    className="form-control"
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
                <div className="form-group col-md-4">
                  <label className="control-label">Địa chỉ email</label>
                  <input
                    className="form-control"
                    type="text"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmailErrorMessage(null);
                      setEmail(e.target.value);
                    }}
                  />
                  {emailErrorMessage && (
                    <p
                      style={{
                        color: "red",
                        fontSize: "12px",
                        marginTop: "5px",
                      }}
                    >
                      {emailErrorMessage}
                    </p>
                  )}
                </div>
                <div className="form-group col-md-4">
                  <label className="control-label">Địa chỉ thường trú</label>
                  <input
                    className="form-control"
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
                <div className="form-group  col-md-4">
                  <label className="control-label">Số điện thoại</label>
                  <input
                    className="form-control"
                    type="number"
                    required
                    value={phoneNumber}
                    onChange={(e) => {
                      setPhoneNumberErrorMessage(null);
                      setPhoneNumber(e.target.value);
                    }}
                  />
                  {phoneNumberErrorMessage && (
                    <p
                      style={{
                        color: "red",
                        fontSize: "12px",
                        marginTop: "5px",
                      }}
                    >
                      {phoneNumberErrorMessage}
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
                      src={dataAvatar}
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
