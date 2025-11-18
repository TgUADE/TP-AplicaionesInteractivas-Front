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

export const fetchAdminProducts = createAsyncThunk(
  "adminProducts/fetchAll",
  async (_, { getState, rejectWithValue }) => {
    try {
      const headers = getAuthHeaders(getState());
      const { data } = await api.get("/products", { headers });
      return Array.isArray(data) ? data : [];
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const createAdminProduct = createAsyncThunk(
  "adminProducts/create",
  async (payload, { getState, rejectWithValue }) => {
    try {
      const headers = getAuthHeaders(getState());
      const { data } = await api.post("/products", payload, { headers });
      return data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const updateAdminProduct = createAsyncThunk(
  "adminProducts/update",
  async ({ productId, payload }, { getState, rejectWithValue }) => {
    try {
      const headers = getAuthHeaders(getState());
      const { data } = await api.put(`/products/${productId}`, payload, {
        headers,
      });
      return data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const deleteAdminProduct = createAsyncThunk(
  "adminProducts/delete",
  async (productId, { getState, rejectWithValue }) => {
    try {
      const headers = getAuthHeaders(getState());
      await api.delete(`/products/${productId}`, { headers });
      return productId;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const uploadAdminProductImage = createAsyncThunk(
  "adminProducts/uploadImage",
  async ({ productId, payload }, { getState, rejectWithValue }) => {
    try {
      const headers = getAuthHeaders(getState());
      const { data } = await api.post(
        `/products/${productId}/images`,
        payload,
        { headers }
      );
      return { productId, image: data };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const updateAdminProductImage = createAsyncThunk(
  "adminProducts/updateImage",
  async ({ productId, imageId, payload }, { getState, rejectWithValue }) => {
    try {
      const headers = getAuthHeaders(getState());
      const { data } = await api.put(
        `/products/${productId}/images/${imageId}`,
        payload,
        { headers }
      );
      return { productId, image: data };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const deleteAdminProductImage = createAsyncThunk(
  "adminProducts/deleteImage",
  async ({ productId, imageId }, { getState, rejectWithValue }) => {
    try {
      const headers = getAuthHeaders(getState());
      await api.delete(`/products/${productId}/images/${imageId}`, {
        headers,
      });
      return { productId, imageId };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

const initialState = {
  items: [],
  loading: false,
  error: null,
  mutationStatus: "idle",
  mutationError: null,
};

const adminProductsSlice = createSlice({
  name: "adminProducts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchAdminProducts.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || action.error?.message || "Error inesperado";
      })
      .addCase(createAdminProduct.pending, (state) => {
        state.mutationStatus = "loading";
        state.mutationError = null;
      })
      .addCase(createAdminProduct.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";
        state.mutationError = null;
        const product = action.payload;
        if (product && typeof product === "object") {
          state.items.unshift(product);
        }
      })
      .addCase(createAdminProduct.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.mutationError =
          action.payload || action.error?.message || "Error inesperado";
      })
      .addCase(updateAdminProduct.pending, (state) => {
        state.mutationStatus = "loading";
        state.mutationError = null;
      })
      .addCase(updateAdminProduct.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";
        state.mutationError = null;
        const product = action.payload;
        if (product?.id) {
          state.items = state.items.map((item) =>
            item.id === product.id ? { ...item, ...product } : item
          );
        }
      })
      .addCase(updateAdminProduct.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.mutationError =
          action.payload || action.error?.message || "Error inesperado";
      })
      .addCase(deleteAdminProduct.pending, (state) => {
        state.mutationStatus = "loading";
        state.mutationError = null;
      })
      .addCase(deleteAdminProduct.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";
        state.mutationError = null;
        const productId = action.payload;
        state.items = state.items.filter((product) => product.id !== productId);
      })
      .addCase(deleteAdminProduct.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.mutationError =
          action.payload || action.error?.message || "Error inesperado";
      })
      .addCase(uploadAdminProductImage.pending, (state) => {
        state.mutationStatus = "loading";
        state.mutationError = null;
      })
      .addCase(uploadAdminProductImage.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";
        state.mutationError = null;
        const { productId, image } = action.payload || {};
        if (!productId || !image) return;
        const product = state.items.find((item) => item.id === productId);
        if (product) {
          product.images = Array.isArray(product.images) ? product.images : [];
          product.images.push(image);
        }
      })
      .addCase(uploadAdminProductImage.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.mutationError =
          action.payload || action.error?.message || "Error inesperado";
      })
      .addCase(updateAdminProductImage.pending, (state) => {
        state.mutationStatus = "loading";
        state.mutationError = null;
      })
      .addCase(updateAdminProductImage.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";
        state.mutationError = null;
        const { productId, image } = action.payload || {};
        if (!productId || !image) return;
        const product = state.items.find((item) => item.id === productId);
        if (product && Array.isArray(product.images)) {
          product.images = product.images.map((img) =>
            img.id === image.id ? image : img
          );
        }
      })
      .addCase(updateAdminProductImage.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.mutationError =
          action.payload || action.error?.message || "Error inesperado";
      })
      .addCase(deleteAdminProductImage.pending, (state) => {
        state.mutationStatus = "loading";
        state.mutationError = null;
      })
      .addCase(deleteAdminProductImage.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";
        state.mutationError = null;
        const { productId, imageId } = action.payload || {};
        if (!productId || !imageId) return;
        const product = state.items.find((item) => item.id === productId);
        if (product && Array.isArray(product.images)) {
          product.images = product.images.filter((img) => img.id !== imageId);
        }
      })
      .addCase(deleteAdminProductImage.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.mutationError =
          action.payload || action.error?.message || "Error inesperado";
      });
  },
});

export default adminProductsSlice.reducer;
