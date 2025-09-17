import React, { useState, useEffect } from "react";
import { FaShoppingCart, FaSearch, FaBars, FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useSelector } from "react-redux";
import logo from '../Utiles/logo2.png';

// NOTE: Firebase imports are removed as they are not used for displaying user state
// If you still need them for other logic, you can add them back.

const Nav = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1000);
  
  // We will now use the user info from the Redux store
  const { user, token } = useSelector(state => state.auth);
  
  const navigate = useNavigate();

  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth <= 1000);
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  useEffect(() => {
    if (sidebarVisible) {
      const handleClickOutside = (e) => {
        if (!e.target.closest(".sidebar") && !e.target.closest(".hamburger")) {
          setSidebarVisible(false);
        }
      };
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [sidebarVisible]);

  const toggleSidebar = () => setSidebarVisible(!sidebarVisible);

  return (
    <>
      <nav className="flex items-center justify-between bg-white py-4 px-6 border-b border-gray-200">
        {isMobile && (
          <div className="md:hidden">
            <button onClick={toggleSidebar} className="text-2xl hamburger">
              <FaBars />
            </button>
          </div>
        )}

        <Link to="/" className="flex items-center space-x-2 text-2xl font-bold" style={{ color: '#5A67BA' }}>
          <img src={logo} alt="StarFashion Logo" className="w-4 h-4" />
          <span>StarFashion</span>
        </Link>

        {!isMobile && (
          <div className="flex space-x-6">
            <Link to="/" className="hover:underline">Home</Link>
            <Link to="/products" className="hover:underline">Products</Link>
            <Link to="/contact-us" className="hover:underline">Contact Us</Link>
          </div>
        )}

        <div className="flex items-center space-x-6">
          {!isMobile && (
            <div className="relative flex">
              <input
                type="text"
                placeholder="Search products..."
                className="w-96 pl-8 p-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <FaSearch className="absolute top-3 left-2 text-[#5D5FEF]" />
            </div>
          )}

          <Link to="/cart" className="relative">
            <FaShoppingCart className="text-2xl text-gray-800" />
            {/* The cart item count is temporarily removed until the cart feature is ready */}
          </Link>

          {/* Use the user state from Redux store */}
          {user && token ? (
            <Link to='/profilepage'>
              <FaUser className="hover:cursor-pointer" size={25} />
            </Link>
          ) : (
            <Link
              to="/login" // Changed from /account to match our auth page route
              className="px-4 py-1 rounded-full bg-blue-800 text-white font-semibold hover:bg-blue-900"
            >
              Sign Up
            </Link>
          )}
        </div>
      </nav>

      {sidebarVisible && <Sidebar closeSidebar={toggleSidebar} />}
    </>
  );
};

export default Nav;