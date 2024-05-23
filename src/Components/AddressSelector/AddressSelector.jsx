import React, { useState, useContext } from "react";
import { ShopContext } from "../../Context/ShopContext";
import "./AddressSelector.css";

const AddressSelector = ({ onSelectAddress }) => {
  const { getUserData } = useContext(ShopContext);
  const user = getUserData();
  const [addresses, setAddresses] = useState(user.addresses);

  const [selectedAddress, setSelectedAddress] = useState(addresses[0]);
  const [newAddress, setNewAddress] = useState({ name: "", details: "" });
  const [showForm, setShowForm] = useState(false);

  const handleSelect = (address) => {
    setSelectedAddress(address);
    onSelectAddress(address);
  };

  const handleNewAddressChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddNewAddress = () => {
    setAddresses((prev) => [...prev, { id: prev.length + 1, ...newAddress }]);
    setNewAddress({ name: "", details: "" });
    setShowForm(false);
  };

  return (
    <div className="address-selector-outer-container">
      <h4>Select an Address</h4>
      <div className="addresses">
        {addresses &&
          addresses.map((address) => (
            <div key={address.id}>
              <input
                type="radio"
                id={`address-${address.id}`}
                name="address"
                value={address.id}
                onChange={() => handleSelect(address)}
                checked={selectedAddress?.id === address.id}
              />
              <label htmlFor={`address-${address.id}`}>
                <p>{address.address}</p>
                <p>{address.city}, {address.state}, {address.pincode}, {user.phoneNumber}</p>
              </label>
            </div>
          ))}
      </div>
      {/* <button onClick={() => setShowForm(!showForm)}>Add New Address</button>

      {showForm && (
        <div className="add-address">
          <h3>New Address</h3>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={newAddress.name}
            onChange={handleNewAddressChange}
          />
          <input
            type="text"
            name="details"
            placeholder="Details"
            value={newAddress.details}
            onChange={handleNewAddressChange}
          />
          <button onClick={handleAddNewAddress}>Save</button>
        </div>
      )} */}

      {/* {selectedAddress && (
        <div className="selected-address">
          <h5>Selected Address</h5>
          <p>
            {selectedAddress.address}
          </p>
        </div>
      )} */}
    </div>
  );
};

export default AddressSelector;
