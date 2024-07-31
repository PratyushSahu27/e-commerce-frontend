import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CSS/Checkout.css";
import AddressSelector from "../Components/AddressSelector/AddressSelector";
import { ShopContext } from "../Context/ShopContext";
import PaymentHandler from "../Components/PaymentHandler/PaymentHandler";
import ConfirmOrder from "../Components/ConfirmOrder/ConfirmOrder";

const Checkout = () => {
  const CheckoutStates = {
    AddressSelection: "Address-Selection",
    Payment: "Payment",
    OrderConfirmation: "Order-Confirmation",
  };
  const serverIp = process.env.REACT_APP_SERVER_IP;
  const [selectedAddress, setSelectedAddress] = useState({});
  const [checkoutState, setCheckoutState] = useState(
    CheckoutStates.AddressSelection
  );
  const {
    user,
    getCartProducts,
    getTotalCartAmount,
    getDefaultCart,
    setCartItems,
  } = useContext(ShopContext);
  const navigate = useNavigate();
  const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false);

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
        const newCart = getDefaultCart();
        setCartItems(newCart);
        fetch(serverIp + "/setcart", {
          method: "POST",
          headers: {
            Accept: "application/form-data",
            "auth-token": `${localStorage.getItem("auth-token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ smId: user.smId, cartItems: newCart }),
        }).then(() => navigate("/orders"));
      });
  };
  return (
    <div className="checkout-outer-container">
      <div className="top-row">
        <button className="back-button" onClick={() => navigate(-1)}>
          Back to Cart
        </button>
        <h3 className="header">Checkout</h3>
        <div className="spacer"></div>
      </div>
      {checkoutState === CheckoutStates.AddressSelection && (
        <>
          <AddressSelector onSelectAddress={onSelectAddress} />
          <button
            onClick={() => setCheckoutState(CheckoutStates.OrderConfirmation)}
          >
            Review Order
          </button>
        </>
      )}
      {checkoutState === CheckoutStates.OrderConfirmation && (
        <>
          <ConfirmOrder />
          <div className="buttons-container">
            <button
              className="back-button"
              onClick={() => setCheckoutState(CheckoutStates.AddressSelection)}
            >
              Back to addresses
            </button>
            <button onClick={() => setCheckoutState(CheckoutStates.Payment)}>
              Proceed to pay
            </button>
          </div>
        </>
      )}
      {checkoutState === CheckoutStates.Payment && (
        <>
          <PaymentHandler setIsPaymentSuccessful={setIsPaymentSuccessful} />
          <div className="buttons-container">
            <button
              className="back-button"
              onClick={() => setCheckoutState(CheckoutStates.OrderConfirmation)}
            >
              Back to Order Review
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Checkout;
