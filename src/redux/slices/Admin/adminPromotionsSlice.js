import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

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

const sortPromotions = (promotions = []) =>
  promotions
    .slice()
    .sort(
      (a, b) =>
        new Date(b?.createdAt || b?.created_at || 0) -
        new Date(a?.createdAt || a?.created_at || 0)
    );

export const fetchAdminPromotions = createAsyncThunk(
  "adminPromotions/fetchAll",
  async (_, { getState, rejectWithValue }) => {
    try {
      const headers = getAuthHeaders(getState());
      const { data } = await api.get("/promotions", { headers });
      return Array.isArray(data) ? data : [];
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const createAdminPromotion = createAsyncThunk(
  "adminPromotions/create",
  async (payload, { getState, rejectWithValue }) => {
    try {
      const headers = getAuthHeaders(getState());
      const { data } = await api.post("/promotions", payload, { headers });
      return data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const updateAdminPromotion = createAsyncThunk(
  "adminPromotions/update",
  async ({ promotionId, payload }, { getState, rejectWithValue }) => {
    try {
      const headers = getAuthHeaders(getState());
      const { data } = await api.put(`/promotions/${promotionId}`, payload, {
        headers,
      });
      return data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const deleteAdminPromotion = createAsyncThunk(
  "adminPromotions/delete",
  async (promotionId, { getState, rejectWithValue }) => {
    try {
      const headers = getAuthHeaders(getState());
      await api.delete(`/promotions/${promotionId}`, { headers });
      return promotionId;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const activateAdminPromotion = createAsyncThunk(
  "adminPromotions/activate",
  async (promotionId, { getState, rejectWithValue }) => {
    try {
      const headers = getAuthHeaders(getState());
      const { data } = await api.put(
        `/promotions/${promotionId}/activate`,
        {},
        { headers }
      );
      return data ?? { id: promotionId, active: true };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const deactivateAdminPromotion = createAsyncThunk(
  "adminPromotions/deactivate",
  async (promotionId, { getState, rejectWithValue }) => {
    try {
      const headers = getAuthHeaders(getState());
      const { data } = await api.put(
        `/promotions/${promotionId}/deactivate`,
        {},
        { headers }
      );
      return data ?? { id: promotionId, active: false };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

const initialState = {
  items: [],
  loading: false,
  mutationStatus: "idle",
  mutationError: null,
  error: null,
};

const adminPromotionsSlice = createSlice({
  name: "adminPromotions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminPromotions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminPromotions.fulfilled, (state, action) => {
        state.loading = false;
        state.items = sortPromotions(
          Array.isArray(action.payload) ? action.payload : []
        );
      })
      .addCase(fetchAdminPromotions.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || action.error?.message || "Error inesperado";
      })
      .addCase(createAdminPromotion.pending, (state) => {
        state.mutationStatus = "loading";
        state.mutationError = null;
      })
      .addCase(createAdminPromotion.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";
        state.mutationError = null;
        const promotion = action.payload;
        if (promotion && typeof promotion === "object") {
          state.items = sortPromotions([promotion, ...state.items]);
        }
      })
      .addCase(createAdminPromotion.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.mutationError =
          action.payload || action.error?.message || "Error inesperado";
      })
      .addCase(updateAdminPromotion.pending, (state) => {
        state.mutationStatus = "loading";
        state.mutationError = null;
      })
      .addCase(updateAdminPromotion.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";
        state.mutationError = null;
        const promotion = action.payload;
        if (promotion?.id) {
          state.items = sortPromotions(
            state.items.map((item) =>
              item.id === promotion.id ? { ...item, ...promotion } : item
            )
          );
        }
      })
      .addCase(updateAdminPromotion.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.mutationError =
          action.payload || action.error?.message || "Error inesperado";
      })
      .addCase(deleteAdminPromotion.pending, (state) => {
        state.mutationStatus = "loading";
        state.mutationError = null;
      })
      .addCase(deleteAdminPromotion.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";
        state.mutationError = null;
        const promotionId = action.payload;
        state.items = state.items.filter(
          (promotion) => promotion.id !== promotionId
        );
      })
      .addCase(deleteAdminPromotion.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.mutationError =
          action.payload || action.error?.message || "Error inesperado";
      })
      .addCase(activateAdminPromotion.pending, (state) => {
        state.mutationStatus = "loading";
        state.mutationError = null;
      })
      .addCase(activateAdminPromotion.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";
        state.mutationError = null;
        const promotion = action.payload;
        if (promotion?.id) {
          state.items = sortPromotions(
            state.items.map((item) =>
              item.id === promotion.id ? { ...item, ...promotion } : item
            )
          );
        }
      })
      .addCase(activateAdminPromotion.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.mutationError =
          action.payload || action.error?.message || "Error inesperado";
      })
      .addCase(deactivateAdminPromotion.pending, (state) => {
        state.mutationStatus = "loading";
        state.mutationError = null;
      })
      .addCase(deactivateAdminPromotion.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";
        state.mutationError = null;
        const promotion = action.payload;
        if (promotion?.id) {
          state.items = sortPromotions(
            state.items.map((item) =>
              item.id === promotion.id ? { ...item, ...promotion } : item
            )
          );
        }
      })
      .addCase(deactivateAdminPromotion.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.mutationError =
          action.payload || action.error?.message || "Error inesperado";
      });
  },
});

export default adminPromotionsSlice.reducer;
