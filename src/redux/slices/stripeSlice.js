import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Crear sesión de checkout de Stripe
export const createCheckoutSession = createAsyncThunk(
  "stripe/createCheckoutSession",
  async (
    { cartProducts, cartId, checkoutData, token }
    
  ) => {
    
      const products = cartProducts.map((item) => ({
        name: item.product.name,
        description: item.product.description,
        price: item.product.current_price || item.product.price,
        quantity: item.quantity,
        images: item.product.images?.[0]?.imageUrl
          ? [item.product.images[0].imageUrl]
          : [],
      }));

      console.log("📤 Enviando al backend:", {
        products,
        cartId,
        shippingAddress: checkoutData.shippingAddress,
        billingAddress: checkoutData.billingAddress,
        origin: window.location.origin,
      });

      const { data } = await axios.post(
        "/api/stripe/create-checkout-session",
        {
          products,
          cartId,
          shippingAddress: checkoutData.shippingAddress,
          billingAddress: checkoutData.billingAddress,
          origin: window.location.origin,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      return data;
    
    }
);

const stripeSlice = createSlice({
  name: "stripe",
  initialState: {
    sessionId: null,
    sessionUrl: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearStripeState: (state) => {
      state.sessionId = null;
      state.sessionUrl = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createCheckoutSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCheckoutSession.fulfilled, (state, action) => {
        state.loading = false;
        state.sessionId = action.payload.sessionId;
        state.sessionUrl = action.payload.url;
      })
      .addCase(createCheckoutSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error creating checkout session";
      });
  },
});

export const { clearStripeState } = stripeSlice.actions;
export default stripeSlice.reducer;
