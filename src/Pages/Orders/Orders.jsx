import React, { useContext, useEffect, useState } from "react";
import "./Orders.scss";
import Order from "../../Components/Order/Order";
import { LoginContext } from "../../Context/LoginContext";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const { user, branch, loginState } = useContext(LoginContext);
  const serverIP = process.env.REACT_APP_SERVER_IP;

  useEffect(() => {
    const reqBody =
      loginState === "User"
        ? {
            smId: user.smId,
          }
        : {
            branchId: branch.branch_id,
          };
    fetch(`${serverIP}/getorders`, {
      method: "POST",
      headers: {
        Accept: "application/form-data",
        "auth-token": `${localStorage.getItem("auth-token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reqBody),
    })
      .then((res) => res.json())
      .then((data) => setOrders(data.orders));
  }, [user, branch, loginState]);

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
