// src/redux/features/authSlice.js

import { createSlice } from '@reduxjs/toolkit';
import { userApiSlice } from '../services/userSlice'; // Import the API slice

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  status: 'idle', // NEW: 'idle' | 'loading' | 'succeeded' | 'failed'
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logOut(state) {
      state.user = null;
      state.token = null;
      state.status = 'idle';
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    // We no longer need setCredentials here, as extraReducers will handle it
  },
  // NEW: extraReducers listen to actions from other slices (like userApiSlice)
  extraReducers: (builder) => {
    builder
      // When a login or token verification is pending, set status to 'loading'
      .addMatcher(userApiSlice.endpoints.login.matchPending, (state, action) => {
        state.status = 'loading';
      })
      .addMatcher(userApiSlice.endpoints.verifyToken.matchPending, (state, action) => {
        state.status = 'loading';
      })
      // When login or verification is successful, update credentials and status
      .addMatcher(userApiSlice.endpoints.login.matchFulfilled, (state, action) => {
        const { user, token } = action.payload;
        state.user = user;
        state.token = token;
        state.status = 'succeeded';
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
      })
      .addMatcher(userApiSlice.endpoints.verifyToken.matchFulfilled, (state, action) => {
        const { user } = action.payload; // verify-token might return slightly different data
        state.user = user;
        state.status = 'succeeded';
      })
      // When login or verification fails, clear the state
      .addMatcher(userApiSlice.endpoints.login.matchRejected, (state, action) => {
        state.status = 'failed';
        state.user = null;
        state.token = null;
      })
      .addMatcher(userApiSlice.endpoints.verifyToken.matchRejected, (state, action) => {
        state.status = 'failed';
        state.user = null;
        state.token = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      });
  },
});

export const { logOut } = authSlice.actions;
export default authSlice.reducer;