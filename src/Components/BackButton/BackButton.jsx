import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Button
        variant="contained"
        size="large"
        sx={{
          backgroundColor: "white",
          color: "#ff1865",
          fontWeight: "bold",
          "&:hover": {
            backgroundColor: "rgba(231,39,103, 0.2)",
          },
        }}
        onClick={() => navigate(-1)}
      >
        Back
      </Button>
    </div>
  );
};

export default BackButton;
