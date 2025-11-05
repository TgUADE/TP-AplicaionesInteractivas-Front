const API_BASE = "/api";

export const fetchJSON = async (path, { token, headers, ...init } = {}) => {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const error = new Error(
      data?.message || data?.error || data || response.statusText
    );
    error.status = response.status;
    error.payload = data;
    throw error;
  }

  return data;
};
