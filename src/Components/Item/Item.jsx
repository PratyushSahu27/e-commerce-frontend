import React, { useContext } from "react";
import "./Item.css";
import { Link } from "react-router-dom";
import AddToCartButton from "../AddToCartButton/AddToCartButton";
import { ShopContext } from "../../Context/ShopContext";

const Item = ({
  name,
  image,
  shoora_price,
  id,
  market_retail_price,
  showAddToCart = true,
}) => {
  const { cartItems } = useContext(ShopContext);

  const discount =
    market_retail_price > shoora_price
      ? Math.round(
          ((market_retail_price - shoora_price) / market_retail_price) * 100
        )
      : 0;

  return (
    <div className="item">
      {discount > 0 && <div className="discount-badge">{discount}% OFF</div>}
      <Link to={`/product/${id}`} style={{ textDecoration: "none" }}>
        <img
          onClick={() => window.scrollTo(0, 0)}
          src={image}
          alt="products"
          style={{ cursor: "pointer" }}
        />
      </Link>
      <p>{name}</p>
      <div className="item-caption pb-4">
        <div className="item-prices">
          <div className="item-price-new">&#8377;{shoora_price}</div>
          {discount > 0 && (
            <div className="item-price-old">&#8377;{market_retail_price}</div>
          )}
        </div>
      </div>
      {showAddToCart && <AddToCartButton itemId={id} items={cartItems[id]} />}
    </div>
  );
};

export default Item;
