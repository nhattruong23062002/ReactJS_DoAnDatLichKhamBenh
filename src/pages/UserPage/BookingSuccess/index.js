import React, { useState, useEffect } from 'react';
import { Alert, Flex, Spin } from 'antd';

const BookingSuccess = () => {
  const [showSpin, setShowSpin] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSpin(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ textAlign: "center", minHeight: "800px" }}>
      {showSpin ? (
        <Spin tip="Loading" size="large" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '90vh' }}>
          <div className="content" />
        </Spin>
      ) : (
        <>
          <Alert
            description="Bạn đã đặt lịch thành công! Vui lòng kiểm tra email để xác nhận lịch hẹn!"
            type="success"
            showIcon
            style={{ fontSize: "26px", fontWeight: "600", marginTop: "10px" }}
          />
        </>
      )}
    </div>
  );
};

export default BookingSuccess;
