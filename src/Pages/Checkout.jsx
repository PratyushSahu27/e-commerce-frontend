import React, { useContext, useState } from "react";
import { useNavigate } from 'react-router-dom';
import "./CSS/Checkout.css";
import AddressSelector from "../Components/AddressSelector/AddressSelector";
import { ShopContext } from "../Context/ShopContext";

const Checkout = () => {
  const serverIp = process.env.REACT_APP_SERVER_IP;
  const [selectedAddress, setSelectedAddress] = useState({});
  const { user, getCartProducts, getTotalCartAmount } = useContext(ShopContext);
  const navigate = useNavigate();

  const onSelectAddress = (address) => {
    setSelectedAddress(address);
  };

  const placeOrder = () => {
    const { totalAmount, totalPurchaseValue } = getTotalCartAmount();
    const orderItems = getCartProducts();

    fetch(serverIp + "/placeOrder", {
      method: "POST",
      headers: {
        Accept: "application/form-data",
        "auth-token": `${localStorage.getItem("auth-token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        smId: user.smId,
        address: selectedAddress,
        orderValue: totalAmount,
        orderPurchaseValue: totalPurchaseValue,
        orderItems,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        alert("Order placed successfully!");
        navigate('/orders')
      });
  };
  return (
    <div className="checkout-outer-container">
      <h3>Checkout</h3>
      <AddressSelector onSelectAddress={onSelectAddress} />
      <button onClick={() => placeOrder()}>Place Order</button>
    </div>
  );
};

export default Checkout;
