import React, { useEffect } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useGetCartItemsQuery, useRemoveProdFromCartMutation,useAddToCartOfUserMutation ,useRemoveFromCartUserMutation } from "../../redux/services/userSlice";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {useCreateOrderMutation} from '../../redux/services/orderSlice'
const Cart = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  // Fetch cart items
  const { data: cart, isLoading, error,refetch } = useGetCartItemsQuery({ userId: userInfo?.user?.id });
  
  useEffect(()=>{
    refetch()
  },[refetch])
  
  const [addToCart] = useAddToCartOfUserMutation();
  const [removeItem] = useRemoveFromCartUserMutation();
  const [removeProdFromCart] = useRemoveProdFromCartMutation()
  const [createOrder] = useCreateOrderMutation()

  if (isLoading) return <p className="text-center text-gray-600">Loading your cart...</p>;
  if (error) return <p className="text-center text-green-500">Loading cart items.</p>;
  if (!cart.cartItems.length) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: -10 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }} 
        className="flex flex-col items-center justify-center h-64 text-gray-500 text-lg font-medium"
      >
        <p className="text-xl font-semibold">Oops! Your cart is feeling a little empty. 🛒</p>
        <p className="text-sm text-gray-400 mt-2">Let’s fix that—start adding your favorite items now!</p>
        <motion.button 
          whileHover={{ scale: 1.05 }} 
          whileTap={{ scale: 0.95 }} 
          onClick={() => navigate("/products")}
          className="mt-4 px-5 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          Browse Products
        </motion.button>
      </motion.div>
    );
  }  
  const items = cart?.cartItems || [];

  // Function to increase quantity
  const increaseQuantity = async (id) => {
    const res =   await addToCart({ user: userInfo.user.id, cartItems: [{ product: id, quantity:1 }] });
    console.log(res);
    refetch()
  };

  // Function to decrease quantity or remove if it's 1
  const decreaseQuantity = async (id) => {
      const res = await removeItem({ user: userInfo.user.id, product: id });
      console.log(res);
      refetch()
     
      
  };

  // Function to remove item
  const handleRemoveItem = async (id) => {
    try {
      const res =  await removeProdFromCart({ user: userInfo.user.id, product: id });
      refetch()
      console.log(res);
    } catch (error) {
      console.log("While removing product from cart"+error);
    }
  };

  // Calculate subtotal, discount, and total
  const subTotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discount = subTotal * 0.2;
  const deliveryFee = 15.98;
  const total = subTotal - discount + deliveryFee;


  const handleCreateOrder = async () => {
    if (!userInfo?.user?.id) {
      alert("You need to log in to place an order.");
      navigate("/login");
      return;
    }
  
    try {
      const shippingAddress = {
        fullName: "John Doe", // Ideally, get this from user profile or form
        street: "123 Main Street",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        country: "USA",
      }
      const response = await createOrder({user:userInfo?.user?.id,shippingAddress,paymentMethod:"COD"}).unwrap()
      console.log(response);
      refetch()
      alert("Order placed successfully!");
      navigate("/profilepage"); // Redirect to orders page
    } catch (error) {
      console.error("Error placing order:", error);
      alert(error.message);
    }
  };
  
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
              transition={{ duration: 0.3 }}
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
                <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded" onClick={() => decreaseQuantity(item.product._id)}>
                  -
                </button>
                <span className="text-lg font-medium">{item.quantity}</span>
                <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded" onClick={() => increaseQuantity(item.product._id)}>
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

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mt-10">
        <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
        <div className="flex justify-between py-2">
          <span>Subtotal</span>
          <span>Rs. {subTotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between py-2 text-green-600">
          <span>Discount (-20%)</span>
          <span>-Rs. {discount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between py-2">
          <span>Delivery fee</span>
          <span>Rs. {deliveryFee.toFixed(2)}</span>
        </div>
        <hr className="my-4" />
        <div className="flex justify-between font-semibold text-lg">
          <span>Total</span>
          <span>Rs. {total.toFixed(2)}</span>
        </div>
      </motion.div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-blue-700 hover:bg-blue-800 text-white w-full py-3 rounded mt-6 font-medium"
        onClick={handleCreateOrder}
      >
        Order All
      </motion.button>
    </div>
  );
};

export default Cart;
