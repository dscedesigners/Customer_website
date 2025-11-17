import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetProductByIdQuery, useGetProductSuggestionsQuery } from '../../redux/services/productSlice';
import { useAddOrUpdateItemMutation } from '../../redux/services/cartSlice'; 
import ProductCard from './ProductCard';
import { FaStar } from 'react-icons/fa';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FiShare2, FiHeart } from "react-icons/fi";

const ProductDetail = () => {
  const { productId } = useParams();
  
  const { data: productData, isLoading, isError, error } = useGetProductByIdQuery(productId);
  const product = productData?.data;

  const { data: suggestionsData, isLoading: suggestionsLoading, isError: suggestionsError } = useGetProductSuggestionsQuery({ 
    productId,
    params: { limit: 4 }
  });

  const [addOrUpdateItem, { isLoading: isUpdatingCart }] = useAddOrUpdateItemMutation();

  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isExpanded, setIsExpanded] = useState(false);
  
  // --- BUG 1 FIX: Add new state to track cart status ---
  const [isInCart, setIsInCart] = useState(false);

  // Effect to set initial state when product data loads
  useEffect(() => {
    if (product) {
      setSelectedImage(product.thumbnail);
      setQuantity(product.cart > 0 ? product.cart : 1);
      // --- BUG 1 FIX: Initialize the new state ---
      setIsInCart(product.cart > 0);
      setIsExpanded(false);
    }
  }, [product]); 

  // Debounce logic for quantity + / - buttons
  const debounceTimer = useRef(null);
  const debouncedUpdateCart = useCallback(async (pid, qty) => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = setTimeout(async () => {
      try {
        await addOrUpdateItem({ productId: pid, quantity: qty }).unwrap();
        // --- BUG 1 FIX: Update cart status on successful debounce ---
        setIsInCart(true); 
      } catch (err) {
        console.error("Failed to update cart:", err);
      }
    }, 1500); 
  }, [addOrUpdateItem]);

  // --- Image Gallery Handlers (Unchanged) ---
  const allImages = product ? [product.thumbnail, ...product.otherImages] : [];

  const handlePrevImage = () => {
    const currentIndex = allImages.indexOf(selectedImage);
    const prevIndex = (currentIndex - 1 + allImages.length) % allImages.length;
    setSelectedImage(allImages[prevIndex]);
  };
  
  const handleNextImage = () => {
    const currentIndex = allImages.indexOf(selectedImage);
    const nextIndex = (currentIndex + 1) % allImages.length;
    setSelectedImage(allImages[nextIndex]);
  };
  
  // --- Cart Handlers ---
  const handleQuantityChange = (amount) => {
    setQuantity((prev) => {
      const newQuantity = Math.max(1, prev + amount);
      
      // If the item is already in the cart (or was just added), start debounce
      if (isInCart) {
        debouncedUpdateCart(product._id, newQuantity);
      }
      
      return newQuantity;
    });
  };
  
  const handleAddToCart = async () => {
    if (!product) return;
    try {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
      await addOrUpdateItem({ productId: product._id, quantity }).unwrap();
      // --- BUG 1 FIX: Update cart status on successful click ---
      setIsInCart(true); 
      console.log('Item added/updated in cart');
    } catch (err) {
      console.error('Failed to add to cart:', err);
    }
  };

  const handleSuggestionCartClick = async (pid) => {
    // This assumes ProductCard is stateful and handles its own logic
    console.log("Suggestion clicked", pid); 
  };

  // --- Render Logic ---

  if (isLoading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (isError) return <div className="flex justify-center items-center h-screen text-red-500">Error fetching product.</div>;
  if (!product) return <div className="flex justify-center items-center h-screen">Product not found.</div>;

  const CHAR_LIMIT = 180;
  const isLongDescription = product.description.length > CHAR_LIMIT;
  const displayText = isLongDescription && !isExpanded 
    ? `${product.description.substring(0, CHAR_LIMIT)}...` 
    : product.description;

  // --- BUG 2 FIX: Create a dynamic button text variable ---
  let buttonText;
  if (isUpdatingCart) {
    buttonText = isInCart ? "Updating..." : "Adding...";
  } else {
    buttonText = isInCart ? "Update Cart" : "Add To Cart";
  }

  return (
    <div className="max-w-6xl mx-auto p-8 md:p-16 font-sans">
      <Link to="/products" className="text-sm text-gray-600 hover:underline mb-6 inline-block">
        &larr; Back to all products
      </Link>

      <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
        
        {/* --- Image Gallery (Unchanged) --- */}
        <div className="flex flex-col gap-4">
          <div className="relative w-full h-[500px] bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
            <button onClick={handlePrevImage} className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/60 hover:bg-white rounded-full p-2 z-10 transition-colors duration-300">
              <IoIosArrowBack size={24} className="text-gray-800"/>
            </button>
            <img src={selectedImage} alt={product.name} className="w-full h-full object-cover" />
            <button onClick={handleNextImage} className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/60 hover:bg-white rounded-full p-2 z-10 transition-colors duration-300">
              <IoIosArrowForward size={24} className="text-gray-800"/>
            </button>
            <div className="absolute top-4 right-4 flex flex-col gap-3">
                <button className="bg-white p-3 rounded-full shadow-md hover:bg-gray-100 transition"><FiShare2 size={18} /></button>
                <button className="bg-white p-3 rounded-full shadow-md hover:bg-gray-100 transition"><FiHeart size={18} /></button>
            </div>
          </div>
          <div className="flex gap-4 justify-center">
            {allImages.map((img, index) => (
              <div
                key={index}
                className={`w-24 h-24 rounded-md cursor-pointer border-2 overflow-hidden transition-all ${selectedImage === img ? 'border-black' : 'border-gray-200 hover:border-gray-400'}`}
                onClick={() => setSelectedImage(img)}
              >
                <img src={img} alt={`${product.name} thumbnail ${index + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* --- Product Info (Unchanged) --- */}
        <div className="flex flex-col pt-4">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">{product.name}</h1>
          <div className="flex items-center gap-4 my-4 text-sm text-gray-600">
            <div className="flex items-center gap-1.5">
              <FaStar className="text-yellow-400" />
              <span className="font-bold text-gray-800">{product.rating.toFixed(1)}</span>
            </div>
          </div>
          <hr className="my-2" />
          <div className="my-6">
            <h2 className="font-semibold text-lg mb-2">Description:</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              {displayText}
              {isLongDescription && (
                <button onClick={() => setIsExpanded(!isExpanded)} className="text-black font-semibold underline ml-1">
                  {isExpanded ? 'See Less' : 'See More...'}
                </button>
              )}
            </p>
          </div>
          <div className="space-y-3 text-md my-6">
            {product.size && <div className="flex items-center"><p className="text-gray-600 w-20">Size:</p><p className="font-bold">{product.size}</p><a href="#" className="text-gray-500 underline ml-auto text-sm">View Size Chart</a></div>}
            {product.color && <div className="flex items-center"><p className="text-gray-600 w-20">Color:</p><p className="font-bold">{product.color}</p></div>}
            {product.cloth && <div className="flex items-center"><p className="text-gray-600 w-20">Cloth:</p><p className="font-bold">{product.cloth}</p></div>}
          </div>
          
          <div className="flex items-center gap-6 mt-6">
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button onClick={() => handleQuantityChange(-1)} className="px-5 py-3 text-lg hover:bg-gray-100 rounded-l-lg transition">-</button>
              <span className="px-6 py-3 text-md font-bold select-none">{quantity}</span>
              <button onClick={() => handleQuantityChange(1)} className="px-5 py-3 text-lg hover:bg-gray-100 rounded-r-lg transition">+</button>
            </div>
            
            {/* --- BUG 2 FIX: Disable button and use dynamic text --- */}
            <button
              onClick={handleAddToCart}
              disabled={isUpdatingCart} 
              className="flex-1 bg-[#222] text-white font-bold py-4 px-8 rounded-lg hover:bg-black transition-colors duration-300 disabled:opacity-50"
            >
              {buttonText}
            </button>
          </div>
        </div>
      </div>

      {/* --- Related Products Section (Unchanged) --- */}
      <div className="mt-16 md:mt-24">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Related Products</h2>
          {suggestionsData?.categoryId && (
            <Link
              to={`/products?category=${suggestionsData.categoryId}`}
              className="text-sm font-semibold text-gray-800 hover:underline"
            >
              View All
            </Link>
          )}
        </div>
        {suggestionsLoading && <p>Loading suggestions...</p>}
        {suggestionsError && <p className="text-red-500">Could not load suggestions.</p>}
        {!suggestionsLoading && !suggestionsError && (
          suggestionsData?.data?.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {suggestionsData.data.map((suggestedProduct) => (
                <ProductCard
                  key={suggestedProduct._id}
                  product={suggestedProduct}
                />
              ))}
            </div>
          ) : (
            <p>No related products found.</p>
          )
        )}
      </div>
    </div>
  );
};

export default ProductDetail;