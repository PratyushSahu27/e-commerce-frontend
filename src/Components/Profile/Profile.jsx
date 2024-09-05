import React, { useContext } from "react";
import "./Profile.css";
import { LoginContext } from "../../Context/LoginContext";
import { Button } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

const Profile = () => {
  const { user, branch, loginState } = useContext(LoginContext);
  const referralLink = `https://shooramall.com/register?guideId=${user.smId}`;
  const profileLabelToObjectKeyMap =
    loginState === "User"
      ? {
          "SM ID": "smId",
          Name: "name",
          "Guide ID": "guideId",
          "Phone Number": "phoneNumber",
          "Total Purchase Value collected": "total_pv",
          "Email Address": "email",
        }
      : {
          "Branch ID": "branch_id",
          "Branch Name": "branch_name",
          Address: "address.address",
          Landmark: "address.landmark",
          City: "address.city",
          State: "address.state",
          Pincode: "address.pincode",
          GSTIN: "gst_no",
          "FSSAI License Number": "fssai_no",
        };

  function getNestedValue(obj, path) {
    return path.split(".").reduce((acc, part) => acc && acc[part], obj);
  }

  return (
    <div className="profile-outer-container">
      <h2 className="font-extrabold">Your Profile</h2>
      {Object.keys(profileLabelToObjectKeyMap).map((key) => {
        return (
          <div className={`profile-detail profile-detail-${key}`} key={key}>
            <span className="profile-detail-key">{key}: </span>
            <span className="profile-detail-value">
              {loginState === "User"
                ? user[profileLabelToObjectKeyMap[key]]
                : getNestedValue(branch, profileLabelToObjectKeyMap[key])}
            </span>
          </div>
        );
      })}
      {loginState === "User" && (
        <div className="mt-8">
          <h3 className="text-teal-500">Your Referral Link</h3>
          <input
            className="text-xs sm:w-30 md:w-40 lg:w-72 p-2 m-4"
            type="text"
            value={referralLink}
            readOnly
          />
          <Button
            onClick={() => navigator.clipboard.writeText(referralLink)}
            variant="contained"
            endIcon={<ContentCopyIcon />}
            size="small"
            className="text-black"
          >
            Copy Link
          </Button>
        </div>
      )}
    </div>
  );
};

export default Profile;
