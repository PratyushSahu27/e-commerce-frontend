import React, { useState } from "react";
import "./CSS/Checkout.css"
import AddressSelector from "../Components/AddressSelector/AddressSelector";

const Checkout = () => {
    const [selectedAddress, setSelectedAddress] = useState({});
    const onSelectAddress = (address) => {
        setSelectedAddress(address);
    }
    const checkout = () => {

    }
  return (
    <div className="checkout-outer-container">
      <h3>Checkout</h3>
      <AddressSelector onSelectAddress={onSelectAddress}/>
      <button onClick={() => checkout()}>Place Order</button>
    </div>
  );
};

export default Checkout;
