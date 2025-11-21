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

export const fetchAdminCategories = createAsyncThunk(
  "adminCategories/fetchAll",
  async (_, { getState }) => {
    const headers = getAuthHeaders(getState());
    const { data } = await api.get("/categories", { headers });
    return Array.isArray(data) ? data : [];
  }
);

export const createAdminCategory = createAsyncThunk(
  "adminCategories/create",
  async (payload, { getState }) => {
    const headers = getAuthHeaders(getState());
    const { data } = await api.post("/categories", payload, { headers });
    return data;
  }
);

export const updateAdminCategory = createAsyncThunk(
  "adminCategories/update",
  async ({ categoryId, payload }, { getState }) => {
    const headers = getAuthHeaders(getState());
    const { data } = await api.put(`/categories/${categoryId}`, payload, {
      headers,
    });
    return data;
  }
);

export const deleteAdminCategory = createAsyncThunk(
  "adminCategories/delete",
  async (categoryId, { getState }) => {
    const headers = getAuthHeaders(getState());
    await api.delete(`/categories/${categoryId}`, { headers });
    return categoryId;
  }
);

const initialState = {
  items: [],
  loading: false,
  error: null,
  mutationStatus: "idle",
  mutationError: null,
};

const adminCategoriesSlice = createSlice({
  name: "adminCategories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.items = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchAdminCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createAdminCategory.pending, (state) => {
        state.mutationStatus = "loading";
        state.mutationError = null;
      })
      .addCase(createAdminCategory.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";
        state.mutationError = null;
        const category = action.payload;
        if (category && typeof category === "object") {
          state.items.unshift(category);
        }
      })
      .addCase(createAdminCategory.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.mutationError = action.error.message;
      })
      .addCase(updateAdminCategory.pending, (state) => {
        state.mutationStatus = "loading";
        state.mutationError = null;
      })
      .addCase(updateAdminCategory.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";
        state.mutationError = null;
        const category = action.payload;
        if (category?.id) {
          state.items = state.items.map((item) =>
            item.id === category.id ? { ...item, ...category } : item
          );
        }
      })
      .addCase(updateAdminCategory.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.mutationError = action.error.message;
      })
      .addCase(deleteAdminCategory.pending, (state) => {
        state.mutationStatus = "loading";
        state.mutationError = null;
      })
      .addCase(deleteAdminCategory.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";
        state.mutationError = null;
        const categoryId = action.payload;
        state.items = state.items.filter(
          (category) => category.id !== categoryId
        );
      })
      .addCase(deleteAdminCategory.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.mutationError = action.error.message;
      });
  },
});

export default adminCategoriesSlice.reducer;
