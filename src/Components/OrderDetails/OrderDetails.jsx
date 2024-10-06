import { useLocation } from "react-router-dom";
import "./OrderDetails.scss";
import React, { useState, useEffect, useContext } from "react";
import Button from "@mui/material/Button";
import { LoginContext } from "../../Context/LoginContext";
import BackButton from "../../Components/BackButton/BackButton";

const OrderDetails = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const orderId = queryParams.get("orderId");
  const [order, setOrder] = useState({});
  const serverIp = process.env.REACT_APP_SERVER_IP;
  const [orderStatus, setOrderStatus] = useState("");
  const [formData, setFormData] = useState({
    deliveryDocketNumber: "",
    deliveryServiceName: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const { user, branch, loginState } = useContext(LoginContext);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    const reqBody =
      loginState === "User"
        ? {
            smId: user.smId,
          }
        : {
            branchId: branch.branch_id,
          };
    fetch(`${serverIp}/getorders`, {
      method: "POST",
      headers: {
        Accept: "application/form-data",
        "auth-token": `${localStorage.getItem("auth-token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reqBody),
    })
      .then((res) => res.json())
      .then((data) =>
        setOrder(data.orders.filter((order) => order.orderId === orderId)[0])
      );
  };

  const markOrderAsCompleted = async () => {
    if (validateForm()) {
      fetch(serverIp + "/markorderascompleted", {
        method: "POST",
        headers: {
          Accept: "application/form-data",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: order.orderId,
          deliveryDocketNumber: formData.deliveryDocketNumber,
          deliveryServiceName: formData.deliveryServiceName,
        }),
      })
        .then((resp) => resp.json())
        .then((data) => {
          if (data.success === true) {
            setOrder({
              ...order,
              deliveryDocketNumber: formData.deliveryDocketNumber,
              deliveryServiceName: formData.deliveryServiceName,
              status: "COMPLETED",
            });
          }
        });
    }
  };

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

  const validateForm = () => {
    let isFormValid = true;

    if (!formData.deliveryDocketNumber) {
      isFormValid = false;
      setFormErrors((prev) => {
        return {
          ...prev,
          deliveryDocketNumber: "Delivery docket no. is empty!",
        };
      });
    }
    return isFormValid;
  };

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="order-details-outer-container flex flex-col m-8">
      <BackButton />
      <div className="flex justify-center">
        <div className="order-details mt-4">
          <div className="order-header">
            <h2>Order ID: {order.orderId}</h2>
            <p>
              Status:{"    "}
              <span className={`status ${order.status?.toLowerCase()}`}>
                {order.status}
              </span>
            </p>
            <p>
              Transaction Status:{" "}
              <span
                className={`transaction-status ${order.transactionStatus?.toLowerCase()}`}
              >
                {order.transactionStatus}
              </span>
            </p>
          </div>

          <div className="buyer-info">
            <h3>Buyer Information</h3>
            <p>
              <strong>
                Name:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </strong>{" "}
              {order.buyer_name}
            </p>
            <p>
              <strong>
                SM
                ID:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </strong>{" "}
              {order.smId}
            </p>
            <p>
              <strong>
                Mode:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </strong>{" "}
              {order.mode}
            </p>
            <p>
              <strong>Contact:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</strong>{" "}
              {order.buyer_contact}
            </p>
          </div>

          <div className="address-info">
            <h3>Shipping Address</h3>
            <p>
              <strong>Name:</strong> {order?.address?.name}
            </p>
            <p>
              <strong>Address:</strong> {order?.address?.address}
            </p>
            <p>
              <strong>City:</strong> {order?.address?.city}
            </p>
            <p>
              <strong>State:</strong> {order?.address?.state}
            </p>
            <p>
              <strong>Pincode:</strong> {order?.address?.pincode}
            </p>
            <p>
              <strong>Contact:</strong> {order?.address?.phoneNumber}
            </p>
          </div>

          <div className="order-items">
            <h3>Order Items</h3>
            {order.orderItems?.map((item, index) => (
              <div className="order-item" key={index}>
                <img src={item.image} alt={item.name} />
                <div className="item-details">
                  <p>
                    <strong>Name:</strong>&nbsp;&nbsp; {item.name}
                  </p>
                  <p>
                    <strong>Category:</strong> &nbsp;&nbsp;{item.category}
                  </p>
                  <p>
                    <strong>Quantity:</strong> {item.quantity} x &nbsp;&nbsp;
                    {item.quantity_value} {item.quantity_unit}
                  </p>
                  <p>
                    <strong>Price:</strong> &nbsp;&nbsp;₹{item.shoora_price}
                  </p>
                  <p>
                    <strong>Purchase Value:</strong> &nbsp;&nbsp;
                    {item.purchase_value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="order-summary">
            <h3>Order Summary</h3>
            <p>Delivery Charge: &nbsp;&nbsp;₹{order.deliveryCharge}</p>
            <p>
              <strong>Total Order Value:</strong> &nbsp;&nbsp;₹
              {order.orderValue}
            </p>
            <p>
              <strong>Total Purchase Value:</strong> &nbsp;&nbsp;
              {order.orderPurchaseValue}
            </p>
            {orderStatus === "COMPLETED" && (
              <span>
                <p>
                  <strong>Delivery Docket No.</strong> &nbsp;&nbsp;
                  {order.deliveryDocketNumber}
                </p>
                <p>
                  <strong>Delivery Service Name</strong> &nbsp;&nbsp;
                  {order.deliveryServiceName}
                </p>
              </span>
            )}
          </div>
          {order.status === "COMPLETED" && (
            <div className="flex justify-end">
              <Button
                variant="contained"
                size="small"
                onClick={() => downloadInvoice()}
              >
                <p className="font-sm">Download Invoice</p>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
