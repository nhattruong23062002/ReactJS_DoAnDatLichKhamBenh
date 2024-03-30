import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function UpdateUser({
  show,
  handleClose,
  handleSubmitUpdate,
  firstName,
  lastName,
  phoneNumber,
  email,
  address,
  gender,
  roleId,
  positionId,
  handleGenderChange,
  handlePositionChange,
  handleRoleChange,
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
          <Modal.Title>Update User</Modal.Title>
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
              <div className="form-group  col-md-6">
                <label htmlFor="exampleSelect1" className="control-label">
                  Giới tính
                </label>
                <select
                  className="form-control"
                  id="exampleSelect1"
                  required
                  value={gender} // Sét giá trị của select bằng biến gender từ props
                  onChange={handleGenderChange}
                >
                  <option value="M">Nam</option>
                  <option value="F">Nữ</option>
                  <option value="O">Other</option>
                </select>
              </div>
              <div className="form-group  col-md-6">
                <label htmlFor="exampleSelect1" className="control-label">
                  Vai trò
                </label>
                <select
                  className="form-control"
                  id="exampleSelect1"
                  value={roleId}
                  required
                  onChange={handleRoleChange}
                >
                  <option value="R1">Quản trị viên</option>
                  <option value="R2">Bác sĩ</option>
                  <option value="R3">Bệnh nhân</option>
                </select>
              </div>
              <div className="form-group  col-md-6">
                <label htmlFor="exampleSelect1" className="control-label">
                  Chức vụ
                </label>
                <select
                  className="form-control"
                  id="exampleSelect1"
                  required
                  value={positionId}
                  onChange={handlePositionChange}
                >
                  <option value="P0">Bác sĩ</option>
                  <option value="P1">Thạc sĩ</option>
                  <option value="P2">Tiến sĩ</option>
                  <option value="P3">Phó giáo sư</option>
                  <option value="P4">Giáo sư</option>
                </select>
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

export default UpdateUser;
