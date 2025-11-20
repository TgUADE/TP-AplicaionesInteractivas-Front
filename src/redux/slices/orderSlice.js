import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const createOrder = createAsyncThunk(
  "order/createOrder",
  async ({ orderData, token }, { rejectWithValue }) => {
    try {
      console.log("📤 Enviando orden al backend:", orderData);

      const { data } = await axios.post("/orders", orderData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("✅ Orden creada exitosamente:", data);
      return data;
    } catch (error) {
      console.error("❌ Error completo:", error);
      console.error("❌ Respuesta del servidor:", error.response?.data);
      console.error("❌ Status:", error.response?.status);
      console.error("❌ Headers:", error.response?.headers);

      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchMyOrders = createAsyncThunk(
  "order/fetchMyOrders",
  async (_, { getState }) => {
    const state = getState();
    const token = state?.auth?.token;

    if (!token) {
      throw new Error("Debes iniciar sesión para ver tus órdenes.");
    }

    const { data } = await axios.get("/orders/my-orders", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return Array.isArray(data) ? data : [];
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState: {
    items: null,
    loading: false,
    error: null,
    myOrders: [],
    myOrdersLoading: false,
    myOrdersError: null,
    myOrdersLoaded: false,
  },
  reducers: {
    clearOrderState: (state) => {
      state.items = null;
      state.loading = false;
      state.error = null;
      state.myOrders = [];
      state.myOrdersLoading = false;
      state.myOrdersError = null;
      state.myOrdersLoaded = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchMyOrders.pending, (state) => {
        state.myOrdersLoading = true;
        state.myOrdersError = null;
        if (!state.myOrdersLoaded) {
          state.myOrders = [];
        }
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.myOrdersLoading = false;
        state.myOrdersLoaded = true;
        state.myOrders = action.payload ?? [];
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.myOrdersLoading = false;
        state.myOrdersError = action.error.message;
        state.myOrdersLoaded = false;
      });
  },
});

export const { clearOrderState } = orderSlice.actions;

export default orderSlice.reducer;
