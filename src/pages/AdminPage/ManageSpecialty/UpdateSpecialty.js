import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function UpdateSpecialty({ show, handleClose, handleSubmitUpdate, name, setName }) {

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update Specialty</Modal.Title>
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

export default UpdateSpecialty;
