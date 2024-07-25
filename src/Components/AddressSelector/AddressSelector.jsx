import React, { useState, useContext, useEffect } from "react";
import { ShopContext } from "../../Context/ShopContext";
import "./AddressSelector.css";

const AddressSelector = ({ onSelectAddress }) => {
  const { getUserData } = useContext(ShopContext);
  // const user = getUserData();

  const dummyUser = {
    name: "Pratyush Sahu",
  };

  const user = dummyUser;
  const dummyAddresses = [
    {
      id: 1,
      address: "304, Moti Bunglow",
      city: "Dewas",
      state: "Madhya Pradesh",
      pincode: "455001",
      phoneNumber: "89888888888",
    },
    {
      id: 2,
      address: "MG Road",
      city: "Indore",
      state: "Madhya Pradesh",
      pincode: "452001",
      phoneNumber: "871678617",
    },
  ];
  // const [addresses, setAddresses] = useState(user.addresses);
  const [addresses, setAddresses] = useState(dummyAddresses);

  const [selectedAddress, setSelectedAddress] = useState(dummyAddresses[0]);
  const [newAddress, setNewAddress] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    phoneNumber: "",
  });
  const [showForm, setShowForm] = useState(false);

  const handleSelect = (address) => {
    setSelectedAddress(address);
  };

  useEffect(() => {
    onSelectAddress(selectedAddress);
  }, [onSelectAddress, selectedAddress]);

  const handleNewAddressChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddNewAddress = () => {
    // TODO: Add api call to add address to DB.
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
      <h4>Select an Address</h4>
      <div className="addresses">
        {addresses &&
          addresses.map((address) => {
            return (
              <>
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
                    <p>{user.name}</p>
                    <p>{address.address}</p>
                    <p>
                      {address.city}, {address.state}, {address.pincode}
                    </p>
                    <p>Contact: {address.phoneNumber}</p>
                  </label>
                </div>
              </>
            );
          })}
      </div>
      <button onClick={() => setShowForm(!showForm)}>Add New Address</button>

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
            name="address"
            placeholder="Address"
            value={newAddress.address}
            onChange={handleNewAddressChange}
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            value={newAddress.city}
            onChange={handleNewAddressChange}
          />
          <input
            type="text"
            name="state"
            placeholder="State"
            value={newAddress.state}
            onChange={handleNewAddressChange}
          />
          <input
            type="number"
            name="pincode"
            placeholder="Pincode"
            value={newAddress.pincode}
            onChange={handleNewAddressChange}
          />
          <input
            type="number"
            name="phoneNumber"
            placeholder="Phone Number"
            value={newAddress.phoneNumber}
            onChange={handleNewAddressChange}
          />
          <button onClick={handleAddNewAddress}>Save</button>
        </div>
      )}

      {selectedAddress && (
        <div className="selected-address">
          <h5>Selected Address</h5>
          <p>{selectedAddress.address}</p>
        </div>
      )}
    </div>
  );
};

export default AddressSelector;
