import React, { useCallback, useState } from "react";
import PropTypes from "prop-types";
import { Button, FloatingLabel, Form, Modal } from "react-bootstrap";
import { stringToMicroAlgos } from "../../utils/conversions";

const AddMeal = ({ addMeal }) => {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [price, setPrice] = useState(0);

  const isFormFilled = useCallback(() => {
    return name && image && price > 0;
  }, [name, image, price]);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button
        onClick={handleShow}
        variant="dark"
        className="rounded-pill px-0"
        style={{ width: "100px" }}
      >
        Add Meal
      </Button>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>New Meal</Modal.Title>
        </Modal.Header>
        <Form>
          <Modal.Body>
            <FloatingLabel
              controlId="inputName"
              label="Meal name"
              className="mb-3"
            >
              <Form.Control
                type="text"
                onChange={(e) => {
                  setName(e.target.value);
                }}
                placeholder="Enter name of meal"
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="inputUrl"
              label="Image URL"
              className="mb-3"
            >
              <Form.Control
                type="text"
                placeholder="Image URL"
                value={image}
                onChange={(e) => {
                  setImage(e.target.value);
                }}
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="inputPrice"
              label="Price in ALGO"
              className="mb-3"
            >
              <Form.Control
                type="text"
                placeholder="Price"
                onChange={(e) => {
                  setPrice(stringToMicroAlgos(e.target.value));
                }}
              />
            </FloatingLabel>
          </Modal.Body>
        </Form>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="dark"
            disabled={!isFormFilled()}
            onClick={() => {
              addMeal({
                name,
                image,
                price,
              });
              handleClose();
            }}
          >
            Add Meal
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

AddMeal.propTypes = {
  addMeal: PropTypes.func.isRequired,
};

export default AddMeal;
