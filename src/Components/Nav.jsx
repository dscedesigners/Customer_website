import React, { useState, useEffect } from "react";
import { 
  FaShoppingCart, 
  FaSearch, 
  FaBars, 
  FaUser, 
  FaBox, 
  FaMapMarkerAlt, 
  FaCog, 
  FaBell, 
  FaSignOutAlt, 
  FaUserCircle 
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logOut } from "../redux/feauters/authSlice";
import Sidebar from "./Sidebar";
import logo from '../Utiles/logo2.png';

const Nav = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1000);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [hideTimeoutId, setHideTimeoutId] = useState(null);

  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logOut());
    navigate('/account');
  };

  const handleMouseEnter = () => {
    if (hideTimeoutId) {
      clearTimeout(hideTimeoutId);
    }
    setDropdownVisible(true);
  };

  const handleMouseLeave = () => {
    const timeoutId = setTimeout(() => {
      setDropdownVisible(false);
    }, 200); // 200ms delay to prevent fast closing
    setHideTimeoutId(timeoutId);
  };

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
      <nav className="flex items-center justify-between bg-white py-4 px-6 border-b border-gray-200 sticky top-0 z-50">
        {isMobile && (
          <div className="md:hidden">
            <button onClick={toggleSidebar} className="text-2xl hamburger">
              <FaBars />
            </button>
          </div>
        )}

        <Link to="/" className="flex items-center space-x-2 text-2xl font-bold" style={{ color: '#5A67BA' }}>
          <img src={logo} alt="StarFashion Logo" className="h-8 w-auto" />
          <span className="hidden sm:inline">StarFashion</span>
        </Link>

        {!isMobile && (
          <div className="flex space-x-6">
            <Link to="/" className="hover:underline">Home</Link>
            <Link to="/products" className="hover:underline">Products</Link>
            <Link to="/contact" className="hover:underline">Contact Us</Link>
          </div>
        )}

        <div className="flex items-center space-x-4 md:space-x-6">
          {!isMobile && (
            <div className="relative flex">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full md:w-96 pl-8 p-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <FaSearch className="absolute top-3 left-2 text-[#5D5FEF]" />
            </div>
          )}

          <Link to="/cart" className="relative">
            <FaShoppingCart className="text-2xl text-gray-800" />
          </Link>

          {user ? (
            <div 
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <FaUserCircle className="hover:cursor-pointer text-gray-700" size={32} />

              {isDropdownVisible && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl z-20 animate-fade-in-down">
                  <div className="p-4 border-b">
                    <p className="font-semibold truncate">{user.name}</p>
                    <p className="text-sm text-gray-500 truncate">{user.email}</p>
                  </div>
                  <div className="py-2">
                    <Link to="/profilepage" className="flex items-center justify-between px-4 py-2 text-gray-700 hover:bg-gray-100">
                      <div className="flex items-center"><FaUser className="mr-3" /> Profile</div>
                      <span>&rsaquo;</span>
                    </Link>
                    <Link to="/profilepage/orders" className="flex items-center justify-between px-4 py-2 text-gray-700 hover:bg-gray-100">
                      <div className="flex items-center"><FaBox className="mr-3" /> Orders</div>
                      <span>&rsaquo;</span>
                    </Link>
                    <Link to="/profilepage/address" className="flex items-center justify-between px-4 py-2 text-gray-700 hover:bg-gray-100">
                      <div className="flex items-center"><FaMapMarkerAlt className="mr-3" /> Saved Address</div>
                      <span>&rsaquo;</span>
                    </Link>
                    <Link to="/settings" className="flex items-center justify-between px-4 py-2 text-gray-700 hover:bg-gray-100">
                      <div className="flex items-center"><FaCog className="mr-3" /> Settings</div>
                      <span>&rsaquo;</span>
                    </Link>
                     <div className="flex items-center justify-between px-4 py-2 text-gray-700 hover:bg-gray-100">
                        <div className="flex items-center"><FaBell className="mr-3" /> Notification</div>
                        <button className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">Allow</button>
                    </div>
                  </div>
                  <div className="border-t">
                    <button onClick={handleLogout} className="flex items-center w-full text-left px-4 py-3 text-red-500 hover:bg-gray-100">
                      <FaSignOutAlt className="mr-3" /> Log Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/account"
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