import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Input, Pagination } from "antd";
import { IoMdArrowRoundBack } from "react-icons/io";
import BreadcrumbComponent from "../../../component/Breadcrumb";
import { BASE_URL } from "../../../utils/apiConfig";


const DoctorList = () => {
  const [doctors, setDoctors] = useState("");
  const [nameDoctor, setNameDoctor] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 5;

  const navigate = useNavigate();

  useEffect(() => {
    const getDoctors = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/users/getall-doctor?name=${nameDoctor}&page=${currentPage}&limit=${pageSize}`
        );
        setDoctors(response.data.payload);
        setTotalItems(response.data.total);
        console.log("««««« response.data.payload »»»»»", response.data.payload);
      } catch (error) {
        console.error("Error searching products:", error);
      }
    };
    getDoctors();
    window.scrollTo(0, 0); 
  }, [currentPage, nameDoctor]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleClick = async (id) => {
    navigate(`/detail-doctor/${id}`);
  };

  return (
    <div className="doctor-list container">
      <div className="doctor-list-top">
        <BreadcrumbComponent currentPage={"Danh sách bác sĩ "} />
      </div>
      <div className="doctor-list-content">
        <div className="doctor-list-heading">
          <h4>Danh sách bác sĩ nổi bật</h4>
          <Input
            className="input-search"
            placeholder="Tìm kiếm bác sĩ"
            onChange={(e) => setNameDoctor(e.target.value)}
          />
        </div>
        {doctors &&
          doctors.map((item) => (
            <div
              className="doctor-item"
              key={item.id}
              onClick={() => handleClick(item.id)}
            >
              <img src={`${BASE_URL}/${item.image}`} />
              <div>
                <p>
                  {item.positionData.valueVi} {item.firstName} {item.lastName}
                </p>
                <span>{item.Doctor_Infor.specialtyData.name}</span>
              </div>
            </div>
          ))}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          paddingBottom: "20px",
        }}
      >
        <Pagination
          current={currentPage}
          total={totalItems}
          pageSize={pageSize}
          onChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default DoctorList;
