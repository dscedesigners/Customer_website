import React from "react";
import { Link } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";

const ProductCard = ({ product }) => {
  return (
    <Link
      to={`/products/${product._id}`}
      className="w-full max-w-xs mx-auto flex flex-col transition-transform transform hover:scale-105 duration-300 ease-in-out bg-white rounded-lg shadow-md overflow-hidden"
    >
      <div className="p-4 flex flex-col items-center">
        <img
          src={product.thumbnail}
          alt={product.name}
          className="w-full h-[280px] object-cover rounded-lg mb-4"
        />
      </div>
      <div className="px-4 pb-4 mt-auto">
        <h3 className="text-sm font-semibold text-center truncate">{product.name}</h3>
        <div className="flex justify-between items-center w-full mt-4">
          <p className="font-semibold text-[#2518BD]">₹{product.price}</p>
          <div className="bg-[#2518BD] text-white p-3 rounded-full">
            <FiShoppingCart size={20} />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;