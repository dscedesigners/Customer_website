import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import showcase from '../../Utiles/banner.png';

const Showcase2 = () => {
  const handleScrollToTop = () => {
    window.scrollTo(0, 0);
  };

  return (
    <div className="mx-auto px-0 sm:px-0 flex flex-col lg:flex-row justify-between items-center space-y-10 lg:space-y-0 lg:space-x-10 relative" style={{ backgroundImage: `url('/showcase.jpg')` }} >
   
<div className="image-container">
  <img src={showcase} alt="Showcase" className="main-image" />

  <div className="info-box">
    <p className="font-bold px-4 py-2" style={{color: '#333333',transform:'translateX(-35px)'}}>New Arrivals</p>
    <p class="info-p1">Discover our new collection</p>
    <p className="font-bold px-4 py-2" style={{color: '#333333',transform:'translateX(-35px)'}}>50% off to new customers</p>
<button type="button" class="text-white bg-blue-900 hover:bg-blue-900 focus:ring-4 focus:ring-blue-300 font-medium  text-sm px-8 py-3 me-2 mb-4 dark:bg-blue-900 dark:hover:bg-blue-900 focus:outline-none dark:focus:ring-blue-800">Buy Now</button>
  </div>
</div>
</div>
  );
};  

export default Showcase2;
