import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const getAuthHeaders = (state) => {
  const token = state.auth?.token;
  if (!token) throw new Error("Token de autenticación no disponible");
  return { Authorization: `Bearer ${token}` };
};

const getErrorMessage = (error) =>
  error?.response?.data?.message ||
  error?.response?.data?.error ||
  error?.message ||
  "Error inesperado";

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

const adminOrdersSlice = createSlice({
  name: "adminOrders",
  initialState,
  reducers: {
    fetchStart(state) {
      state.loading = state.items.length === 0;
      state.error = null;
    },
    fetchSuccess(state, action) {
      state.loading = false;
      state.items = sortOrders(action.payload ?? []);
    },
    fetchFailure(state, action) {
      state.loading = false;
      state.error = action.payload ?? "Error inesperado";
    },
    mutationStart(state) {
      state.mutationStatus = "loading";
      state.mutationError = null;
    },
    mutationSuccess(state) {
      state.mutationStatus = "succeeded";
      state.mutationError = null;
    },
    mutationFailure(state, action) {
      state.mutationStatus = "failed";
      state.mutationError = action.payload ?? "Error inesperado";
    },
    orderStatusUpdated(state, action) {
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
    },
  },
});

const {
  fetchStart,
  fetchSuccess,
  fetchFailure,
  mutationStart,
  mutationSuccess,
  mutationFailure,
  orderStatusUpdated,
} = adminOrdersSlice.actions;

export const fetchAdminOrders = () => async (dispatch, getState) => {
  dispatch(fetchStart());
  try {
    const headers = getAuthHeaders(getState());
    const { data } = await axios.get("/orders", { headers });
    const orders = Array.isArray(data) ? data : [];
    dispatch(fetchSuccess(orders));
    return orders;
  } catch (error) {
    const message = getErrorMessage(error);
    dispatch(fetchFailure(message));
    throw new Error(message);
  }
};

export const updateAdminOrderStatus =
  ({ orderId, status }) =>
  async (dispatch, getState) => {
    dispatch(mutationStart());
    try {
      const headers = getAuthHeaders(getState());
      const { data } = await axios.put(
        `/orders/${orderId}`,
        { status },
        { headers }
      );
      const payload = data && typeof data === "object" ? data : { status };
      dispatch(
        orderStatusUpdated({
          orderId,
          payload,
        })
      );
      dispatch(mutationSuccess());
      return payload;
    } catch (error) {
      const message = getErrorMessage(error);
      dispatch(mutationFailure(message));
      throw new Error(message);
    }
  };

export default adminOrdersSlice.reducer;
