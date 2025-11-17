// src/Pages/Orders/OrderDetail.jsx
import React from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useGetOrderItemDetailsQuery } from '../../redux/services/orderSlice';
import { FaMapMarkerAlt, FaPhone } from 'react-icons/fa';
import { IoChevronBack } from 'react-icons/io5';

// --- 1. HELPER FUNCTIONS ---
const inr = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(
    n
  );

const formatDate = (dateString) => {
    const parts = dateString.split(' ')[0].split('/');
    if (parts.length !== 3) return "Invalid Date";
    const [day, month, year] = parts;
    const date = new Date(year, month - 1, day);
    if (isNaN(date)) return "Invalid Date";
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
};

const formatStatusDate = (dateString) => {
    const parts = dateString.split(' ')[0].split('/');
    if (parts.length !== 3) return "Invalid Date";
    const [day, month, year] = parts;
    const date = new Date(year, month - 1, day);
    if (isNaN(date)) return "Invalid Date";
    return date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' });
};

const getEstimatedDelivery = (dateString) => {
    const parts = dateString.split(' ')[0].split('/');
    if (parts.length !== 3) return "Invalid Date";
    const [day, month, year] = parts;
    const date = new Date(year, month - 1, day);
    if (isNaN(date)) return "Invalid Date";
    date.setDate(date.getDate() + 14);
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
};

const formatEstimatedDelivery = (dateString) => {
    const parts = dateString.split(' ')[0].split('/');
    if (parts.length !== 3) return "Invalid Date";
    const [day, month, year] = parts;
    const date = new Date(year, month - 1, day);
    if (isNaN(date)) return "Invalid Date";
    date.setDate(date.getDate() + 14); 
    
    const weekday = date.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNum = date.toLocaleDateString('en-US', { day: 'numeric' });
    
    return `${weekday} ${dayNum}`;
};

// --- 2. STATUS TRACKER COMPONENT ---
const StatusTracker = ({ currentStatus, orderDate, estimatedDate }) => {
    const statuses = ['Order Confirmed', 'Shipped', 'Out For Delivery', 'Delivered'];
    const displayStatus = currentStatus === 'Processing' ? 'Order Confirmed' : currentStatus;
    
    let currentIndex = statuses.indexOf(displayStatus);
    if (currentIndex === -1) currentIndex = 0; 

    return (
        <div className="flex items-start justify-between my-8 relative">
            <div className="absolute top-3 left-0 w-full h-0.5 bg-gray-300" />
            <div 
                className="absolute top-3 left-0 h-0.5 bg-black"
                style={{ width: `${(currentIndex / (statuses.length - 1)) * 100}%` }}
            />
            {statuses.map((status, index) => {
                const isActive = index === currentIndex;
                const isComplete = index < currentIndex;
                
                let dotClass = 'bg-gray-300';
                let textClass = 'text-gray-400';

                if (isActive) {
                    dotClass = 'bg-black'; 
                    textClass = 'text-black font-semibold';
                } else if (isComplete) {
                    dotClass = 'bg-black'; 
                    textClass = 'text-gray-700';
                }

                return (
                    <div key={status} className="z-10 flex flex-col items-center text-center w-24">
                        <div 
                            className={`w-6 h-6 rounded-full border-4 border-white ${dotClass}`}
                        />
                        <span className={`text-sm mt-2 ${textClass}`}>
                            {status}
                        </span>
                        
                        {index === 0 && (
                            <span className="text-xs text-gray-500 mt-1">{orderDate}</span>
                        )}
                        {index === statuses.length - 1 && (
                            <span className="text-xs text-gray-500 mt-1">Expected by, {estimatedDate}</span>
                        )}
                    </div>
                );
            })}
        </div>
    );
};


// --- 3. MAIN COMPONENT ---
const OrderDetail = () => {
    const { orderId } = useParams();
    const [searchParams] = useSearchParams();
    const productId = searchParams.get('productId');
    const navigate = useNavigate();

    const { data, isLoading, error } = useGetOrderItemDetailsQuery(
        { orderId, productId },
        { skip: !orderId || !productId }
    );

    if (isLoading) return <p className="text-center p-8">Loading order details...</p>;
    if (error) return <p className="text-center text-red-500 p-8">Error loading details.</p>;
    if (!data) return <p className="text-center p-8">Order not found.</p>;

    const {
        thumbnail,
        price,
        qty,
        size,
        color,
        shippingDetails,
        orderStatus,
        otherProductsInSameOrder,
        createdAt,
        paymentMethod, 
        name 
    } = data;

    // Calculate Summary
    const subtotal = price * qty;
    const tax = subtotal * 0.05; // 5% tax
    const shipping = 0; 
    const total = subtotal + tax + shipping;

    // Format dates
    const orderDateForStatus = formatStatusDate(createdAt); 
    const estimatedDateForStatus = formatEstimatedDelivery(createdAt); 
    const orderDateTopBar = formatDate(createdAt); 
    const estimatedDeliveryTopBar = getEstimatedDelivery(createdAt); 

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8">
            <button
                onClick={() => navigate('/orders')}
                className="flex items-center gap-2 text-gray-700 font-medium mb-6 hover:text-black"
            >
                <IoChevronBack /> Shopping Continue
            </button>

            {/* Top Info Bar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <span className="text-sm text-gray-600">
                    Order date: <span className="font-medium text-black">{orderDateTopBar}</span>
                </span>
                <span className="text-sm text-gray-600">
                    Estimated delivery: <span className="font-medium text-black">{estimatedDeliveryTopBar}</span>
                </span>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left/Main Column */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Product Card */}
                    <div className="flex flex-col md:flex-row items-start gap-4 p-4 border rounded-lg">
                        {/* --- 4. Wrap image in Link --- */}
                        <Link to={`/products/${productId}`}>
                            <img src={thumbnail} alt={name} className="w-24 h-24 object-cover rounded-md" />
                        </Link>
                        <div className="flex-1">
                            {/* --- 5. Wrap name in Link --- */}
                            <Link to={`/products/${productId}`}>
                                <h2 className="text-lg font-semibold hover:underline">{name}</h2>
                            </Link>
                            <p className="text-sm text-gray-600">Size: {size} | Color: {color}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-lg font-semibold">{inr(price)}</p>
                            <p className="text-sm text-gray-600">Qty: {qty}</p>
                        </div>
                    </div>

                    {/* Status Tracker */}
                    <div className="p-4 border rounded-lg">
                        <StatusTracker 
                            currentStatus={orderStatus} 
                            orderDate={orderDateForStatus}
                            estimatedDate={estimatedDateForStatus}
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                        <button className="flex-1 border border-gray-300 rounded-lg py-3 font-semibold hover:bg-gray-50">
                            Cancel
                        </button>
                        <button className="flex-1 bg-black text-white rounded-lg py-3 font-semibold hover:bg-gray-800">
                            Track Order
                        </button>
                    </div>

                    {/* Other Products */}
                    {otherProductsInSameOrder?.length > 0 && (
                        <div className="p-4 border rounded-lg">
                            <h3 className="text-xl font-semibold mb-4">Other Products in this Order</h3>
                            <div className="flex gap-4 overflow-x-auto">
                                {otherProductsInSameOrder.map(item => (
                                    // --- 6. Update Link for "Other Products" ---
                                    <Link 
                                        key={item.productId}
                                        to={`/products/${item.productId}`} // <-- Updated this link
                                        className="flex-shrink-0"
                                    >
                                        <img 
                                            src={item.thumbnail} 
                                            alt="Other product" 
                                            className="w-24 h-24 object-cover rounded-md border" 
                                        />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Shipping Details */}
                    <div className="p-6 bg-gray-50 rounded-lg">
                        <h3 className="text-xl font-semibold mb-4">Shipping Details</h3>
                        <div className="space-y-3">
                            <p className="font-medium">{shippingDetails.fullName}</p>
                            <div className="flex items-start gap-3">
                                <FaMapMarkerAlt className="mt-1 text-gray-600" />
                                <p className="text-sm text-gray-600">
                                    {shippingDetails.street}, {shippingDetails.city}, {shippingDetails.state}, {shippingDetails.zipCode}
                                </p>
                            </div>
                            <div className="flex items-start gap-3">
                                <FaPhone className="mt-1 text-gray-600" />
                                <p className="text-sm text-gray-600">{shippingDetails.contactPhone}</p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Payment Details */}
                    <div className="p-6 bg-gray-50 rounded-lg">
                        <h3 className="text-xl font-semibold mb-4">Payment Details</h3>
                        <p className="text-sm text-gray-600">{paymentMethod}</p>
                    </div>

                    {/* Summary */}
                    <div className="p-6 bg-gray-50 rounded-lg space-y-3">
                        <h3 className="text-xl font-semibold mb-4">Summary</h3>
                        <div className="flex justify-between text-sm"><span className="text-gray-600">Subtotal</span> <span>{inr(subtotal)}</span></div>
                        <div className="flex justify-between text-sm"><span className="text-gray-600">Tax (5%)</span> <span>{inr(tax)}</span></div>
                        <div className="flex justify-between text-sm"><span className="text-gray-600">Shipping</span> <span>{inr(shipping)}</span></div>
                        <div className="border-t my-2" />
                        <div className="flex justify-between font-semibold"><span >Total</span> <span>{inr(total)}</span></div>
                    </div>

                    <button className="w-full bg-black text-white rounded-lg py-3 font-semibold hover:bg-gray-800">
                        Download Invoice
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderDetail;