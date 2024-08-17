import React, { useState, useEffect } from "react";
import "./Order.scss";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import arrow_down from "../Assets/arrow-down.png";

const Order = ({ order }) => {
  const orderDate = new Date(order.orderDate);
  const serverIp = process.env.REACT_APP_SERVER_IP;
  const [totalQuantity, setTotalQuantity] = useState(0);

  useEffect(() => {
    setTotalQuantity(
      order.orderItems.reduce((acc, item) => acc + item.quantity, 0)
    );
  });

  const downloadInvoice = async () => {
    try {
      const response = await fetch(
        `${serverIp}/download-invoice/${order.orderId}-invoice.pdf`,
        {
          method: "GET",
        }
      );

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${order.orderId}-invoice.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading the file:", error);
    }
  };
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
            <p className="order-detail-title">Order Purchase Value</p>
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
      <div className="order-detail-bottom justify-between flex w-full pt-4 gap-8 sm:gap-4 md:gap-6 lg:gap-8">
        <div className="order-detail-bottom-left flex gap-14 md:gap-6">
          <div className="order-detail">
            <p className="order-detail-title">Total Items</p>
            <p>{totalQuantity}</p>
          </div>
          <div className="order-detail">
            <p className="order-detail-title">Ship To</p>
            <div className="flex gap-1">
              <p>{order.address.name ?? order.buyer_name}</p>
              <div className="tooltip-container">
                <img
                  src={arrow_down}
                  className="w-4 rounded hover:bg-sky-500"
                  alt="arrow-down"
                />
                <div className="tooltip-text">
                  <p>{order.address.name ?? order.buyer_name}</p>
                  <p>{order.address.address}</p>
                  <p>
                    {order.address.city} {order.address.state}
                  </p>
                  <p>{order.address.pincode}</p>
                  <p>{order.address.phoneNumber ?? order.buyer_contact}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="order-detail">
            <p className="order-detail-title">Order Status</p>
            <h4 className="font-black text-green-700 text-md">
              {order.status}
            </h4>
          </div>
        </div>
        <div className="order-detail-bottom-right flex items-center gap-6">
          <Link to={`/order?orderId=${order.orderId}`}>
            <Button size="small">View Details</Button>
          </Link>
          {order.status === "COMPLETED" && (
            <Button
              variant="contained"
              size="small"
              onClick={() => downloadInvoice()}
            >
              <p className="font-sm">Download Invoice</p>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Order;
