import React from "react";
import "../../../styles/dashboard.css";
import {
  FaHouseUser,
  FaDatabase,
  FaShoppingBag,
  FaBandcamp,
} from "react-icons/fa";
import BarChart from "../../../component/dashboard/BarChart";
import PolarAreaChart from "../../../component/dashboard/PolarAreaChart";

const MainDashboardAdmin = () => {


  //Kết nối vs PolarAreaChart
/*   const fetchBestSellers = async () => {
    try {
      const response = await axiosClient.get("questions/bestsellerlist");
      setBestSellers(response.payload);
    } catch (error) {
      console.error("Error fetching best-sellers:", error);
    }
  }; */

 // Hiển thị doanh thu theo 1 tuần hiện tại
/*  const calculateRevenueInAWeek = async () => {
  try {
    const response = await axiosClient.get(
      "questions/calculateRevenueInAWeek"
    );
    if (response && response.weeklyRevenue) {
      const formattedRevenueData = Object.keys(response.weeklyRevenue).map(date => ({
        date: date,
        totalRevenue: response.weeklyRevenue[date].totalRevenue
      }));
      setRevenueData(formattedRevenueData); // Cập nhật dữ liệu doanh thu vào biến state
    }
  } catch (error) {
    console.error("Error fetching revenue data:", error);
  }
}; */

  return (
    <main className="app-content">
      <div className="row">
        <div className="col-md-12">
          <div className="app-title">
            <ul className="app-breadcrumb breadcrumb">
              <li className="breadcrumb-item">
                <a href="#">
                  <b>Bảng điều khiển</b>
                </a>
              </li>
            </ul>
            <div id="clock"></div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12 col-lg-6">
          <div className="row">
            <div className="col-md-6">
              <div className="widget-small primary coloured-icon">
                <div className="iicon">
                  <i className="icon">
                    <FaHouseUser />
                  </i>
                </div>
                <div className="info">
                  <h4>Tổng khách hàng</h4>
                  <p>
                    <b>khách hàng</b>
                  </p>
                  <p className="info-tong">Tổng số khách hàng được quản lý.</p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="widget-small info coloured-icon">
                <div className="iicon">
                  <i className="icon">
                    <FaDatabase />
                  </i>
                </div>
                <div className="info">
                  <h4>Tổng sản phẩm</h4>
                  <p>
                    <b> sản phẩm</b>
                  </p>
                  <p className="info-tong">Tổng số sản phẩm được quản lý.</p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="widget-small warning coloured-icon">
                <div className="iicon">
                  <i className="icon">
                    <FaShoppingBag />
                  </i>
                </div>
                <div className="info">
                  <h4>Tổng đơn hàng</h4>
                  <p>
                    <b>đơn hàng</b>
                  </p>
                  <p className="info-tong">
                    Tổng số hóa đơn bán hàng trong tháng.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="widget-small danger coloured-icon">
                <div className="iicon">
                  <i className="icon">
                    <FaBandcamp />
                  </i>
                </div>
                <div className="info">
                  <h4>Sắp hết hàng</h4>
                  <p>
                    <b>sản phẩm</b>
                  </p>
                  <p className="info-tong">
                    Số sản phẩm cảnh báo hết cần nhập thêm.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-12">
              <div className="tile">
                <h3 className="tile-title">
                  Khách hàng có lượt mua nhiều nhất
                </h3>
                <div>
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        {/* <th>ID khách hàng</th> */}
                        <th>Tên khách hàng</th>
                        <th>Số lượt mua</th>
                        <th>Tổng tiền</th>
                      </tr>
                    </thead>
                    <tbody>
                      
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="col-md-12">
              <div className="tile">
                <h3 className="tile-title">Khách hàng mới</h3>
                <div>
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Họ và tên</th>
                        <th>Địa chỉ</th>
                        <th>SĐT</th>
                      </tr>
                    </thead>
                    <tbody>
                     
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-12 col-lg-6">
          <div className="row">
            <div className="col-md-12">
              <div className="tile">
                <h3 className="tile-title">Top 5 sản phẩm bán chạy</h3>
                <div className="embed-responsive embed-responsive-16by9">
                  {/* <PolarAreaChart /> */}
                </div>
              </div>
            </div>
            <div className="col-md-12">
              <div className="tile">
                <h3 className="tile-title">Thống kê doanh thu theo ngày trong 1 tuần hiện tại</h3>
                <div className="embed-responsive embed-responsive-16by9">
                 {/*  <BarChart
                    weekDays={["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]}
                    /> */}
                   
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default MainDashboardAdmin;