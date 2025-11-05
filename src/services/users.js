import { fetchJSON } from "./apiClient";

export const getUsers = (token) => fetchJSON("/users", { token });

// Más helpers si tu backend lo permite:
export const exportUsers = (token) => fetchJSON("/users/export", { token }); // ajustá la ruta según corresponda

// ...y cualquier otra operación (crear, actualizar, etc.) que tu API exponga.
