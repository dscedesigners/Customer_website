// src/Pages/Cart/Cart.jsx

import React, { useEffect } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
// import { useGetCartItemsQuery, useRemoveProdFromCartMutation, useAddToCartOfUserMutation, useRemoveFromCartUserMutation } from "../../redux/services/userSlice"; // Temporarily disabled
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
// import { useCreateOrderMutation } from '../../redux/services/orderSlice'; // Temporarily disabled

const Cart = () => {
  const navigate = useNavigate();
  // const { userInfo } = useSelector((state) => state.auth); // You might still need this

  // ---- START: TEMPORARY PLACEHOLDER DATA ----
  const placeholderCart = {
    cartItems: [
      {
        product: {
          _id: "1",
          name: "Stylish Blue T-Shirt",
          images: ["https://via.placeholder.com/150"],
          price: 499.00,
          size: "L",
          color: "Navy Blue"
        },
        quantity: 2
      },
      {
        product: {
          _id: "2",
          name: "Classic Denim Jeans",
          images: ["https://via.placeholder.com/150"],
          price: 1299.00,
          size: "M",
          color: "Washed Blue"
        },
        quantity: 1
      },
    ]
  };

  const cart = placeholderCart; // Use placeholder data
  const isLoading = false;      // Simulate loading is complete
  const error = null;           // Simulate no error
  // ---- END: TEMPORARY PLACEHOLDER DATA ----


  /* --- BACKEND API LOGIC (Temporarily disabled) ---
  const { data: cart, isLoading, error, refetch } = useGetCartItemsQuery({ userId: userInfo?.user?.id });
  
  useEffect(()=>{
    refetch()
  },[refetch])
  
  const [addToCart] = useAddToCartOfUserMutation();
  const [removeItem] = useRemoveFromCartUserMutation();
  const [removeProdFromCart] = useRemoveProdFromCartMutation()
  const [createOrder] = useCreateOrderMutation()
  */

  if (isLoading) return <p className="text-center text-gray-600">Loading your cart...</p>;
  if (error) return <p className="text-center text-green-500">Loading cart items.</p>;
  
  // Use a safe check for cart and cartItems
  if (!cart || !cart.cartItems || !cart.cartItems.length) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: -10 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="flex flex-col items-center justify-center h-64"
      >
        <p className="text-xl font-semibold">Oops! Your cart is feeling a little empty. 🛒</p>
        <motion.button 
          whileHover={{ scale: 1.05 }} 
          onClick={() => navigate("/products")}
          className="mt-4 px-5 py-2 bg-blue-600 text-white rounded-lg"
        >
          Browse Products
        </motion.button>
      </motion.div>
    );
  }  
  
  const items = cart?.cartItems || [];

  // Temporarily disable API logic inside functions
  const increaseQuantity = async (id) => {
    console.log("Increase quantity for item:", id);
    // const res = await addToCart({ user: userInfo.user.id, cartItems: [{ product: id, quantity:1 }] });
    // refetch();
  };

  const decreaseQuantity = async (id) => {
    console.log("Decrease quantity for item:", id);
    // const res = await removeItem({ user: userInfo.user.id, product: id });
    // refetch();
  };

  const handleRemoveItem = async (id) => {
    console.log("Remove item:", id);
    // const res = await removeProdFromCart({ user: userInfo.user.id, product: id });
    // refetch();
  };
  
  const handleCreateOrder = async () => {
    console.log("Creating order...");
    alert("Order functionality is disabled until backend is ready.");
    // try {
    //   ... (original order logic) ...
    //   navigate("/profilepage");
    // } catch (error) {
    //   ... (original error logic) ...
    // }
  };

  // Calculate subtotal, discount, and total
  const subTotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discount = subTotal * 0.2;
  const deliveryFee = 15.98;
  const total = subTotal - discount + deliveryFee;

  return (
    <div className="p-8 max-w-3xl mx-auto font-sans">
      <header className="flex items-center justify-between mb-8">
        <span className="text-gray-500 text-sm cursor-pointer" onClick={() => navigate("/")}>
          &lt; Go Back
        </span>
        <h1 className="text-2xl font-semibold">Your Cart</h1>
      </header>
      <div className="space-y-6">
        <AnimatePresence>
          {items.map((item) => (
            <motion.div
              key={item.product._id}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              className="flex items-center border-b pb-4"
            >
              <img src={item.product.images[0]} alt={item.product.name} className="w-20 h-20 object-cover rounded-md mr-4" />
              <div className="flex-1">
                <p className="font-semibold">{item.product.name}</p>
                <p className="text-gray-600 text-sm">Size: {item.product.size || "M"}</p>
                <p className="text-gray-600 text-sm">Color: {item.product.color || "Default"}</p>
                <p className="font-semibold text-gray-800">Rs. {item.product.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center space-x-2 mr-4">
                <button className="px-3 py-1 bg-gray-200 rounded" onClick={() => decreaseQuantity(item.product._id)}>
                  -
                </button>
                <span className="text-lg font-medium">{item.quantity}</span>
                <button className="px-3 py-1 bg-gray-200 rounded" onClick={() => increaseQuantity(item.product._id)}>
                  +
                </button>
              </div>
              <button className="text-red-500 text-xl" onClick={() => handleRemoveItem(item.product._id)}>
                <FaTrashAlt />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-10">
        <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
        <div className="flex justify-between py-2"><span>Subtotal</span><span>Rs. {subTotal.toFixed(2)}</span></div>
        <div className="flex justify-between py-2 text-green-600"><span>Discount (-20%)</span><span>-Rs. {discount.toFixed(2)}</span></div>
        <div className="flex justify-between py-2"><span>Delivery fee</span><span>Rs. {deliveryFee.toFixed(2)}</span></div>
        <hr className="my-4" />
        <div className="flex justify-between font-semibold text-lg"><span>Total</span><span>Rs. {total.toFixed(2)}</span></div>
      </motion.div>
      <motion.button
        whileHover={{ scale: 1.05 }}
        className="bg-blue-700 text-white w-full py-3 rounded mt-6 font-medium"
        onClick={handleCreateOrder}
      >
        Order All
      </motion.button>
    </div>
  );
};

export default Cart;