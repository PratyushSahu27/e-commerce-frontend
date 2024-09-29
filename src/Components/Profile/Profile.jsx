import React, { useContext } from "react";
import "./Profile.css";
import { LoginContext } from "../../Context/LoginContext";
import { Button } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useNavigate } from "react-router-dom";
import BackButton from "../BackButton/BackButton";
import VerifiedTick from "../../Components/VerfiedTickmark/VerifiedTickmark";

const Profile = () => {
  const { user, branch, loginState, isKycComplete } = useContext(LoginContext);
  const referralLink = `https://shooramall.com/register?guideId=${user.smId}`;
  const navigate = useNavigate();
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
      <BackButton />
      <h2 className="font-extrabold m-12">Your Profile</h2>
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
        <>
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
          {!isKycComplete ? (
            <div className="kyc-button mt-8 flex gap-8 items-center">
              <p className="text-fuchsia-700 font-bold">
                Your KYC is incomplete.{" "}
              </p>
              <Button
                onClick={() => navigate("/kyc")}
                variant="outlined"
                size="large"
                className="text-black"
                color="secondary"
                sx={{ fontWeight: 650 }}
              >
                Complete KYC
              </Button>
            </div>
          ) : (
            <div className="flex mt-8 flex gap-4 items-center">
              <h3 className="font-bold">KYC Complete</h3>
              <VerifiedTick />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Profile;
