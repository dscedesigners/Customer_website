// src/Pages/Orders/Orders.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useGetAllOrdersQuery } from '../../redux/services/orderSlice';
import { Link, useNavigate } from 'react-router-dom';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';

// Helper to format date
const formatDate = (dateString) => {
    // Handle potential invalid date strings
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date)) return "Invalid Date";
    return date.toLocaleDateString('en-US', { 
        day: 'numeric', 
        month: 'short',
        year: 'numeric' 
    });
};

// Helper to format currency
const inr = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(n);

// Component for a single product item
// --- 1. Accept `paymentMethod` as a prop ---
const OrderItem = ({ orderId, item, paymentMethod }) => {
    let statusText = item.orderStatus;
    let statusColor = "text-yellow-600"; // Processing

    if (item.orderStatus === "Delivered") {
        statusText = `Delivered on ${formatDate(item.updatedAt || new Date())}`;
        statusColor = "text-green-600";
    } else if (item.orderStatus === "Cancelled") {
        statusText = "Cancellation on the process";
        statusColor = "text-red-600";
    } else if (item.orderStatus === "Refunded") {
        statusText = `Refunded amount on ${formatDate(item.updatedAt || new Date())}`;
        statusColor = "text-blue-600";
    }

    return (
        <Link 
            to={`/orders/${orderId}?productId=${item.productId}`}
            className="flex items-center gap-4 p-4 border-b last:border-b-0 hover:bg-gray-50"
        >
            <img src={item.thumbnail} alt={item.name} className="w-20 h-20 object-cover rounded-md" />
            <div className="flex-1">
                <p className={`text-sm font-semibold ${statusColor}`}>{statusText}</p>
                {/* --- 2. Use the dynamic `paymentMethod` prop --- */}
                <p className="text-xs text-gray-500">{paymentMethod}</p>
                
                {item.orderStatus === "Delivered" ? (
                    <div className="text-xs text-gray-500 mt-2">
                        <span>Rate the product</span>
                        <div className="flex gap-1 text-gray-400">
                            <span>☆</span><span>☆</span><span>☆</span><span>☆</span><span>☆</span>
                        </div>
                    </div>
                ) : (
                    <p className="text-sm font-medium mt-1">{inr(item.price * item.quantity)}</p>
                )}
            </div>
            <IoChevronForward className="text-gray-400" />
        </Link>
    );
};

// Main Orders Page Component
const Orders = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [filter, setFilter] = useState("Past 6 months");
    const loaderRef = useRef(null);

    const { data, isLoading, isFetching, error } = useGetAllOrdersQuery(
        { page },
        { refetchOnFocus: true }
    );

    const orders = data?.data || [];
    const pagination = data?.pagination;

    // Infinite scroll observer
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            const target = entries[0];
            if (target.isIntersecting && !isFetching && pagination && pagination.hasNext) {
                setPage((prevPage) => prevPage + 1);
            }
        });

        const currentLoader = loaderRef.current;
        if (currentLoader) {
            observer.observe(currentLoader);
        }

        return () => {
            if (currentLoader) {
                observer.unobserve(currentLoader);
            }
        };
    }, [isFetching, pagination]);

    const showLoading = isLoading || (isFetching && page === 1);

    if (showLoading) {
        return <p className="text-center p-8">Loading your orders...</p>;
    }

    if (error) {
        return <p className="text-center text-red-500 p-8">Error fetching orders.</p>;
    }

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8">
            <button
                onClick={() => navigate('/products')}
                className="flex items-center gap-2 text-gray-700 font-medium mb-6 hover:text-black"
            >
                <IoChevronBack /> Shopping Continue
            </button>

            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-semibold">Your orders</h1>
                    <p className="text-sm text-gray-500">
                        {pagination ? `You have ${pagination.total} orders` : 'Loading...'}
                    </p>
                </div>
                <select 
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="border border-gray-300 rounded-md p-2 text-sm"
                >
                    <option>Past 6 months</option>
                    <option>Past 1 year</option>
                    <option>All time</option>
                </select>
            </div>

            {!Array.isArray(orders) || orders.length === 0 ? (
                <p className="text-center text-gray-600">You have no orders yet.</p>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order.orderId} className="border rounded-lg overflow-hidden shadow-sm">
                            <div className="bg-gray-50 p-4">
                                <span className="text-sm font-semibold">Order ID: {order.orderId}</span>
                            </div>
                            <div className="divide-y">
                                {Array.isArray(order.items) && order.items.map(item => (
                                    // --- 3. Pass the prop down ---
                                    <OrderItem 
                                        key={item.productId} 
                                        orderId={order.orderId} 
                                        item={item} 
                                        paymentMethod={order.paymentMethod} // <-- Pass it here
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination Loader */}
            <div ref={loaderRef} className="h-20 text-center pt-4">
                {isFetching && page > 1 && <p>Loading more orders...</p>}
                {!isFetching && pagination && !pagination.hasNext && orders.length > 0 && (
                    <p>You've reached the end!</p>
                )}
            </div>
        </div>
    );
};

export default Orders;