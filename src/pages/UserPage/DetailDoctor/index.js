import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import DoctorSchedule from "../../../component/DoctorSchedule";
import DoctorExtraInfor from "../../../component/DoctorExtraInfor";
import DoctorInfor from "../../../component/DoctorInfor";
import BreadcrumbComponent from "../../../component/Breadcrumb";

const DetailDoctor = () => {
  const [doctor, setDoctor] = useState("");
  const { id } = useParams();

  const getDoctor = async () => {
    try {
      const response = await axios.get(`http://localhost:3333/users/${id}`);
      setDoctor(response.data.payload);
    } catch (error) {
      console.error("Error searching products:", error);
    }
  };
  useEffect(() => {
    getDoctor();
  }, []);

  return (
    <div className="doctor-detail-container">
      <div className="container">
        <BreadcrumbComponent currentPage={`Thông tin bác sĩ`} />
      </div>
      <DoctorInfor doctor={doctor} />
      <div className="schedule-doctor container">
        <div className="schedule-doctor-left">
          <DoctorSchedule doctorId={id} />
        </div>
        <div className="schedule-doctor-right">
          <DoctorExtraInfor doctor={doctor} />
        </div>
      </div>
      {doctor && doctor.Markdown && (
        <div className="detail-infor-doctor">
          <div
            className="container"
            dangerouslySetInnerHTML={{
              __html: doctor.Markdown.contentMarkdown,
            }}
          ></div>
        </div>
      )}
      <div className="comment-doctor"></div>
    </div>
  );
};

export default DetailDoctor;
