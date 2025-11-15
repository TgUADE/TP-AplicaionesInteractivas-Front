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

const adminProductsSlice = createSlice({
  name: "adminProducts",
  initialState,
  reducers: {
    resetMutationState(state) {
      state.mutationStatus = "idle";
      state.mutationError = null;
    },
    setProducts(state, action) {
      state.items = action.payload ?? [];
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
    productAdded(state, action) {
      const product = action.payload;
      if (product && typeof product === "object") {
        state.items.unshift(product);
      }
    },
    productUpdated(state, action) {
      const product = action.payload;
      if (product?.id) {
        state.items = state.items.map((item) =>
          item.id === product.id ? { ...item, ...product } : item
        );
      }
    },
    productDeleted(state, action) {
      const productId = action.payload;
      state.items = state.items.filter((product) => product.id !== productId);
    },
    productImageAdded(state, action) {
      const { productId, image } = action.payload || {};
      if (!productId || !image) return;
      const product = state.items.find((item) => item.id === productId);
      if (product) {
        product.images = Array.isArray(product.images) ? product.images : [];
        product.images.push(image);
      }
    },
    productImageUpdated(state, action) {
      const { productId, image } = action.payload || {};
      if (!productId || !image) return;
      const product = state.items.find((item) => item.id === productId);
      if (product && Array.isArray(product.images)) {
        product.images = product.images.map((img) =>
          img.id === image.id ? image : img
        );
      }
    },
    productImageDeleted(state, action) {
      const { productId, imageId } = action.payload || {};
      if (!productId || !imageId) return;
      const product = state.items.find((item) => item.id === productId);
      if (product && Array.isArray(product.images)) {
        product.images = product.images.filter((img) => img.id !== imageId);
      }
    },
  },
});

export const { resetMutationState, setProducts } = adminProductsSlice.actions;

const {
  mutationStart,
  mutationSuccess,
  mutationFailure,
  productAdded,
  productUpdated,
  productDeleted,
  productImageAdded,
  productImageUpdated,
  productImageDeleted,
} = adminProductsSlice.actions;

export const createAdminProduct = (payload) => async (dispatch, getState) => {
  dispatch(mutationStart());
  try {
    const headers = getAuthHeaders(getState());
    const { data } = await api.post("/products", payload, { headers });
    if (data && typeof data === "object") {
      dispatch(productAdded(data));
    }
    dispatch(mutationSuccess());
    return data;
  } catch (error) {
    const message = getErrorMessage(error);
    dispatch(mutationFailure(message));
    throw new Error(message);
  }
};

export const updateAdminProduct =
  ({ productId, payload }) =>
  async (dispatch, getState) => {
    dispatch(mutationStart());
    try {
      const headers = getAuthHeaders(getState());
      const { data } = await api.put(`/products/${productId}`, payload, {
        headers,
      });
      if (data && typeof data === "object") {
        dispatch(productUpdated(data));
      }
      dispatch(mutationSuccess());
      return data;
    } catch (error) {
      const message = getErrorMessage(error);
      dispatch(mutationFailure(message));
      throw new Error(message);
    }
  };

export const deleteAdminProduct = (productId) => async (dispatch, getState) => {
  dispatch(mutationStart());
  try {
    const headers = getAuthHeaders(getState());
    await api.delete(`/products/${productId}`, { headers });
    dispatch(productDeleted(productId));
    dispatch(mutationSuccess());
    return productId;
  } catch (error) {
    const message = getErrorMessage(error);
    dispatch(mutationFailure(message));
    throw new Error(message);
  }
};

export const uploadAdminProductImage =
  ({ productId, payload }) =>
  async (dispatch, getState) => {
    dispatch(mutationStart());
    try {
      const headers = getAuthHeaders(getState());
      const { data } = await api.post(
        `/products/${productId}/images`,
        payload,
        { headers }
      );
      dispatch(
        productImageAdded({
          productId,
          image: data,
        })
      );
      dispatch(mutationSuccess());
      return { productId, image: data };
    } catch (error) {
      const message = getErrorMessage(error);
      dispatch(mutationFailure(message));
      throw new Error(message);
    }
  };

export const updateAdminProductImage =
  ({ productId, imageId, payload }) =>
  async (dispatch, getState) => {
    dispatch(mutationStart());
    try {
      const headers = getAuthHeaders(getState());
      const { data } = await api.put(
        `/products/${productId}/images/${imageId}`,
        payload,
        {
          headers,
        }
      );
      dispatch(
        productImageUpdated({
          productId,
          image: data,
        })
      );
      dispatch(mutationSuccess());
      return { productId, image: data };
    } catch (error) {
      const message = getErrorMessage(error);
      dispatch(mutationFailure(message));
      throw new Error(message);
    }
  };

export const deleteAdminProductImage =
  ({ productId, imageId }) =>
  async (dispatch, getState) => {
    dispatch(mutationStart());
    try {
      const headers = getAuthHeaders(getState());
      await api.delete(`/products/${productId}/images/${imageId}`, {
        headers,
      });
      dispatch(
        productImageDeleted({
          productId,
          imageId,
        })
      );
      dispatch(mutationSuccess());
      return { productId, imageId };
    } catch (error) {
      const message = getErrorMessage(error);
      dispatch(mutationFailure(message));
      throw new Error(message);
    }
  };

export default adminProductsSlice.reducer;
