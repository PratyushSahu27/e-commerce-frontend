import React, { createContext, useContext, useEffect, useState } from "react";
import { LoginContext } from "./LoginContext";

export const ShopContext = createContext(null);

const ShopContextProvider = (props) => {
  const serverIp = process.env.REACT_APP_SERVER_IP;
  const [products, setProducts] = useState([]);
  const { loginState } = useContext(LoginContext);
  const [deliveryCharge, setDeliveryCharge] = useState(0);

  const getDefaultCart = () => {
    let cart = {};
    for (let i = 0; i < 500; i++) {
      cart[i] = 0;
    }
    return cart;
  };
  const [cartItems, setCartItems] = useState(getDefaultCart());

  function getCart() {
    try {
      fetch(serverIp + "/getcart", {
        method: "POST",
        headers: {
          Accept: "application/form-data",
          "auth-token": `${localStorage.getItem("auth-token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(),
      })
        .then((resp) => resp.json())
        .then((data) => {
          setCartItems(data);
        });
    } catch (e) {
      console.log("Could not fetch cart");
    }
  }

  useEffect(() => {
    fetch(serverIp + "/getallitems")
      .then((res) => res.json())
      .then((data) => {
        if (loginState === "Branch") {
          setProducts(data);
        } else {
          setProducts(
            data.filter((product) => {
              return product.available === true;
            })
          );
        }
      });

    if (localStorage.getItem("auth-token")) {
      getCart();
    }
  }, [serverIp, loginState]);

  const updateDeliveryCharge = (charge) => {
    setDeliveryCharge(charge);
  };

  const getDeliveryCharge = () => {
    return deliveryCharge;
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    let totalPurchaseValue = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = products.find((product) => product.id === Number(item));
        totalAmount += cartItems[item] * itemInfo.shoora_price;
        totalPurchaseValue += cartItems[item] * itemInfo.purchase_value;
      }
    }

    if (totalAmount < 999) {
      setDeliveryCharge(100);
    }
    return {
      totalAmount: roundTo2Decimals(totalAmount + deliveryCharge),
      totalPurchaseValue: roundTo2Decimals(totalPurchaseValue),
    };
  };

  const roundTo2Decimals = (num) => {
    return Math.round(num * 100) / 100;
  };

  const getTotalCartItems = () => {
    let totalItem = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        totalItem += cartItems[item];
      }
    }
    return totalItem;
  };

  const getCartProducts = () => {
    const cartProductsList = [];
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        cartProductsList.push({
          ...products.find((product) => product.id === Number(item)),
          quantity: cartItems[item],
        });
      }
    }
    return cartProductsList;
  };

  const addToCart = (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    if (localStorage.getItem("auth-token") && loginState === "User") {
      fetch(serverIp + "/addtocart", {
        method: "POST",
        headers: {
          Accept: "application/form-data",
          "auth-token": `${localStorage.getItem("auth-token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemId: itemId }),
      })
        .then((resp) => resp.json())
        .then((data) => {
          console.log(data);
        });
    }
  };

  const addAllToCart = () => {
    return fetch(serverIp + "/addalltocart", {
      method: "POST",
      headers: {
        Accept: "application/form-data",
        "auth-token": `${localStorage.getItem("auth-token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cartItems: cartItems }),
    });
  };

  const removeFromCart = (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    if (localStorage.getItem("auth-token") && loginState === "User") {
      fetch(serverIp + "/removefromcart", {
        method: "POST",
        headers: {
          Accept: "application/form-data",
          "auth-token": `${localStorage.getItem("auth-token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemId: itemId }),
      })
        .then((resp) => resp.json())
        .then((data) => {
          console.log(data);
        });
    }
  };

  const contextValue = {
    cartItems,
    products,
    addAllToCart,
    getCartProducts,
    getDefaultCart,
    addToCart,
    getTotalCartItems,
    getTotalCartAmount,
    removeFromCart,
    setCartItems,
    updateDeliveryCharge,
    getDeliveryCharge,
  };
  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
