import { createContext, useEffect, useState } from "react";

export const LoginContext = createContext(null);

const LoginContextProvider = (props) => {
  const serverIp = process.env.REACT_APP_SERVER_IP;
  const [loginState, setLoginState] = useState("User");
  const [user, setUser] = useState({});
  const [isKycComplete, setIsKycComplete] = useState(false);
  const [branch, setBranch] = useState({});

  function getUserOrBranch() {
    fetch(serverIp + "/getuserorbranch", {
      method: "GET",
      headers: {
        Accept: "application/form-data",
        "auth-token": `${localStorage.getItem("auth-token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(),
    })
      .then((resp) => resp.json())
      .then((data) => {
        if (data.state === "User") {
          setUser(data.userData);
          setLoginState(data.state);
          fetch(serverIp + "/iskyccomplete", {
            method: "POST",
            headers: {
              Accept: "application/form-data",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ smId: data.userData.smId }),
          })
            .then((resp) => resp.json())
            .then((data) => {
              if (data.success) {
                setIsKycComplete(data.isKycComplete);
              }
            });
        } else if (data.state === "Branch") {
          setBranch(data.userData);
          setLoginState(data.state);
        }
      });
  }

  useEffect(() => {
    if (localStorage.getItem("auth-token")) {
      getUserOrBranch();
    }
  }, [loginState]);

  const contextValue = {
    user,
    branch,
    loginState,
    setLoginState,
    isKycComplete,
  };
  return (
    <LoginContext.Provider value={contextValue}>
      {props.children}
    </LoginContext.Provider>
  );
};

export default LoginContextProvider;
