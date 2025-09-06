import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/api`
  }),
  tagTypes: ["Product"], // Used for caching and re-fetching data
  endpoints: (builder) => ({}),
});