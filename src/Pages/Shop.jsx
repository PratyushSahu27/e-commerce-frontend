import React, { useEffect, useState } from "react";
import Hero from "../Components/Hero/Hero";
import NewCollections from "../Components/NewCollections/NewCollections";

const Shop = ({ category = null }) => {
  const serverIp = process.env.REACT_APP_SERVER_IP;
  const [items, setItems] = useState([]);

  const fetchInfo = () => {
    fetch(serverIp + `/getallitems`)
      .then((res) => res.json())
      .then((data) => setItems(data));
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  return (
    <div>
      <Hero />
      <NewCollections data={items} />
    </div>
  );
};

export default Shop;
