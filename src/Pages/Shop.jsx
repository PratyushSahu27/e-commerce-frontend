import React, { useContext } from "react";
import Hero from "../Components/Hero/Hero";
import NewCollections from "../Components/NewCollections/NewCollections";
import { LoginContext } from "../Context/LoginContext";
import exclamation from "../Components/Assets/exclamation-mark.png";

const Shop = ({ category }) => {
  const { user, loginState } = useContext(LoginContext);

  return (
    <div>
      <Hero />
      {loginState === "User" &&
        user.smId &&
        (user.isActive === null || !user.isActive) && (
          <div className="h-24 bg-stone-900 flex justify-center items-center text-lg font-extrabold text-white gap-4">
            <img src={exclamation} className="h-12" />
            Make a purchase to complete registration and activate account
          </div>
        )}
      <NewCollections category={category} />
    </div>
  );
};

export default Shop;
