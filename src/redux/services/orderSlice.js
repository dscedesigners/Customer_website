import { apiSlice } from "./apiSlice";
const Order = "/api/order"

export const orderSlice = apiSlice.injectEndpoints({
    endpoints: (builder)=>({
        createOrder: builder.mutation({
            query: ({ user, shippingAddress, paymentMethod }) => ({
                url:`${Order}/neworder`,
                method:"POST",
                body:{ user, shippingAddress, paymentMethod }
            }),
        }),
        getOrderByUserId: builder.query({
            query: (userId) => `${Order}/getallorders/${userId}`,
            providesTags: ["Orders"],
        }),
    })
})

export const {useCreateOrderMutation,useGetOrderByUserIdQuery} = orderSlice