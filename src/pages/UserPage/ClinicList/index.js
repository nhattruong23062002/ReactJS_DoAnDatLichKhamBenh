import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Input, Pagination } from "antd";
import { IoMdArrowRoundBack } from "react-icons/io";
import BreadcrumbComponent from "../../../component/Breadcrumb";
import { BASE_URL } from "../../../utils/apiConfig";

const ClinicList = () => {
  const [clinics, setClinics] = useState("");
  const [nameClinic, setNameClinic] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 10;

  const navigate = useNavigate();

  useEffect(() => {
    const getClinics = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/clinic?name=${nameClinic}&page=${currentPage}&limit=${pageSize}`
        );
        setClinics(response.data.payload);
        setTotalItems(response.data.total);
      } catch (error) {
        console.error("Error searching products:", error);
      }
    };
    getClinics();

    window.scrollTo(0, 0);
  }, [currentPage, nameClinic]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleClick = async (id) => {
    navigate(`/detail-Clinic/${id}`);
  };

  return (
    <div className="specialty-list container">
      <div className="specialty-list-top">
        <BreadcrumbComponent currentPage={"Danh sách phòng khám "} />
      </div>
      <div className="specialty-list-content">
        <div className="specialty-list-heading">
          <h4>Danh sách phòng khám</h4>
          <Input
            className="input-search"
            placeholder="Tìm kiếm phòng khám"
            onChange={(e) => setNameClinic(e.target.value)}
          />
        </div>
        {clinics &&
          clinics.map((item) => (
            <div
              className="clinic-item"
              key={item.id}
              onClick={() => handleClick(item.id)}
            >
              <div style={{ width: "220px", backgroundColor: "#fff" }}>
                <img src={`${BASE_URL}/${item.image}`} />
              </div>
              <p>{item.name}</p>
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

export default ClinicList;
