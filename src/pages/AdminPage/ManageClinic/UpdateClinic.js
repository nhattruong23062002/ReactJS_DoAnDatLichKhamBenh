import React, { useState, useEffect, useRef } from "react";
import * as ReactDOM from "react-dom";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import Select from "react-select";
import axios from "axios";
import { getTokenFromLocalStorage } from "../../../utils/tokenUtils";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../../../utils/apiConfig";

const mdParser = new MarkdownIt(/* Markdown-it options */);
const UpdateClinic = () => {
  const [contentHTML, setContentHTML] = useState("");
  const [contentMarkdown, setContentMarkdown] = useState("");
  const [nameClinic, setNameClinic] = useState("");
  const [addressClinic, setAddressClinic] = useState("");
  const [tempAvatarFile, setTempAvatarFile] = useState(null);
  const [fileName, setFileName] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const fileInputRef = useRef(null);

  const token = getTokenFromLocalStorage();

  const getClinicDetail = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/clinic/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNameClinic(response.data.payload.name);
      setAddressClinic(response.data.payload.address);
      setTempAvatarFile(response.data.payload.image);
      setContentHTML(response.data.payload.descriptionHTML);
      setContentMarkdown(response.data.payload.descriptionMarkdown);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    getClinicDetail();
  }, []);

  function handleEditorChange({ html, text }) {
    setContentHTML(text);
    setContentMarkdown(html);
  }

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      // Lấy đường dẫn base64 của ảnh đã chọn
      const base64Image = reader.result;
      setTempAvatarFile(file);
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
          setFileName(uploadedFileName);
        } else {
          setFileName('check')
        }
      } catch (error) {
        console.error("Upload failed:", error);
      }
    }
  };

  const updateClinic = async () => {
    try {
      if (fileName) {
        const response = await axios.patch(
          `${BASE_URL}/clinic/${id}`,
          {
            name: nameClinic,
            descriptionHTML: contentHTML,
            descriptionMarkdown: contentMarkdown,
            image: fileName !== 'check' ? fileName : tempAvatarFile,
            address: addressClinic,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        alert("Update thành công");
        navigate("/admin/clinic-manager");
        console.log("Response from server:", response.data);
      } else {
        console.error("fileName is not updated.");
      }
    } catch (error) {
      alert("Update thất bại");
      console.error("Error logging in:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    handleUploadAvatar();
  };

  useEffect(() => {
    if (fileName) {
      updateClinic();
    }
  }, [fileName]);

  const handleSelectFile = () => {
    fileInputRef.current.click();
  };

  const valueImage = typeof tempAvatarFile !== 'object' ? tempAvatarFile : tempAvatarFile?.name

  return (
    <>
      <h3 className="doctor-title">Update Phòng Khám</h3>
      <form className="row" onSubmit={handleSubmit}>
        <div className="form-group col-md-6">
          <label className="control-label">Tên phòng khám</label>
          <input
            className="form-control"
            type="text"
            required
            value={nameClinic}
            onChange={(e) => setNameClinic(e.target.value)}
          />
        </div>
        <div className="form-group col-md-6">
          <label className="control-label">Ảnh phòng khám</label>
          <div style={{ display: "flex" }}>
            <button
              type="button"
              className="btnChooseFile"
              onClick={handleSelectFile}
            >
              Choose File
            </button>
            <input
              type="text"
              className="form-control"
              value={valueImage}
              readOnly
              onClick={handleSelectFile}
              placeholder="Chọn file..."
            />
            <input
              ref={fileInputRef}
              style={{ display: "none" }}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
            />
          </div>
        </div>
        <div className="form-group col-md-6">
          <label className="control-label">Địa chỉ phòng khám</label>
          <input
            className="form-control"
            type="text"
            required
            value={addressClinic}
            onChange={(e) => setAddressClinic(e.target.value)}
          />
        </div>
        <MdEditor
          style={{ height: "500px", marginTop: "20px" }}
          renderHTML={(text) => mdParser.render(text)}
          value={contentHTML}
          onChange={handleEditorChange}
        />
        <button className="form-group col-md-1 btn-manageDoctor" type="submit">
          Lưu lại
        </button>
      </form>
    </>
  );
};

export default UpdateClinic;
