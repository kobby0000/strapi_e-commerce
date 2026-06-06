import React, { useState } from "react";
import "./Product.scss";
import { MdAddShoppingCart } from "react-icons/md";
import { MdBalance } from "react-icons/md";
import { CiHeart } from "react-icons/ci";
import useFetch from "../../hooks/hookFetch";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/cartReducer";
import { resolveAssetUrl } from "../../config/env";

const Product = () => {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState("img");
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();

  const { data, loading, error } = useFetch(`/products/${id}`);

  const product = data?.data;
  const getImageUrl = (image) => {
    if (!image) return "/placeholder.png";
    if (typeof image === "string") return resolveAssetUrl(image);
    return image.url ? resolveAssetUrl(image.url) : "/placeholder.png";
  };

  return (
    <div className="product">
      {error ? (
        "Could not load this product."
      ) : loading ? (
        "Loading..."
      ) : (
        <>
          <div className="left">
            <div className="images">
              {/* First Image */}
              <img
                src={
                  getImageUrl(product?.img)
                }
                alt={product?.title}
                onClick={() => setSelectedImage("img")}
              />

              {/* Second Image */}
              <img
                src={
                  getImageUrl(product?.img2)
                }
                alt={product?.title}
                onClick={() => setSelectedImage("img2")}
              />
            </div>

            {/* Main Selected Image */}
            <div className="main_image">
              <img
                src={
                  selectedImage === "img2"
                    ? getImageUrl(product?.img2)
                    : getImageUrl(product?.img)
                }
                alt={product?.title}
              />
            </div>
          </div>

          <div className="right">
            <h2>{product?.title || "Untitled Product"}</h2>
            <span className="price">${product?.price || "0.00"}</span>
            <p>{product?.desc || "No description available."}</p>

            <div className="quantity">
              <button
                onClick={() =>
                  setQuantity((prev) => (prev === 1 ? 1 : prev - 1))
                }
              >
                -
              </button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity((prev) => prev + 1)}>+</button>
            </div>

            <button className="add" onClick={() => {dispatch(addToCart({
              id: product.id || product._id,
              title: product.title,
              desc: product.desc, 
              price: product.price,
              img: getImageUrl(product?.img),
              quantity,
            }))}}>
              <MdAddShoppingCart className="icon" /> ADD TO CART
            </button>

            <div className="links">
              <div className="item">
                <CiHeart className="icon" /> ADD TO WISHLIST
              </div>
              <div className="item">
                <MdBalance className="icon" /> ADD TO COMPARE
              </div>
            </div>

            <div className="info">
              <span>Brand: {product?.brand}</span>
              <span>Product: {product?.title}</span>
              <span>Category: {product?.category}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Product;
