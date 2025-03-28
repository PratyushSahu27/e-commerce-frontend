import React, { useState, useContext } from 'react';
import { TextField, Button, Typography, Box, LinearProgress } from '@mui/material';
import zxcvbn from 'zxcvbn';
import { LoginContext } from "../../Context/LoginContext";
import { toast } from 'react-toastify';

const ChangePassword = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [retypePassword, setRetypePassword] = useState('');
    const [errors, setError] = useState({});
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [strengthLabel, setStrengthLabel] = useState('');
    const serverIp = process.env.REACT_APP_SERVER_IP;
    const { user } = useContext(LoginContext);

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setNewPassword(newPassword);

        const result = zxcvbn(newPassword);
        setPasswordStrength(result.score);

        switch (result.score) {
            case 0:
                setStrengthLabel('Very Weak');
                break;
            case 1:
                setStrengthLabel('Weak');
                break;
            case 2:
                setStrengthLabel('Fair');
                break;
            case 3:
                setStrengthLabel('Strong');
                break;
            case 4:
                setStrengthLabel('Very Strong');
                break;
            default:
                setStrengthLabel('');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newPassword !== retypePassword) {
            errors["password"] = 'New password and Retyped password do not match';
            return;
        }

        if (newPassword.length < 6) {
            errors["password"] = "Password must be at least 6 characters long";
            return;
        }
        
        requestChangePassword()
        setError('');
    };

    const requestChangePassword = () => {
        fetch(serverIp + "/changepassword", {
            method: "POST",
            headers: {
              Accept: "application/form-data",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ smId:  user.smId, oldPassword: oldPassword, newPassword: newPassword}),
          })
            .then((resp) => resp.json())
            .then((data) => {
              if (data.success === true) {
                toast.info(data.message);
              } else {
                toast.error(data.message);            
              }
            });
    }

    return (
        <Box className="max-w-md my-12 p-6 border rounded-lg shadow-lg">
            <Typography variant="h6" className="text-center mb-4">
                Change Password
            </Typography>

            <form onSubmit={handleSubmit}>
                {/* Old Password Field */}
                <TextField
                    label="Old Password"
                    type="password"
                    fullWidth
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="mb-4"
                    required
                />

                {/* New Password Field */}
                <TextField
                    label="New Password"
                    type="password"
                    fullWidth
                    value={newPassword}
                    onChange={handlePasswordChange}
                    className="mb-4"
                    required
                />

                {/* Password Strength Meter */}
                <LinearProgress
                    variant="determinate"
                    value={(passwordStrength / 4) * 100} // Convert score to a percentage (0-100)
                    className="mb-2"
                />
                <Typography variant="caption" className="text-center mb-4">{strengthLabel}</Typography>

                {/* Retype New Password Field */}
                <TextField
                    label="Retype New Password"
                    type="password"
                    fullWidth
                    value={retypePassword}
                    onChange={(e) => setRetypePassword(e.target.value)}
                    className="mb-4"
                    required
                />

                {/* Error Message */}
                {errors["password"] && <Typography color="error" className="mb-4 text-center">{errors["password"]}</Typography>}

                {/* Submit Button */}
                <Button type="submit" variant="contained" color="primary" fullWidth>
                    Change Password
                </Button>
            </form>
        </Box>
    );
};

export default ChangePassword;
