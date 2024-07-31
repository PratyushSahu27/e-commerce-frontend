import { createContext, useEffect, useState } from "react";

export const LoginContext = createContext(null);

const LoginContextProvider = (props) => {
  const serverIp = process.env.REACT_APP_SERVER_IP;
  const [loginState, setLoginState] = useState("User");
  const [user, setUser] = useState({});
  const [branch, setBranch] = useState({});

  function getUser() {
    fetch(serverIp + "/getuser", {
      method: "POST",
      headers: {
        Accept: "application/form-data",
        "auth-token": `${localStorage.getItem("auth-token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(),
    })
      .then((resp) => resp.json())
      .then((data) => {
        setUser(data);
      });
  }

  function getBranch() {
    fetch(serverIp + "/getbranch", {
      method: "POST",
      headers: {
        Accept: "application/form-data",
        "auth-token": `${localStorage.getItem("auth-token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(),
    })
      .then((resp) => resp.json())
      .then((data) => {
        setBranch(data);
      });
  }

  useEffect(() => {
    if (localStorage.getItem("auth-token")) {
      loginState === "User" ? getUser() : getBranch();
    }
  }, [serverIp]);

  const contextValue = {
    user,
    branch,
    loginState,
    setLoginState,
  };
  return (
    <LoginContext.Provider value={contextValue}>
      {props.children}
    </LoginContext.Provider>
  );
};

export default LoginContextProvider;
