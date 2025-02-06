import React, { useState, useContext, useEffect } from "react";
import "./AddressSelector.css";
import { indianStates } from "../../Utils/signup.util";
import { LoginContext } from "../../Context/LoginContext";

const AddressSelector = ({
  onSelectAddress,
  buyer,
  setBuyer,
  isBuyerValidated,
  setIsBuyerValidated,
}) => {
  const { user, branch, loginState } = useContext(LoginContext);
  const [addresses, setAddresses] = useState(
    loginState === "User" && user.addresses
  );
  const serverIp = process.env.REACT_APP_SERVER_IP;
  const [selectedAddress, setSelectedAddress] = useState(
    addresses ? addresses[0] : ""
  );
  const [newAddress, setNewAddress] = useState({
    name: "",
    address: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
    phoneNumber: "",
  });
  const [buyerError, setBuyerErrors] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSelect = (address) => {
    setSelectedAddress(address);
  };

  useEffect(() => {
    onSelectAddress(selectedAddress);
    console.log("onEffect called with address: ", selectedAddress);
  }, [onSelectAddress, selectedAddress]);

  // Validates the forms fields
  const validateForm = () => {
    let errors = {};
    let formIsValid = true;

    if (!newAddress.phoneNumber) {
      formIsValid = false;
      errors["phoneNumber"] = "Phone Number cannot be empty";
    }

    if (newAddress.phoneNumber.length !== 10) {
      formIsValid = false;
      errors["phoneNumber"] = "Enter a valid 10 digit phone number";
    }

    if (!newAddress.name) {
      formIsValid = false;
      errors["name"] = "Name cannot be empty. Enter your full name.";
    }

    if (!newAddress.state) {
      formIsValid = false;
      errors["state"] = "Please select a state";
    }

    if (!newAddress.city) {
      formIsValid = false;
      errors["city"] = "Please enter city name";
    }

    if (!newAddress.address) {
      formIsValid = false;
      errors["address"] = "Address cannot be empty";
    }

    if (!newAddress.landmark) {
      formIsValid = false;
      errors["landmark"] = "Landmark cannot be empty";
    }

    if (!newAddress.pincode) {
      formIsValid = false;
      errors["pincode"] = "Pincode cannot be empty";
    }

    if (newAddress.pincode.length !== 6) {
      formIsValid = false;
      errors["pincode"] = "Enter a valid 6 digit pincode";
    }

    setErrors(errors);
    return formIsValid;
  };

  const validateBuyer = () => {
    let error = {};
    let isBuyerValid = true;
    if (!buyer.smId || buyer.smId.length !== 9) {
      error["buyer"] = "Enter valid SM ID";
      isBuyerValid = false;
    } else {
      fetch(serverIp + "/getuserorbranch", {
        method: "POST",
        headers: {
          Accept: "application/form-data",
          "auth-token": `${localStorage.getItem("auth-token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ smId: buyer.smId }),
      })
        .then((resp) => resp.json())
        .then((data) => {
          if (data.success === true) {
            setBuyer(data.user);
            setIsBuyerValidated(true);
            setAddresses(data.user.addresses);
            setSelectedAddress(data.user.addresses[0]);
          } else {
            error["buyer"] = "SM ID not found";
            isBuyerValid = false;
            setBuyerErrors(error);
            alert("User not found!");
          }
        });
    }
    setBuyerErrors(error);
    return isBuyerValid;
  };

  const handleChange = (e) => {
    setBuyer({ ...buyer, [e.target.name]: e.target.value });
  };

  const handleNewAddressChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddNewAddress = () => {
    // TODO: Add api call to add address to DB.
    if (!validateForm()) {
      return;
    }
    setAddresses((prev) => [...prev, { id: prev.length + 1, ...newAddress }]);
    setNewAddress({
      name: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      phoneNumber: "",
    });
    setShowForm(false);
  };

  return (
    <div className="address-selector-outer-container">
      {loginState === "Branch" && (
        <div className="add-address">
          <div className="form-field">
            <label id="smId">Enter buyer SM ID</label>
            <input
              type="text"
              name="smId"
              placeholder="SM ID"
              value={buyer.smId}
              onChange={handleChange}
            />
            <p className="text-red-600 text-xs pl-1">{buyerError["buyer"]}</p>
          </div>
          <div>
            <button onClick={() => validateBuyer()}>Validate</button>
            {isBuyerValidated && (
              <p className="font-black text-lg pt-4 text-teal-700">
                SM ID Validated
              </p>
            )}
          </div>
        </div>
      )}
      <h4 className="font-extrabold">{addresses && "Select an Address"}</h4>
      <div className="addresses">
        {addresses &&
          addresses.map((address, index) => {
            return (
              <div key={index}>
                <div className="address" key={address.id}>
                  <input
                    type="radio"
                    id={`address-${address.id}`}
                    name="address"
                    value={address.id}
                    onChange={() => handleSelect(address)}
                    checked={selectedAddress?.id === address.id}
                  />
                  <label htmlFor={`address-${address.id}`}>
                    <p className="font-bold">{address.name ?? user.name}</p>
                    <p>{address.address}</p>
                    <p>
                      {address.city}, {address.state}, {address.pincode}
                    </p>
                    <p>
                      Contact:{" "}
                      {address.phoneNumber ??
                        user.phoneNumber ??
                        branch.address.phoneNumber}
                    </p>
                  </label>
                </div>
              </div>
            );
          })}
      </div>
      {loginState === "User" && (
        <button className="text-xs" onClick={() => setShowForm(!showForm)}>
          Add New Address
        </button>
      )}

      {showForm && (
        <div className="add-address">
          <h3 className="font-extrabold">New Address</h3>
          <div className="form-field">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={newAddress.name}
              onChange={handleNewAddressChange}
            />
            <p className="text-red-600 text-xs pl-1">{errors["name"]}</p>
          </div>
          <div className="form-field">
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={newAddress.address}
              onChange={handleNewAddressChange}
            />
            <p className="text-red-600 text-xs pl-1">{errors["address"]}</p>
          </div>
          <div className="form-field">
            <input
              type="text"
              name="landmark"
              placeholder="Landmark"
              value={newAddress.landmark}
              onChange={handleNewAddressChange}
            />
            <p className="text-red-600 text-xs pl-1">{errors["landmark"]}</p>
          </div>
          <div className="form-field">
            <input
              type="number"
              name="pincode"
              placeholder="Pincode"
              value={newAddress.pincode}
              onChange={handleNewAddressChange}
            />
            <p className="text-red-600 text-xs pl-1">{errors["pincode"]}</p>
          </div>
          <div className="form-field">
            <input
              type="text"
              name="city"
              placeholder="City"
              value={newAddress.city}
              onChange={handleNewAddressChange}
            />
            <p className="text-red-600 text-xs pl-1">{errors["city"]}</p>
          </div>
          <div className="form-field">
            <select
              className="w-full h-8 text-xs border-solid border border-smgrey"
              id="state"
              name="state"
              value={newAddress.state}
              onChange={handleNewAddressChange}
              required
            >
              {indianStates.map((state, index) => (
                <option key={index} value={state}>
                  {state}
                </option>
              ))}
            </select>
            <p className="text-red-600 text-xs pl-1">{errors["state"]}</p>
          </div>
          <div className="form-field">
            <input
              type="number"
              name="phoneNumber"
              placeholder="Phone Number"
              value={newAddress.phoneNumber}
              onChange={handleNewAddressChange}
            />
            <p className="text-red-600 text-xs pl-1">{errors["phoneNumber"]}</p>
          </div>
          <button onClick={handleAddNewAddress}>Save</button>
        </div>
      )}
    </div>
  );
};

export default AddressSelector;
