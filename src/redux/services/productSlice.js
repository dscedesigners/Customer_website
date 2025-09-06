import { apiSlice } from './apiSlice';

export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: (params) => `/products?${params}`,
      //
      // START OF NEW CODE
      //
      // This tells RTK Query to treat requests as the same data set 
      // if everything except the 'page' parameter is identical.
      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        const newQueryArgs = { ...queryArgs };
        delete newQueryArgs.page; // Exclude page from the cache key
        
        // Create a stable key based on filters but not page number
        const serialized = new URLSearchParams(newQueryArgs).toString();
        return `${endpointName}(${serialized})`;
      },
      // This function merges the incoming page's data with the existing cached data.
      merge: (currentCache, newItems) => {
        // Append new products to the existing list
        currentCache.data.push(...newItems.data);
        // Update pagination info with the latest from the server
        currentCache.pagination = newItems.pagination;
      },
      // This ensures a refetch happens if the page number changes.
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
      //
      // END OF NEW CODE
      //
      providesTags: ["Product"],
    }),
    getProductById: builder.query({
      query: (productId) => `/products/${productId}`,
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),
  }),
});

export const { useGetProductsQuery, useGetProductByIdQuery } = productApiSlice;