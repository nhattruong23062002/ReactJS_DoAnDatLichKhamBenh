import React, { useState } from 'react';
import { Button, Modal } from 'antd';
const ModalDelete = ({showModal,isModalOpen,handleOk,handleCancel}) => {
  return (
    <>
      <Modal title="Bạn có muốn xóa?" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
      </Modal>
    </>
  );
};
export default ModalDelete;