import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";
import { useGetCartItemsQuery, useGetUserByIdQuery } from '../../redux/services/userSlice';
import { useAddToCartOfUserMutation, useRemoveFromCartUserMutation } from "../../redux/services/userSlice";
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase.config';
import { useSelector } from "react-redux";
import productimg from '../../Utiles/productimg.png';

const ProductCard = ({ product }) => {
  const [userId, setuserId] = useState("");

  const { userInfo } = useSelector(state => state.auth);

  const [count, setCount] = useState(0);

  const [addToCart] = useAddToCartOfUserMutation();
  const [removeFromCart] = useRemoveFromCartUserMutation();

  const incrementCount = async (e) => {
    e.preventDefault();
    setCount(count + 1);
    const user = userInfo.user.id;
    console.log(user);

    const cartItems = [{
      product: product._id,
      quantity: 1
    }];
    console.log(cartItems);
    const res = await addToCart({ user, cartItems }).unwrap();
    console.log(res);
  };

  const decrementCount = async (e) => {
    e.preventDefault();
    count > 1 ? setCount(count - 1) : setCount(0);
    const user = userInfo.user.id;
    const res = await removeFromCart({ user, product: product._id }).unwrap();
    console.log(res);
  };

  return (
    <Link
      to={`/products/${product._id}`}
      state={{ product }}
      className="w-full max-w-xs mx-auto transition-transform transform hover:scale-105 duration-300 ease-in-out"
    >  
   {/*   <div className="p-4 flex flex-col items-center bg-white shadow-lg rounded-lg min-h-[380px] transition-all duration-300 ease-in-out hover:shadow-2xl"> */}

        {/* ✅ Updated Product Image Section */}
        <div className="p-4 flex flex-col items-center bg-white rounded-lg min-h-[300px] transition-all duration-300 ease-in-out hover:shadow-2xl">
          <img
            src={productimg}
            alt={product.name}
            className="w-full h-[280px] object-cover rounded-lg mb-4"
          />
        </div>

        {/* Product Name & Description */}
       <h3 className="text-sm font-semibold text-center">Male Suite</h3>
        <p className="text-xs text-gray-500 mb-4 text-center">gen: male      age: 22-25</p> 

        {/* Content that will expand */}
        <div className="flex-grow" />

        {/* Price and Cart section at the bottom */}
        <div className="flex justify-center items-center w-full mt-auto">
          <p className="font-semibold text-[#2518BD]">Rs.999.99</p>

          {count === 0 ? (
            <button
              className="bg-[#2518BD] text-white p-3 rounded-full transition-all duration-300 ease-in-out hover:bg-[#1A1380] hover:scale-110"
              onClick={incrementCount}
            >
              <FiShoppingCart size={24} />
            </button>
          ) : (
            <div className="flex items-center bg-[#2518BD] text-white rounded-full px-2 py-1 transition-all duration-300 ease-in-out">
              <button
                onClick={decrementCount}
                className="px-3 text-white font-bold text-lg rounded-full bg-[#1B1290] hover:bg-[#140C72] transition-all duration-300 ease-in-out"
              >
                -
              </button>
              <span className="px-6 text-lg font-semibold">{count}</span>
              <button
                onClick={incrementCount}
                className="px-3 text-white font-bold text-lg rounded-full bg-[#1B1290] hover:bg-[#140C72] transition-all duration-300 ease-in-out"
              >
                +
              </button>
            </div>
          )}
        </div>
      {/*</div>*/}
    </Link>
  );
};

export default ProductCard;