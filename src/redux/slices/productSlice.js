import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchProducts= createAsyncThunk("products/fetchProducts", async () => {
    const {data}= await axios.get("/api/products");
    return data;
});

export const fetchProductById= createAsyncThunk("products/fetchProductById", async (productId) => {
    const {data}= await axios.get(`/api/products/${productId}`);
    return data;
});



const productSlice = createSlice({
    name: "products",
    initialState: {
        items: [],
        loading : false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

const productIDSlice = createSlice({
    name: "product-id",
    initialState: {
        item: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProductById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProductById.fulfilled, (state, action) => {
                state.loading = false;
                state.item = action.payload;
            })
            .addCase(fetchProductById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});




export default productSlice.reducer;
export const productIDReducer = productIDSlice.reducer;
