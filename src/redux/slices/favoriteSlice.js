import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';

// Thunk 1: Fetch favorites
export const fetchFavorites = createAsyncThunk("favorite/fetchFavorites", async (token) => {  
    const { data } = await axios.get("/api/favorites/my-favorites", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return data;
});

// Thunk 2: Toggle favorite
export const toggleFavorite = createAsyncThunk("favorite/toggleFavorite", async ({ productId, token }) => {  
    const { data } = await axios.post(`/api/favorites/products/${productId}/toggle`, {}, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return data;
});


const favoriteSlice = createSlice({
    name: "favorite",
    initialState: { 
        items: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        // Builder 1: Fetch favorites
        builder
            .addCase(fetchFavorites.pending, (state) => {
                console.log('favoriteSlice - fetchFavorites pending');
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFavorites.fulfilled, (state, action) => {
                console.log('favoriteSlice - fetchFavorites fulfilled:', action.payload);
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchFavorites.rejected, (state, action) => {
                console.log('favoriteSlice - fetchFavorites rejected:', action.error);
                state.loading = false;
                state.error = action.error.message;
            })
            
        // Builder 2: Toggle favorite (mismo builder, diferentes cases)
            .addCase(toggleFavorite.pending, (state) => {
                console.log('favoriteSlice - toggleFavorite pending');
                state.loading = true;
                state.error = null;
            })
            .addCase(toggleFavorite.fulfilled, (state, action) => {
                console.log('favoriteSlice - toggleFavorite fulfilled:', action.payload);
                state.loading = false;
                
            })
            .addCase(toggleFavorite.rejected, (state, action) => {
                console.log('favoriteSlice - toggleFavorite rejected:', action.error);
                state.loading = false;
                state.error = action.error.message;
            });
    },
});


export default favoriteSlice.reducer;