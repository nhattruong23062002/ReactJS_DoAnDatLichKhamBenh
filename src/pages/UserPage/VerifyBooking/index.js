import React, { useState, useEffect } from "react";
import axios from "axios";

const VerifyBooking = () => {
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const getVerify = async () => {
      try {
        // Parse the query parameters from the URL
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");
        const doctorId = params.get("doctorId");

        if (token && doctorId) {
          const response = await axios.post(
            `http://localhost:3333/booking/verify-book-appointment`,
            {
                token: token,
                doctorId: doctorId,
            }
          );
          setNotice(response.data.payload);
        } else {
          console.error("Token and/or doctorId not found in the URL query.");
        }
      } catch (error) {
        console.error("Lỗi xác nhận:", error);
      }
    };

    getVerify(); // Call the function here
  }, []);

  return (
    <div style={{textAlign:"center", minHeight:"800px"}}>
      {notice  &&  (
        <p style={{fontSize:"26px", fontWeight:"600",marginTop:"10px"}}>Xác nhận lịch khám bệnh thành công!</p>
      )}
    </div>
  );
};

export default VerifyBooking;
