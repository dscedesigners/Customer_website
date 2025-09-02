import React, { useState } from "react";
import ProductFilters1 from "./ProductFilters1";
import productsData from "./ProductsData";

const ProductPage = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState(productsData);

  const applyFilter = (category, option) => {
    const filtered = productsData.filter((product) => {
      const normalize = (str) => str?.toLowerCase().trim();

      switch (category) {
        case "Color":
          return normalize(product.color) === normalize(option);
        case "Brands":
          return normalize(product.brand) === normalize(option);
        case "Material":
          return normalize(product.material) === normalize(option);
        case "Category":
          return normalize(product.category) === normalize(option);
        case "Ratings":
          return normalize(product.rating) === normalize(option);
        case "Price":
          if (option === "Under ₹500") return product.price < 500;
          if (option === "₹500–₹1000") return product.price >= 500 && product.price <= 1000;
          if (option === "₹1000–₹2000") return product.price > 1000 && product.price <= 2000;
          if (option === "Above ₹2000") return product.price > 2000;
          return true;
        default:
          return true;
      }
    });

    console.log("Filtered products:", filtered);
    setFilteredProducts(filtered);
  };

  return (
    <div className="p-6">
      <button
        onClick={() => setIsFilterOpen(true)}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Open Filters
      </button>

      <ProductFilters1
        isFilterOpen={isFilterOpen}
        closeFilter={() => setIsFilterOpen(false)}
        applyFilter={applyFilter}
      />

      <div className="grid grid-cols-3 gap-4 mt-6">
        {filteredProducts.length === 0 ? (
          <p className="text-center col-span-full text-gray-500">No products found for selected filter.</p>
        ) : (
          filteredProducts.map((product) => (
            <div key={product.id} className="border p-4 rounded shadow-sm">
              <h4 className="font-semibold text-lg">{product.name}</h4>
              <p>Color: {product.color}</p>
              <p>Brand: {product.brand}</p>
              <p>Material: {product.material}</p>
              <p>Category: {product.category}</p>
              <p>Rating: {product.rating}</p>
              <p>Price: ₹{product.price}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductPage;
