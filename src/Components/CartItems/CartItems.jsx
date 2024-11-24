import React, { useContext, useState } from "react";
import "./CartItems.css";
import { ShopContext } from "../../Context/ShopContext";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../../Context/LoginContext";
import AddToCartButton from "../AddToCartButton/AddToCartButton";
import BackButton from "../BackButton/BackButton";
import { toast } from "react-toastify";
import Modal from "../../Components/Modal/ModalComponent";

const CartItems = () => {
  const {
    products,
    cartItems,
    getTotalCartAmount,
    updateDeliveryCharge,
    getDeliveryCharge,
    removeAllQuantityOfItemFromCart,
  } = useContext(ShopContext);
  const { loginState } = useContext(LoginContext);
  const navigate = useNavigate();
  const [isCartEmpty, setIsCartEmpty] = useState(true);
  const MIN_CHECKOUT_AMOUNT_FOR_FREE_DELIVERY = 50;
  const [openModal, setOpenModal] = useState(false);

  const checkout = () => {
    if (isCartEmpty) {
      alert("Add atleast 1 item to place an order.");
    } else if (localStorage.getItem("auth-token")) {
      if (
        loginState === "User" &&
        getTotalCartAmount().totalPurchaseValue <
          MIN_CHECKOUT_AMOUNT_FOR_FREE_DELIVERY
      ) {
        setOpenModal(true);
      } else {
        navigate("/checkout");
      }
    } else {
      toast.error("Login to place order.");
      navigate("/login");
    }
  };

  const submitHandler = (state) => {
    if (state === "ACCEPT") {
      navigate("/checkout");
    } else {
      setOpenModal(false);
    }
  };

  return (
    <div className="cartitems">
      <BackButton />
      <div className="cartitems-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Price</p>
        <p>Quantity</p>
        <p>Total</p>
      </div>
      <hr />
      {Object.keys(cartItems).map((itemId) => {
        if (cartItems[itemId] > 0) {
          const product = products.filter((product) => product.id == itemId)[0];
          // Product is not there then remove that product from cart
          if (!product) {
            removeAllQuantityOfItemFromCart(itemId);
            toast.error("Some unavailable items were removed from cart.");
            return null;
          }
          isCartEmpty && setIsCartEmpty(false);
          return (
            <div key={itemId}>
              <div className="cartitems-format-main cartitems-format">
                <img
                  className="cartitems-product-icon"
                  src={product.image}
                  alt=""
                />
                <p className="cartitems-product-title">{product.name}</p>
                <p>&#8377;{product.shoora_price}</p>
                <button className="cartitems-quantity">
                  {cartItems[product.id]}
                </button>
                <div className="flex gap-2">
                  <h3>Line Total</h3>
                  <p>
                    &#8377;
                    {Math.round(
                      product.shoora_price * cartItems[itemId] * 100
                    ) / 100}
                  </p>
                </div>

                <div>
                  <AddToCartButton
                    itemId={product.id}
                    items={cartItems[product.id]}
                  />
                </div>
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
              <p>Delivery Charge</p>
              <p>&#8377;{getDeliveryCharge()}</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <h3>Total</h3>
              <h3>&#8377;{getTotalCartAmount().totalAmount}</h3>
            </div>
          </div>
          <button onClick={() => checkout()} disabled={isCartEmpty}>
            PROCEED TO CHECKOUT
          </button>
        </div>
        <div className="cartitems-promocode">
          <p>If you have a promo code, Enter it here</p>
          <div className="cartitems-promobox">
            <input type="text" placeholder="promo code" />
            <button disabled>Submit</button>
          </div>
        </div>
      </div>
      <Modal
        title={`Order purchase value is less than ${MIN_CHECKOUT_AMOUNT_FOR_FREE_DELIVERY}.`}
        message={`Delivery charge will be applicable.`}
        isOpen={openModal}
        isRejectEnabled
        acceptMessage="Proceed to make purchase"
        rejectMessage="Continue buying"
        submitHandler={submitHandler}
      />
    </div>
  );
};

export default CartItems;
