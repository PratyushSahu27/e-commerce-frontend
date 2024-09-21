import React, { useContext, useEffect, useState } from "react";
import "./MyTeam.css";
import TeamLevel from "../../Components/TeamLevel/TeamLevel";
import { LoginContext } from "../../Context/LoginContext";
import BackButton from "../../Components/BackButton/BackButton";

const MyTeam = () => {
  const serverIp = process.env.REACT_APP_SERVER_IP;
  const [team, setTeam] = useState([]);
  const [noOfDirectJoinees, setNoOfDirectJoinees] = useState(0);
  const [teamSize, setTeamSize] = useState(0);
  const { user, loginState } = useContext(LoginContext);

  useEffect(() => {
    const tempTeam = [];
    user &&
      user.smId &&
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
          tempTeam.push(data.directJoinees);
          setNoOfDirectJoinees(data.directJoinees.length);
          setTeamSize(data.directJoinees.length);
        })
        .then(() => {
          let promise = Promise.resolve();
          for (let i = 0; i < 8; i++) {
            promise = promise
              .then(() => {
                let promises = [];
                let newLevel = [];
                if (tempTeam[i]?.length > 0) {
                  promises = tempTeam[i].map(async (member) => {
                    const response = await fetch(
                      serverIp + "/getdirectjoinees",
                      {
                        method: "POST",
                        headers: {
                          Accept: "application/form-data",
                          "auth-token": `${localStorage.getItem("auth-token")}`,
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          user: {
                            smId: member.smId,
                          },
                        }),
                      }
                    );
                    const data = await response.json();
                    newLevel = [...newLevel, ...data.directJoinees];
                  });
                }
                return Promise.all(promises).then(() => {
                  if (newLevel.length !== 0) {
                    tempTeam.push(newLevel);
                  }
                  setTeamSize((prevSize) => prevSize + newLevel.length);
                });
              })
              .finally(() => {
                setTeam(tempTeam);
              });
          }
        });
  }, [serverIp, user]);

  return (
    <div className="my-team-outer-container">
      <BackButton />
      <h2 className="font-extrabold">My Team</h2>
      <div className="user-information-block">
        <p>SM ID: {user.smId}</p>
        <p>Total Purchase Value(PV): {user.total_pv}</p>
        <p>Total Direct Joinees: {noOfDirectJoinees}</p>
        <p>Total Team Members: {teamSize}</p>
      </div>
      {team.length > 0 &&
        team.map((level, index) => {
          return <TeamLevel key={index} level={index + 1} team={level} />;
        })}
    </div>
  );
};

export default MyTeam;
