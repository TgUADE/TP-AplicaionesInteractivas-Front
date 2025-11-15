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
  loading: false,
  error: null,
};

const adminUsersSlice = createSlice({
  name: "adminUsers",
  initialState,
  reducers: {
    fetchStart(state) {
      state.loading = state.items.length === 0;
      state.error = null;
    },
    fetchSuccess(state, action) {
      state.loading = false;
      state.items = Array.isArray(action.payload) ? action.payload : [];
    },
    fetchFailure(state, action) {
      state.loading = false;
      state.error = action.payload ?? "Error inesperado";
    },
  },
});

const { fetchStart, fetchSuccess, fetchFailure } = adminUsersSlice.actions;

export const fetchAdminUsers = () => async (dispatch, getState) => {
  dispatch(fetchStart());
  try {
    const headers = getAuthHeaders(getState());
    const { data } = await api.get("/users", { headers });
    dispatch(fetchSuccess(data));
    return data;
  } catch (error) {
    const message = getErrorMessage(error);
    dispatch(fetchFailure(message));
    throw new Error(message);
  }
};

export default adminUsersSlice.reducer;
