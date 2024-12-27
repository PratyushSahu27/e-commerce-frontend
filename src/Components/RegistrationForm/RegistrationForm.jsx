import { useState } from "react";
import "./RegistrationForm.css";
import { GuideSideEnum, indianStates } from "../../Utils/signup.util";
import Modal from "../../Components/Modal/ModalComponent";
import { toast } from "react-toastify";

function RegistrationForm({ guideIdDefault, setState }) {
  const serverIp = process.env.REACT_APP_SERVER_IP;
  // The registration form state
  const [formData, setFormData] = useState({
    guideId: guideIdDefault ? guideIdDefault : "",
    guideSide: "",
    fullName: "",
    phoneNumber: "",
    email: "",
    password: "",
    retypePassword: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  // The tnc checkbox state
  const [tncCheckbox, setTncCheckbox] = useState(false);

  const [openModal, setModalOpen] = useState(false);

  // The state of form errors
  const [errors, setErrors] = useState({});

  const submitHandler = (state) => {
    if (state === "ACCEPT") {
      signUp();
    } else {
      setModalOpen(false);
    }
  };

  // Updates form state on any change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Post api call on signup
  let dataObj;
  const signUp = async () => {
    console.log("Signup called!");
    if (validateForm()) {
      await fetch(serverIp + "/signup", {
        method: "POST",
        headers: {
          Accept: "application/form-data",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((resp) => resp.json())
        .then((data) => {
          dataObj = data;
        });

      if (dataObj.success) {
        localStorage.setItem("auth-token", dataObj.token);
        window.location.replace("/");
      } else {
        alert(dataObj.errors);
      }
      console.log("Form submitted:", formData);
    } else {
      console.log("Form submission invalid");
    }
  };

  // Validates the forms fields
  const validateForm = () => {
    let errors = {};
    let formIsValid = true;

    if (!formData.guideId) {
      formIsValid = false;
      errors["guideId"] = "Guide ID cannot be empty";
    }

    if (!formData.phoneNumber) {
      formIsValid = false;
      errors["phoneNumber"] = "Phone Number cannot be empty";
    }

    if (formData.phoneNumber.length !== 10) {
      formIsValid = false;
      errors["phoneNumber"] = "Enter a valid 10 digit phone number";
    }

    if (!formData.fullName) {
      formIsValid = false;
      errors["fullName"] = "Name cannot be empty. Enter your full name.";
    }

    if (!formData.email) {
      formIsValid = false;
      errors["email"] = "Email cannot be empty";
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      formIsValid = false;
      errors["email"] = "Please enter a valid email address";
    }

    if (!formData.password) {
      formIsValid = false;
      errors["password"] = "Password cannot be empty";
    }

    if (formData.password.length < 6) {
      formIsValid = false;
      errors["password"] = "Password must be at least 6 characters long";
    }

    if (formData.retypePassword !== formData.password) {
      formIsValid = false;
      errors["retypePassword"] = "Both passwords do not match!";
    }

    if (!formData.state) {
      formIsValid = false;
      errors["state"] = "Please select a state";
    }

    if (!formData.guideSide) {
      formIsValid = false;
      errors["guideSide"] = "Please select a state";
    }

    if (!formData.city) {
      formIsValid = false;
      errors["city"] = "Please enter city name";
    }

    if (!formData.address) {
      formIsValid = false;
      errors["address"] = "Address field cannot be empty";
    }

    if (!formData.pincode) {
      formIsValid = false;
      errors["pincode"] = "Pincode cannot be empty";
    }
    if (formData.pincode.length !== 6) {
      formIsValid = false;
      errors["pincode"] = "Enter a valid 6 digit pincode";
    }

    if (!tncCheckbox) {
      formIsValid = false;
      toast.error("Please read and accept term and conditions to register");
    }
    setErrors(errors);
    return formIsValid;
  };

  return (
    <div className="signup-container">
      <h3>Enter your details</h3>
      <div className="signUp-form">
        <div className="form-input">
          <div className="form-input-top">
            <label htmlFor="guideId" className="required-field">
              Guide ID{" "}
            </label>
            <input
              className="loginsignup-field"
              type="text"
              id="guideId"
              name="guideId"
              value={formData.guideId}
              onChange={handleChange}
              required
              disabled={guideIdDefault ? true : false}
            />
          </div>
          <div className="error">{errors.guideId}</div>
        </div>
        <div className="form-input">
          <div className="form-input-top">
            <label htmlFor="guideSide" className="required-field">
              Side of your guide{" "}
            </label>
            <select
              className="loginsignup-field text-black font-bold"
              id="guideSide"
              name="guideSide"
              value={formData.guideSide}
              onChange={handleChange}
              required
            >
              <option value="">Select guide side</option>
              {Object.keys(GuideSideEnum).map((side, index) => (
                <option key={index} value={GuideSideEnum[side]}>
                  {side}
                </option>
              ))}
            </select>
          </div>
          <div className="error">{errors.guideSide}</div>
        </div>
        <div className="form-input">
          <div className="form-input-top">
            <label htmlFor="fullName" className="required-field">
              Full Name{" "}
            </label>
            <input
              className="loginsignup-field"
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="error">{errors.fullName}</div>
        </div>
        <div className="form-input">
          <div className="form-input-top">
            <label htmlFor="phoneNumber" className="required-field">
              Phone Number{" "}
            </label>
            <input
              className="loginsignup-field"
              type="number"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div className="error">{errors.phoneNumber}</div>
        </div>
        <div className="form-input">
          <div className="form-input-top">
            <label htmlFor="email" className="required-field">
              Email
            </label>
            <input
              className="loginsignup-field"
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="error">{errors.email}</div>
        </div>
        <div className="form-input">
          <div className="form-input-top">
            <label htmlFor="password" className="required-field">
              Password{" "}
            </label>
            <input
              className="loginsignup-field"
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="error">{errors.password}</div>
        </div>

        <div className="form-input">
          <div className="form-input-top">
            <label htmlFor="retypepassword" className="required-field">
              Confirm Password
            </label>
            <input
              className="loginsignup-field"
              type="password"
              id="retypePassword"
              name="retypePassword"
              value={formData.retypePassword}
              onChange={handleChange}
              required
            />
          </div>
          <div className="error">{errors.retypePassword}</div>
        </div>

        <div className="form-input">
          <div className="form-input-top">
            <label htmlFor="state" className="required-field">
              State{" "}
            </label>
            <select
              className="loginsignup-field text-black font-bold"
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
            >
              <option value="">Select State</option>
              {indianStates.map((state, index) => (
                <option key={index} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>
          <div className="error">{errors.state}</div>
        </div>

        <div className="form-input">
          <div className="form-input-top">
            <label htmlFor="city" className="required-field">
              City{" "}
            </label>
            <input
              className="loginsignup-field"
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
            />
          </div>
          <div className="error">{errors.city}</div>
        </div>

        <div className="form-input">
          <div className="form-input-top">
            <label htmlFor="address" className="required-field">
              Address{" "}
            </label>
            <input
              className="loginsignup-field"
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>
          <div className="error">{errors.address}</div>
        </div>

        <div className="form-input">
          <div className="form-input-top">
            <label htmlFor="pincode" className="required-field">
              Pincode{" "}
            </label>
            <input
              className="loginsignup-field"
              type="number"
              id="pincode"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              required
            />
          </div>
          <div className="error">{errors.pincode}</div>
        </div>

        <div className="loginsignup-agree">
          <input
            type="checkbox"
            name=""
            id=""
            defaultChecked={tncCheckbox}
            onChange={() => setTncCheckbox(!tncCheckbox)}
          />
          <p>By continuing, i agree to the terms of use & privacy policy.</p>
        </div>

        <button
          onClick={() => {
            if (validateForm()) {
              setModalOpen(true);
            }
          }}
        >
          Proceed to Register
        </button>

        <p className="loginsignup-login">
          Already have an account?{" "}
          <span
            onClick={() => {
              setState("Login");
            }}
          >
            Login here
          </span>
        </p>
      </div>
      <Modal
        title="Just one more step"
        message="Place your first order to complete registration"
        isOpen={openModal}
        isRejectEnabled
        acceptMessage="Proceed to make purchase"
        submitHandler={submitHandler}
      />
    </div>
  );
}

export default RegistrationForm;
