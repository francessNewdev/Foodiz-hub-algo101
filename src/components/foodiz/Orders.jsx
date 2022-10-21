import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Table } from "react-bootstrap";
import OrderInfo from "./OrderInfo";
import { convertTime } from "../../utils/conversions";

const Orders = ({ orders, deleteOrder }) => {
  const [show, setShow] = useState(false);
  const handleShow = () => {
    setShow(!show);
  };
  const [showOrder, setShowOrder] = useState(false);
  const [orderIndex, setOrderIndex] = useState(0);

  const view = (index) => {
    setOrderIndex(index);
    setShowOrder(true);
  };

  if (showOrder) {
    let order = orders[orderIndex];
    return (
      <OrderInfo order={order} show={showOrder} setShowOrder={setShowOrder} />
    );
  }
  return (
    <>
      <div className="collbtn" id="prevOrders" style={{ marginTop: "40px" }}>
        <Button
          onClick={handleShow}
          className="btn btn-primary"
          style={{ textAlign: "center", display: "block", margin: "10px auto" }}
        >
          View Prev Orders
        </Button>
      </div>
      {show ? (
        <div id="menuBar">
          <div className="cardmenu">
            <div className="menu" id="menu">
              <Table
                style={{
                  color: "white",
                }}
                responsive="lg"
                size="lg"
              >
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Order ID</th>
                    <th scope="col">Details</th>
                    <th scope="col">Date</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody id="userorders">
                  {orders ? (
                    orders.map((order, index) => (
                      <tr key={index} className="align-middle">
                        <td id="id">{index}</td>
                        <td id="orderID">
                          <a
                            href={`https://testnet.algoexplorer.io/application/${order.appId}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {order.appId}
                          </a>
                        </td>
                        <td id="orderDetails">
                          <Button onClick={(e) => view(index)} variant="info">
                            View Info
                          </Button>
                        </td>
                        <td id="orderDate">{convertTime(order.date)}</td>
                        <td id="action">
                          <Button
                            variant="outline-danger"
                            disabled={order.status === 0}
                            onClick={() => {
                              deleteOrder(order);
                            }}
                            className="btn"
                          >
                            <i className="bi bi-trash"></i>
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <></>
                  )}
                </tbody>
              </Table>
            </div>
          </div>
        </div>
      ) : (
        <> </>
      )}
    </>
  );
};

Orders.propTypes = {
  orders: PropTypes.instanceOf(Array),
  deleteOrder: PropTypes.func.isRequired,
};

export default Orders;
