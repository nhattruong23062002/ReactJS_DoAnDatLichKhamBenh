import React, { useState } from 'react';
import { Button, Modal } from 'antd';
const ModalDelete = ({showModal,isModalOpen,handleOk,handleCancel}) => {
  return (
    <>
      <Button type="primary" onClick={showModal}>
        Bạn có muốn xóa?
      </Button>
      <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
      </Modal>
    </>
  );
};
export default ModalDelete;