import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetProductByIdQuery } from '../../redux/services/productSlice'; // 1. Import the Redux hook
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa'; // For star ratings

// Helper component to display star ratings
const StarRating = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars.push(<FaStar key={i} className="text-yellow-400" />);
    } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
      stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
    } else {
      stars.push(<FaRegStar key={i} className="text-gray-300" />);
    }
  }
  return <div className="flex items-center">{stars}</div>;
};


const ProductDetail = () => {
  const { productId } = useParams();
  
  // 2. Use the hook to fetch data. It handles loading, error, and data states automatically.
  const { data: productData, isLoading, isError, error } = useGetProductByIdQuery(productId);
  
  // The actual product object is nested in the 'data' property of the response
  const product = productData?.data;

  // State to manage which image is currently displayed
  const [selectedImage, setSelectedImage] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // When the product data loads, set the initial selected image to be the thumbnail
  useEffect(() => {
    if (product?.thumbnail) {
      setSelectedImage(product.thumbnail);
    }
  }, [product]);

  const handleAddToCart = async () => {
    // Note: This would ideally be a Redux mutation
    const userId = "replace-with-actual-user-id";
    if (!userId) {
      alert("Please log in to add items to your cart.");
      return;
    }
    setIsAdding(true);
    try {
      // Assuming you have axiosInstance configured elsewhere
      // await axiosInstance.post('/users/addtocart', { user: userId, cartItems: [{ product: product._id, quantity: 1 }] });
      alert(`${product.name} has been added to your cart!`);
    } catch (err) {
      alert('Failed to add product to cart.');
      console.error(err);
    } finally {
      setIsAdding(false);
    }
  };

  if (isLoading) return <div className="text-center p-10">Loading product...</div>;
  if (isError) return <div className="text-center p-10 text-red-500">Error: {error.toString()}</div>;
  if (!product) return <div className="text-center p-10">Product not found.</div>;

  // Combine the thumbnail and other images into one array for the gallery
  const allImages = [product.thumbnail, ...product.otherImages];

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <Link to="/products" className="text-blue-600 hover:underline mb-4 inline-block">
        &larr; Back to Products
      </Link>
      <div className="grid md:grid-cols-2 gap-8 md:gap-12">
        {/* Image Gallery */}
        <div className="flex flex-col gap-4">
          <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
            <img src={selectedImage} alt={product.name} className="w-full h-full object-contain" />
          </div>
          <div className="flex gap-2 justify-center">
            {allImages.map((img, index) => (
              <div
                key={index}
                className={`w-20 h-20 rounded-md cursor-pointer border-2 overflow-hidden ${selectedImage === img ? 'border-blue-500' : 'border-transparent'}`}
                onClick={() => setSelectedImage(img)}
              >
                <img src={img} alt={`${product.name} thumbnail ${index + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col justify-center">
          <span className="text-sm text-gray-500 uppercase">{product.category.name}</span>
          <h1 className="text-3xl md:text-4xl font-bold my-2">{product.name}</h1>
          <p className="text-gray-500 text-md mb-2">by {product.brand}</p>
          <div className="flex items-center gap-2 mb-4">
            <StarRating rating={product.rating} />
            <span className="text-gray-500 text-sm">({product.reviews.length} reviews)</span>
          </div>
          <p className="text-3xl text-blue-600 font-semibold my-4">₹{product.price}</p>
          <p className="text-gray-700 leading-relaxed mb-6">{product.description || "No description available."}</p>
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
          >
            {isAdding ? 'Adding...' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;