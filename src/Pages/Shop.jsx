import React, { useEffect, useState } from "react";
import Hero from "../Components/Hero/Hero";
import NewCollections from "../Components/NewCollections/NewCollections";

const Shop = ({ category }) => {
  const serverIp = process.env.REACT_APP_SERVER_IP;
  const [items, setItems] = useState([]);

  const fetchInfo = () => {
    !category
      ? fetch(serverIp + `/getallitems`)
          .then((res) => res.json())
          .then((data) => setItems(data))
      : fetch(serverIp + `/getitems/${category}`)
          .then((res) => res.json())
          .then((data) => setItems(data));
  };

  useEffect(() => {
    fetchInfo();
  }, [category]);

  return (
    <div>
      <Hero />
      <NewCollections category={category} data={items} setData={setItems} />
    </div>
  );
};

export default Shop;
