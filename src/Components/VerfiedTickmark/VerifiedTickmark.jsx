import React, { useState } from "react";
import { CheckCircle } from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";
import { green } from "@mui/material/colors";

const VerifiedTick = () => {
  const [isVerified, setIsVerified] = useState(true);

  const handleVerify = () => {
    setIsVerified(true);
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      <IconButton
        onClick={handleVerify}
        sx={{
          borderRadius: "50%",
          padding: 0,
        }}
      >
        {isVerified && (
          <CheckCircle
            sx={{
              color: green[500],
              fontSize: 40,
              animation: "scaleUp 0.6s ease-in-out",
            }}
          />
        )}
      </IconButton>
    </Box>
  );
};

export default VerifiedTick;
