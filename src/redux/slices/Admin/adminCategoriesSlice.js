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

const initialState = {
  items: [],
  mutationStatus: "idle",
  mutationError: null,
};

const adminCategoriesSlice = createSlice({
  name: "adminCategories",
  initialState,
  reducers: {
    resetMutationState(state) {
      state.mutationStatus = "idle";
      state.mutationError = null;
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
    categoryAdded(state, action) {
      const category = action.payload;
      if (category && typeof category === "object") {
        state.items.unshift(category);
      }
    },
    categoryUpdated(state, action) {
      const category = action.payload;
      if (category?.id) {
        state.items = state.items.map((item) =>
          item.id === category.id ? { ...item, ...category } : item
        );
      }
    },
    categoryDeleted(state, action) {
      const categoryId = action.payload;
      state.items = state.items.filter(
        (category) => category.id !== categoryId
      );
    },
  },
});

export const { resetMutationState } = adminCategoriesSlice.actions;

const {
  mutationStart,
  mutationSuccess,
  mutationFailure,
  categoryAdded,
  categoryUpdated,
  categoryDeleted,
} = adminCategoriesSlice.actions;

export const createAdminCategory = (payload) => async (dispatch, getState) => {
  dispatch(mutationStart());
  try {
    const headers = getAuthHeaders(getState());
    const { data } = await api.post("/categories", payload, { headers });
    if (data && typeof data === "object") {
      dispatch(categoryAdded(data));
    }
    dispatch(mutationSuccess());
    return data;
  } catch (error) {
    const message = getErrorMessage(error);
    dispatch(mutationFailure(message));
    throw new Error(message);
  }
};

export const updateAdminCategory =
  ({ categoryId, payload }) =>
  async (dispatch, getState) => {
    dispatch(mutationStart());
    try {
      const headers = getAuthHeaders(getState());
      const { data } = await api.put(`/categories/${categoryId}`, payload, {
        headers,
      });
      if (data && typeof data === "object") {
        dispatch(categoryUpdated(data));
      }
      dispatch(mutationSuccess());
      return data;
    } catch (error) {
      const message = getErrorMessage(error);
      dispatch(mutationFailure(message));
      throw new Error(message);
    }
  };

export const deleteAdminCategory =
  (categoryId) => async (dispatch, getState) => {
    dispatch(mutationStart());
    try {
      const headers = getAuthHeaders(getState());
      await api.delete(`/categories/${categoryId}`, { headers });
      dispatch(categoryDeleted(categoryId));
      dispatch(mutationSuccess());
      return categoryId;
    } catch (error) {
      const message = getErrorMessage(error);
      dispatch(mutationFailure(message));
      throw new Error(message);
    }
  };

export default adminCategoriesSlice.reducer;
