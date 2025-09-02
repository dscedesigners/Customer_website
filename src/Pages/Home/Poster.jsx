import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import person1 from '../../Utiles/person1.jpg'; // Import the image

function Poster() {
  const handleScrollToTop = () => {
    window.scrollTo(0, 0); // Scroll to the top of the page
  };

  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-center justify-between rounded-xl bg-blue-800 text-white p-6 sm:p-8 mx-4 mt-20 mb-20">
      <div className="flex items-center mb-6 sm:mb-0">
        <img
          src={person1} // Use the imported image
          alt="Styled Look"
          className="h-32 w-32 sm:h-40 sm:w-40 object-cover rounded-full border-4 border-white"
        />
      </div>
      <div className="text-center sm:text-left sm:ml-8 sm:flex sm:items-center sm:space-x-8 sm:w-full">
        <div className="sm:w-2/3 text-center sm:text-left">
          <h3 className="text-2xl sm:text-3xl font-semibold mb-2 sm:mb-0">Find your Style!</h3>
          <p className="text-lg mb-4 sm:mb-0">Thousands of styles await!</p>
        </div>

        {/* Visible on larger screens (sm and above) with ticks */}
        <div className="hidden sm:flex sm:space-x-6 sm:items-center sm:flex-1 justify-start">
          <span className="text-lg font-medium flex items-center">
            <span className="mr-2 mb-1">✅</span> {/* Adjusted margin here */}
            Free Register
          </span>
          <span className="text-lg font-medium flex items-center">
            <span className="mr-2 mb-1">✅</span> {/* Adjusted margin here */}
            Great Service
          </span>
          <span className="text-lg font-medium flex items-center">
            <span className="mr-2 mb-1">✅</span> {/* Adjusted margin here */}
            Easy Payment
          </span>
        </div>
        
        {/* Link with onClick to handle scroll to top */}
        <Link to="/products" onClick={handleScrollToTop}>
          <button className="bg-white text-blue-800 px-4 py-2 rounded-full mt-4 sm:mt-0">Shop Collections</button>
        </Link>
      </div>
    </div>
  );
}

export default Poster;
