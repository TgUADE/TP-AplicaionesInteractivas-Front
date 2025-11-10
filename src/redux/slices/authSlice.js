import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const isTokenExpired = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

export const loginUser = createAsyncThunk(
  'auth/loginUser', 
  async (credentials) => {
    const response = await axios.post('/api/v1/auth/login', credentials);
    const token = response.data.access_token || response.data.token;
    localStorage.setItem('authToken', token);
    
    return { token };
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser', 
  async (userInfo) => {
    
    const response = await axios.post('/api/v1/auth/register', userInfo);
    const token = response.data.access_token || response.data.token;
    localStorage.setItem('authToken', token);
    
    
    return { token };
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: null,
    isLoggedIn: false,
    isLoading: false,
    error: null,
    isInitialized: false,
  },
  reducers: {
    logout: (state) => {
      state.token = null;
      state.isLoggedIn = false;
      state.error = null;
      localStorage.removeItem('authToken');
      localStorage.removeItem('temp_cart');
      localStorage.removeItem('isAdmin');
      ;
    },
    initializeAuth: (state) => {
      const savedToken = localStorage.getItem('authToken');
      
      if (savedToken && !isTokenExpired(savedToken)) {
        state.token = savedToken;
        state.isLoggedIn = true;
        console.log("✅ Auth initialized from localStorage");
      } else {
        localStorage.removeItem('authToken');
        state.token = null;
        state.isLoggedIn = false;
      }
      
      state.isInitialized = true;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
    //LOGIN USER
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.isLoggedIn = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
        state.token = null;
        state.isLoggedIn = false;
      })
      //REGISTER USER
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.isLoggedIn = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
        state.token = null;
        state.isLoggedIn = false;
      });
  }
});

export const { logout, initializeAuth, clearError } = authSlice.actions;
export default authSlice.reducer;