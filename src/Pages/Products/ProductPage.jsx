import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useGetProductsQuery } from "../../redux/productSlice"; // Import the Redux hook
import ProductCard from "./ProductCard";
import SkeletonCard from "./SkeletonCard";

const ProductPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Use the Redux hook to fetch data. It automatically handles loading, error, and data states.
  const { data, isLoading, isError, error } = useGetProductsQuery(location.search);

  // Extract products and pagination from the hook's return value
  const products = data?.data || [];
  const pagination = data?.pagination;

  const handlePageChange = (newPage) => {
    if (!pagination || newPage < 1 || newPage > pagination.totalPages) return;
    const params = new URLSearchParams(location.search);
    params.set('page', newPage);
    navigate(`${location.pathname}?${params.toString()}`);
  };

  const renderPagination = () => {
    if (!pagination || !pagination.totalPages || pagination.totalPages <= 1) return null;
    return (
      <div className="flex justify-center items-center space-x-4 mt-8">
        <button
          onClick={() => handlePageChange(pagination.page - 1)}
          disabled={pagination.page === 1}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="font-semibold">
          Page {pagination.page} of {pagination.totalPages}
        </span>
        <button
          onClick={() => handlePageChange(pagination.page + 1)}
          disabled={pagination.page === pagination.totalPages}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    );
  };

  let content;

  if (isLoading) {
    content = (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array(8).fill(0).map((_, index) => <SkeletonCard key={index} />)}
      </div>
    );
  } else if (isError) {
    content = <p className="text-center text-red-500 text-lg">Error: {error.toString()}</p>;
  } else if (products.length > 0) {
    content = (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
        {renderPagination()}
      </>
    );
  } else {
    content = <p className="text-center text-gray-500 text-lg">No products found.</p>;
  }

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold text-center mb-8">Explore Our Collection</h1>
      <main className="w-full max-w-7xl mx-auto">{content}</main>
    </div>
  );
};

export default ProductPage;