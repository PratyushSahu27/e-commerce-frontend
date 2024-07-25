import React, { useContext, useEffect, useState } from "react";
import "./CartItems.css";
import cross_icon from "../Assets/cart_cross_icon.png";
import { ShopContext } from "../../Context/ShopContext";
import { useNavigate } from "react-router-dom";

const CartItems = () => {
  const { products } = useContext(ShopContext);
  const { cartItems, removeFromCart, getTotalCartAmount } =
    useContext(ShopContext);
  const navigate = useNavigate();
  const [isCartEmpty, setIsCartEmpty] = useState(true);
  const MIN_CHECKOUT_AMOUNT_FOR_FREE_DELIVERY = 599;

  const checkout = () => {
    if (isCartEmpty) {
      alert("Add atleast 1 item to place an order.");
      // } else if (
      //   getTotalCartAmount().totalAmount < MIN_CHECKOUT_AMOUNT_FOR_FREE_DELIVERY
      // ) {
      //   alert(
      //     `Minimum order value should ${MIN_CHECKOUT_AMOUNT_FOR_FREE_DELIVERY} to get a free delivery.`
      //   );
      // } else if (localStorage.getItem("auth-token")) {
    } else {
      navigate("/checkout");
    }
    // else {
    //  alert("Login to place order.")
    //   navigate("/login");
    // }
  };

  return (
    <div className="cartitems">
      <div className="cartitems-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Price</p>
        <p>Quantity</p>
        <p>Total</p>
        <p>Remove</p>
      </div>
      <hr />
      {Object.keys(cartItems).map((itemId) => {
        if (cartItems[itemId] > 0) {
          isCartEmpty && setIsCartEmpty(false);
          const product = products.filter((product) => product.id == itemId)[0];
          return (
            <div key={itemId}>
              <div className="cartitems-format-main cartitems-format">
                <img
                  className="cartitems-product-icon"
                  src={product.image}
                  alt=""
                />
                <p cartitems-product-title>{product.name}</p>
                <p>&#8377;{product.shoora_price}</p>
                <button className="cartitems-quantity">
                  {cartItems[product.id]}
                </button>
                <p>
                  &#8377;
                  {Math.round(product.shoora_price * cartItems[itemId] * 100) /
                    100}
                </p>
                <img
                  onClick={() => {
                    removeFromCart(itemId);
                  }}
                  className="cartitems-remove-icon"
                  src={cross_icon}
                  alt=""
                />
              </div>
              <hr />
            </div>
          );
        }
        return null;
      })}

      {isCartEmpty && (
        <div className="empty-cart">
          <h3>Cart is empty.</h3>
        </div>
      )}
      <div className="cartitems-down">
        <div className="cartitems-total">
          <h1>Cart Totals</h1>
          <div>
            <div className="cartitems-total-item">
              <p>Subtotal</p>
              <p>&#8377;{getTotalCartAmount().totalAmount}</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <p>Shipping Fee</p>
              <p>Free</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <p>Cart Purchase Value</p>
              <p>{getTotalCartAmount().totalPurchaseValue}</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <h3>Total</h3>
              <h3>&#8377;{getTotalCartAmount().totalAmount}</h3>
            </div>
          </div>
          <button onClick={() => checkout()}>PROCEED TO CHECKOUT</button>
        </div>
        <div className="cartitems-promocode">
          <p>If you have a promo code, Enter it here</p>
          <div className="cartitems-promobox">
            <input type="text" placeholder="promo code" />
            <button>Submit</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItems;
