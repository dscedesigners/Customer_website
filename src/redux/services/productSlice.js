import { apiSlice } from "./apiSlice";
const product = "/api/product"

export const productSlice = apiSlice.injectEndpoints({
    endpoints: (builder)=>({
        getProducts: builder.query({
            query: () => `${product}/getproducts`,
        }),
        getSignfleProduct: builder.query({
            query: ({productId}) => `${product}/getproduct/${productId}`,
        })
    })
})

export const {useGetProductsQuery,useGetSignfleProductQuery} = productSlice