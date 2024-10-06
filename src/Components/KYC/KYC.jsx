import BackButton from "../BackButton/BackButton";
import "./KYC.scss";
import React, { useContext, useState, useEffect } from "react";
import { LoginContext } from "../../Context/LoginContext";
import { Button } from "@mui/material";
import { toast } from "react-toastify";
import { toastConfigs } from "../../Utils/toast.util";
import KycDoc from "../../Components/KycDoc/KycDoc";
import { banksInIndia } from "../../Utils/kyc.util";

const KYC = () => {
  const { user } = useContext(LoginContext);
  const serverIp = process.env.REACT_APP_SERVER_IP;
  const [isAadhaarUpdated, setIsAadhaarUpdated] = useState(false);
  const [isPanUpdated, setIsPanUpdated] = useState(false);
  const [isChequeUpdated, setIsChequeUpdated] = useState(false);
  const [isPhotoUpdated, setIsPhotoUpdated] = useState(false);
  const [aadhaarImage, setAadhaarImage] = useState(false);
  const [panImage, setPanImage] = useState(false);
  const [chequeImage, setChequeImage] = useState(false);
  const [passPhoto, setPassPhoto] = useState(false);
  const [isFirstKycTry, setIsFirstKycTry] = useState(false);

  const [kycDetails, setKycDetails] = useState({
    smId: user.smId,
    details: {
      aadhaarDetails: {
        image: "",
        isVerified: false,
        idNumber: "",
        verifierComments: "",
        status: "",
      },
      panDetails: {
        image: "",
        isVerified: false,
        idNumber: "",
        verifierComments: "",
        status: "",
      },
      chequeDetails: {
        image: "",
        isVerified: false,
        accountNumber: "",
        bankName: "",
        ifsCode: "",
        verifierComments: "",
        status: "",
      },
      passportPhoto: {
        image: "",
        isVerified: false,
        idNumber: "",
        verifierComments: "",
        status: "",
      },
    },
  });

  const [errors, setErrors] = useState({});

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
          setAadhaarImage(data.details.details.aadhaarDetails.image);
          setPanImage(data.details.details.panDetails.image);
          setChequeImage(data.details.details.chequeDetails.image);
          setPassPhoto(data.details.details.passportPhoto.image);
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

  const passPhotoHandler = (e) => {
    if (!isFirstKycTry) {
      setIsPhotoUpdated(true);
    }
    setPassPhoto(e.target.files[0]);
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

  const validate = () => {
    let errors = {};
    let valid = true;
    if (
      (!aadhaarImage &&
        kycDetails.details.aadhaarDetails.status !== "VERIFY") ||
      (!panImage && kycDetails.details.panDetails.status !== "VERIFY") ||
      (!chequeImage && kycDetails.details.chequeDetails.status !== "VERIFY") ||
      (!passPhoto && kycDetails.details.passportPhoto.status !== "VERIFY")
    ) {
      toast.error("Upload all documents' images before submitting!");
      valid = false;
    }

    if (!kycDetails.details.aadhaarDetails.idNumber) {
      errors.aadhaarDetails = "Yes";
      valid = false;
    }

    if (!kycDetails.details.panDetails.idNumber) {
      errors.panDetails = "Yes";
      valid = false;
    }

    if (!kycDetails.details.chequeDetails.accountNumber) {
      errors.accountNumber = "Yes";
      valid = false;
    }

    if (!kycDetails.details.chequeDetails.bankName) {
      errors.bankName = "Yes";
      valid = false;
    }

    if (!kycDetails.details.chequeDetails.ifsCode) {
      errors.ifsCode = "Yes";
      valid = false;
    }

    if (!valid) toast.error("Enter all details!");
    setErrors(errors);

    return valid;
  };

  const onSendForVerification = async () => {
    if (!validate()) return;

    try {
      const promises = [];

      // Uploading Aadhar
      if (
        isFirstKycTry ||
        (isAadhaarUpdated && typeof aadhaarImage === "object")
      ) {
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
      if (isFirstKycTry || (isPanUpdated && typeof panImage === "object")) {
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
      if (
        isFirstKycTry ||
        (isChequeUpdated && typeof chequeImage === "object")
      ) {
        promises.push(uploadDocument("cheque", chequeImage));
      } else {
        promises.push(
          Promise.resolve({
            success: true,
            image_url: kycDetails.details.chequeDetails.image,
          })
        );
      }

      // Uploading passport photo
      if (isFirstKycTry || (isPhotoUpdated && typeof passPhoto === "object")) {
        promises.push(uploadDocument("passport-photo", passPhoto));
      } else {
        promises.push(
          Promise.resolve({
            success: true,
            image_url: kycDetails.details.passportPhoto.image,
          })
        );
      }

      const uploadResults = await Promise.all(promises);

      uploadResults.forEach((result) => {
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
          passportPhoto: {
            ...kycDetails.details.passportPhoto,
            image: uploadResults[3].image_url, // Cheque image URL
            status: kycDetails.details.passportPhoto.isVerified
              ? kycDetails.details.passportPhoto.status
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
            setIsPhotoUpdated(false);

            toast.success("Sent for verification", toastConfigs);
          } else {
            toast.error("Error uploading kyc details", toastConfigs);
          }
        });
    } catch (error) {
      toast.error(error.message || "An error occurred", toastConfigs);
    }
  };

  const idChangeHandler = (e, type) => {
    switch (type) {
      case "aadhaar":
        setKycDetails((prev) => {
          return {
            ...prev,
            details: {
              ...prev.details,
              aadhaarDetails: {
                ...prev.details.aadhaarDetails,
                idNumber: e.target.value,
              },
            },
          };
        });
        setIsAadhaarUpdated(true);
        break;

      case "pan":
        setKycDetails((prev) => {
          return {
            ...prev,
            details: {
              ...prev.details,
              panDetails: {
                ...prev.details.panDetails,
                idNumber: e.target.value,
              },
            },
          };
        });
        setIsPanUpdated(true);
        break;

      default:
        break;
    }
  };

  return (
    <div className="kyc-outer-container">
      <div className="flex w-full items-start">
        <BackButton className="mx-12" />
      </div>
      <h2 className="font-extrabold">Know your Customer</h2>
      <h4 className="w-full text-black text-red-700">
        Maximum file size allowed is 1MB
      </h4>
      <div className="inputs w-full flex flex-col my-12 gap-8 justify-between grid grid-cols-1 md:grid-cols-2">
        <KycDoc
          idName="Passport-size Photo"
          kycDetails={kycDetails}
          isDocUpdated={isPhotoUpdated}
          image={passPhoto}
          imageHandler={passPhotoHandler}
          detailName="passportPhoto"
          idType="photo"
          errors={errors}
        />
        <KycDoc
          idName="Aadhaar Card"
          kycDetails={kycDetails}
          isDocUpdated={isAadhaarUpdated}
          image={aadhaarImage}
          imageHandler={aadhaarImageHandler}
          idChangeHandler={idChangeHandler}
          detailName="aadhaarDetails"
          idType="aadhaar"
          errors={errors}
        />
        <KycDoc
          idName="PAN Card"
          kycDetails={kycDetails}
          isDocUpdated={isPanUpdated}
          image={panImage}
          imageHandler={panImageHandler}
          idChangeHandler={idChangeHandler}
          detailName="panDetails"
          idType="pan"
          errors={errors}
        />
        <KycDoc
          idName="Bank Details (Upload cancelled cheque)"
          kycDetails={kycDetails}
          isDocUpdated={isChequeUpdated}
          image={chequeImage}
          imageHandler={chequeImageHandler}
          detailName="chequeDetails"
          idType="cheque"
        >
          <div className="flex flex-col">
            <label className="font-semibold text-sm" htmlFor="comments">
              Bank Name
            </label>
            <select
              name="comments"
              value={kycDetails?.details.chequeDetails?.bankName}
              disabled={
                kycDetails?.details.chequeDetails?.status === "VERIFY" ||
                kycDetails?.details.chequeDetails?.status === "VERIFIED"
              }
              className={`text-gray-600 rounded text-sm w-56 border-2 ${
                errors["bankName"] === "Yes"
                  ? "border-red-600"
                  : "border-grey-500"
              }`}
              onChange={(e) => {
                setIsChequeUpdated(true);
                setKycDetails((prev) => {
                  return {
                    ...prev,
                    details: {
                      ...prev.details,
                      chequeDetails: {
                        ...prev.details.chequeDetails,
                        bankName: e.target.value,
                      },
                    },
                  };
                });
              }}
            >
              <option value="">Select State</option>
              {banksInIndia.map((bank, index) => (
                <option key={index} value={bank}>
                  {bank}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <label className="font-semibold text-sm" htmlFor="comments">
              Account Number
            </label>
            <input
              name="comments"
              type="number"
              value={kycDetails?.details.chequeDetails?.accountNumber}
              disabled={
                kycDetails?.details.chequeDetails?.status === "VERIFY" ||
                kycDetails?.details.chequeDetails?.status === "VERIFIED"
              }
              className={`text-gray-600 rounded text-sm w-56 border-2 ${
                errors["accountNumber"] === "Yes"
                  ? "border-red-600"
                  : "border-grey-500"
              }`}
              onChange={(e) => {
                setIsChequeUpdated(true);
                setKycDetails((prev) => {
                  return {
                    ...prev,
                    details: {
                      ...prev.details,
                      chequeDetails: {
                        ...prev.details.chequeDetails,
                        accountNumber: e.target.value,
                      },
                    },
                  };
                });
              }}
            />
          </div>
          <div className="flex flex-col">
            <label className="font-semibold text-sm" htmlFor="comments">
              IFS Code
            </label>
            <input
              name="comments"
              value={kycDetails?.details.chequeDetails?.ifsCode}
              disabled={
                kycDetails?.details.chequeDetails?.status === "VERIFY" ||
                kycDetails?.details.chequeDetails?.status === "VERIFIED"
              }
              className={`text-gray-600 rounded text-sm w-56 border-2 ${
                errors["ifsCode"] === "Yes"
                  ? "border-red-600"
                  : "border-grey-500"
              }`}
              onChange={(e) => {
                setIsChequeUpdated(true);
                setKycDetails((prev) => {
                  return {
                    ...prev,
                    details: {
                      ...prev.details,
                      chequeDetails: {
                        ...prev.details.chequeDetails,
                        ifsCode: e.target.value,
                      },
                    },
                  };
                });
              }}
            />
          </div>
        </KycDoc>
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
