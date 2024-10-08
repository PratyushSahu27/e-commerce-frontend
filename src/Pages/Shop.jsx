import React from "react";
import Hero from "../Components/Hero/Hero";
import NewCollections from "../Components/NewCollections/NewCollections";

const Shop = ({ category }) => {
  return (
    <div>
      <Hero />
      <NewCollections category={category} />
    </div>
  );
};

export default Shop;
