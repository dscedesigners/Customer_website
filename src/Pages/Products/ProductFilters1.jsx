import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaTimes } from "react-icons/fa";

const categoryOptions = {
  Material: [
    "Cotton", "Silk", "Polyester", "Nylon", "Cotton Blend", "Mix",
    "100% Cotton", "100% Silk", "70/30 Silk", "Hand Made", "60/40 Polyester",
  ],
  Color: ["Red", "Blue", "Green", "Black", "White", "Yellow"],
  Brands: ["Nike", "Adidas", "Puma", "Zara", "H&M"],
  Price: ["Under ₹500", "₹500–₹1000", "₹1000–₹2000", "Above ₹2000"],
  Ratings: ["1 Star", "2 Stars", "3 Stars", "4 Stars", "5 Stars"],
  Category: ["Men", "Women", "Kids", "Accessories"],
};

const ProductFilters1 = ({ isFilterOpen, closeFilter, applyFilter }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);

  if (!isFilterOpen) return null;

  const categories = Object.keys(categoryOptions);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="absolute top-[60px] left-0 w-full max-w-5xl bg-white border rounded-md shadow-lg p-4 z-50"
    >
      {/* Close Button */}
      <div className="flex justify-end mb-2">
        <button onClick={closeFilter} className="text-gray-500 hover:text-gray-700">
          <FaTimes size={20} />
        </button>
      </div>

      <h3 className="text-lg font-semibold mb-4">Suggested Filters</h3>

      <div className="grid grid-cols-2 gap-4">
        {/* Left Column */}
        <div className="space-y-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => {
                setSelectedCategory(category);
                setSelectedOption(null); // Reset option when category changes
              }}
              className={`w-full text-left px-4 py-2 border rounded hover:bg-gray-100 ${
                selectedCategory === category ? "bg-gray-200" : ""
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Right Column */}
        <div className="space-y-2">
          {selectedCategory && categoryOptions[selectedCategory] ? (
            <>
              <h4 className="font-semibold">{selectedCategory} Options</h4>
              <div className="flex flex-wrap gap-2">
                {categoryOptions[selectedCategory].map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setSelectedCategory(selectedCategory); // Reinforce category
                      setSelectedOption(option);
                    }}
                    className={`px-3 py-1 border rounded-full text-sm ${
                      selectedOption === option
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <p className="text-gray-500">Select a category to view options.</p>
          )}
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="flex justify-between mt-6">
        <button
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          onClick={() => {
            setSelectedCategory(null);
            setSelectedOption(null);
          }}
        >
          Clear Filters
        </button>

        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => {
            console.log("Show clicked");
            console.log("Selected Category:", selectedCategory);
            console.log("Selected Option:", selectedOption);

            if (selectedCategory && selectedOption) {
              applyFilter(selectedCategory, selectedOption);
              closeFilter();
            } else {
              alert("Please select both category and option.");
            }
          }}
        >
          Show
        </button>
      </div>
    </motion.div>
  );
};

export default ProductFilters1;
