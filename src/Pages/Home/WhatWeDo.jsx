// src/components/WhatWeDo.jsx

import React from 'react';

function WhatWeDo() {
  return (
    <section className="p-10 bg-white mx-4 rounded-lg mb-20">
      <h2 className="text-3xl font-bold text-center text-black mb-8">What We Do</h2>
      
      {/* Unified container with one box */}
      <div className="bg-[linear-gradient(94.1deg,_#F4F4F4_-39.59%,_#91DEFB_99.19%)] p-6 rounded-lg shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Individual items now share the same background without their own box styles */}
          <div className="flex items-center p-6">
            <div className="text-orange-500 text-3xl mr-4">🛒</div>
            <div>
              <h3 className="font-semibold text-lg">Shop for Latest Wears</h3>
              <p className="text-gray-600">Get the latest trends delivered to your doorstep!</p>
            </div>
          </div>

          <div className="flex items-center p-6">
            <div className="text-green-500 text-3xl mr-4">📏</div>
            <div>
              <h3 className="font-semibold text-lg">Request for Measurement</h3>
              <p className="text-gray-600">Personalized measurements for the perfect fit.</p>
            </div>
          </div>

          <div className="flex items-center p-6">
            <div className="text-blue-500 text-3xl mr-4">💼</div>
            <div>
              <h3 className="font-semibold text-lg">Sale You Wear</h3>
              <p className="text-gray-600">Affordable fashion for everyone.</p>
            </div>
          </div>

          <div className="flex items-center p-6">
            <div className="text-pink-500 text-3xl mr-4">🚚</div>
            <div>
              <h3 className="font-semibold text-lg">Make Your Delivery</h3>
              <p className="text-gray-600">Convenient delivery at your doorstep.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default WhatWeDo;
