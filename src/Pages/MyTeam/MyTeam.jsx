import React, { useContext, useEffect, useState } from "react";
import "./MyTeam.css";
import TeamLevel from "../../Components/TeamLevel/TeamLevel";
import { LoginContext } from "../../Context/LoginContext";
import BackButton from "../../Components/BackButton/BackButton";
import BinaryTree from "../../Components/BinaryTree/BinaryTree.tsx";

const MyTeam = () => {
  const serverIp = process.env.REACT_APP_SERVER_IP;
  const [team, setTeam] = useState({});
  const [parent, setParent] = useState("");
  const [teamSize, setTeamSize] = useState(0);
  const { user, loginState } = useContext(LoginContext);

  useEffect(() => {
    user &&
      user.smId &&
      fetch(serverIp + "/getusertree", {
        method: "POST",
        headers: {
          Accept: "application/form-data",
          "auth-token": `${localStorage.getItem("auth-token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          smId: user.smId,
        }),
      })
        .then((resp) => resp.json())
        .then((data) => {
          setParent(data.parent);
          setTeam(data.tree);
        });
  }, [serverIp, user]);

  return (
    <div className="my-team-outer-container">
      <BackButton />
      <h2 className="font-extrabold">My Team</h2>
      <div className="user-information-block">
        <p>SM ID: {user.smId}</p>
        {/* <p>Total Team Members: {teamSize}</p> */}
      </div>
      <BinaryTree parent={parent} currentSmId={user.smId} tree={team} />
    </div>
  );
};

export default MyTeam;
