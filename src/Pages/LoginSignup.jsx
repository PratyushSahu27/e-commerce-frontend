import React, { useContext, useEffect, useState } from "react";
import "./CSS/LoginSignup.css";
import RegistrationForm from "../Components/RegistrationForm/RegistrationForm";
import { ShopContext } from "../Context/ShopContext";
import { LoginContext } from "../Context/LoginContext";

const LoginSignup = () => {
  const [state, setState] = useState("Login");
  const { addAllToCart } = useContext(ShopContext);
  const { loginState, setLoginState } = useContext(LoginContext);
  const serverIp = process.env.REACT_APP_SERVER_IP;
  const [formData, setFormData] = useState({
    smId: "",
    branch_id: "",
    password: "",
  });

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const login = async () => {
    const route = loginState === "User" ? "/login" : "/branchlogin";
    let dataObj;
    await fetch(serverIp + route, {
      method: "POST",
      headers: {
        Accept: "application/form-data",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((resp) => resp.json())
      .then((data) => {
        dataObj = data;
      });
    console.log(dataObj);
    if (dataObj.success) {
      localStorage.setItem("auth-token", dataObj.token);
      loginState === "User"
        ? addAllToCart().then(() => window.location.replace("/"))
        : window.location.replace("/");
    } else {
      alert(dataObj.errors);
    }
  };

  return (
    <div className="loginsignup">
      <div className="loginsignup-container">
        <h1>{state === "Login" ? "Log In" : "Register"}</h1>
        {state === "Login" && (
          <>
            <div className="loginsignup-fields">
              {loginState === "User" ? (
                <input
                  type="text"
                  placeholder="SM ID"
                  name="smId"
                  value={formData.smId}
                  onChange={changeHandler}
                />
              ) : (
                <input
                  type="text"
                  placeholder="Branch ID"
                  name="branch_id"
                  value={formData.branch_id}
                  onChange={changeHandler}
                />
              )}
              <input
                type="password"
                placeholder="Password"
                name="password"
                value={formData.password}
                onChange={changeHandler}
              />
            </div>

            <button
              onClick={() => {
                login();
              }}
            >
              Login
            </button>

            <p className="loginsignup-login">
              Create an account?{" "}
              <span
                onClick={() => {
                  setState("Sign Up");
                }}
              >
                Click here
              </span>
            </p>
            <p className="loginsignup-login">
              Login as {"  "}
              {loginState === "User" ? (
                <span
                  onClick={() => {
                    setLoginState("Branch");
                  }}
                >
                  Branch
                </span>
              ) : (
                <span
                  onClick={() => {
                    setLoginState("User");
                  }}
                >
                  User
                </span>
              )}
            </p>
          </>
        )}
        {state === "Sign Up" && <RegistrationForm setState={setState} />}
      </div>
    </div>
  );
};

export default LoginSignup;
