import "./ProductDisplay.css";
import star_icon from "../Assets/star_icon.png";
import star_dull_icon from "../Assets/star_dull_icon.png";
import AddToCartButton from "../AddToCartButton/AddToCartButton";
import BackButton from "../BackButton/BackButton";
import { styled } from "@mui/material/styles";
import { useContext } from "react";
import { ShopContext } from "../../Context/ShopContext";

const ProductDisplay = (props) => {
  const { product } = props;
  const { cartItems } = useContext(ShopContext);

  const ResponsiveDiv = styled("div")(({ theme }) => ({
    display: "flex",
    gap: "36px", // Default gap

    [theme.breakpoints.down("sm")]: {
      gap: "1.4rem",
    },
    [theme.breakpoints.between("sm", "md")]: {
      gap: "18px",
    },
    [theme.breakpoints.between("md", "lg")]: {
      gap: "24px",
    },
    [theme.breakpoints.between("lg", "xl")]: {
      gap: "28px",
    },
    [theme.breakpoints.up("xl")]: {
      gap: "36px",
    },
  }));

  return (
    <div className="productdisplay">
      <div>
        <BackButton />
      </div>
      <ResponsiveDiv className="flex">
        <div className="productdisplay-left">
          <div className="productdisplay-img-list">
            <img src={product.image} alt="img" />
          </div>
          <div className="productdisplay-img">
            <img
              className="productdisplay-main-img"
              src={product.image}
              alt="img"
            />
          </div>
        </div>
        <div className="productdisplay-right">
          <h1>{product.name}</h1>
          {/* <div className="productdisplay-right-stars">
            <img src={star_icon} alt="" />
            <img src={star_icon} alt="" />
            <img src={star_icon} alt="" />
            <img src={star_icon} alt="" />
            <img src={star_dull_icon} alt="" />
            <p>(122)</p>
          </div> */}
          <div className="productdisplay-right-prices pb-8">
            <div className="productdisplay-right-price-old">
              &#8377;{product.market_retail_price}
            </div>
            <div className="productdisplay-right-price-new">
              &#8377;{product.shoora_price}
            </div>
          </div>
          <AddToCartButton
            itemId={product.id}
            size="small"
            bg="black"
            items={cartItems[product.id]}
          />
        </div>
      </ResponsiveDiv>
    </div>
  );
};

export default ProductDisplay;
