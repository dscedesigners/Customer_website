import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useGetProductsQuery } from "../../redux/services/productSlice";
import { useGetCategoriesQuery, useGetBrandsQuery } from "../../redux/services/filterSlice";
// 1. Import the cart mutation
import { useAddOrUpdateItemMutation } from "../../redux/services/cartSlice"; 
import ProductCard from "./ProductCard";
import SkeletonCard from "./SkeletonCard";
import { FiFilter } from "react-icons/fi";
import ProductFilters from "./ProductFilters";

const QuickFilter = ({ children, onClick, isActive }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-sm border rounded-full whitespace-nowrap ${isActive ? 'bg-blue-600 text-white border-blue-600' : 'bg-white hover:bg-gray-50'}`}
  >
    {children}
  </button>
);

const ProductPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const loaderRef = useRef(null);

  // 2. Initialize the mutation
  const [addOrUpdateItem] = useAddOrUpdateItemMutation();

  const getFiltersFromURL = useCallback(() => { /* ... (no changes) ... */
    const params = new URLSearchParams(location.search);
    const brands = params.get('brands');
    return { sortBy: params.get('sortBy') || '', gender: params.get('gender') || '', category: params.get('category') || '', brands: brands ? brands.split(',') : [], minPrice: params.get('minPrice') || '', maxPrice: params.get('maxPrice') || '', rating: params.get('rating') || '' };
  }, [location.search]);

  // --- All the state management and data fetching logic below remains the same ---
  const [page, setPage] = useState(1);
  const [currentFilters, setCurrentFilters] = useState(getFiltersFromURL());
  const [combinedProducts, setCombinedProducts] = useState([]);
  const { data: categoriesData } = useGetCategoriesQuery();
  const { data: brandsData } = useGetBrandsQuery();
  const categories = categoriesData?.data || [];
  const brands = brandsData?.data || [];
  useEffect(() => {
    const newFilters = getFiltersFromURL();
    if (JSON.stringify(newFilters) !== JSON.stringify(currentFilters)) { setPage(1); setCurrentFilters(newFilters); setCombinedProducts([]); }
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
    const updateParam = (key, value) => { if (value && value.length > 0) { if (Array.isArray(value)) params.set(key, value.join(',')); else params.set(key, value); } else { params.delete(key); } };
    updateParam('gender', filters.gender); updateParam('category', filters.category); updateParam('brands', filters.brands); updateParam('minPrice', filters.minPrice); updateParam('maxPrice', filters.maxPrice); updateParam('rating', filters.rating);
    navigate(`/products?${params.toString()}`);
  };
  const handleQuickFilterClick = (type, value) => {
    const params = new URLSearchParams(location.search);
    if (type === 'priceRange') {
      if (params.get('minPrice') === String(value.min) && params.get('maxPrice') === String(value.max)) { params.delete('minPrice'); params.delete('maxPrice'); } else { params.set('minPrice', value.min); params.set('maxPrice', value.max); }
    } else { if (params.get(type) === String(value)) { params.delete(type); } else { params.set(type, value); } }
    navigate(`/products?${params.toString()}`);
  };
  const currentParams = new URLSearchParams(location.search);

  // 3. Add the handler
  const handleAddToCart = async (productId) => {
    try {
      await addOrUpdateItem({ productId, quantity: 1 }).unwrap();
      console.log('Product added to cart');
      // You can add a toast notification here
    } catch (err) {
      console.error('Failed to add product:', err);
    }
  };

  return (
    <div className="relative p-4 md:p-8">
      <div className="flex items-center gap-4 mb-6 overflow-x-auto pb-2">
        {/* ... (filter bar buttons) ... */}
      </div>

      <ProductFilters
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        initialFilters={currentFilters}
        categories={categories}
        brands={brands}
        onApplyFilters={handleApplyFilters}
      />

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
              // 4. Pass the handler to the card
              <ProductCard 
                key={product._id} 
                product={product} 
                onAddToCartClick={handleAddToCart} 
              />
            ))}
          </div>
        ) : !isFetching ? (
          <p className="text-center text-gray-500 text-lg">No products found.</p>
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