import React, { useState, useContext, useEffect } from "react";
import { ShopContext } from "../../Context/ShopContext";
import "./AddressSelector.css";
import { indianStates } from "../../Utils/signup.util";

const AddressSelector = ({ onSelectAddress }) => {
  const { getUserData } = useContext(ShopContext);
  const user = getUserData();
  const [addresses, setAddresses] = useState(user.addresses);
  const [selectedAddress, setSelectedAddress] = useState(addresses[0]);
  const [newAddress, setNewAddress] = useState({
    name: "",
    address: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
    phoneNumber: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSelect = (address) => {
    setSelectedAddress(address);
  };

  useEffect(() => {
    onSelectAddress(selectedAddress);
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
      <h4 className="font-extrabold">Select an Address</h4>
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
                    <p>Contact: {address.phoneNumber ?? user.phoneNumber}</p>
                  </label>
                </div>
              </div>
            );
          })}
      </div>
      <button className="text-xs" onClick={() => setShowForm(!showForm)}>
        Add New Address
      </button>

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

      {/* {selectedAddress && (
        <div className="selected-address">
          <h5>Selected Address</h5>
          <p>{selectedAddress.address}</p>
        </div>
      )} */}
    </div>
  );
};

export default AddressSelector;
