import { useNavigate, useLocation } from "react-router-dom";
import { ShopContext } from "../../Context/ShopContext";
import "./PaymentHandler.scss";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { LoginContext } from "../../Context/LoginContext";

const PaymentHandler = ({
  setIsPaymentInitiated,
  orderId,
  setPaymentMode,
  buyer,
}) => {
  const queryParams = new URLSearchParams(useLocation().search);
  const [paymentMethod, setPaymentMethod] = useState("PhonePe");
  const [paymentStatus, setPaymentStatus] = useState(queryParams.get("status"));
  const [merchantTransactionId, setMerchantTransactionId] = useState(
    queryParams.get("merchantTransactionId")
  );
  const [isTransactionSuccess, setIsTransactionSuccess] = useState(
    queryParams.get("success")
  );
  const { loginState, user, branch } = useContext(LoginContext);
  const serverIp = process.env.REACT_APP_SERVER_IP;
  const { getTotalCartAmount } = useContext(ShopContext);
  const MAX_TIMEOUT = 15 * 60 * 1000;
  const navigate = useNavigate();
  const [isPayDisabled, setIsPayDisabled] = useState(false);

  useEffect(() => {
    if (isTransactionSuccess && paymentStatus && merchantTransactionId) {
      if (paymentStatus === "PAYMENT_SUCCESS") {
        setOrderTransactionStatus(paymentStatus);
        setTimeout(() => navigate("/orders"), 5000);
      } else if (
        paymentStatus === "PAYMENT_PENDING" ||
        paymentStatus === "INTERNAL_SERVER_ERROR"
      ) {
        scheduleChecks();
      } else {
        setOrderTransactionStatus(paymentStatus);
        console.log("else block");
        setTimeout(() => navigate("/orders"), 5000);
      }
    }
  }, []);

  const setOrderTransactionStatus = async (status) => {
    fetch(serverIp + "/updateordertransactionstatus", {
      method: "POST",
      headers: {
        Accept: "application/form-data",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        transactionId: merchantTransactionId,
        status,
      }),
    });
  };

  async function checkStatus() {
    try {
      const response = await axios.get(
        `${serverIp}/payment/status/${merchantTransactionId}`
      );
      console.log("Status Called$$: ", response.data.data.code);
      return response.data.data.code;
    } catch (error) {
      console.error("Error checking status:", error);
      return "error";
    }
  }

  function scheduleChecks() {
    let startTime = Date.now();
    let firstCheckTime = 22 * 1000;

    function scheduleNextCheck(interval, duration, nextPhaseCallback) {
      const intervalId = setInterval(async () => {
        const status = await checkStatus();
        if (
          status &&
          status !== "PAYMENT_DECLINED" &&
          status !== "INTERNAL_SERVER_ERROR"
        ) {
          clearInterval(intervalId);
          setPaymentStatus(status);
          console.log(`Transaction status: ${status}`);
          return;
        }
        console.log("interval: ", interval);
        if (Date.now() - startTime >= MAX_TIMEOUT) {
          clearInterval(intervalId);
          console.log("Timeout reached");
          return;
        }
      }, interval);

      setTimeout(() => {
        clearInterval(intervalId);
        if (Date.now() - startTime < MAX_TIMEOUT) {
          nextPhaseCallback();
        }
      }, duration);
    }

    setTimeout(() => {
      scheduleNextCheck(3000, 33000, () => {
        scheduleNextCheck(6000, 60000, () => {
          scheduleNextCheck(10000, 60000, () => {
            scheduleNextCheck(30000, 60000, () => {
              const intervalId = setInterval(async () => {
                const status = await checkStatus(merchantTransactionId);
                if (status !== "Pending") {
                  clearInterval(intervalId);
                  console.log(`Transaction status: ${status}`);
                  return;
                }
                if (Date.now() - startTime >= MAX_TIMEOUT) {
                  clearInterval(intervalId);
                  console.log("Timeout reached");
                  return;
                }
              }, 60 * 1000); // 1 minute
            });
          });
        });
      });
    }, firstCheckTime);
  }

  const paymentHandler = async () => {
    setIsPayDisabled(true);
    setPaymentMode(paymentMethod);
    setIsPaymentInitiated(true);

    if (paymentMethod === "PhonePe") {
      const { totalAmount } = getTotalCartAmount();
      const reqBody =
        loginState === "User"
          ? {
            name: user.name,
            merchantUserId: user.smId,
            mobileNumber: user.phoneNumber,
            amount: totalAmount,
          }
          : {
            name: buyer.name,
            merchantUserId: buyer.smId,
            mobileNumber: buyer.phoneNumber,
            amount: totalAmount,
          };

      fetch(serverIp + "/payment", {
        method: "POST",
        headers: {
          Accept: "application/form-data",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reqBody),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success === true) {
            setOrderPaymentId(orderId, data.data.merchantTransactionId);
            window.location.href =
              data.data.instrumentResponse.redirectInfo.url;
          }
        })
        .catch((error) => {
          console.log("Error making payment: ", error);
        });
    }
  };

  const setOrderPaymentId = async (orderId, transactionId) => {
    fetch(serverIp + "/updateordertransactionid", {
      method: "POST",
      headers: {
        Accept: "application/form-data",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderId,
        transactionId,
      }),
    });
  };

  return (
    <div className="payment-handler-outer-container">
      {paymentStatus ? (
        <div className="payment-handler-inner-container">
          <>
            <p className="text-extrabold text-xl">
              <h2>Checking payment status...</h2>
            </p>
            <p
              className="text-black text-lg"
              style={{
                color: paymentStatus === "PAYMENT_SUCCESS" ? "green" : "red",
              }}
            >
              {paymentStatus}
            </p>
            {paymentStatus === "PAYMENT_SUCCESS" && (
              <p>Redirecting back to application</p>
            )}
            <p className="pt-10 text-teal-600 font-extrabold font-md">
              Do not refresh or press back button
            </p>
          </>
        </div>
      ) : (
        <>
          <p>Select payment options</p>
          <div
            onClick={() => setPaymentMethod("PhonePe")}
            className="payment-method flex gap-8 p-3 sm:p-3 lg:p-4 rounded-xl border border-solid border-black "
          >
            <input
              type="radio"
              name="payment-method"
              value={paymentMethod}
              checked={paymentMethod === "PhonePe"}
            />
            <label htmlFor="payment-method">
              UPI, Debit Card, Credit Card, Netbanking (Powered by PhonePe)
            </label>
          </div>
          {/* {loginState === "Branch" && (
            <div
              onClick={() => setPaymentMethod("Offline")}
              className="payment-method flex gap-8 p-3 sm:p-3 lg:p-4  rounded-xl border border-solid border-black "
            >
              <input
                type="radio"
                name="payment-method"
                value={paymentMethod}
                checked={paymentMethod === "Offline"}
              />
              <label htmlFor="payment-method">Pay Offline</label>
            </div>
          )} */}
          <button disabled={isPayDisabled} onClick={() => paymentHandler()}>
            Pay
          </button>
        </>
      )}
    </div>
  );
};

export default PaymentHandler;
