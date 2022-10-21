import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Header from "./Header";
import Menu from "./Menu";
import Orders from "./Orders";
import Footer from "./Footer";
import Loader from "../utils/Loader";
import { NotificationError, NotificationSuccess } from "../utils/Notifications";
import PropTypes from "prop-types";
import { createMealAction, getMealsAction } from "../../utils/foodizMeal";
import {
  createOrderAction,
  getOrdersAction,
  deleteOrderAction,
} from "../../utils/foodizOrder";

const Foodiz = ({ address, name, balance, fetchBalance, disconnect }) => {
  const [meals, setMeals] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const getMeals = useCallback(async () => {
    setLoading(true);
    getMealsAction()
      .then((meals) => {
        if (meals) {
          setMeals(meals);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally((_) => {
        setLoading(false);
      });
  }, []);

  const getOrders = useCallback(async () => {
    setLoading(true);
    getOrdersAction(address)
      .then((orders) => {
        if (orders) {
          setOrders(orders);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [address]);

  const addMeal = (data) => {
    setLoading(true);
    createMealAction(address, data)
      .then(() => {
        toast(<NotificationSuccess text="Meal added successfully." />);
        getMeals();
        fetchBalance(address);
      })
      .catch((error) => {
        console.log(error);
        toast(<NotificationError text="Failed to create meal." />);
        setLoading(false);
      });
  };

  const createOrder = async (data, total) => {
    setLoading(true);
    if (!total) return;
    createOrderAction(address, data, total)
      .then(async () => {
        toast(<NotificationSuccess text="Order added successfully." />);
        await getMeals();
        getOrders();
        fetchBalance(address);
      })
      .catch((error) => {
        console.log(error);
        toast(<NotificationError text="Failed to create order." />);
        setLoading(false);
      });
  };

  const deleteOrder = async (order) => {
    setLoading(true);
    deleteOrderAction(address, order.appId)
      .then(async () => {
        toast(<NotificationSuccess text="Order deleted successfully" />);
        await getMeals();
        getOrders();
        fetchBalance(address);
      })
      .catch((error) => {
        console.log(error);
        toast(<NotificationError text="Failed to delete order." />);
        setLoading(false);
      });
  };

  useEffect(() => {
    getMeals();
    getOrders();
  }, [getMeals, getOrders]);

  if (loading) {
    return <Loader />;
  }
  return (
    <>
      <Header
        address={address}
        name={name}
        balance={balance}
        disconnect={disconnect}
        addMeal={addMeal}
      />
      <main>
        <Menu address={address} meals={meals} createOrder={createOrder} />
        <Orders orders={orders} deleteOrder={deleteOrder} />
      </main>
      <Footer />
    </>
  );
};

Foodiz.propTypes = {
  address: PropTypes.string,
  name: PropTypes.string,
  balance: PropTypes.number,
  fetchBalance: PropTypes.func.isRequired,
  disconnect: PropTypes.func.isRequired,
};

export default Foodiz;
