import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import { Pagination } from "antd";
import BreadcrumbComponent from "../../../component/Breadcrumb";
import { BASE_URL } from "../../../utils/apiConfig";


const SpecialtyList = () => {
  const [specialtys, setSpecialtys] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const getSpecialtys = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/specialty?name=`
        );
        setSpecialtys(response.data.payload);
      } catch (error) {
        console.error("Error searching products:", error);
      }
    };
    getSpecialtys();
  }, []);

  const handleClick = async (id) => {
    navigate(`/detail-specialty/${id}`);
  };

  return (
    <div className="specialty-list container">
      <div className="specialty-list-top">
      <BreadcrumbComponent currentPage = {'Danh sách chuyên khoa '}/>
      </div>
      <div className="specialty-list-content">
        <h4 style={{ marginTop: "10px" }}>Danh sách chuyên khoa khám bệnh</h4>
        {specialtys &&
          specialtys.map((item) => (
            <div
              className="specialty-item"
              key={item.id}
              onClick={() => handleClick(item.id)}
            >
              <div style={{ width: "220px",height:'120px', backgroundColor: "#fff" }}>
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
          style={{ fontSize: "20px" }}
          defaultCurrent={1}
          total={50}
        />
      </div>
    </div>
  );
};

export default SpecialtyList;
