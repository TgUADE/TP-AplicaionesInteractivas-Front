import { fetchJSON } from "./apiClient";

export const getOrders = async (token) => {
  const res = await fetch("/orders", {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const text = await res.text();

  try {
    return JSON.parse(text || "null");
  } catch (parseError) {
    console.error("Parse error:", parseError);
    throw new Error("Respuesta no es JSON válido");
  }
};

export const updateOrderStatus = async (token, orderId, status) => {
  const res = await fetch(`/orders/${orderId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ status }),
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const message =
      data?.message || data?.error || data || res.statusText || "Error";
    throw new Error(message);
  }

  return data;
};

export const getOrderById = (token, id) =>
  fetchJSON(`/orders/${id}`, { token });

// Si tu API soporta cambios de estado, agregá helpers extra.
// Ejemplo: marcar como enviado, cancelar, etc.
// export const updateOrderStatus = (token, id, payload) =>
//   fetchJSON(`/orders/${id}/status`, {
//     token,
//     method: "PUT",
//     body: JSON.stringify(payload),
//   });
