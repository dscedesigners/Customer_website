import {createApi,fetchBaseQuery} from '@reduxjs/toolkit/query/react'

export const apiSlice = createApi({
    // reducerPath:"Coffee_products",
    //baseQuery:fetchBaseQuery({baseUrl:'http://localhost:5000'}),
     baseQuery:fetchBaseQuery({baseUrl:'https://backend-boutique-website-2.onrender.com'}),
    tagTypes:["User","Product","Order","Cart"],
    endpoints:()=>({})
})