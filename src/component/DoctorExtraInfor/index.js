import React,{useState} from "react";
import "./DoctorExtraInfor.scss";
const DoctorExtraInfor = (doctor) => {
  const [isShow, setIsShow] = useState(false);


  return (
    <>
      {doctor.doctor  && (
        <div className="doctor-extra-infor-container">
          <div className="doctor-extra-infor-top">
            <h4>Địa chỉ khám</h4>
            <p>{doctor.doctor.Doctor_Infor.clinicData.name}</p>
            <span>{doctor.doctor.Doctor_Infor.clinicData.address}</span>
          </div>
          <div className="doctor-extra-infor-bottom">
            <span>Giá khám: {doctor.doctor.Doctor_Infor.priceData.valueVi}đ</span>
            {isShow === false && (
            <p onClick={() => setIsShow(true)}>Xem chi tiết</p>
            )}
          </div>
        {isShow === true && (
        <>
        <div className="more-infor">
            <div className="more-infor-top">
                <div>
                    <p>Giá khám:</p>
                    <span>{doctor.doctor.Doctor_Infor.priceData.valueVi}đ</span>
                </div>
                Giá khám đã bao gồm phí đặt lịch hẹn trước (Giá niêm yết của phòng khám)
            </div>
            <div className="more-infor-bottom">
                Người bệnh có thể thanh toán chi phí bằng hình thức tiền mặt và quẹt thẻ
            </div>
        </div>
        <p onClick={() => setIsShow(false)}>Ẩn bảng giá</p>
        </>
        )}
        </div>
      )}
    </>
  );
};

export default DoctorExtraInfor;
