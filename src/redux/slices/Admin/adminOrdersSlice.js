import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const getAuthHeaders = (state) => {
  const token = state.auth?.token;
  if (!token) throw new Error("Token de autenticación no disponible");
  return { Authorization: `Bearer ${token}` };
};

const sortOrders = (orders = []) =>
  orders
    .slice()
    .sort(
      (a, b) =>
        new Date(b?.createdAt || b?.created_at || 0) -
        new Date(a?.createdAt || a?.created_at || 0)
    );

const initialState = {
  items: [],
  loading: false,
  error: null,
  mutationStatus: "idle",
  mutationError: null,
};

export const fetchAdminOrders = createAsyncThunk(
  "adminOrders/fetchAll",
  async (_, { getState }) => {
    const headers = getAuthHeaders(getState());
    const { data } = await axios.get("/orders", { headers });
    return Array.isArray(data) ? data : [];
  }
);

export const updateAdminOrderStatus = createAsyncThunk(
  "adminOrders/updateStatus",
  async ({ orderId, status }, { getState }) => {
    const headers = getAuthHeaders(getState());
    const { data } = await axios.put(
      `/orders/${orderId}`,
      { status },
      { headers }
    );
    const payload = data && typeof data === "object" ? data : { status };
    return { orderId, payload };
  }
);

const adminOrdersSlice = createSlice({
  name: "adminOrders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminOrders.pending, (state) => {
        state.loading = state.items.length === 0;
        state.error = null;
      })
      .addCase(fetchAdminOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.items = sortOrders(
          Array.isArray(action.payload) ? action.payload : []
        );
      })
      .addCase(fetchAdminOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateAdminOrderStatus.pending, (state) => {
        state.mutationStatus = "loading";
        state.mutationError = null;
      })
      .addCase(updateAdminOrderStatus.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";
        state.mutationError = null;
        const { orderId, payload } = action.payload || {};
        if (!orderId) return;
        state.items = sortOrders(
          state.items.map((order) => {
            const id = order?.id ?? order?.orderId ?? order?._id;
            if (id !== orderId) return order;
            const status =
              payload?.status ?? payload?.state ?? order?.status ?? null;
            return {
              ...order,
              ...(payload && typeof payload === "object" ? payload : {}),
              status: status ?? order?.status,
            };
          })
        );
      })
      .addCase(updateAdminOrderStatus.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.mutationError = action.error.message;
      });
  },
});

export default adminOrdersSlice.reducer;
