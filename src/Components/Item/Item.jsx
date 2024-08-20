import React, { useContext } from "react";
import "./Item.css";
import { Link } from "react-router-dom";
import AddToCartButton from "../AddToCartButton/AddToCartButton";
import { ShopContext } from "../../Context/ShopContext";

const Item = (props) => {
  const { cartItems } = useContext(ShopContext);
  return (
    <div className="item">
      <Link to={`/product/${props.id}`} style={{ textDecoration: "none" }}>
        <img onClick={window.scrollTo(0, 0)} src={props.image} alt="products" />
      </Link>
      <p>{props.name}</p>
      <div className="item-caption pb-4">
        <div className="item-prices">
          <div className="item-price-new">&#8377;{props.shoora_price}</div>
          <div className="item-price-old">
            &#8377;{props.market_retail_price}
          </div>
        </div>
        <div className="item-purchase-value">PV: {props.purchase_value}</div>
      </div>
      <AddToCartButton itemId={props.id} items={cartItems[props.id]} />
    </div>
  );
};

export default Item;
