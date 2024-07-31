import React from "react";
import "./Hero.css";
import Shoora from "../Assets/Shoora.png";

const Hero = () => {
  return (
    <div className="hero flex-col">
      <div className="hero-left pt-4">
        <h2>Welcome to Shoora Mall</h2>
        <img className="shoora" src={Shoora} alt="" />
      </div>
      <h3 className="hindi-tagline font-extrabold">
        {" "}
        आजीवन आय से यारी , करो खरीदारी ।
      </h3>
    </div>
  );
};

export default Hero;
