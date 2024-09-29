import BackButton from "../BackButton/BackButton";
import "./KYC.scss";
import React, { useContext, useState, useEffect } from "react";
import upload_area from "../Assets/upload_area.svg";
import { LoginContext } from "../../Context/LoginContext";
import { Button } from "@mui/material";
import { toast } from "react-toastify";
import { toastConfigs } from "../../Utils/toast.util";
import VerifiedTick from "../../Components/VerfiedTickmark/VerifiedTickmark";

const KYC = () => {
  const { user } = useContext(LoginContext);
  const serverIp = process.env.REACT_APP_SERVER_IP;
  const [isAadhaarUpdated, setIsAadhaarUpdated] = useState(false);
  const [isPanUpdated, setIsPanUpdated] = useState(false);
  const [isChequeUpdated, setIsChequeUpdated] = useState(false);
  const [aadhaarImage, setAadhaarImage] = useState(false);
  const [panImage, setPanImage] = useState(false);
  const [chequeImage, setChequeImage] = useState(false);
  const [isFirstKycTry, setIsFirstKycTry] = useState(false);

  const [kycDetails, setKycDetails] = useState({
    smId: user.smId,
    details: {
      aadhaarDetails: {
        image: "",
        isVerified: false,
        idNumber: "",
        verifierComments: "",
      },
      panDetails: {
        image: "",
        isVerified: false,
        idNumber: "",
        verifierComments: "",
      },
      chequeDetails: {
        image: "",
        isVerified: false,
        idNumber: "",
        verifierComments: "",
      },
    },
  });

  useEffect(() => {
    getKycInfo();
  }, [user]);

  const getKycInfo = () => {
    fetch(serverIp + "/getkycdetails", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ smId: user.smId }),
    })
      .then((resp) => resp.json())
      .then((data) => {
        if (data.details) {
          setKycDetails(data.details);
        } else {
          setIsFirstKycTry(true);
        }
      });
  };

  const aadhaarImageHandler = (e) => {
    if (!isFirstKycTry) {
      setIsAadhaarUpdated(true);
    }
    setAadhaarImage(e.target.files[0]);
  };

  const panImageHandler = (e) => {
    if (!isFirstKycTry) {
      setIsPanUpdated(true);
    }
    setPanImage(e.target.files[0]);
  };

  const chequeImageHandler = (e) => {
    if (!isFirstKycTry) {
      setIsChequeUpdated(true);
    }
    setChequeImage(e.target.files[0]);
  };

  const uploadDocument = async (idType, image) => {
    const formData = new FormData();
    formData.append("smId", user.smId);
    formData.append("idType", idType);
    formData.append("kycdocument", image);

    const response = await fetch(`${serverIp}/uploadkycdocs`, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: formData,
    });

    return response.json();
  };

  const onSendForVerification = async () => {
    if (
      (!aadhaarImage && !kycDetails.details.aadhaarDetails.isVerified) ||
      (!panImage && !kycDetails.details.panDetails.isVerified) ||
      (!chequeImage && !kycDetails.details.chequeDetails.isVerified)
    ) {
      alert("Upload all documents before submitting!");
      return;
    }

    try {
      const promises = [];

      // Uploading Aadhar
      if (isFirstKycTry || isAadhaarUpdated) {
        promises.push(uploadDocument("aadhaar", aadhaarImage));
      } else {
        promises.push(
          Promise.resolve({
            success: true,
            image_url: kycDetails.details.aadhaarDetails.image,
          })
        );
      }

      // Uploading PAN Card
      if (isFirstKycTry || isPanUpdated) {
        promises.push(uploadDocument("pan", panImage));
      } else {
        promises.push(
          Promise.resolve({
            success: true,
            image_url: kycDetails.details.panDetails.image,
          })
        );
      }

      // Uploading cheque
      if (isFirstKycTry || isChequeUpdated) {
        promises.push(uploadDocument("cheque", chequeImage));
      } else {
        promises.push(
          Promise.resolve({
            success: true,
            image_url: kycDetails.details.chequeDetails.image,
          })
        );
      }

      const uploadResults = await Promise.all(promises);

      uploadResults.forEach((result, idx) => {
        if (!result.success) {
          toast.error(
            "Failed uploading documents, please retry.",
            toastConfigs
          );
          return;
        }
      });

      const updatedKycDetails = {
        ...kycDetails,
        details: {
          ...kycDetails.details,
          aadhaarDetails: {
            ...kycDetails.details.aadhaarDetails,
            image: uploadResults[0].image_url, // Aadhaar image URL
            status: kycDetails.details.aadhaarDetails.isVerified
              ? kycDetails.details.aadhaarDetails.status
              : "VERIFY",
          },
          panDetails: {
            ...kycDetails.details.panDetails,
            image: uploadResults[1].image_url, // PAN image URL
            status: kycDetails.details.panDetails.isVerified
              ? kycDetails.details.panDetails.status
              : "VERIFY",
          },
          chequeDetails: {
            ...kycDetails.details.chequeDetails,
            image: uploadResults[2].image_url, // Cheque image URL
            status: kycDetails.details.chequeDetails.isVerified
              ? kycDetails.details.chequeDetails.status
              : "VERIFY",
          },
        },
      };

      setKycDetails(updatedKycDetails);

      fetch(`${serverIp}/publishkyc`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ kycDetails: updatedKycDetails }),
      })
        .then((resp) => resp.json())
        .then((data) => {
          if (data.success) {
            setIsFirstKycTry(false);
            setIsAadhaarUpdated(false);
            setIsChequeUpdated(false);
            setIsPanUpdated(false);

            toast.success("Sent for verification", toastConfigs);
          } else {
            toast.error("Error uploading kyc details", toastConfigs);
          }
        });
    } catch (error) {
      toast.error(error.message || "An error occurred", toastConfigs);
    }
  };

  return (
    <div className="kyc-outer-container">
      <div className="flex w-full items-start">
        <BackButton className="mx-12" />
      </div>
      <h2 className="font-extrabold">Know your Customer</h2>
      <h4 className="w-full text-black text-red-700">
        Maximum file size allowed is 5MB
      </h4>
      <div className="inputs w-full flex flex-col my-12 gap-4 justify-between grid grid-cols-1 md:grid-cols-3">
        <div className="input flex flex-col gap-8">
          <h3 className="font-semibold">Aadhar Card</h3>
          <div className="image-input w-fit">
            <label for="aadhaar-file-input">
              <img
                className="kyc-image"
                src={
                  !isAadhaarUpdated && kycDetails.details.aadhaarDetails.image
                    ? kycDetails.details.aadhaarDetails.image
                    : !aadhaarImage
                    ? upload_area
                    : URL.createObjectURL(aadhaarImage)
                }
                alt=""
              />
            </label>
            {kycDetails?.details?.aadhaarDetails?.status !== "VERIFIED" &&
              kycDetails?.details?.aadhaarDetails?.status !== "VERIFY" && (
                <input
                  onChange={(e) => {
                    aadhaarImageHandler(e);
                  }}
                  type="file"
                  name="aadhaar"
                  id="aadhaar-file-input"
                />
              )}
          </div>
          {kycDetails?.details?.aadhaarDetails?.status === "REJECTED" && (
            <div>
              <p className="text-md text-extrabold text-red-700">
                Verification Failed
              </p>
              <p className="text-sm text-extrabold text-black-600">
                Please re-upload document and send for verification
              </p>
              <p className="pt-4 text-sm font-semibold">
                <bold>Verifier Comments: &nbsp;&nbsp;</bold>{" "}
                {kycDetails?.details?.aadhaarDetails?.verifierComments}
              </p>
            </div>
          )}
          {kycDetails?.details?.aadhaarDetails?.status === "VERIFIED" && (
            <div className="flex flex-col">
              <VerifiedTick />
              <h3>Verified</h3>
            </div>
          )}

          {kycDetails?.details?.aadhaarDetails?.status === "VERIFY" && (
            <div className="flex flex-col">
              <h3 className="font-extrabold">Sent for verification</h3>
            </div>
          )}
        </div>
        <div className="input flex flex-col gap-8">
          <h3 className="font-semibold">PAN Card</h3>
          <div className="image-input w-fit">
            <label for="pan-file-input">
              <img
                className="kyc-image"
                src={
                  !isPanUpdated && kycDetails.details.panDetails.image
                    ? kycDetails.details.panDetails.image
                    : !panImage
                    ? upload_area
                    : URL.createObjectURL(panImage)
                }
                alt=""
              />
            </label>
            {kycDetails?.details?.panDetails?.status !== "VERIFIED" &&
              kycDetails?.details?.panDetails?.status !== "VERIFY" && (
                <input
                  onChange={(e) => {
                    panImageHandler(e);
                  }}
                  type="file"
                  name="pan"
                  id="pan-file-input"
                />
              )}
          </div>
          {kycDetails?.details?.panDetails?.status === "REJECTED" && (
            <div>
              <p className="text-md text-extrabold text-red-700">
                Verification Failed
              </p>
              <p className="text-sm text-extrabold text-black-600">
                Please re-upload document and send for verification
              </p>
              <p className="pt-4 text-sm font-semibold">
                <bold>Verifier Comments: &nbsp;&nbsp;</bold>{" "}
                {kycDetails?.details?.panDetails?.verifierComments}
              </p>
            </div>
          )}
          {kycDetails?.details?.panDetails?.status === "VERIFIED" && (
            <div className="flex flex-col">
              <VerifiedTick />
              <h3>Verified</h3>
            </div>
          )}

          {kycDetails?.details?.panDetails?.status === "VERIFY" && (
            <div className="flex flex-col">
              <h3 className="font-extrabold">Sent for verification</h3>
            </div>
          )}
        </div>
        <div className="input flex flex-col gap-8">
          <h3 className="font-semibold">
            Bank Details (Upload cancelled cheque)
          </h3>
          <div className="image-input w-fit">
            <label for="cheque-file-input">
              <img
                className="kyc-image"
                src={
                  !isChequeUpdated && kycDetails.details.chequeDetails.image
                    ? kycDetails.details.chequeDetails.image
                    : !chequeImage
                    ? upload_area
                    : URL.createObjectURL(chequeImage)
                }
                alt=""
              />
            </label>
            {kycDetails?.details?.chequeDetails?.status !== "VERIFIED" &&
              kycDetails?.details?.chequeDetails?.status !== "VERIFY" && (
                <input
                  onChange={(e) => {
                    chequeImageHandler(e);
                  }}
                  type="file"
                  name="cheque"
                  id="cheque-file-input"
                />
              )}
          </div>
          {kycDetails?.details?.chequeDetails?.status === "REJECTED" && (
            <div>
              <p className="text-md text-extrabold text-red-700">
                Verification Failed
              </p>
              <p className="text-sm text-extrabold text-black-600">
                Please re-upload document and send for verification
              </p>
              <p className="pt-4 text-sm font-semibold">
                <bold>Verifier Comments: &nbsp;&nbsp;</bold>{" "}
                {kycDetails?.details?.chequeDetails?.verifierComments}
              </p>
            </div>
          )}
          {kycDetails?.details?.chequeDetails?.status === "VERIFIED" && (
            <div className="flex flex-col">
              <VerifiedTick />
              <h3>Verified</h3>
            </div>
          )}

          {kycDetails?.details?.chequeDetails?.status === "VERIFY" && (
            <div className="flex flex-col">
              <h3 className="font-extrabold">Sent for verification</h3>
            </div>
          )}
        </div>
      </div>
      <Button
        variant="contained"
        size="large"
        disabled={
          !isFirstKycTry &&
          !isAadhaarUpdated &&
          !isPanUpdated &&
          !isChequeUpdated
        }
        sx={{
          backgroundColor: "white",
          color: "#004a94",
          fontWeight: "bold",
          "&:hover": {
            backgroundColor: "rgba(130,39,103, 0.2)",
          },
        }}
        onClick={() => onSendForVerification()}
      >
        Send for verification
      </Button>
    </div>
  );
};

export default KYC;
