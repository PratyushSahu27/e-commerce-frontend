import React from "react";
import "./Footer.css";

import footer_logo from "../Assets/shoormall-logo-final-transparent.png";
import instagram_icon from "../Assets/instagram_icon.png";
import whatsapp_icon from "../Assets/whatsapp_icon.png";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <div className="footer">
      <div className="footer-logo">
        <img src={footer_logo} alt="" />
      </div>
      <ul className="footer-links">
        {/* <li>Products</li> */}
        <li key="about">
          <button onClick={() => navigate("/about")}>About</button>
        </li>
        <li key="offices">
          <button onClick={() => navigate("/offices")}>Contact Us</button>
        </li>
        <li key="contactus">
          <button onClick={() => navigate("/T&C")}>Terms and Conditions</button>
        </li>
        <li key="privacy">
          <button onClick={() => navigate("/privacy_policy")}>
            Privacy Policy
          </button>
        </li>
        <li key="refund">
          <button onClick={() => navigate("/refund_policy")}>
            Refund Policy
          </button>
        </li>
        <li key="shipping">
          <button onClick={() => navigate("/shipping_policy")}>
            Shipping Policy
          </button>
        </li>
      </ul>
      <div className="footer-social-icons">
        <div className="footer-icons-container">
          <img src={instagram_icon} alt="" />
        </div>
        <div className="footer-icons-container">
          <img src={whatsapp_icon} alt="" />
        </div>
      </div>
      <div className="footer-copyright">
        <hr />
        <p>Copyright @ 2024 - All Right Reserved.</p>
      </div>
    </div>
  );
};

export default Footer;
