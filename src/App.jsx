import Navbar from "./Components/Navbar/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Shop from "./Pages/Shop";
import Cart from "./Pages/Cart";
import Product from "./Pages/Product";
import Footer from "./Components/Footer/Footer";
import LoginSignup from "./Pages/LoginSignup";
import Profile from "./Components/Profile/Profile";
import Checkout from "./Pages/Checkout";
import MyTeam from "./Pages/MyTeam/MyTeam";
import Orders from "./Pages/Orders/Orders";
import About from "./Pages/About/About";
import ContactUs from "./Pages/ContactUs/ContactUs";
import Offices from "./Pages/Offices/Offices";
import TnC from "./Pages/TnC/TnC";
import PrivacyPolicy from "./Pages/PrivacyPolicy/PrivacyPolicy.jsx";
import RefundPolicy from "./Pages/RefundPolicy/RefundPolicy.jsx";
import ShippingPolicy from "./Pages/ShippingPolicy/ShippingPolicy.jsx";
import { useState } from "react";
import PaymentHandler from "./Components/PaymentHandler/PaymentHandler";
import OrderDetails from "./Components/OrderDetails/OrderDetails";

function App() {
  const [category, setCategory] = useState();
  return (
    <div>
      <Router>
        <Navbar setCategory={setCategory} />
        <Routes>
          <Route path="/" element={<Shop category={category} />} />
          <Route path="/product" element={<Product />}>
            <Route path=":productId" element={<Product />} />
          </Route>
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<LoginSignup />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/myteam" element={<MyTeam />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/about" element={<About />} />
          <Route path="/contactus" element={<ContactUs />} />
          <Route path="/offices" element={<Offices />} />
          <Route path="/T&C" element={<TnC />} />
          <Route path="/privacy_policy" element={<PrivacyPolicy />} />
          <Route path="/refund_policy" element={<RefundPolicy />} />
          <Route path="/shipping_policy" element={<ShippingPolicy />} />
          <Route path="/paymenthandler" element={<PaymentHandler />} />
          <Route path="order" element={<OrderDetails />}>
            <Route path=":orderId" element={<OrderDetails />} />
          </Route>
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
