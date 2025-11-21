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

export const fetchAdminProducts = createAsyncThunk(
  "adminProducts/fetchAll",
  async (_, { getState }) => {
    const headers = getAuthHeaders(getState());
    const { data } = await api.get("/products", { headers });
    return Array.isArray(data) ? data : [];
  }
);

export const createAdminProduct = createAsyncThunk(
  "adminProducts/create",
  async (payload, { getState }) => {
    const headers = getAuthHeaders(getState());
    const { data } = await api.post("/products", payload, { headers });
    return data;
  }
);

export const updateAdminProduct = createAsyncThunk(
  "adminProducts/update",
  async ({ productId, payload }, { getState }) => {
    const headers = getAuthHeaders(getState());
    const { data } = await api.put(`/products/${productId}`, payload, {
      headers,
    });
    return data;
  }
);

export const deleteAdminProduct = createAsyncThunk(
  "adminProducts/delete",
  async (productId, { getState }) => {
    const headers = getAuthHeaders(getState());
    await api.delete(`/products/${productId}`, { headers });
    return productId;
  }
);

export const uploadAdminProductImage = createAsyncThunk(
  "adminProducts/uploadImage",
  async ({ productId, payload }, { getState }) => {
    const headers = getAuthHeaders(getState());
    const { data } = await api.post(
      `/products/${productId}/images`,
      payload,
      { headers }
    );
    return { productId, image: data };
  }
);

export const updateAdminProductImage = createAsyncThunk(
  "adminProducts/updateImage",
  async ({ productId, imageId, payload }, { getState }) => {
    const headers = getAuthHeaders(getState());
    const { data } = await api.put(
      `/products/${productId}/images/${imageId}`,
      payload,
      { headers }
    );
    return { productId, image: data };
  }
);

export const deleteAdminProductImage = createAsyncThunk(
  "adminProducts/deleteImage",
  async ({ productId, imageId }, { getState }) => {
    const headers = getAuthHeaders(getState());
    await api.delete(`/products/${productId}/images/${imageId}`, {
      headers,
    });
    return { productId, imageId };
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
        state.error = action.error.message;
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
        state.mutationError = action.error.message;
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
        state.mutationError = action.error.message;
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
        state.mutationError = action.error.message;
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
        state.mutationError = action.error.message;
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
        state.mutationError = action.error.message;
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
        state.mutationError = action.error.message;
      });
  },
});

export default adminProductsSlice.reducer;
