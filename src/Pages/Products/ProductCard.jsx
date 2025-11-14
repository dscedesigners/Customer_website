import React, { useState, useRef, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";
import { FaPlus, FaMinus } from "react-icons/fa";
// 1. Import the cart mutation hooks
import { 
    useAddOrUpdateItemMutation, 
    useDeleteItemMutation 
} from "../../redux/services/cartSlice"; // Adjust path as needed

const ProductCard = ({ product }) => {
  // 2. Initialize quantity state from product.cart (which comes from the API)
  const [quantity, setQuantity] = useState(product.cart || 0);

  // 3. Initialize mutation hooks
  const [addOrUpdateItem] = useAddOrUpdateItemMutation();
  const [deleteItem] = useDeleteItemMutation();

  // 4. Update state if the prop changes (after a refetch)
  useEffect(() => {
    setQuantity(product.cart || 0);
  }, [product.cart]);

  // 5. Create a ref to hold the debounce timer
  const debounceTimer = useRef(null);

  // 6. Handle the very first "Add to Cart" click
  const handleInitialAddToCart = (e) => {
    e.stopPropagation();
    e.preventDefault();
    
    const newQuantity = 1;
    setQuantity(newQuantity); // Optimistic UI update
    
    // Call API (no debounce for the first add)
    addOrUpdateItem({ productId: product._id, quantity: newQuantity })
      .unwrap()
      .catch(() => setQuantity(0)); // Revert on error
  };

  // 7. Handle quantity changes (+/-) with debounce
  const handleQuantityChange = (e, amount) => {
    e.stopPropagation();
    e.preventDefault();

    const oldQuantity = quantity;
    const newQuantity = oldQuantity + amount;

    if (newQuantity < 0) return;

    // Optimistic UI update
    setQuantity(newQuantity);

    // Clear any existing timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (newQuantity === 0) {
      // If quantity is 0, delete the item (no debounce)
      deleteItem(product._id)
        .unwrap()
        .catch(() => setQuantity(oldQuantity)); // Revert on error
    } else {
      // Otherwise, update the item with a 3-second debounce
      debounceTimer.current = setTimeout(() => {
        addOrUpdateItem({ productId: product._id, quantity: newQuantity })
          .unwrap()
          .catch(() => setQuantity(oldQuantity)); // Revert on error
      }, 3000); // 3-second debounce
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
          
          {/* --- 8. CONDITIONAL UI based on new state --- */}
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