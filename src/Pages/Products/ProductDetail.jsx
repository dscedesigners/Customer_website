import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { axiosInstance } from '../../axios';

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/products/${productId}`);
        setProduct(response.data.data);
      } catch (err) {
        setError('Could not find the requested product.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  const handleAddToCart = async () => {
    const userId = "replace-with-actual-user-id";
    if (!userId) {
      alert("Please log in to add items to your cart.");
      return;
    }
    setIsAdding(true);
    try {
      const cartItems = [{ product: product._id, quantity: 1 }];
      await axiosInstance.post('/users/addtocart', { user: userId, cartItems });
      alert(`${product.name} has been added to your cart!`);
    } catch (err) {
      alert('Failed to add product to cart.');
      console.error(err);
    } finally {
      setIsAdding(false);
    }
  };

  if (loading) return <div className="text-center p-10">Loading product...</div>;
  if (error) return <div className="text-center p-10 text-red-500">{error}</div>;
  if (!product) return <div className="text-center p-10">Product not found.</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Link to="/products" className="text-blue-500 hover:underline">
        &larr; Back to Products
      </Link>
      <div className="grid md:grid-cols-2 gap-8 mt-6">
        <div>
          <img src={product.thumbnail} alt={product.name} className="w-full rounded-lg shadow-lg" />
        </div>
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-gray-500 text-sm mt-1">Brand: {product.brand}</p>
          <p className="text-3xl text-blue-600 font-semibold my-4">₹{product.price}</p>
          <p className="text-gray-700 leading-relaxed">{product.description || "No description available."}</p>
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className="mt-6 w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isAdding ? 'Adding...' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;