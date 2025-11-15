import { createSlice } from "@reduxjs/toolkit";
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
  reducers: {
    resetAdminPromotionsState(state) {
      state.mutationStatus = "idle";
      state.mutationError = null;
    },
    fetchStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchSuccess(state, action) {
      state.loading = false;
      state.items = sortPromotions(action.payload ?? []);
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
    promotionAdded(state, action) {
      const promotion = action.payload;
      if (promotion && typeof promotion === "object") {
        state.items = sortPromotions([promotion, ...state.items]);
      }
    },
    promotionUpdated(state, action) {
      const promotion = action.payload;
      if (promotion?.id) {
        state.items = sortPromotions(
          state.items.map((item) =>
            item.id === promotion.id ? { ...item, ...promotion } : item
          )
        );
      }
    },
    promotionRemoved(state, action) {
      const promotionId = action.payload;
      state.items = state.items.filter(
        (promotion) => promotion.id !== promotionId
      );
    },
  },
});

export const { resetAdminPromotionsState } = adminPromotionsSlice.actions;

const {
  fetchStart,
  fetchSuccess,
  fetchFailure,
  mutationStart,
  mutationSuccess,
  mutationFailure,
  promotionAdded,
  promotionUpdated,
  promotionRemoved,
} = adminPromotionsSlice.actions;

export const fetchAdminPromotions = () => async (dispatch, getState) => {
  dispatch(fetchStart());
  try {
    const headers = getAuthHeaders(getState());
    const { data } = await api.get("/promotions", { headers });
    const promotions = Array.isArray(data) ? data : [];
    dispatch(fetchSuccess(promotions));
    return promotions;
  } catch (error) {
    const message = getErrorMessage(error);
    dispatch(fetchFailure(message));
    throw new Error(message);
  }
};

export const createAdminPromotion = (payload) => async (dispatch, getState) => {
  dispatch(mutationStart());
  try {
    const headers = getAuthHeaders(getState());
    const { data } = await api.post("/promotions", payload, { headers });
    if (data && typeof data === "object") {
      dispatch(promotionAdded(data));
    }
    dispatch(mutationSuccess());
    return data;
  } catch (error) {
    const message = getErrorMessage(error);
    dispatch(mutationFailure(message));
    throw new Error(message);
  }
};

export const updateAdminPromotion =
  ({ promotionId, payload }) =>
  async (dispatch, getState) => {
    dispatch(mutationStart());
    try {
      const headers = getAuthHeaders(getState());
      const { data } = await api.put(`/promotions/${promotionId}`, payload, {
        headers,
      });
      if (data && typeof data === "object") {
        dispatch(promotionUpdated(data));
      }
      dispatch(mutationSuccess());
      return data;
    } catch (error) {
      const message = getErrorMessage(error);
      dispatch(mutationFailure(message));
      throw new Error(message);
    }
  };

export const deleteAdminPromotion =
  (promotionId) => async (dispatch, getState) => {
    dispatch(mutationStart());
    try {
      const headers = getAuthHeaders(getState());
      await api.delete(`/promotions/${promotionId}`, { headers });
      dispatch(promotionRemoved(promotionId));
      dispatch(mutationSuccess());
      return promotionId;
    } catch (error) {
      const message = getErrorMessage(error);
      dispatch(mutationFailure(message));
      throw new Error(message);
    }
  };

export const activateAdminPromotion =
  (promotionId) => async (dispatch, getState) => {
    dispatch(mutationStart());
    try {
      const headers = getAuthHeaders(getState());
      const { data } = await api.put(
        `/promotions/${promotionId}/activate`,
        {},
        { headers }
      );
      const promotion = data ?? { id: promotionId, active: true };
      dispatch(promotionUpdated(promotion));
      dispatch(mutationSuccess());
      return promotion;
    } catch (error) {
      const message = getErrorMessage(error);
      dispatch(mutationFailure(message));
      throw new Error(message);
    }
  };

export const deactivateAdminPromotion =
  (promotionId) => async (dispatch, getState) => {
    dispatch(mutationStart());
    try {
      const headers = getAuthHeaders(getState());
      const { data } = await api.put(
        `/promotions/${promotionId}/deactivate`,
        {},
        { headers }
      );
      const promotion = data ?? { id: promotionId, active: false };
      dispatch(promotionUpdated(promotion));
      dispatch(mutationSuccess());
      return promotion;
    } catch (error) {
      const message = getErrorMessage(error);
      dispatch(mutationFailure(message));
      throw new Error(message);
    }
  };

export default adminPromotionsSlice.reducer;
