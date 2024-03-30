import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function UpdateClinic({ show, handleClose, handleSubmitUpdate, name, address, setName, setAddress }) {

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update Clinic</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <form>
          <div >
            <div className="row">
            <div className="form-group col-md-12">
                <label className="control-label">Name</label>
                <input
                  className="form-control"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="form-group col-md-12">
                <label className="control-label">Address</label>
                <input
                  className="form-control"
                  type="text"
                  required
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

export default UpdateClinic;
