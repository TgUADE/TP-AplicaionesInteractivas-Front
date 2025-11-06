import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';


// Recibe un objeto con orderData y token
export const createOrder = createAsyncThunk("order/createOrder", async ({ orderData, token }) => {  
    const { data } = await axios.post("/orders", orderData, {
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    },
    });
    return data;
}
);

const orderSlice = createSlice({
    name: "order",
    initialState: {
        items: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createOrder.pending, (state) => {
                console.log('orderSlice - pending');
                state.loading = true;
                state.error = null;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                console.log('orderSlice - fulfilled:', action.payload);
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(createOrder.rejected, (state, action) => {
                console.log('orderSlice - rejected:', action.error);
                state.loading = false;
                state.error = action.error.message;
            }); 
    },
});

export default orderSlice.reducer;