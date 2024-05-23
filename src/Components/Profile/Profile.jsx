import { ShopContext } from "../../Context/ShopContext";
import React, { useContext, useEffect, useState } from "react";
import "./Profile.css";

const Profile = () => {
  const { getUserData } = useContext(ShopContext);
  const user = getUserData();
  const hello = () => {
    console.log(user);
  };
  const profileLabelToObjectKeyMap = {
    "SM ID": "smId",
    Name: "name",
    "Guide ID": "guideId",
    "Phone Number": "phoneNumber",
    "Total Purchase Value collected": "total_pv",
    "Email Address": "email"
  };
  return (
    <div className="profile-outer-container">
      <h2>Your Profile</h2>
      {Object.keys(profileLabelToObjectKeyMap).map((key) => {
        return (
          <div className={`profile-detail profile-detail-${key}`} key={key}>
            <span className="profile-detail-key">{key}: </span>
            <span className="profile-detail-value">
              {user[profileLabelToObjectKeyMap[key]]}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default Profile;
