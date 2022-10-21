import React from "react";
import PropTypes from "prop-types";
import { Button, Table, Modal } from "react-bootstrap";
import { microAlgosToString } from "../../utils/conversions";

const OrderInfo = ({ order, show, setShowOrder }) => {
  const handleClose = () => setShowOrder(false);
  return (
    <>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{order.appId}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table>
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Meal</th>
                <th scope="col">Count</th>
              </tr>
            </thead>
            <tbody id="userorders">
              {order.details ? (
                order.details.map((meal, index) => (
                  <tr key={index} className="align-middle">
                    <td id="id">{index}</td>
                    <td id="meal">{meal.name}</td>
                    <td id="count">{meal.count}</td>
                  </tr>
                ))
              ) : (
                <></>
              )}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={"2"}> You paid a Total of:{"  "}</td>
                <td>{microAlgosToString(order.total)} ALGO</td>
              </tr>
            </tfoot>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

OrderInfo.propTypes = {
  order: PropTypes.instanceOf(Object).isRequired,
  show: PropTypes.bool.isRequired,
  setShowOrder: PropTypes.any,
};

export default OrderInfo;
