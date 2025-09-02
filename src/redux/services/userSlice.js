import { apiSlice } from "./apiSlice";

const userAPI = '/api/users'

export const userApiSlice = apiSlice.injectEndpoints({
    endpoints:(builder)=>({
        createUser :builder.mutation({
            query:({phone})=>({
                url:`${userAPI}/signup`,
                method:"POST",
                body:{phone}
            })
        }),
        updateUser: builder.mutation({
            query: ({ userId, data }) => ({
              url: `${userAPI}/update/${userId}`,
              method: "PATCH",
              body: data,
            }),
        }),
        addToCartOfUser : builder.mutation({
            query: ({user, cartItems}) => ({
                url:`${userAPI}/addtocart`,
                method:"POST",
                body:{user,cartItems}
            })
        }),
        removeFromCartUser : builder.mutation({
            query: ({user, product}) => ({
                url:`${userAPI}/removefromcart`,
                method:"DELETE",
                body:{user, product}
            })
        }),
        removeProdFromCart : builder.mutation({
            query: ({user, product}) => ({
                url:`${userAPI}/removeproductfromcart`,
                method:"DELETE",
                body:{user, product}
            })
        }),
        getUserById: builder.query({
            query: ({userId}) => `${userAPI}/user/${userId}`,
        }),
        getCartItems: builder.query({
            query: ({userId}) => `${userAPI}/cartitems/${userId}`,
        })
    })
})

export const {
    useCreateUserMutation,
    useUpdateUserMutation,
    useAddToCartOfUserMutation,
    useRemoveFromCartUserMutation,
    useGetUserByIdQuery,
    useGetCartItemsQuery,
    useRemoveProdFromCartMutation
} = userApiSlice