import React, { useState, useEffect } from "react";
import DoctorSchedule from "../../../component/DoctorSchedule";
import DoctorExtraInfor from "../../../component/DoctorExtraInfor";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import DoctorInfor from "../../../component/DoctorInfor";
import Select from "react-select";

const DetailSpecialty = () => {
  const [doctor, setDoctor] = useState("");
  const [detailSpecialty, setDetailSpecialty] = useState("");
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [province, setProvine] = useState("");
  const { id } = useParams();
  const [showMore, setShowMore] = useState(false);

  const { descriptionMarkdown } = detailSpecialty;
  const lines = descriptionMarkdown && typeof descriptionMarkdown === 'string' ? descriptionMarkdown.split('\n') : [];
  const visibleContent = showMore ? lines : lines.slice(0, 8);

  const toggleShowMore = () => {
    setShowMore(!showMore);
  };

  useEffect(() => {
    const getSelectProvince = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3333/allcode?type=PROVINCE"
        );
        setProvine(response.data.payload);
      } catch (error) {
        console.error("Error searching products:", error);
      }
    };
    getSelectProvince();
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
  const dataProvince = BuildDataInputSelect(province);

  const getDetailSpecialty = async () => {
    let dataProvince
    if(selectedProvince){
        dataProvince = selectedProvince.value 
    }else{
        dataProvince = "ALL"
    }
      try {
        const response = await axios.get(
          `http://localhost:3333/specialty/${id}?location=${dataProvince}`
        );
        setDetailSpecialty(response.data.payload);
      } catch (error) {
        console.error("Error searching products:", error);
      }
    };

  useEffect(() => {
    getDetailSpecialty();
  }, []);

  useEffect(() => {
    getDetailSpecialty();
  }, [selectedProvince]);

  useEffect(() => {
    const getDoctors = async () => {
      if (detailSpecialty.doctorSpecialty) {
        const doctorIds = detailSpecialty.doctorSpecialty.map((item) => {
          return item.doctorId;
        });
        try {
          const doctorPromises = doctorIds.map(async (id) => {
            const response = await axios.get(
              `http://localhost:3333/users/${id}`
            );
            return response.data.payload;
          });

          const doctors = await Promise.all(doctorPromises);
          setDoctor(doctors);
        } catch (error) {
          console.error("Error searching doctors:", error);
        }
      } else {
        console.error("detailSpecialty.doctorSpecialty is undefined");
        // Thực hiện xử lý hoặc thông báo lỗi ở đây nếu cần.
      }
    };
    getDoctors();
  }, [detailSpecialty]);
  return (
    <div className="detail-specialty-container">
      <div className="detail-specialty-top">
      <div className="description-specialty container">
      <div dangerouslySetInnerHTML={{ __html: visibleContent.join('') }}></div>
      {lines.length > 3 && (
        <p className="btn-showmore" onClick={toggleShowMore}>
          {showMore ? 'Ẩn đi' : 'Đọc thêm'}
        </p>
      )}
      </div>
      </div>
      <div className="each-doctor">
        <div className="container" style={{padding:"0px"}}>
        <Select
          onChange={setSelectedProvince}
          options={dataProvince}
          placeholder={"Chọn tỉnh thành"}
          className="select-province"
        />
        </div>
        {doctor &&
          doctor.map((doctorInfo) => (
            <div className="wrap-doctor-infor container" key={doctorInfo.id}>
              <div className="content-left-doctor">
                <DoctorInfor doctor={doctorInfo} />
                <Link className="more-detail-doctor" to={`/detail-doctor/${doctorInfo.id}`}>Xem thêm</Link>
              </div>
              <div className="content-right-doctor">
                <DoctorSchedule doctorId={doctorInfo.id} />
                <DoctorExtraInfor doctor={doctorInfo} />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default DetailSpecialty;
