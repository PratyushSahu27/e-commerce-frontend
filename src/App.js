import Navbar from "./Components/Navbar/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Shop from "./Pages/Shop";
import Cart from "./Pages/Cart";
import Product from "./Pages/Product";
import Footer from "./Components/Footer/Footer";
import ShopCategory from "./Pages/ShopCategory";
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

function App() {
  return (
    <div>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Shop gender="all" />} />
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
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
