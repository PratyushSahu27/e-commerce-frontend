import { useNavigate, useLocation } from "react-router-dom";
import { ShopContext } from "../../Context/ShopContext";
import "./PaymentHandler.scss";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";

const PaymentHandler = () => {
  const queryParams = new URLSearchParams(useLocation().search);
  const [paymentStatus, setPaymentStatus] = useState(queryParams.get("status"));
  const [merchantTransactionId, setMerchantTransactionId] = useState(
    queryParams.get("merchantTransactionId")
  );
  const [isTransactionSuccess, setIsTransactionSuccess] = useState(
    queryParams.get("success")
  );
  const navigate = useNavigate();
  const serverIp = process.env.REACT_APP_SERVER_IP;
  const { user, getTotalCartAmount } = useContext(ShopContext);
  const MAX_TIMEOUT = 15 * 60 * 1000;

  useEffect(() => {
    if (isTransactionSuccess && paymentStatus && merchantTransactionId) {
      if (
        isTransactionSuccess === true &&
        paymentStatus === "PAYMENT_SUCCESS"
      ) {
        // place order
        scheduleChecks();
        console.log("transaction success");
      } else if (
        paymentStatus === "PAYMENT_DECLINED" ||
        paymentStatus === "PAYMENT_ERROR"
      ) {
        console.log("Transaction failed");
      } else {
        scheduleChecks();
      }
    }
  }, []);

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
    const { totalAmount } = getTotalCartAmount();

    fetch(serverIp + "/payment", {
      method: "POST",
      headers: {
        Accept: "application/form-data",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: user.name,
        merchantUserId: user.smId,
        mobileNumber: user.phoneNumber,
        amount: totalAmount,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success === true) {
          window.location.href = data.data.instrumentResponse.redirectInfo.url;
        }
      })
      .catch((error) => {
        console.log("Error making payment: ", error);
      });

    // if (paymentVerification() === true) {
    //   setIsPaymentSuccessful(true);
    // }
  };

  const paymentVerification = async () => {
    return true;
  };

  return (
    <div className="payment-handler-outer-container">
      {console.log("Status: ", paymentStatus)}
      {paymentStatus ? (
        <>
          <p className="text-extrabold text-lg">{paymentStatus}</p>
          <p>Checking payment status</p>
          <p>Do not refresh or press back button</p>
        </>
      ) : (
        <>
          <p>Select payment options</p>
          <button onClick={() => paymentHandler()}>Pay</button>
        </>
      )}
    </div>
  );
};

export default PaymentHandler;
