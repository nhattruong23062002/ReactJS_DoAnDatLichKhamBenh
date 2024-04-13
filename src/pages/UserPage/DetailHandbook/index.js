import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import cheerio from "cheerio";

const DetailHandbook = () => {
  const [detailHandbook, setDetailHandbook] = useState("");
  const { id } = useParams();

  const getDetailHandbook = async () => {
    try {
      const response = await axios.get(`http://localhost:3333/handbook/${id}`);
      setDetailHandbook(response.data.payload);
    } catch (error) {
      console.error("Error searching products:", error);
    }
  };

  useEffect(() => {
    getDetailHandbook();
    window.scrollTo(0, 0); 
  }, []);

  const extractHeadings = (htmlContent) => {
    const $ = cheerio.load(htmlContent);
    $("h6").each((index, element) => {
      const headingId = `heading_${index + 1}`; // Tạo id mới cho mỗi tiêu đề
      $(element).attr("id", headingId); // Thêm thuộc tính id vào tiêu đề
    });

    const headings = $("h6")
      .map((index, element) => ({
        text: $(element).text(),
        id: $(element).attr("id"),
      }))
      .get();
    return headings;
  };

  const scrollToHeading = (headingId) => {
    const element = document.getElementById(headingId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="detail-handbook-container">
      <div className="detail-handbook-background">
        <img
          style={{ objectFit: "cover" }}
          src="https://www.nec.com/en/global/solutions/img/healthcare_h1_sp.jpg"
        />
        <div>
          <span>
            {" "}
            <Link to={'/'}>Trang chủ</Link>
            <span>&gt;</span>
            Cẩm nang
          </span>
          <h3>{detailHandbook.title}</h3>
        </div>
      </div>

      <div className="wrap-description-handbook container">
        <div className="wrapper-handbook-content">
          <img src={`http://localhost:3333/${detailHandbook.image}`} />
          <div
            dangerouslySetInnerHTML={{
              __html: detailHandbook.descriptionMarkdown,
            }}
          ></div>
        </div>
        <div className="wrapper-handbook-keyword">
          <div className="wrapper-keyword">
            <h4>Nội dung chính</h4>
            <p>{detailHandbook.title}</p>
            {detailHandbook && (
              <ul>
                {extractHeadings(detailHandbook.descriptionMarkdown).map(
                  (heading, index) => (
                    <li key={index}>
                      <a
                        href={`#${heading.id}`}
                        onClick={() => scrollToHeading(heading.id)}
                      >
                        {heading.text}
                      </a>
                    </li>
                  )
                )}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailHandbook;
