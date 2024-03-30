import React, { useState, useEffect } from "react";
import * as ReactDOM from "react-dom";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import Select from "react-select";
import axios from "axios";
import { getTokenFromLocalStorage } from "../../../utils/tokenUtils";

const mdParser = new MarkdownIt(/* Markdown-it options */);

export default (props) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
  const [selectedClinic, setSelectedClinic] = useState(null);

  const [show, setShow] = useState(null);
  const [note, setNote] = useState(null);
  const [doctor, setDoctor] = useState("");
  const [price, setPrice] = useState("");
  const [payment, setPayment] = useState("");
  const [province, setProvine] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [clinic, setClinic] = useState("");
  const [introduction, setIntroduction] = useState("");
  const [contentHTML, setContentHTML] = useState("");
  const [contentMarkdown, setContentMarkdown] = useState("");

  const token = getTokenFromLocalStorage();

  function handleEditorChange({ html, text }) {
    setContentHTML(text);
    setContentMarkdown(html);
  }


  const getAllSelect = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3333/users/getall-doctor?name="
      );
      const response1 = await axios.get(
        "http://localhost:3333/allcode?type=PRICE"
      );
      const response2 = await axios.get(
        "http://localhost:3333/allcode?type=PAYMENT"
      );
      const response3 = await axios.get(
        "http://localhost:3333/allcode?type=PROVINCE"
      );
      const response4 = await axios.get(
        "http://localhost:3333/specialty?name="
      );
      const response5 = await axios.get(
        "http://localhost:3333/clinic?name="
      );
      setDoctor(response.data.payload);
      setPrice(response1.data.payload);
      setPayment(response2.data.payload);
      setProvine(response3.data.payload)
      setSpecialty(response4.data.payload);
      setClinic(response5.data.payload);
    } catch (error) {
      console.error("Error searching products:", error);
    }
  };

  useEffect(() => {
    getAllSelect();
  }, []);


  useEffect(() => {
    const getDetailDoctor = async () => {
      try {
        if (selectedOption) {
          const response = await axios.get(
            `http://localhost:3333/users/${selectedOption.value}`
          );
          if(response.data.payload.Markdown.contentHTML === null){
            setContentHTML('');
          }else{
            setContentHTML(response.data.payload.Markdown.contentHTML);
          }
          setIntroduction(response.data.payload.Markdown.description);
          setNote(response.data.payload.Doctor_Infor.note)
          setShow(response.data.payload.Markdown.contentHTML)

          setSelectedPrice(dataSelectPrice.filter((item) => item.value === response.data.payload.Doctor_Infor.priceId))
          setSelectedPayment(dataSelectPayment.filter((item) => item.value === response.data.payload.Doctor_Infor.paymentId))
          setSelectedProvince(dataProvince.filter((item) => item.value === response.data.payload.Doctor_Infor.provinceId))
          setSelectedSpecialty(dataSpecialty.filter((item) => item.value === response.data.payload.Doctor_Infor.specialtyId))
          setSelectedClinic(dataClinic.filter((item) => item.value === response.data.payload.Doctor_Infor.clinicId))


          console.log("««««« response,data.payload »»»»»",response.data.payload);
        } else {
          console.log("«««««Chờ chọn »»»»»");
        }
      } catch (error) {
        console.error("Lỗi:", error);
      }
    };
    getDetailDoctor(); // Gọi hàm ở đây
  }, [selectedOption]);

  const BuildDataInputSelect = (inputData) => {
    const result = [];
    if (inputData && inputData.length > 0) {
      inputData.map((item, index) => {
        let object = {};
        let allName;

        if (inputData === doctor) {
          allName = `${item.firstName} ${item.lastName}`;
          object.value = item.id;
        } else if (inputData === specialty || inputData === clinic) {
          allName = item.name;
          object.value = item.id;
        } else {
          allName = item.valueVi;
          object.value = item.keyMap;
        }
        object.label = allName;
        result.push(object);
      });
      return result;
    }
  };
  
  console.log('««««« doctor »»»»»', doctor);
  const options = BuildDataInputSelect(doctor);
  const dataSelectPrice =  BuildDataInputSelect(price);
  const dataSelectPayment = BuildDataInputSelect(payment);
  const dataProvince = BuildDataInputSelect(province);
  const dataSpecialty = BuildDataInputSelect(specialty);
  const dataClinic = BuildDataInputSelect(clinic);



  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3333/markdown/save-info-doctor",
        {
          contentHTML: contentHTML,
          contentMarkdown: contentMarkdown,
          description: introduction,
          doctorId: selectedOption.value,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const response1 = await axios.post(
        "http://localhost:3333/doctor-infor",
        {
          doctorId: selectedOption.value,
          priceId: selectedPrice.value,
          provinceId: selectedProvince.value,
          paymentId: selectedPayment.value,
          specialtyId: selectedSpecialty.value,
          clinicId: selectedClinic.value,
          note: note,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Thêm mới thành công");
      setSelectedOption('');
      setSelectedPrice('');
      setSelectedPayment('');
      setSelectedProvince('');
      setSelectedSpecialty('');
      setSelectedClinic('');
      setIntroduction('');
      setContentHTML('');
      setContentMarkdown('');

    } catch (error) {
      console.error("Error searching products:", error);
    }
  };

  const handleUpdateSubmit = async () => {
    try {
      const response = await axios.patch(
        `http://localhost:3333/markdown/${selectedOption.value}`,
        {
          contentHTML: contentHTML,
          contentMarkdown: contentMarkdown,
          description: introduction,
          doctorId: selectedOption.value,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const response1 = await axios.patch(
        `http://localhost:3333/doctor-infor/${selectedOption.value}`,
        {
          doctorId: selectedOption.value,
          priceId: selectedPrice.value,
          provinceId: selectedProvince.value,
          paymentId: selectedPayment.value,
          specialtyId: selectedSpecialty.value,
          clinicId: selectedClinic.value,
          note: note,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("««««« response.data.payload »»»»»", response1.data.payload);
      alert("Cập nhật thành công");
      setSelectedOption('');
      setSelectedPrice('');
      setSelectedPayment('');
      setSelectedProvince('');
      setSelectedSpecialty('');
      setSelectedClinic('');
      setIntroduction('');
      setContentHTML('');
      setContentMarkdown('');
      
    } catch (error) {
      console.error("Error searching products:", error);
    }
  };


  return (
    <>
      <h2 className="doctor-title">Thêm thông tin cho bác sĩ</h2>
      <div className="more-info-doctor">
        <div className="content-doctor-left">
          <h6 className="control-label">Thông tin giới thiệu</h6>
          <textarea
            rows={4}
            value={introduction}
            onChange={(e) => setIntroduction(e.target.value)}
          ></textarea>
        </div>
        <div className="content-doctor-right">
          <h6 className="control-label">Chọn bác sĩ</h6>
          <Select
            value={selectedOption}
            onChange={setSelectedOption}
            options={options}
            placeholder={"Chọn bác sĩ"}
            className="select-doctor"
          />
        </div>
      </div>
      <form className="row">
        <div className="form-group col-md-4">
          <label className="control-label">Chọn giá</label>
          <Select    
            onChange={setSelectedPrice}
            value={selectedPrice}
            options={dataSelectPrice}
            placeholder={"Chọn giá"}
            className="select-doctor"
          />
        </div>
        <div className="form-group col-md-4">
          <label className="control-label">Chọn phương thức thanh toán</label>
          <Select 
            onChange={setSelectedPayment}     
            options={dataSelectPayment}   
            value={selectedPayment}
            placeholder={"Chọn phương thức thanh toán"}
            className="select-doctor"
          />
        </div>
        <div className="form-group col-md-4">
          <label className="control-label">Chọn tỉnh thành</label>
          <Select      
            onChange={setSelectedProvince}     
            value={selectedProvince}
            options={dataProvince}
            placeholder={"Chọn tỉnh thành"}
            className="select-doctor"
          />
        </div>
        <div className="form-group col-md-4">
          <label className="control-label">Chọn chuyên khoa</label>
          <Select 
            onChange={setSelectedSpecialty}     
            options={dataSpecialty}   
            value={selectedSpecialty}
            placeholder={"Chọn chuyên khoa"}
            className="select-doctor"
          />
        </div>
        <div className="form-group col-md-4">
          <label className="control-label">Chọn phòng khám</label>
          <Select      
            onChange={setSelectedClinic}     
            options={dataClinic}
            value={selectedClinic}
            placeholder={"Chọn phòng khám"}
            className="select-doctor"
          />
        </div>
        <div className="form-group col-md-4">
          <label className="control-label">Ghi chú</label>
          <input className="form-control" type="text" required value={note} onChange={(e) => setNote(e.target.value)}/>
        </div>
      </form>

      <MdEditor
        style={{ height: "500px", marginTop:"20px" }}
        renderHTML={(text) => mdParser.render(text)}
        value={contentHTML}
        onChange={handleEditorChange}
      />
      {show !== null ? (
         <button className="btn-manageDoctor" onClick={handleUpdateSubmit}>
         Chỉnh sửa
       </button>
      ) : (
        <button className="btn-manageDoctor" onClick={handleSubmit}>
        Lưu lại
      </button>
      )}
    </>
  );
};
