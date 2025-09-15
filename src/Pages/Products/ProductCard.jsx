import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";
import { FaPlus, FaMinus } from "react-icons/fa";

const ProductCard = ({ product }) => {
  // Use state to track the quantity. 0 means not in cart.
  const [quantity, setQuantity] = useState(0);

  // This function handles the very first click on the cart icon
  const handleInitialAddToCart = (e) => {
    // Prevent the parent Link from navigating to the product detail page
    e.stopPropagation();
    e.preventDefault();
    
    const newQuantity = 1;
    setQuantity(newQuantity);
    alert(`Added to cart!\nProduct ID: ${product._id}\nQuantity: ${newQuantity}`);
  };

  // This function handles clicks on the '+' and '-' buttons
  const handleQuantityChange = (e, amount) => {
    // Prevent the parent Link from navigating
    e.stopPropagation();
    e.preventDefault();

    const newQuantity = quantity + amount;

    // The quantity cannot go below 0
    if (newQuantity < 0) return;

    setQuantity(newQuantity);

    if (newQuantity === 0) {
      alert(`Item removed from cart.\nProduct ID: ${product._id}`);
    } else {
      alert(`Quantity updated!\nProduct ID: ${product._id}\nNew Quantity: ${newQuantity}`);
    }
  };

  return (
    <Link
      to={`/products/${product._id}`}
      className="w-full max-w-xs mx-auto flex flex-col transition-transform transform hover:scale-105 duration-300 ease-in-out bg-white rounded-lg shadow-md overflow-hidden"
    >
      {/* --- Product Image (Unchanged) --- */}
      <div className="p-4 flex flex-col items-center">
        <img
          src={product.thumbnail}
          alt={product.name}
          className="w-full h-[280px] object-cover rounded-lg mb-4"
        />
      </div>

      {/* --- Product Info & Actions --- */}
      <div className="px-4 pb-4 mt-auto">
        <h3 className="text-sm font-semibold text-center truncate">{product.name}</h3>
        <div className="flex justify-between items-center w-full mt-4">
          <p className="font-semibold text-[#2518BD]">₹{product.price}</p>
          
          {/* --- CONDITIONAL UI: Show Cart Icon OR Quantity Selector --- */}
          {quantity === 0 ? (
            // If quantity is 0, show the "Add to Cart" icon
            <div
              onClick={handleInitialAddToCart}
              className="bg-[#2518BD] text-white p-3 rounded-full cursor-pointer hover:bg-blue-800 transition-colors"
            >
              <FiShoppingCart size={20} />
            </div>
          ) : (
            // If quantity is > 0, show the quantity selector
            <div className="flex items-center justify-center gap-2 text-[#2518BD]">
              <button
                onClick={(e) => handleQuantityChange(e, -1)}
                className="w-8 h-8 flex items-center justify-center border border-[#2518BD] rounded-full hover:bg-blue-100 transition-colors"
              >
                <FaMinus size={12} />
              </button>
              <span className="font-bold text-lg w-5 text-center">{quantity}</span>
              <button
                onClick={(e) => handleQuantityChange(e, 1)}
                className="w-8 h-8 flex items-center justify-center border border-[#2518BD] rounded-full hover:bg-blue-100 transition-colors"
              >
                <FaPlus size={12} />
              </button>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;