import React from 'react';
// 1. Import the Link component from react-router-dom
import { Link } from 'react-router-dom';
import picture1 from '../../Utiles/picture1.png';
import picture2 from '../../Utiles/picture2.png';
import picture3 from '../../Utiles/picture3.png';

const Products1 = () => {
  return (
    <section id="products" className="p-8 sm:p-16 bg-blue-50">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-[32px] leading-tight tracking-tight font-poppins font-bold text-blue-900 mb-4">
          Browse With The Gender
        </h2>
        <p className="text-base sm:text-lg text-[#666666] -mt-3">
          Checkout Top Trending Products
        </p>

        <div className="w-full flex flex-col sm:flex-row justify-center gap-6 mt-4">
          {/* 2. Wrap each section with a Link component */}
          
          {/* Male */}
          <Link to="/products?gender=male">
            <div className="group relative overflow-hidden rounded-xl">
              <img
                src={picture1}
                alt="Male"
                className="w-full h-auto object-cover rounded-xl shadow-lg transition-transform duration-300 ease-in-out transform group-hover:scale-105"
              />
              <p className="text-center text-blue-900 font-semibold mt-4">Male</p>
            </div>
          </Link>

          {/* Female */}
          <Link to="/products?gender=female">
            <div className="group relative overflow-hidden rounded-xl">
              <img
                src={picture2}
                alt="Female"
                className="w-full h-auto object-cover rounded-xl shadow-lg transition-transform duration-300 ease-in-out transform group-hover:scale-105"
              />
              <p className="text-center text-blue-900 font-semibold mt-4">Female</p>
            </div>
          </Link>

          {/* Kids */}
          <Link to="/products?gender=kids">
            <div className="group relative overflow-hidden rounded-xl">
              <img
                src={picture3}
                alt="Kids"
                className="w-full h-auto object-cover rounded-xl shadow-lg transition-transform duration-300 ease-in-out transform group-hover:scale-105"
              />
              <p className="text-center text-blue-900 font-semibold mt-4">Kids</p>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Products1;