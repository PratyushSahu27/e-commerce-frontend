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
      </div>
    </div>
  );
};

export default Hero;
