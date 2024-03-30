import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";

const SpecialtyList = () => {
  const [specialtys, setSpecialtys] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const getSpecialtys = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3333/specialty?name="
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

  const handleClickBack = async (id) => {
    navigate(`/`);
  };

  return (
    <div className="specialty-list container">
      <div className="specialty-list-top">
        <span className="icon-back" onClick={handleClickBack}>
          <IoMdArrowRoundBack />
        </span>
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
              <img src={`http://localhost:3333/${item.image}`} />
              <p>{item.name}</p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default SpecialtyList;
