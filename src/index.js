import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import ShopContextProvider from "./Context/ShopContext";
import LoginContextProvider from "./Context/LoginContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <LoginContextProvider>
    <ShopContextProvider>
      <App />
    </ShopContextProvider>
  </LoginContextProvider>
);
