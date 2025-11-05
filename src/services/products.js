import { fetchJSON } from "./apiClient";

export const getProducts = (token) => fetchJSON("/products", { token });

export const createProduct = (token, payload) =>
  fetchJSON("/products", {
    token,
    method: "POST",
    body: JSON.stringify(payload),
  });

export const updateProduct = (token, id, payload) =>
  fetchJSON(`/products/${id}`, {
    token,
    method: "PUT",
    body: JSON.stringify(payload),
  });

export const deleteProduct = (token, id) =>
  fetchJSON(`/products/${id}`, {
    token,
    method: "DELETE",
  });

export const uploadProductImage = (token, productId, payload) =>
  fetchJSON(`/products/${productId}/images`, {
    token,
    method: "POST",
    body: JSON.stringify(payload),
  });

export const updateProductImage = (token, productId, imageId, payload) =>
  fetchJSON(`/products/${productId}/images/${imageId}`, {
    token,
    method: "PUT",
    body: JSON.stringify(payload),
  });

export const deleteProductImage = (token, productId, imageId) =>
  fetchJSON(`/products/${productId}/images/${imageId}`, {
    token,
    method: "DELETE",
  });
