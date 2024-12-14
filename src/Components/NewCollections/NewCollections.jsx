import React, { useContext, useEffect } from "react";
import "./NewCollections.css";
import Item from "../Item/Item";
import { ShopContext } from "../../Context/ShopContext";
import { LoginContext } from "../../Context/LoginContext";

const NewCollections = ({ category }) => {
  const { products } = useContext(ShopContext);
  const { loginState } = useContext(LoginContext);

  return (
    <div className="new-collections">
      <h1>{category ? category : "Newly added products"}</h1>
      <div className="collections">
        {products
          .filter((item) =>
            loginState === "User" ? item.available === true : item
          )
          .filter((item) =>
            category !== "First Buy" ? item.category !== "First Buy" : item
          )
          .filter((item) => (category ? item.category === category : item))
          .map((item, i) => {
            return (
              <Item
                key={item.id}
                id={item.id}
                name={item.name}
                image={item.image}
                market_retail_price={item.market_retail_price}
                shoora_price={item.shoora_price}
                purchase_value={item.purchase_value}
                is_available={item.available}
              />
            );
          })}
      </div>
    </div>
  );
};

export default NewCollections;
