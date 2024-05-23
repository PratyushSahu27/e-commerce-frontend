import React, { useContext, useRef, useState } from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";
import logo from "../Assets/logo.png";
import { ShopContext } from "../../Context/ShopContext";
import nav_dropdown from "../Assets/nav_dropdown.png";
import Dropdown from "../Dropdown/Dropdown";

const Navbar = (props) => {
  let [menu, setMenu] = useState("shop");
  const { getTotalCartItems } = useContext(ShopContext);

  const menuRef = useRef();

  const dropdownItems = [
    {
      id: 1,
      value: "My Profile",
    },
    {
      id: 2,
      value: "Orders",
    },
    {
      id: 3,
      value: "Addresses",
    },
    {
      id: 4,
      value: "My Team",
    },
    {
      id: 0,
      value: "Logout",
    },
  ];

  const dropdown_toggle = (e) => {
    menuRef.current.classList.toggle("nav-menu-visible");
    e.target.classList.toggle("open");
  };

  return (
    <div className="nav">
      <Link
        to="/"
        onClick={() => {
          setMenu("shop");
        }}
        style={{ textDecoration: "none" }}
        className="nav-logo"
      >
        <img src={logo} alt="logo" />
        <p>Shoora Mall</p>
      </Link>
      <img
        onClick={dropdown_toggle}
        className="nav-dropdown"
        src={nav_dropdown}
        alt=""
      />
      <ul ref={menuRef} className="nav-menu">
        <li
          onClick={() => {
            setMenu("shop");
          }}
        >
          <Link to="/" style={{ textDecoration: "none" }}>
            Shop
          </Link>
          {menu === "shop" ? <hr /> : <></>}
        </li>
        <li
          onClick={() => {
            setMenu("mens");
          }}
        >
          <Link to="/mens" style={{ textDecoration: "none" }}>
            Grocery
          </Link>
          {menu === "mens" ? <hr /> : <></>}
        </li>
        <li
          onClick={() => {
            setMenu("womens");
          }}
        >
          <Link to="/womens" style={{ textDecoration: "none" }}>
            Apparels
          </Link>
          {menu === "womens" ? <hr /> : <></>}
        </li>
        {/* <li onClick={()=>{setMenu("kids")}}><Link to='/kids' style={{ textDecoration: 'none' }}>Kids</Link>{menu==="kids"?<hr/>:<></>}</li> */}
      </ul>
      <div className="nav-login-cart">
        {localStorage.getItem("auth-token") ? (
          <Dropdown items={dropdownItems}></Dropdown>
        ) : (
          <Link to="/login" style={{ textDecoration: "none" }}>
            <button className="login-button">Login</button>
          </Link>
        )}
        <Link to="/cart">
          <svg
            fill="#ffffff"
            width="32px"
            height="32px"
            viewBox="0 0 902.86 902.86"
          >
            <g>
              <g>
                <path
                  d="M671.504,577.829l110.485-432.609H902.86v-68H729.174L703.128,179.2L0,178.697l74.753,399.129h596.751V577.829z
			 M685.766,247.188l-67.077,262.64H131.199L81.928,246.756L685.766,247.188z"
                />
                <path
                  d="M578.418,825.641c59.961,0,108.743-48.783,108.743-108.744s-48.782-108.742-108.743-108.742H168.717
			c-59.961,0-108.744,48.781-108.744,108.742s48.782,108.744,108.744,108.744c59.962,0,108.743-48.783,108.743-108.744
			c0-14.4-2.821-28.152-7.927-40.742h208.069c-5.107,12.59-7.928,26.342-7.928,40.742
			C469.675,776.858,518.457,825.641,578.418,825.641z M209.46,716.897c0,22.467-18.277,40.744-40.743,40.744
			c-22.466,0-40.744-18.277-40.744-40.744c0-22.465,18.277-40.742,40.744-40.742C191.183,676.155,209.46,694.432,209.46,716.897z
			 M619.162,716.897c0,22.467-18.277,40.744-40.743,40.744s-40.743-18.277-40.743-40.744c0-22.465,18.277-40.742,40.743-40.742
			S619.162,694.432,619.162,716.897z"
                />
              </g>
            </g>
          </svg>
        </Link>
        <div className="nav-cart-count">{getTotalCartItems()}</div>
      </div>
    </div>
  );
};

export default Navbar;
