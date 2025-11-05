import { fetchJSON } from "./apiClient";

export const getPromotions = (token) => fetchJSON("/promotions", { token });

export const createPromotion = (token, payload) =>
  fetchJSON("/promotions", {
    token,
    method: "POST",
    body: JSON.stringify(payload),
  });

export const updatePromotion = (token, id, payload) =>
  fetchJSON(`/promotions/${id}`, {
    token,
    method: "PUT",
    body: JSON.stringify(payload),
  });

export const deletePromotion = (token, id) =>
  fetchJSON(`/promotions/${id}`, {
    token,
    method: "DELETE",
  });

export const activatePromotion = (token, id) =>
  fetchJSON(`/promotions/${id}/activate`, {
    token,
    method: "PUT",
  });

export const deactivatePromotion = (token, id) =>
  fetchJSON(`/promotions/${id}/deactivate`, {
    token,
    method: "PUT",
  });
