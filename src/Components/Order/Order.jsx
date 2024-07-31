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
        {order.orderItems.map((item) => {
          return (
            <img
              key={item.id}
              className="w-6 sm:w-6 md:w-8 lg:w-10 xl:w-12"
              src={item.image}
              alt=""
            />
          );
        })}
      </div>
      <div className="order-detail-bottom flex w-full pt-4 gap-8 sm:gap-4 md:gap-6 lg:gap-8">
        <div className="order-detail-row">
          <p className="order-detail-title">Total Items</p>
          <p>{order.orderItems.length}</p>
        </div>
        <div className="order-detail-row">
          <p className="order-detail-title">Ship To</p>
          <p>{order.address.name}</p>
        </div>
      </div>
    </div>
  );
};

export default Order;
