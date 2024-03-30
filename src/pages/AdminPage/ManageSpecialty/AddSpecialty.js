import React, { useState, useEffect } from "react";
import * as ReactDOM from "react-dom";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import Select from "react-select";
import axios from "axios";
import { getTokenFromLocalStorage } from "../../../utils/tokenUtils";

const mdParser = new MarkdownIt(/* Markdown-it options */);
const AddSpecialty = () => {
  const [contentHTML, setContentHTML] = useState("");
  const [contentMarkdown, setContentMarkdown] = useState("");
  const [nameSpecialty, setNameSpecialty] = useState("");
  const [tempAvatarFile, setTempAvatarFile] = useState(null);
  const [fileName, setFileName] = useState(null);


  const token = getTokenFromLocalStorage();

  function handleEditorChange({ html, text }) {
    setContentHTML(text);
    setContentMarkdown(html);
  }

  const handleAvatarChange = async(e) => {
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
      // Tiến hành tải lên ảnh nếu đã chọn ảnh
      const formData = new FormData();
      formData.append("file", tempAvatarFile);

      try {
        const response = await axios.post("http://localhost:3333/users/upload-single", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });

        const uploadedFileName = response.data.payload.location;
        setFileName(uploadedFileName); 
        console.log("Upload success:", response.data);
      } catch (error) {
        console.error("Upload failed:", error);
      }
    }
  };

  const postSpecialty = async () => {
    try {
      if (fileName) {
        const response = await axios.post("http://localhost:3333/specialty",    
        {
          name: nameSpecialty,
          descriptionHTML: contentHTML,
          descriptionMarkdown: contentMarkdown,
          image:fileName
        },{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        alert("Thêm mới thành công");
        console.log("Response from server:", response.data);
      } else {
        console.error("fileName is not updated.");
      }
    } catch (error) {
      alert("Thêm mới thất bại");
      console.error("Error logging in:", error);
    }
  };

  const handleSubmit = async() => {
    handleUploadAvatar();
  };

  useEffect(() => {
    if (fileName) {
      postSpecialty();
      setNameSpecialty('');
      setContentMarkdown('');
      setContentHTML('');
    }
  }, [fileName]);


  return (
    <>
      <h2 className="doctor-title">Thêm Chuyên Khoa </h2>
      <form className="row" onSubmit={handleSubmit}>
        <div className="form-group col-md-6">
          <label className="control-label" >Tên chuyên khoa</label>
          <input className="form-control" type="text" required value={nameSpecialty} onChange={(e) => setNameSpecialty(e.target.value)}/>
        </div>
        <div className="form-group col-md-6">
          <label className="control-label">Ảnh chuyên khoa</label>
          <input className="form-control" type="file" required accept="image/*" onChange={handleAvatarChange}/>
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

export default AddSpecialty;
