import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useGetProductsQuery } from "../../redux/services/productSlice";
import { useGetCategoriesQuery, useGetBrandsQuery } from "../../redux/services/filterSlice"; // Import new hooks
import ProductCard from "./ProductCard";
import SkeletonCard from "./SkeletonCard";
import { FiFilter } from "react-icons/fi";
import ProductFilters from "./ProductFilters";

const QuickFilterButton = ({ label, param, value, currentParams, onClick }) => {
  const isActive = currentParams.get(param) === value;
  return (
    <button
      onClick={() => onClick(param, value)}
      className={`px-4 py-2 text-sm border rounded-full ${isActive ? 'bg-blue-600 text-white border-blue-600' : 'bg-white hover:bg-gray-50'}`}
    >
      {label}
    </button>
  );
};

const ProductPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const loaderRef = useRef(null);

  const getFiltersFromURL = useCallback(() => {
    const params = new URLSearchParams(location.search);
    const brands = params.get('brands');
    return {
      sortBy: params.get('sortBy') || '',
      gender: params.get('gender') || '', // Added gender
      category: params.get('category') || '',
      brands: brands ? brands.split(',') : [],
      minPrice: params.get('minPrice') || '',
      maxPrice: params.get('maxPrice') || '',
      rating: params.get('rating') || '', // Added rating
    };
  }, [location.search]);

  const [page, setPage] = useState(1);
  const [currentFilters, setCurrentFilters] = useState(getFiltersFromURL());
  const [combinedProducts, setCombinedProducts] = useState([]);

  const { data: categoriesData } = useGetCategoriesQuery();
  const { data: brandsData } = useGetBrandsQuery();
  const categories = categoriesData?.data || [];
  const brands = brandsData?.data || [];

  useEffect(() => {
    const newFilters = getFiltersFromURL();
    if (JSON.stringify(newFilters) !== JSON.stringify(currentFilters)) {
      setPage(1);
      setCurrentFilters(newFilters);
      setCombinedProducts([]);
    }
  }, [location.search, currentFilters, getFiltersFromURL]);

  const queryParams = new URLSearchParams(location.search);
  queryParams.set('page', page);
  const query = queryParams.toString();

  const { data, isLoading, isFetching, isError, error } = useGetProductsQuery(query);

  useEffect(() => {
    if (data?.data) {
      setCombinedProducts(prev => {
        if (page === 1) return data.data;
        const existingIds = new Set(prev.map(p => p._id));
        const newProducts = data.data.filter(p => !existingIds.has(p._id));
        return [...prev, ...newProducts];
      });
    }
  }, [data, page]);

  const pagination = data?.pagination;

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const target = entries[0];
      if (target.isIntersecting && !isFetching && pagination && pagination.page < pagination.totalPages) {
        setPage((prevPage) => prevPage + 1);
      }
    });
    const currentLoader = loaderRef.current;
    if (currentLoader) observer.observe(currentLoader);
    return () => { if (currentLoader) observer.unobserve(currentLoader); };
  }, [isFetching, pagination]);

  const handleApplyFilters = (filters) => {
    const params = new URLSearchParams(location.search);
    // Use a helper to set or delete params
    const updateParam = (key, value) => {
      if (value && value.length > 0) {
        if (Array.isArray(value)) params.set(key, value.join(','));
        else params.set(key, value);
      } else {
        params.delete(key);
      }
    };
    
    updateParam('gender', filters.gender);
    updateParam('category', filters.category);
    updateParam('brands', filters.brands);
    updateParam('minPrice', filters.minPrice);
    updateParam('maxPrice', filters.maxPrice);
    updateParam('rating', filters.rating);
    
    navigate(`/products?${params.toString()}`);
  };

  const handleQuickFilterClick = (param, value) => {
    const params = new URLSearchParams(location.search);
    if (params.get(param) === value) {
        params.delete(param);
    } else {
        params.set(param, value);
    }
    navigate(`/products?${params.toString()}`);
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center gap-4 mb-6 relative">
        <button onClick={() => setIsFilterOpen(true)} className="flex items-center gap-2 px-4 py-2 border rounded-md">
          <FiFilter /> Filters
        </button>
        <ProductFilters
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          initialFilters={currentFilters}
          categories={categories}
          brands={brands}
          onApplyFilters={handleApplyFilters}
        />
        <div className="h-full border-l mx-2"></div>
        {/* POPULAR QUICK FILTER */}
        <QuickFilterButton label="Popular" param="sortBy" value="popularity" currentParams={new URLSearchParams(location.search)} onClick={handleQuickFilterClick} />
      </div>

      <main className="w-full">
         { (isLoading && combinedProducts.length === 0) ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {Array(10).fill(0).map((_, index) => <SkeletonCard key={index} />)}
              </div>
          ) : isError ? (
              <p className="text-center text-red-500 text-lg">Error: {error.toString()}</p>
          ) : combinedProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {combinedProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
          ) : !isFetching ? (
              <p className="text-center text-gray-500 text-lg">No products found matching your criteria.</p>
          ) : null}

          <div ref={loaderRef} className="h-20 text-center pt-4">
            {isFetching && <p>Loading more products...</p>}
            {!isFetching && pagination && pagination.page >= pagination.totalPages && combinedProducts.length > 0 && (
              <p>You've reached the end!</p>
            )}
          </div>
      </main>
    </div>
  );
};

export default ProductPage;