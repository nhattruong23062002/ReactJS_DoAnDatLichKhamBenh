import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import { Pagination } from "antd";
import BreadcrumbComponent from "../../../component/Breadcrumb";
import { BASE_URL } from "../../../utils/apiConfig";


const HandbookList = () => {
  const [handbooks, setHandbooks] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 10;


  const navigate = useNavigate();

  useEffect(() => {
    const getHandbooks= async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/handbook?page=${currentPage}&limit=${pageSize}`
        );
        setHandbooks(response.data.payload);
        setTotalItems(response.data.total);
      } catch (error) {
        console.error("Error searching products:", error);
      }
    };
    getHandbooks();
    window.scrollTo(0, 0); 
  }, [currentPage]);

  const handleClick = async (id) => {
    navigate(`/detail-handbook/${id}`);
  };
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="specialty-list container">
      <div className="specialty-list-top">
      <BreadcrumbComponent currentPage = {'Danh sách cẩm nang '}/>
      </div>
      <div className="specialty-list-content">
        <h4 style={{ marginTop: "10px" }}>Danh sách cẩm nang</h4>
        {handbooks &&
          handbooks.map((item) => (
            <div
              className="specialty-item"
              key={item.id}
              onClick={() => handleClick(item.id)}
            >
              <div style={{ width: "220px",height:'120px', backgroundColor: "#fff" }}>
                <img src={`${BASE_URL}/${item.image}`} />
              </div>
              <p>{item.title}</p>
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

export default HandbookList;
