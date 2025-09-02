import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Footer from "../../Components/Footter";
import { useGetSignfleProductQuery, useGetProductsQuery } from "../../redux/services/productSlice";

const ProductDetail = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const { data: product } = useGetSignfleProductQuery({ productId });
  const { data: products } = useGetProductsQuery();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!product) {
    return <div className="text-center p-6">Product not found</div>;
  }

  const handleNextImage = () =>
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  const handlePrevImage = () =>
    setCurrentImageIndex((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );

  return (
    <>
      <div className="bg-gray-100 min-h-screen p-4">
        {/* Go Back Button */}
        <button
          onClick={() => navigate("/products")}
          className="text-black font-semibold text-md flex items-center hover:underline mb-4"
        >
          <FiChevronLeft className="mr-1" size={20} />
          Go Back
        </button>

        {/* Main Product Section */}
        <div className="bg-white shadow-lg rounded-lg max-w-4xl mx-auto p-6 flex flex-col items-center relative">
          {/* Main Image with Navigation */}
          <div className="relative w-full flex justify-center items-center h-[400px] bg-white rounded-lg mb-4">
            <img
              src={product.images[currentImageIndex] || "https://via.placeholder.com/500"}
              alt={product.name}
              className="max-h-full max-w-full object-contain"
            />
            <button
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-600"
            >
              <FiChevronLeft size={24} />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-600"
            >
              <FiChevronRight size={24} />
            </button>
          </div>

          {/* Thumbnails */}
          <div className="flex justify-center gap-2 mb-6">
            {product.images.map((img, index) => (
              <div
                key={index}
                className={`w-20 h-20 p-1 rounded border cursor-pointer ${
                  index === currentImageIndex ? "border-blue-500" : "border-gray-300"
                } bg-white flex items-center justify-center`}
                onClick={() => setCurrentImageIndex(index)}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${index}`}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            ))}
          </div>

          {/* Product Info */}
          <div className="w-full text-left space-y-2 text-sm text-gray-700 mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">{product.name}</h2>
            <p className="text-lg font-semibold text-gray-700 mb-2">
              ₹{product.originalPrice || product.price}{" "}
              <span className="line-through text-red-500 ml-2">
                {product.originalPrice ? `₹${product.originalPrice}` : ""}
              </span>
            </p>
            <p><strong>Gender:</strong> {product.gender || "Male"}</p>
            <p><strong>Age Range:</strong> {product.ageRange || "14 - 22"}</p>
            <p><strong>Size:</strong> {product.size || "M"}</p>
            <p><strong>Location:</strong> {product.location || "Benglore"}</p>
            <p><strong>Color:</strong> {product.color || "Varies"}</p>
            <p><strong>Description:</strong> {product.description || "No description available."}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 w-full justify-center">
            <button
              className="bg-[#2518BD] text-white px-6 py-3 rounded-3xl hover:bg-[#1B1290] transition"
              onClick={() => navigate("/checkout", { state: { product, count: 1 } })}
            >
              Book Now
            </button>
            <button
              className="bg-gray-200 text-gray-800 px-6 py-3 rounded-3xl hover:bg-gray-300 transition"
              onClick={() => alert("Contact feature coming soon!")}
            >
              Contact Us
            </button>
          </div>
        </div>

        {/* Suggested Products Section */}
        <div className="mt-12">
          <h3 className="text-2xl font-semibold mb-6 text-left text-blue-900 ml-4">
            More Suggestion's
          </h3>
          <div className="overflow-x-auto flex space-x-6 px-6">
            {products?.map((prod) => (
              <div
                key={prod.id}
                className="border p-4 rounded-lg shadow-lg min-w-[200px] bg-white hover:scale-105 transition flex flex-col items-center"
              >
                <img
                  src={prod.images?.[0] || "https://via.placeholder.com/150"}
                  alt={prod.name}
                  className="w-[120px] h-[120px] object-contain mb-4"
                />
                <p className="text-sm text-gray-600 mb-1"><strong>Gender:</strong> {prod.gender || "Male"}</p>
                <p className="text-sm text-gray-600 mb-1"><strong>Age:</strong> {prod.ageRange || "22 - 25"}</p>
                <p className="text-lg text-[#2518BD] font-semibold mb-2">Rs. {prod.price || "999.99"}</p>
                <button className="bg-[#2518BD] text-white px-4 py-2 rounded-full hover:bg-[#1B1290] transition">
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ProductDetail;
