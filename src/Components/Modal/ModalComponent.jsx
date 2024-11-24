import React from "react";

const Modal = ({
  title,
  message,
  isOpen,
  rejectMessage,
  isRejectEnabled = false,
  acceptMessage,
  submitHandler,
  type = "",
  loading,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-70"></div>
      <div className="bg-gray-800 text-white rounded-lg shadow-lg p-6 max-w-md w-11/12 md:w-full z-10">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p className="text-gray-300 mb-6">{message}</p>
        <div className="flex justify-end space-x-4">
          {isRejectEnabled && (
            <button
              className="bg-neutral-400 hover:bg-neutral-700 text-white font-semibold py-2 px-4 rounded"
              onClick={() => submitHandler("REJECT", type)}
              disabled={loading}
            >
              <p className="text-sm">{rejectMessage ?? "Cancel"}</p>
            </button>
          )}
          <button
            className="bg-lime-500 hover:bg-lime-700 text-white font-extrabold py-2 px-4 rounded "
            onClick={() => submitHandler("ACCEPT", type)}
            disabled={loading}
          >
            <p className="text-sm">{acceptMessage ?? "Confirm"}</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
