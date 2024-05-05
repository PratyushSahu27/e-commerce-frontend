import React from "react";
import "./Hero.css";
import hero_image from "../Assets/hero_image.png";
import arrow_icon from "../Assets/arrow.png";
import { Link } from 'react-router-dom'
import Shoora from '../Assets/Shoora.png'

const Hero = () => {
  return (
    <div className="hero">
      <div className="hero-left">
        <h2>Welcome to Shoora Mall<img className="shoora" src={Shoora} alt="" /></h2>
        <h3 className="hindi-tagline"> आजीवन आय से यारी , करो  खरीदारी ।</h3>
        <div>
          <div className="hero-hand-icon">
            <p>Your one stop</p>
          </div>
          <p>destination for</p>
          <p>all everyday needs</p>
        </div>
        {/* <Link to='/login' style={{ textDecoration: 'none' }}>
          <div className="hero-latest-btn">
            <div>Register</div>
            <img src={arrow_icon} alt="" />
          </div>
        </Link> */}
      </div>
      {/* <div className="hero-right">
        <img src={hero_image} alt="hero" />
      </div> */}
    </div>
  );
};

export default Hero;
