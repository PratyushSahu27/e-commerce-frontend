import React, { useContext, useEffect, useState } from "react";
import "./Orders.scss";
import { ShopContext } from "../../Context/ShopContext";
import Order from "../../Components/Order/Order";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const { user } = useContext(ShopContext);
  const serverIP = process.env.REACT_APP_SERVER_IP;

  useEffect(() => {
    fetch(`${serverIP}/getorders`, {
      method: "POST",
      headers: {
        Accept: "application/form-data",
        "auth-token": `${localStorage.getItem("auth-token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        smId: user.smId,
      }),
    })
      .then((res) => res.json())
      .then((data) => setOrders(data.orders));
  }, [user]);

  return (
    <div className="orders-outer-container">
      <h2 className="font-extrabold">Orders</h2>
      <div className="order-list-container">
        {orders.length > 0 ? (
          orders
            .slice()
            .reverse()
            .map((order) => {
              return <Order key={order.orderId} order={order} />;
            })
        ) : (
          <h3>No Orders to display</h3>
        )}
      </div>
    </div>
  );
};

export default Orders;
