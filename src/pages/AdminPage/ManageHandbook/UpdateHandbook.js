import React, { useState, useEffect, useRef } from "react";
import * as ReactDOM from "react-dom";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import Select from "react-select";
import axios from "axios";
import { getTokenFromLocalStorage } from "../../../utils/tokenUtils";
import { useNavigate, useParams } from "react-router-dom";

const mdParser = new MarkdownIt(/* Markdown-it options */);
const UpdateHandbook = () => {
  const [contentHTML, setContentHTML] = useState("");
  const [contentMarkdown, setContentMarkdown] = useState("");
  const [titleHandbook, setTitleHandbook] = useState("");
  const [tempAvatarFile, setTempAvatarFile] = useState(null);
  const [fileName, setFileName] = useState(null);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { id } = useParams();

  const token = getTokenFromLocalStorage();

  const getHandbookDetail = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3333/handbook/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTitleHandbook(response.data.payload.title);
      setTempAvatarFile(response.data.payload.image);
      setContentHTML(response.data.payload.descriptionHTML);
      setContentMarkdown(response.data.payload.descriptionMarkdown);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    getHandbookDetail();
  }, []);

  function handleEditorChange({ html, text }) {
    setContentHTML(text);
    setContentMarkdown(html);
  }

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
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
        if(typeof tempAvatarFile === 'object'){
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
          setFileName('check')
        }
      } catch (error) {
        console.error("Upload failed:", error);
      }
    }
  };

  const UpdateHandbook = async () => {
    try {
      if (fileName) {
        const response = await axios.patch(
          `http://localhost:3333/handbook/${id}`,
          {
            title: titleHandbook,
            descriptionHTML: contentHTML,
            descriptionMarkdown: contentMarkdown,
            image: fileName !== 'check' ? fileName : tempAvatarFile,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        alert("Update thành công");
        navigate("/admin/handbook-manager");
        console.log("Response from server:", response.data);
      } else {
        console.error("fileName is not updated.");
      }
    } catch (error) {
      alert("Thêm mới thất bại");
      console.error("Error logging in:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    handleUploadAvatar();
  };

  useEffect(() => {
    if (fileName) {
      UpdateHandbook();
    }
  }, [fileName]);
  
  const handleSelectFile = () => {
    fileInputRef.current.click();
  };

  const valueImage = typeof tempAvatarFile !== 'object' ? tempAvatarFile : tempAvatarFile?.name

  return (
    <>
      <h3 className="doctor-title">Update Cẩm Nang </h3>
      <form className="row" onSubmit={handleSubmit}>
        <div className="form-group col-md-6">
          <label className="control-label">Tiêu đề cẩm nang</label>
          <input
            className="form-control"
            type="text"
            required
            value={titleHandbook}
            onChange={(e) => setTitleHandbook(e.target.value)}
          />
        </div>
        <div className="form-group col-md-6">
          <label className="control-label">Ảnh cẩm nang</label>
          <div style={{display:'flex'}}>
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

export default UpdateHandbook;
