import React, { useContext, useEffect, useState } from "react";
import "./MyTeam.css";
import TeamLevel from "../../Components/TeamLevel/TeamLevel";
import { ShopContext } from "../../Context/ShopContext";

const MyTeam = () => {
  const serverIp = process.env.REACT_APP_SERVER_IP;
  const [team, setTeam] = useState([]);
  const { user } = useContext(ShopContext);
  const [noOfDirectJoinees, setNoOfDirectJoinees] = useState(0);
  const teamSize = 0;

  useEffect(() => {
    if (localStorage.getItem("auth-token")) {
      fetch(serverIp + "/getdirectjoinees", {
        method: "POST",
        headers: {
          Accept: "application/form-data",
          "auth-token": `${localStorage.getItem("auth-token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: {
            smId: user.smId,
          },
        }),
      })
        .then((resp) => resp.json())
        .then((data) => {
          setTeam(data.directJoinees);
          setNoOfDirectJoinees(data.directJoinees.length);
        });
    }
    for (let i = 0; i < 8; i++) {}
  }, [user]);
  return (
    <div className="my-team-outer-container">
      <h2>My Team</h2>
      <div className="user-information-block">
        <p>SM ID: {user.smId}</p>
        <p>Total Purchase Value(PV): {user.total_pv}</p>
        <p>Total Direct Joinees: {noOfDirectJoinees}</p>
        <p>Total Team Members: {teamSize}</p>
      </div>
      <TeamLevel level="1" team={team} />
      {/* <TeamLevel level="2" /> */}
      {/* <TeamLevel level="3" /> */}
      {/* <TeamLevel level="4" /> */}
    </div>
  );
};

export default MyTeam;
