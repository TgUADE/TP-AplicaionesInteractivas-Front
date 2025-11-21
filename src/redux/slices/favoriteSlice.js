import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchFavorites = createAsyncThunk(
  "favorite/fetchFavorites",
  async (token) => {
    const { data } = await axios.get("/api/favorites/my-favorites", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return data;
  }
);

export const toggleFavorite = createAsyncThunk(
  "favorite/toggleFavorite",
  async ({ productId, token }) => {
    const { data } = await axios.post(`/api/favorites/products/${productId}/toggle`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return data;
  }
);


const favoriteSlice = createSlice({
  name: "favorite",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Favorites
      .addCase(fetchFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Toggle Favorite
      .addCase(toggleFavorite.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(toggleFavorite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});


export default favoriteSlice.reducer;