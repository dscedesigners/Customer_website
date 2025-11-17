// src/redux/services/orderSlice.js
import { apiSlice } from "./apiSlice";

const orderURL = '/orders';

export const orderApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // POST /api/orders
        createOrder: builder.mutation({
            query: (orderData) => ({ // Expects { addressId, totalAmount }
                url: `${orderURL}`,
                method: 'POST',
                body: orderData,
            }),
            // --- This is correct, it invalidates 'Order' ---
            invalidatesTags: ['Cart', 'CartLength', 'Order', 'Product'],
        }),

        // GET /api/orders
        getAllOrders: builder.query({
            query: (params) => ({ // Expects { page: 1 }
                url: `${orderURL}`,
                params: params,
            }),
            
            // --- THIS IS THE FIX ---
            // It now provides the generic 'Order' tag, which createOrder invalidates
            providesTags: (result) => {
                const tags = [{ type: 'Order', id: 'LIST' }, 'Order']; // <-- Added generic 'Order' tag
                if (result?.data) {
                    // This handles both the object and array case
                    const dataArray = Array.isArray(result.data) ? result.data : [result.data];
                    dataArray.forEach(order => {
                        tags.push({ type: 'Order', id: order.orderId });
                    });
                }
                return tags;
            },
            serializeQueryArgs: ({ endpointName }) => {
                return endpointName;
            },
            merge: (currentCache, newItems, { arg }) => {
                if (arg.page === 1) {
                    return {
                        message: newItems.message,
                        pagination: newItems.pagination,
                        data: newItems.data?.orderId ? [newItems.data] : [] 
                    };
                }
                if (newItems.data?.orderId) {
                    const dataArray = Array.isArray(currentCache.data) ? currentCache.data : [];
                    const existing = dataArray.find(o => o.orderId === newItems.data.orderId);
                    if (!existing) {
                        return {
                            ...currentCache,
                            pagination: newItems.pagination,
                            message: newItems.message,
                            data: [...dataArray, newItems.data]
                        };
                    }
                }
                return currentCache;
            },
            forceRefetch({ currentArg, previousArg }) {
                return currentArg !== previousArg;
            },
        }),

        // GET /api/orders/:orderId?productId=:productId
        getOrderItemDetails: builder.query({
            query: ({ orderId, productId }) => 
                `${orderURL}/${orderId}?productId=${productId}`,
            providesTags: (result, error, { orderId, productId }) => 
                [{ type: 'Order', id: orderId }, { type: 'Product', id: productId }],
        }),
    }),
});

export const {
    useCreateOrderMutation,
    useGetAllOrdersQuery,
    useGetOrderItemDetailsQuery,
} = orderApiSlice;