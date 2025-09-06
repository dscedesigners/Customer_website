import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaTimes } from "react-icons/fa";

const ProductFilters1 = ({
  isFilterOpen,
  closeFilter,
  initialFilters,
  onApplyFilters,
  categories,
  brands,
}) => {
  const [localFilters, setLocalFilters] = useState(initialFilters);

  useEffect(() => {
    setLocalFilters(initialFilters);
  }, [initialFilters]);

  if (!isFilterOpen) return null;

  const handleBrandChange = (brandName) => {
    const currentBrands = localFilters.brands || [];
    const newBrands = currentBrands.includes(brandName)
      ? currentBrands.filter((b) => b !== brandName)
      : [...currentBrands, brandName];
    setLocalFilters({ ...localFilters, brands: newBrands });
  };
  
  const handleInputChange = (e) => {
      const { name, value } = e.target;
      setLocalFilters({ ...localFilters, [name]: value });
  };

  const handleClearFilters = () => {
    const clearedFilters = {
        gender: "",
        category: "",
        brands: [],
        minPrice: "",
        maxPrice: "",
    };
    setLocalFilters(clearedFilters);
    onApplyFilters(clearedFilters); // Apply cleared filters immediately
    closeFilter();
  };

  const handleSubmit = () => {
    onApplyFilters(localFilters);
    closeFilter();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="absolute top-[60px] left-0 w-full max-w-5xl bg-white border rounded-md shadow-lg p-6 z-50"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Filters</h3>
        <button onClick={closeFilter} className="text-gray-500 hover:text-gray-700">
          <FaTimes size={20} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Column 1: Gender & Price */}
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Gender</h4>
            <select
              name="gender"
              value={localFilters.gender || ''}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            >
              <option value="">All</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="unisex">Unisex</option>
            </select>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Price Range</h4>
            <div className="flex items-center gap-2">
              <input
                type="number"
                name="minPrice"
                placeholder="Min"
                value={localFilters.minPrice || ''}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="number"
                name="maxPrice"
                placeholder="Max"
                value={localFilters.maxPrice || ''}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        </div>

        {/* Column 2: Categories */}
        <div className="space-y-4">
          <h4 className="font-semibold mb-2">Category</h4>
          <div className="max-h-48 overflow-y-auto space-y-2 pr-2">
            {categories.map((cat) => (
              <div key={cat._id} className="flex items-center">
                <input
                  type="radio"
                  id={`cat-${cat._id}`}
                  name="category"
                  value={cat._id}
                  checked={localFilters.category === cat._id}
                  onChange={handleInputChange}
                  className="form-radio"
                />
                <label htmlFor={`cat-${cat._id}`} className="ml-2">{cat.name}</label>
              </div>
            ))}
          </div>
        </div>

        {/* Column 3: Brands */}
        <div className="space-y-4">
          <h4 className="font-semibold mb-2">Brands</h4>
          <div className="max-h-48 overflow-y-auto space-y-2 pr-2">
            {brands.map((brand) => (
              <div key={brand} className="flex items-center">
                <input
                  type="checkbox"
                  id={`brand-${brand}`}
                  checked={(localFilters.brands || []).includes(brand)}
                  onChange={() => handleBrandChange(brand)}
                  className="form-checkbox"
                />
                <label htmlFor={`brand-${brand}`} className="ml-2">{brand}</label>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-6 border-t pt-4">
        <button
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          onClick={handleClearFilters}
        >
          Clear Filters
        </button>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={handleSubmit}
        >
          Show Results
        </button>
      </div>
    </motion.div>
  );
};

export default ProductFilters1;