import React from "react";
import PropTypes from "prop-types";
import { Button } from "react-bootstrap";
import { microAlgosToString } from "../../utils/conversions";

const Meal = ({ meal, addToCart, addCount, subCount, orders }) => {
  const { name, image, price, appId } = meal;

  let order = orders.find((order) => {
    return order.mealId === appId;
  });
  let count = order ? order.count : 0;
  return (
    <div key={appId} className="maincard">
      <div className="maincard-img">
        <img src={image} alt="" />
      </div>
      <div className="maincardtext">{name}</div>
      <div className="maprice">{microAlgosToString(price)} Algo per piece</div>
      {count === 0 ? (
        <Button
          onClick={() => addToCart(appId, price)}
          className="mbutton addToCart"
          style={{ textAlign: "center !important" }}
          id="mbtn"
        >
          Add to Cart
        </Button>
      ) : (
        <div
          id="item"
          className="Reitem"
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-evenly",
            width: "100%",
            fontSize: "35px",
          }}
        >
          <div id="p" onClick={() => addCount(appId, price)} className="p">
            <span id="p" className="p add">
              +
            </span>
          </div>
          <div className="display" id="counter">
            {count}
          </div>
          <div id="m" onClick={() => subCount(appId, price)} className="m">
            <span id="m" className="m sub">
              -
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

Meal.propTypes = {
  meal: PropTypes.instanceOf(Object).isRequired,
  addToCart: PropTypes.func,
  addCount: PropTypes.func,
  subCount: PropTypes.func,
};

export default Meal;
