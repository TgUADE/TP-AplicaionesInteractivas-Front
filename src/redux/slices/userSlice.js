import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchUserProfile = createAsyncThunk(
  'user/fetchUserProfile', 
  async ({ token }) => {
    const response = await axios.get('/api/users/me', { 
      headers: { Authorization: `Bearer ${token}` } 
    });
    return response.data;
  }
);

export const updateUserProfile = createAsyncThunk(
  'user/updateUserProfile', 
  async ({ profileData, token }) => {
    // Eliminar solo los campos que el backend NO acepta en UserRequest
    const { id, role, createdAt, updatedAt, ...dataToSend } = profileData;
    
    // El backend acepta: email, password, name, surname
    const response = await axios.put('/api/users/me', dataToSend, { 
      headers: { Authorization: `Bearer ${token}` } 
    });
    return response.data;
  }
);

export const deleteUserAccount = createAsyncThunk(
  'user/deleteUserAccount', 
  async ({ token }) => {
    await axios.delete('/api/users/me', { 
      headers: { Authorization: `Bearer ${token}` } 
    });
    return;
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    profile: null,
    loading: false,
    error: null,
    isInitialized: false,
    role: null,
  },
  reducers: {
    clearUserProfile: (state) => {
      state.profile = null;
      state.loading = false;
      state.error = null;
      state.isInitialized = false;
      state.role = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        state.isInitialized = true;
        state.error = null;
        state.role = action.payload.role;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.profile = null;
      })
      // Update Profile
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        state.error = null;
        state.role = action.payload.role;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Delete Account
      .addCase(deleteUserAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUserAccount.fulfilled, (state) => {
        state.loading = false;
        state.profile = null;
        state.error = null;
        state.isInitialized = false;
        state.role = null;
      })
      .addCase(deleteUserAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearUserProfile } = userSlice.actions;
export default userSlice.reducer;