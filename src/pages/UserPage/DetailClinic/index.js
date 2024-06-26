import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import DoctorInfor from "../../../component/DoctorInfor";
import DoctorSchedule from "../../../component/DoctorSchedule";
import DoctorExtraInfor from "../../../component/DoctorExtraInfor";
import { BASE_URL } from "../../../utils/apiConfig";


const DetailClinic = () => {
  const [detailClinic, setDetailClinic] = useState("");
  const [doctor, setDoctor] = useState("");
  const { id } = useParams();

  const getDetailSpecialty = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/clinic/${id}`);
      setDetailClinic(response.data.payload);
    } catch (error) {
      console.error("Error searching products:", error);
    }
  };

  useEffect(() => {
    getDetailSpecialty();
  }, []);

  useEffect(() => {
    const getDoctors = async () => {
      if (detailClinic.doctorClinic) {
        const doctorIds = detailClinic.doctorClinic.map((item) => {
          return item.doctorId;
        });
        try {
          const doctorPromises = doctorIds.map(async (id) => {
            const response = await axios.get(
              `${BASE_URL}/users/${id}`
            );
            return response.data.payload;
          });

          const doctors = await Promise.all(doctorPromises);
          setDoctor(doctors);
        } catch (error) {
          console.error("Error searching doctors:", error);
        }
      } else {
        console.error("detailSpecialty.doctorClinic is undefined");
      }
    };
    getDoctors();
  }, [detailClinic]);
  return (
    <div className="detail-clinic-container">
      <div className="detail-clinic-background">
        <img src="https://saobacdautelecom.vn/wp-content/uploads/2021/08/Be%CC%A3%CC%82nh-vie%CC%A3%CC%82n-Pho%CC%80ng-kha%CC%81m_1920x772-e1633608427676.png" />
        <div className="wrap-clinic-infor container">
          <img src={`${BASE_URL}/${detailClinic.image}`} />
          <div className="wrap-clinic-name">
            <h3>{detailClinic.name}</h3>
            <p>{detailClinic.address}</p>
          </div>
        </div>
      </div>
      {doctor &&
        doctor.map((doctorInfo) => (
          <div className="wrap-doctor-infor container" key={doctorInfo.id}>
            <div className="content-left-doctor">
              <DoctorInfor doctor={doctorInfo} />
              <Link
                className="more-detail-doctor"
                to={`/detail-doctor/${doctorInfo.id}`}
              >
                Xem thêm
              </Link>
            </div>
            <div className="content-right-doctor">
              <DoctorSchedule doctorId={doctorInfo.id} />
              <DoctorExtraInfor doctor={doctorInfo} />
            </div>
          </div>
        ))}
      <div className="wrap-description-clinic container">
        <div
          dangerouslySetInnerHTML={{ __html: detailClinic.descriptionMarkdown }}
        ></div>
      </div>
    </div>
  );
};

export default DetailClinic;
