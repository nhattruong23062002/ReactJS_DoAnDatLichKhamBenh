import React, { useState,useRef } from 'react';
import { Button, Modal } from 'antd';
import { getTokenFromLocalStorage } from '../../../utils/tokenUtils';
import axios from "axios";

const ModalConfirm =  (({ isModalOpen, handleSubmit, handleCancelModal, rowData, onDataFromChild }) => {


  const handleAvatarChange = async(e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
  
    reader.onloadend = () => {
      const base64Image = reader.result;
      onDataFromChild(file)
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };


  return (
    <>
      <Modal title="Xác nhận và gửi hóa đơn cho bệnh nhân" open={isModalOpen} onOk={handleSubmit} onCancel={handleCancelModal}>
        <div className='wrap-modal-confirm'>
            <div className='email-confirm'>
                <p>Emai bệnh nhân</p>
                <input type='text'value={rowData.patientData.email}/>
            </div>
            <div className='invoice-confirm'>
                <p>Chọn file đơn thuốc</p>
                <input  type="file" required accept="image/*" onChange={handleAvatarChange}/>
            </div>
        </div>
      </Modal>
    </>
  );
  
});

export default ModalConfirm;
