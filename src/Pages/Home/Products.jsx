import React, { useState, useEffect } from 'react';
import product1 from '../../Utiles/person1.jpg';
import product2 from '../../Utiles/person2.jpg';
import product3 from '../../Utiles/person1.jpg';
import product4 from '../../Utiles/person2.jpg';
import product5 from '../../Utiles/person1.jpg';
import product6 from '../../Utiles/person2.jpg';

const products = [
  { id: 1, image: product1 },
  { id: 2, image: product2 },
  { id: 3, image: product3 },
  { id: 4, image: product4 },
  { id: 5, image: product5 },
  { id: 6, image: product6 },
];

function Products() {
  const [currentIndex, setCurrentIndex] = useState(2); // Start in the middle image

  // Go to the next image
  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
  };

  // Go to the previous image
  const goToPrev = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + products.length) % products.length
    );
  };

  // Visible images (prev, current, next)
  const visibleImages = [
    products[(currentIndex - 1 + products.length) % products.length],
    products[currentIndex],
    products[(currentIndex + 1) % products.length],
  ];

  return (
    <section id="products" className="p-8 sm:p-16 bg-blue-50">
     <h2 className="text-[32px] leading-[100%] tracking-[0px] font-poppins font-bold text-center text-black mb-4">
  Browse With The Gender
</h2>
      <div className="relative mt-6">
        {/* Image Container */}
        <div className="flex items-center justify-center space-x-4 sm:space-x-12 overflow-hidden">
          {visibleImages.map((product, index) => {
            let widthClass = 'w-44 sm:w-72';
            let scaleClass = 'scale-90';
            let borderRadiusClass = 'rounded-md';

            if (index === 1) {
              widthClass = 'w-44 sm:w-96';
              scaleClass = 'scale-100';
              borderRadiusClass = 'rounded-lg';
            }

            return (
              <div
                key={product.id}
                onClick={index === 0 ? goToPrev : index === 2 ? goToNext : undefined}
                className={`transition-all transform duration-300 ease-in-out ${widthClass} ${scaleClass} cursor-pointer`}
              >
                <img
                  src={product.image}
                  alt={`Product ${product.id}`}
                  className={`w-full h-64 sm:h-96 object-cover ${borderRadiusClass} shadow-lg`}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Products;
