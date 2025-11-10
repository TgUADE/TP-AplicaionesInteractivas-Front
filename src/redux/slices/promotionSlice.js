import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchPromotions= createAsyncThunk("promotions/fetchPromotions", async () => {
    const {data}= await axios.get("/api/promotions");
    return data;
});
export const productsOnSale= createAsyncThunk("promotions/productsOnSale", async () => {
    const {data}= await axios.get("/api/products/on-sale"); 
    return data;
});

const promotionSlice = createSlice({
    name: "promotions",
    initialState: {
        items: [],
        loading : false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
        //GET PROMOTIONS
            .addCase(fetchPromotions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPromotions.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchPromotions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

const productOnSaleSlice = createSlice({
    name: "products-on-sale",
    initialState: {
        items: [],
        loading : false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
        //GET PRODUCTS ON SALE
            .addCase(productsOnSale.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(productsOnSale.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(productsOnSale.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default promotionSlice.reducer;
export const productsOnSaleReducer = productOnSaleSlice.reducer;