import React, { useState } from "react";
import "./CSS/LoginSignup.css";
import RegistrationForm from "../Components/RegistrationForm/RegistrationForm";

const LoginSignup = () => {
  const [state, setState] = useState("Login");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const login = async () => {
    let dataObj;
    await fetch("http://162.240.173.162:8080/login", {
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
      window.location.replace("/");
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
              <input
                type="email"
                placeholder="Email address"
                name="email"
                value={formData.email}
                onChange={changeHandler}
              />
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
          </>
        )}
        {state === "Sign Up" && <RegistrationForm setState={setState} />}
      </div>
    </div>
  );
};

export default LoginSignup;
