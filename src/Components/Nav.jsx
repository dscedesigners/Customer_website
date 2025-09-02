import React, { useState, useEffect } from "react";
import { FaShoppingCart, FaSearch, FaBars } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar"; // Static Sidebar Component
import { FaUser } from "react-icons/fa";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase.config";
import {useGetCartItemsQuery} from '../redux/services/userSlice'
import { useSelector } from "react-redux";
import logo from '../Utiles/logo2.png';


const Nav = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [user,setUser] = useState('')

  // Check if the screen is mobile-sized
  const navigate = useNavigate()

  
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 1000); // Adjust for mobile view
  };
    checkIfMobile(); // Initial check
    window.addEventListener("resize", checkIfMobile); // Event listener for resizing

    return () => {
      window.removeEventListener("resize", checkIfMobile); // Cleanup listener
    };
  }, []);

  useEffect(()=>{
    onAuthStateChanged(auth,(user)=>{
      if(user){
        setUser(user)
      }
      else{
        navigate('/account')
      }
    })
  })

  const {userInfo} = useSelector(state=>state.auth)

  const {data:cart,refetch} = useGetCartItemsQuery({userId:userInfo?.user?.id})
  
  // Close Sidebar when clicked outside
  useEffect(() => {
    if (sidebarVisible) {
      const handleClickOutside = (e) => {
        if (!e.target.closest(".sidebar") && !e.target.closest(".hamburger")) {
          setSidebarVisible(false);
        }
      };
      document.addEventListener("click", handleClickOutside);

      return () => {
        document.removeEventListener("click", handleClickOutside);
      };
    }
  }, [sidebarVisible]);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const toggleSearch = () => {
    setSearchVisible(!searchVisible);
  };

  return (
    <>
      {/* Navbar */}
      <nav className="flex items-center justify-between bg-white py-4 px-6 border-b border-gray-200">
        {/* Hamburger Icon (Only on mobile) */}
        {isMobile && (
          <div className="md:hidden">
            <button onClick={toggleSidebar} className="text-2xl hamburger">
              <FaBars />
            </button>
          </div>
        )}

        {/* My Profile Link in Navbar */}
       <Link to="/" className="flex items-center space-x-2 text-2xl font-bold" style={{ color: '#5A67BA' }}>
  <img src={logo} alt="StarFashion Logo" className="w-4 h-4" />
  <span>StarFashion</span>
</Link>


        {/* Navbar Links (Visible in PC view) */}
        {!isMobile && (
          <div className="flex space-x-6">
            <Link to="/" className="hover:underline">Home</Link>
            <Link to="/products" className="hover:underline">Products</Link>
            <Link to="/contact-us" className="hover:underline">Contact Us</Link>
          </div>
        )}

        {/* Right Section: Search Bar, Cart, Sign Up Button */}
        <div className="flex items-center space-x-6">
          {/* Search Bar (Visible in PC view) */}
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

          {/* Cart Icon */}
          <Link to="/cart" className="relative">
            <FaShoppingCart className="text-2xl text-gray-800" />
            {cart?.cartItems?.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {cart.cartItems.length}
              </span>
            )}
          </Link>

          {/* Sign Up Button (Visible in PC and Mobile) */}
          {user?(<>
            <Link to='/profilepage'>
            <FaUser className="hover:cursor-pointer" size={25}/>
            </Link>
          </>):(<>
            <Link
            to="/account"
            className="px-4 py-1 rounded-full bg-blue-800 text-white font-semibold hover:bg-blue-900"
            >
              Sign Up
            </Link>
          </>)}
        </div>
      </nav>

      {/* Sidebar (Visible only on mobile) */}
      {sidebarVisible && <Sidebar closeSidebar={toggleSidebar} />}

      {/* Mobile View Search Bar */}
      {isMobile && searchVisible && (
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 bg-white w-80 py-2 border border-gray-300 rounded-md shadow-lg">
          <input
            type="text"
            placeholder="Search"
            className="outline-none w-full p-2"
          />
        </div>
      )}
    </>
  );
};

export default Nav;
