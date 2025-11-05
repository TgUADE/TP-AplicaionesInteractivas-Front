import { fetchJSON } from "./apiClient";

export const getCategories = (token) => fetchJSON("/categories", { token });

export const createCategory = (token, payload) =>
  fetchJSON("/categories", {
    token,
    method: "POST",
    body: JSON.stringify(payload),
  });

export const updateCategory = (token, id, payload) =>
  fetchJSON(`/categories/${id}`, {
    token,
    method: "PUT",
    body: JSON.stringify(payload),
  });

export const deleteCategory = (token, id) =>
  fetchJSON(`/categories/${id}`, {
    token,
    method: "DELETE",
  });
