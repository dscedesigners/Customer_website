import React from "react";
import { useSelector } from "react-redux";
import { useGetOrderByUserIdQuery } from "../../redux/services/orderSlice";

const Orders = () => {
  const { userInfo } = useSelector((state) => state.auth); // Get logged-in user
  const { data: orders, isLoading, error } = useGetOrderByUserIdQuery(userInfo?.user?.id, {
    skip: !userInfo?.user?.id, // Skip query if user is not logged in
  });

  console.log(orders);
  
  if (isLoading) return <p className="text-center text-gray-600">Loading your orders...</p>;
  if (error) return <p className="text-center text-red-500">Error fetching orders.</p>;
  if (!orders?.length) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-black">My Orders</h2>
        <p className="mt-4 text-gray-600">You have no orders yet.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-black">My Orders</h2>
        <ul className="space-y-4 mt-4">
          {orders.map((order) => (
            <li key={order._id} className="border-b pb-4">
              <div className="flex justify-between">
                <p className="text-lg font-medium">
                  Date: {new Date(order.createdAt).toLocaleDateString()}
                </p>
                <p className="text-lg font-medium">Total: Rs. {order.totalPrice.toFixed(2)}</p>
              </div>
              <p className="mt-2">
                Items: {order.orderItems.map((item) => item.product.name).join(", ")}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Orders;
