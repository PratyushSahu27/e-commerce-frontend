import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CSS/Checkout.css";
import AddressSelector from "../Components/AddressSelector/AddressSelector";
import { ShopContext } from "../Context/ShopContext";
import PaymentHandler from "../Components/PaymentHandler/PaymentHandler";
import ConfirmOrder from "../Components/ConfirmOrder/ConfirmOrder";
import { LoginContext } from "../Context/LoginContext";
import { v4 } from "uuid";

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
  const { getCartProducts, getTotalCartAmount, getDefaultCart, setCartItems } =
    useContext(ShopContext);
  const navigate = useNavigate();
  const [isPaymentInitiated, setIsPaymentInitiated] = useState(false);
  const { loginState, user, branch } = useContext(LoginContext);
  const [orderId, setOrderId] = useState("");
  const [buyer, setBuyer] = useState({
    smId: "",
  });
  const [isBuyerValidated, setIsBuyerValidated] = useState(false);
  const onSelectAddress = (address) => {
    setSelectedAddress(address);
  };
  const [paymentMode, setPaymentMode] = useState("");

  useEffect(() => {
    if (isPaymentInitiated === true) {
      placeOrder();
    }
  }, [isPaymentInitiated]);

  useEffect(() => {
    setOrderId(v4());
  }, []);

  const placeOrder = () => {
    const { totalAmount, totalPurchaseValue } = getTotalCartAmount();
    const orderItems = getCartProducts();
    let data;
    if (loginState === "User") {
      data = { mode: "Online", smId: user.smId, branchId: "SMBKT0002" };
    } else {
      if (paymentMode === "PhonePe") {
        data = {
          mode: "Offline",
          smId: buyer.smId,
          branchId: branch.branch_id,
        };
      } else {
        data = {
          mode: "Offline",
          smId: buyer.smId,
          branchId: branch.branch_id,
          status: "CONFIRMED",
          transactionId: "NA",
          transactionStatus: "OFFLINE",
        };
      }
    }

    fetch(serverIp + "/placeorder", {
      method: "POST",
      headers: {
        Accept: "application/form-data",
        "auth-token": `${localStorage.getItem("auth-token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
        orderId,
        address: selectedAddress,
        orderValue: totalAmount,
        orderPurchaseValue: totalPurchaseValue,
        orderItems,
        // alternateContactNumber, //TODO
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success === true) {
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
          });
        }
      });

    if (paymentMode === "Offline") {
      alert(`Collect ${totalAmount} from Customer in Cash`);
      navigate("/orders");
    }
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
          <AddressSelector
            onSelectAddress={onSelectAddress}
            buyer={buyer}
            setBuyer={setBuyer}
            isBuyerValidated={isBuyerValidated}
            setIsBuyerValidated={setIsBuyerValidated}
          />
          <button
            onClick={() => {
              if (loginState === "User" || isBuyerValidated) {
                setCheckoutState(CheckoutStates.OrderConfirmation);
              } else {
                alert("Enter a valid SM ID to proceed");
              }
            }}
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
          <PaymentHandler
            setIsPaymentInitiated={setIsPaymentInitiated}
            orderId={orderId}
            setPaymentMode={setPaymentMode}
            buyer={buyer}
          />
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
