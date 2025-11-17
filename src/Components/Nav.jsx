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
import { useGetCartLengthQuery } from "../redux/services/cartSlice";

const Nav = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1000);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [hideTimeoutId, setHideTimeoutId] = useState(null);
  
  // --- 1. Add state for the search term ---
  const [searchTerm, setSearchTerm] = useState("");

  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { data: cartLengthData } = useGetCartLengthQuery(undefined, {
    skip: !user, 
  });
  const cartCount = cartLengthData?.length || 0;

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
    }, 200); 
    setHideTimeoutId(timeoutId);
  };

  // --- 2. Add search handler function ---
  const handleSearch = (e) => {
    // Check if the key pressed is "Enter" and the search term isn't empty
    if (e.key === 'Enter' && searchTerm.trim() !== "") {
      navigate(`/products?search=${searchTerm.trim()}`);
    }
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
              {/* --- 3. Connect input to state and handler --- */}
              <input
                type="text"
                placeholder="Search products..."
                className="w-full md:w-96 pl-8 p-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleSearch}
              />
              <FaSearch className="absolute top-3 left-2 text-[#5D5FEF]" />
            </div>
          )}

          <Link to="/cart" className="relative">
            <FaShoppingCart className="text-2xl text-gray-800" />
            {user && cartCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
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
                    <Link to="/orders" className="flex items-center justify-between px-4 py-2 text-gray-700 hover:bg-gray-100">
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