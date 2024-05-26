import React from "react";
import "./Order.scss";

const Order = ({ order }) => {
  const orderDate = new Date(order.orderDate);
  return (
    <div className="order-outer-container">
      <div className="order-details">
        <div className="order-details-left">
          <div className="order-detail">
            <p className="order-detail-title">Order Date</p>
            <p>{`${orderDate.toDateString()} `}</p>
          </div>
          <div className="order-detail">
            <p className="order-detail-title">Order Value</p>
            <p>{order.orderValue}</p>
          </div>
          <div className="order-detail">
            <p className="order-detail-title">Order Purchase Date</p>
            <p>{order.orderPurchaseValue}</p>
          </div>
        </div>
        <div className="order-details-right">
          <div className="order-id">
            <p>ORDER# {order.orderId}</p>
          </div>
        </div>
      </div>
      <div className="order-items-list">
        <p>Items ordered (Coming Soon)</p>
      </div>
    </div>
  );
};

export default Order;
