import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useGetProductsQuery } from "../../redux/services/productSlice";
import { useGetCategoriesQuery, useGetBrandsQuery } from "../../redux/services/filterSlice";
// 1. Import all 3 hooks
import { 
  useAddOrUpdateItemMutation, 
  useDeleteItemMutation 
} from "../../redux/services/cartSlice"; 
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

  // 2. Import cart mutations
  const [addOrUpdateItem] = useAddOrUpdateItemMutation();
  const [deleteItem] = useDeleteItemMutation();

  // 3. NEW STATE: Holds quantities for all products
  // This state will persist even when child components unmount
  const [cartQuantities, setCartQuantities] = useState({});
  
  // 4. NEW REF: Holds debounce timers for each product
  const debounceTimers = useRef({});

  const getFiltersFromURL = useCallback(() => {
    const params = new URLSearchParams(location.search);
    const brands = params.get('brands');
    return { sortBy: params.get('sortBy') || '', gender: params.get('gender') || '', category: params.get('category') || '', brands: brands ? brands.split(',') : [], minPrice: params.get('minPrice') || '', maxPrice: params.get('maxPrice') || '', rating: params.get('rating') || '' };
  }, [location.search]);

  // --- State management ---
  const [page, setPage] = useState(1);
  const [currentFilters, setCurrentFilters] = useState(getFiltersFromURL());
  const [combinedProducts, setCombinedProducts] = useState([]);
  
  // --- Data Fetching ---
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

  // 5. This is still correct: refetch on focus
  const { data, isLoading, isFetching, isError, error } 
    = useGetProductsQuery(query, { refetchOnFocus: true });

  // --- 6. UPDATED useEffect: Populates both products AND quantities ---
  useEffect(() => {
    if (data?.data) {
      const newQuantities = {};
      data.data.forEach(p => {
        if (p.cart > 0) {
          newQuantities[p._id] = p.cart;
        }
      });
      
      // Merge with existing quantities (in case some are mid-debounce)
      setCartQuantities(prev => ({ ...prev, ...newQuantities }));

      setCombinedProducts(prev => {
        if (page === 1) return data.data;
        const existingIds = new Set(prev.map(p => p._id));
        const newProducts = data.data.filter(p => !existingIds.has(p._id));
        return [...prev, ...newProducts];
      });
    }
  }, [data, page]);

  // --- Infinite scroll observer (unchanged) ---
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

  // --- Filter handlers (unchanged) ---
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
  
  // --- 7. NEW CART HANDLERS ---
  
  // Passed to ProductCard for the first add
  const handleInitialAddToCart = (productId) => {
    const newQuantity = 1;
    
    // Optimistic UI update
    setCartQuantities(prev => ({ ...prev, [productId]: newQuantity }));

    // Call API (no debounce for first add)
    addOrUpdateItem({ productId, quantity: newQuantity })
      .unwrap()
      .catch(() => {
        // Revert on error
        setCartQuantities(prev => ({ ...prev, [productId]: 0 }));
      });
  };

  // Passed to ProductCard for +/- clicks
  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 0) return;

    const oldQuantity = cartQuantities[productId] || 0;

    // Optimistic UI update
    setCartQuantities(prev => ({ ...prev, [productId]: newQuantity }));

    // Clear existing timer
    if (debounceTimers.current[productId]) {
      clearTimeout(debounceTimers.current[productId]);
    }

    if (newQuantity === 0) {
      // Delete item (no debounce)
      deleteItem(productId)
        .unwrap()
        .catch(() => {
          setCartQuantities(prev => ({ ...prev, [productId]: oldQuantity }));
        });
    } else {
      // Update item (with debounce)
      debounceTimers.current[productId] = setTimeout(() => {
        addOrUpdateItem({ productId, quantity: newQuantity })
          .unwrap()
          .catch(() => {
            setCartQuantities(prev => ({ ...prev, [productId]: oldQuantity }));
          });
      }, 3000); // 3-second debounce
    }
  };

  return (
    <div className="relative p-4 md:p-8">
      {/* --- Filter Bar (unchanged) --- */}
      <div className="flex items-center gap-4 mb-6 overflow-x-auto pb-2">
        <button onClick={() => setIsFilterOpen(true)} className="flex items-center gap-2 px-4 py-2 border rounded-md whitespace-nowrap">
          <FiFilter /> Filters
        </button>
        <div className="h-full border-l mx-2"></div>
        <div className="flex items-center gap-2">
          <QuickFilter onClick={() => handleQuickFilterClick('sortBy', 'popularity')} isActive={currentParams.get('sortBy') === 'popularity'}>Popular</QuickFilter>
          <QuickFilter onClick={() => handleQuickFilterClick('priceRange', {min: 0, max: 500})} isActive={currentParams.get('minPrice') === '0' && currentParams.get('maxPrice') === '500'}>Under ₹500</QuickFilter>
          <QuickFilter onClick={() => handleQuickFilterClick('priceRange', {min: 500, max: 1000})} isActive={currentParams.get('minPrice') === '500' && currentParams.get('maxPrice') === '1000'}>₹500-1000</QuickFilter>
          <QuickFilter onClick={() => handleQuickFilterClick('rating', 4)} isActive={currentParams.get('rating') === '4'}>4+ Rating</QuickFilter>
          <QuickFilter onClick={() => handleQuickFilterClick('gender', 'female')} isActive={currentParams.get('gender') === 'female'}>Female</QuickFilter>
        </div>
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
              // 8. Pass new props to ProductCard
              <ProductCard 
                key={product._id} 
                product={product} 
                quantity={cartQuantities[product._id] || 0}
                onInitialAddToCart={handleInitialAddToCart}
                onQuantityChange={handleQuantityChange}
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