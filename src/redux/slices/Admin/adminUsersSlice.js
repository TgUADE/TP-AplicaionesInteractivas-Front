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

export const fetchAdminUsers = createAsyncThunk(
  "adminUsers/fetchAll",
  async (_, { getState, rejectWithValue }) => {
    try {
      const headers = getAuthHeaders(getState());
      const { data } = await api.get("/users", { headers });
      return Array.isArray(data) ? data : [];
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const adminUsersSlice = createSlice({
  name: "adminUsers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminUsers.pending, (state) => {
        state.loading = state.items.length === 0;
        state.error = null;
      })
      .addCase(fetchAdminUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.items = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchAdminUsers.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || action.error?.message || "Error inesperado";
      });
  },
});

export default adminUsersSlice.reducer;
