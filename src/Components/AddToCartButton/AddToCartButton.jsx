import React, { useContext, useState } from "react";
import { Button, IconButton, Box, CircularProgress } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { ShopContext } from "../../Context/ShopContext";

function AddToCartButton({ itemId, size, bg, items }) {
  const [quantity, setQuantity] = useState(items ?? 0);
  const { addToCart, removeFromCart, isCartLoading } = useContext(ShopContext);

  const handleAdd = () => {
    setQuantity(quantity + 1);
    addToCart(itemId);
  };

  const handleRemove = () => {
    setQuantity(quantity - 1);
    removeFromCart(itemId);
  };

  return (
    <div className="add-to-cart-button-outer-container">
      <Box display="flex" alignItems="center">
        {quantity === 0 ? (
          <Button
            variant="contained"
            sx={{
              backgroundColor: !isCartLoading
                ? bg ?? "white"
                : "rgba(70, 68, 68, 0.6)",
              color: "#ff1865",
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: "rgba(231,39,103, 0.2)",
              },
            }}
            onClick={handleAdd}
            size={size ?? "small"}
            disabled={isCartLoading}
          >
            <span>Add to Cart</span>
          </Button>
        ) : (
          <>
            <IconButton
              onClick={handleRemove}
              sx={{
                backgroundColor: !isCartLoading
                  ? bg ?? "white"
                  : "rgba(70, 68, 68, 0.6)",
                color: "#ff1865",
                fontWeight: "bold",
                marginRight: "5px",
                "&:hover": {
                  backgroundColor: "rgba(231,39,103, 0.2)",
                },
              }}
              size={size ?? "small"}
              disabled={isCartLoading}
            >
              <RemoveIcon />
            </IconButton>
            <Box mx={1}>
              {isCartLoading ? (
                <CircularProgress size={24} /> // Show loader when loading
              ) : (
                quantity
              )}
            </Box>
            <IconButton
              onClick={handleAdd}
              sx={{
                backgroundColor: bg ?? "white",
                color: "#ff1865",
                fontWeight: "bold",
                marginLeft: "5px",
                "&:hover": {
                  backgroundColor: "rgba(231,39,103, 0.2)",
                },
              }}
              size={size ?? "small"}
              disabled={isCartLoading}
            >
              <AddIcon />
            </IconButton>
          </>
        )}
      </Box>
    </div>
  );
}

export default AddToCartButton;
