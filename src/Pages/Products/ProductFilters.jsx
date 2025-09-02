import React, { useState } from "react";

const ProductFiltersMobile = ({ priceRange, handlePriceChange }) => {
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);

  const toggleFilters = () => {
    setIsFiltersVisible(!isFiltersVisible);
  };

  return (
    <div>
      {/* Mobile Filters Button */}
      <button
        onClick={toggleFilters}
        className="w-full py-3 bg-blue-600 text-white text-lg font-semibold rounded-md shadow-lg mb-4"
      >
        Apply Filters
      </button>

      {/* Filters Sidebar */}
      {isFiltersVisible && (
        <div className="fixed top-0 left-0 w-full h-full bg-white p-6 space-y-6 shadow-lg z-50 md:hidden">
          {/* Category Filter */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg text-gray-800">Category</h3>
            <ul className="space-y-2">
              {["Formal Wear", "Casual Wear", "Sportswear", "Accessories"].map((category) => (
                <li key={category} className="flex items-center">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-blue-600 border-gray-400 rounded transition duration-200"
                  />
                  <span className="ml-2 text-gray-700">{category}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Price Filter */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg text-gray-800">Price Range</h3>
            <input
              type="range"
              min="0"
              max="200"
              value={priceRange}
              onChange={handlePriceChange}
              className="w-full h-2 bg-gray-200 rounded-full"
            />
            <p className="text-sm text-gray-600">Up to: Rs.{priceRange}</p>
          </div>

          {/* Brand Filter */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg text-gray-800">Brand</h3>
            <ul className="space-y-2">
              {["Brand A", "Brand B", "Brand C"].map((brand) => (
                <li key={brand} className="flex items-center">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-blue-600 border-gray-400 rounded transition duration-200"
                  />
                  <span className="ml-2 text-gray-700">{brand}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Size Filter */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg text-gray-800">Size</h3>
            <ul className="space-y-2">
              {["S", "M", "L"].map((size) => (
                <li key={size} className="flex items-center">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-blue-600 border-gray-400 rounded transition duration-200"
                  />
                  <span className="ml-2 text-gray-700">{size}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Color Filter */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg text-gray-800">Color</h3>
            <ul className="space-y-2">
              {["Black", "Blue", "White"].map((color) => (
                <li key={color} className="flex items-center">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-blue-600 border-gray-400 rounded transition duration-200"
                  />
                  <span className="ml-2 text-gray-700">{color}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductFiltersMobile;
