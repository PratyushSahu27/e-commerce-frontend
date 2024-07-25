import "./ConfirmOrder.scss";
import { useContext } from "react";
import { ShopContext } from "../../Context/ShopContext";

const ConfirmOrder = () => {
  const { cartItems, products, getTotalCartAmount } = useContext(ShopContext);

  return (
    <div className="confirm-order-outer-container">
      <h3>Review Order items</h3>
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
          return (
            <div key={itemId}>
              <div className="cartitems-format-main cartitems-format">
                <img
                  className="cartitems-product-icon"
                  src={product.image}
                  alt=""
                />
                <p cartitems-product-title>{product.name}</p>
                <p>
                  <span className="cancel">
                    &#8377;{product.market_retail_price}
                  </span>
                  {` `}&#8377;{product.shoora_price}
                </p>
                <button className="cartitems-quantity">
                  {cartItems[product.id]}
                </button>
                <p>
                  &#8377;
                  {Math.round(product.shoora_price * cartItems[itemId] * 100) /
                    100}
                </p>
              </div>
              <hr />
            </div>
          );
        }
        return null;
      })}

      <div className="cartitems-total-item">
        <p>Subtotal</p>
        <p>&#8377;{getTotalCartAmount().totalAmount}</p>
      </div>
    </div>
  );
};

export default ConfirmOrder;
