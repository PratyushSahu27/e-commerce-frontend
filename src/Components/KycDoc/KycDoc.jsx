import upload_area from "../Assets/upload_area.svg";
import VerifiedTick from "../../Components/VerfiedTickmark/VerifiedTickmark";

const KycDoc = ({
  idName,
  kycDetails,
  isDocUpdated,
  image,
  imageHandler,
  detailName,
  idType,
  idChangeHandler,
  children,
  errors,
}) => {
  return (
    <div className="input flex flex-col gap-8">
      <h3 className="font-semibold">{idName}</h3>
      <div className="image-input w-fit">
        {console.log(typeof image)}

        <label for={`${idType}-file-input`}>
          <img
            className="kyc-image"
            src={
              !isDocUpdated && kycDetails.details[detailName].image
                ? kycDetails.details[detailName].image
                : !image
                ? upload_area
                : typeof image === "object"
                ? URL.createObjectURL(image)
                : image
            }
            alt=""
          />
        </label>
        {console.log(image)}
        {kycDetails?.details[detailName]?.status !== "VERIFIED" &&
          kycDetails?.details[detailName]?.status !== "VERIFY" && (
            <input
              onChange={(e) => {
                imageHandler(e);
              }}
              type="file"
              name={idType}
              id={`${idType}-file-input`}
            />
          )}
      </div>
      {kycDetails?.details[detailName]?.status === "REJECTED" && (
        <div>
          <p className="text-md text-extrabold text-red-700">
            Verification Failed
          </p>
          <p className="text-sm text-extrabold text-black-600">
            Please re-upload document and send for verification
          </p>
          <p className="pt-4 text-sm font-semibold">
            <bold>Verifier Comments: &nbsp;&nbsp;</bold>{" "}
            {kycDetails?.details[detailName]?.verifierComments}
          </p>
        </div>
      )}
      {kycDetails?.details[detailName]?.status === "VERIFIED" && (
        <div className="flex flex-col">
          <VerifiedTick />
          <h3>Verified</h3>
        </div>
      )}

      {kycDetails?.details[detailName]?.status === "VERIFY" && (
        <div className="flex flex-col">
          <h3 className="font-extrabold text-green-800">
            Sent for verification
          </h3>
        </div>
      )}

      {idType !== "cheque" && idType !== "photo" && (
        <div className="flex flex-col">
          <label className="font-semibold text-sm" htmlFor={`${idType}-number`}>
            {idType.toUpperCase()} Number
          </label>
          <input
            name={`${idType}-number`}
            value={kycDetails?.details[detailName]?.idNumber}
            className={`text-gray-600 rounded text-sm w-56 border-2 ${
              errors[detailName] === "Yes"
                ? "border-red-600"
                : "border-grey-500"
            }`}
            onChange={(e) => {
              idChangeHandler(e, idType);
            }}
            disabled={
              kycDetails?.details[detailName]?.status === "VERIFY" ||
              kycDetails?.details[detailName]?.status === "VERIFIED"
            }
          />
        </div>
      )}

      {children}
    </div>
  );
};

export default KycDoc;
