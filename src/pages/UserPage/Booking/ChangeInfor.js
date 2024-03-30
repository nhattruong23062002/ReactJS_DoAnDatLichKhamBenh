import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function ChangeInfor({
  show,
  handleClose,
  handleSubmitUpdate,
  firstName,
  lastName,
  phoneNumber,
  email,
  address,
  setFirstName,
  setLastName,
  setPhoneNumber,
  setEmail,
  setAddress,
}) {
  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Chỉnh sửa thông tin</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <form>
          <div >
            <div className="row">
            <div className="form-group col-md-6">
                <label className="control-label">Họ</label>
                <input
                  className="form-control"
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="form-group col-md-6">
                <label className="control-label">Tên</label>
                <input
                  className="form-control"
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
              <div className="form-group  col-md-6">
                <label className="control-label">Số điện thoại</label>
                <input
                  className="form-control"
                  type="number"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
              <div className="form-group col-md-6">
                <label className="control-label">Địa chỉ email</label>
                <input
                  className="form-control"
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="form-group col-md-6">
                <label className="control-label">Địa chỉ thường trú</label>
                <input
                  className="form-control"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
            </div>
          </div>
        </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmitUpdate}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ChangeInfor;
