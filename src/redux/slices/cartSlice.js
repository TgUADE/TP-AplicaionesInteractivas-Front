import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ============ Async Thunks ============

// Inicializar carrito (cargar desde backend si está autenticado)
export const initializeCart = createAsyncThunk(
  "cart/initializeCart",
  async (_, { getState }) => {
    const state = getState();
    const { token, isLoggedIn } = state.auth;
    const { cartItems } = state.cart;
    
    console.log('🔄 initializeCart - isLoggedIn:', isLoggedIn, 'cartItems en memoria:', cartItems.length);
    
    if (!isLoggedIn || !token) {
      console.log('💾 No autenticado - usando memoria');
      return { type: 'memory' };
    }
    
    // Obtener carrito del backend (404 no se considera error)
    const response = await axios.get("/api/carts/my-carts", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      validateStatus: (status) => {
        // Aceptar 2xx y 404 como respuestas válidas
        return (status >= 200 && status < 300) || status === 404;
      },
    });
    
    // Si el backend no tiene carrito (404)
    if (response.status === 404) {
      console.log('📭 Backend no tiene carrito (404)');
      
      // Si hay items en memoria, marcar para sincronizar
      if (cartItems.length > 0) {
        console.log('⚠️ Hay', cartItems.length, 'items en memoria - Necesita sincronización');
        return { type: 'no-backend-cart-with-memory', needsSync: true };
      }
      
      // No hay carrito en backend ni items en memoria
      console.log('📭 No hay carrito ni items en memoria');
      return { type: 'backend', cart: null };
    }
    
    // Backend respondió con 2xx
    const userCart = Array.isArray(response.data) ? response.data[0] : response.data;
    
    // Si hay carrito en backend con items
    if (userCart && userCart.cartProducts && userCart.cartProducts.length > 0) {
      console.log('✅ Carrito encontrado en backend con', userCart.cartProducts.length, 'items');
      return { type: 'backend', cart: userCart };
    }
    
    // Si el backend tiene carrito vacío pero hay items en memoria
    if (cartItems.length > 0) {
      console.log('⚠️ Carrito backend vacío pero hay', cartItems.length, 'items en memoria - Necesita sincronización');
      return { type: 'backend-empty-with-memory', cart: userCart, needsSync: true };
    }
    
    // Backend tiene carrito vacío y no hay items en memoria
    console.log('📭 Carrito backend vacío y sin items en memoria');
    return { type: 'backend', cart: userCart };
  }
);

// Agregar producto al carrito
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ product, quantity = 1 }, { getState }) => {
    const thunkStartTime = performance.now();
    console.log('🟢 [cartSlice] INICIO - Thunk addToCart');
    
    const state = getState();
    const { token, isLoggedIn } = state.auth;
    
    // Usuario no autenticado: usar memoria
    if (!isLoggedIn || !token) {
      console.log('💾 [cartSlice] Usuario NO autenticado - usando MEMORIA (rápido)');
      return { 
        type: 'memory', 
        product, 
        quantity 
      };
    }
    
    // Usuario autenticado: usar backend
    console.log('🌐 [cartSlice] Usuario AUTENTICADO - usando BACKEND');
    let cart = state.cart.cart;
    
    // Crear carrito si no existe
    if (!cart) {
      console.log('📝 [cartSlice] Paso 1: Creando carrito en backend...');
      const createStart = performance.now();
      
      const { data: newCart } = await axios.post(
        "/api/carts",
        { productIds: [] },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      const createEnd = performance.now();
      console.log(`   ✅ Carrito creado en ${(createEnd - createStart).toFixed(2)}ms`);
      cart = newCart;
    }
    
    // Agregar producto al carrito
    console.log('📝 [cartSlice] Paso 2: POST - Agregando producto al carrito...');
    const postStart = performance.now();
    
    await axios.post(
      `/api/carts/${cart.id}/products`,
      { productId: product.id, quantity },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    const postEnd = performance.now();
    const postTime = (postEnd - postStart).toFixed(2);
    console.log(`   ✅ POST completado en ${postTime}ms`);
    
    // Obtener carrito actualizado
    console.log('📝 [cartSlice] Paso 3: GET - Obteniendo carrito actualizado...');
    const getStart = performance.now();
    
    const { data } = await axios.get("/api/carts/my-carts", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    const getEnd = performance.now();
    const getTime = (getEnd - getStart).toFixed(2);
    console.log(`   ✅ GET completado en ${getTime}ms`);
    
    const userCart = Array.isArray(data) ? data[0] : data;
    
    // Tiempo total del thunk
    const thunkEndTime = performance.now();
    const thunkTotal = (thunkEndTime - thunkStartTime).toFixed(2);
    console.log(`🟢 [cartSlice] FIN - Tiempo total del thunk: ${thunkTotal}ms`);
    console.log(`📊 [cartSlice] Resumen: POST=${postTime}ms | GET=${getTime}ms | TOTAL=${thunkTotal}ms`);
    
    return { type: 'backend', cart: userCart };
  }
);

// Actualizar cantidad de producto
export const updateQuantity = createAsyncThunk(
  "cart/updateQuantity",
  async ({ productId, quantity }, { getState }) => {
    const state = getState();
    const { token, isLoggedIn } = state.auth;
    
    // Usuario no autenticado: usar memoria
    if (!isLoggedIn || !token) {
      return { 
        type: 'memory', 
        productId, 
        quantity 
      };
    }
    
    // Usuario autenticado: usar backend
    const cart = state.cart.cart;
    
    if (!cart) {
      throw new Error("No hay carrito");
    }
    
    await axios.put(
      `/api/carts/${cart.id}/products/${productId}`,
      { quantity },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    // Obtener carrito actualizado
    const { data } = await axios.get("/api/carts/my-carts", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    const userCart = Array.isArray(data) ? data[0] : data;
    return { type: 'backend', cart: userCart };
  }
);

// Remover producto del carrito
export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (productId, { getState }) => {
    const state = getState();
    const { token, isLoggedIn } = state.auth;
    
    // Usuario no autenticado: usar memoria
    if (!isLoggedIn || !token) {
      return { 
        type: 'memory', 
        productId 
      };
    }
    
    // Usuario autenticado: usar backend
    const cart = state.cart.cart;
    
    if (!cart) {
      throw new Error("No hay carrito");
    }
    
    await axios.delete(
      `/api/carts/${cart.id}/product/${productId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    // Obtener carrito actualizado
    const { data } = await axios.get("/api/carts/my-carts", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    const userCart = Array.isArray(data) ? data[0] : data;
    return { type: 'backend', cart: userCart };
  }
);

// Limpiar carrito
export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, { getState }) => {
    const state = getState();
    const { token, isLoggedIn } = state.auth;
    
    // Usuario no autenticado: usar memoria
    if (!isLoggedIn || !token) {
      return { type: 'memory' };
    }
    
    // Usuario autenticado: usar backend
    const cart = state.cart.cart;
    
    if (cart) {
      await axios.delete(
        `/api/carts/${cart.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    }
    
    return { type: 'backend' };
  }
);

// Sincronizar carrito en memoria con backend (cuando el usuario inicia sesión)
export const syncMemoryCartToBackend = createAsyncThunk(
  "cart/syncMemoryCartToBackend",
  async (_, { getState }) => {
    console.log('🔄 syncMemoryCartToBackend - Iniciando sincronización');
    
    const state = getState();
    const { token, isLoggedIn } = state.auth;
    const { cartItems } = state.cart;
    
    // Si no hay items en memoria, no hacer nada
    if (cartItems.length === 0) {
      console.log('⚠️ No hay items en memoria para sincronizar');
      return { type: 'no-sync', cart: null };
    }
    
    // Si no está autenticado, no hacer nada
    if (!isLoggedIn || !token) {
      console.log('⚠️ Usuario no autenticado, no se puede sincronizar');
      return { type: 'no-sync', cart: null };
    }
    
    console.log('📦 Items a sincronizar:', cartItems.length);
    
    // 1. Crear carrito en backend
    console.log('🆕 Creando carrito en backend...');
    const { data: newCart } = await axios.post(
      "/api/carts",
      { productIds: [] },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log('✅ Carrito creado:', newCart.id);
    
    // 2. Agregar cada item al carrito
    for (const item of cartItems) {
      console.log(`➕ Agregando producto ${item.productId} (cantidad: ${item.quantity})`);
      await axios.post(
        `/api/carts/${newCart.id}/products`,
        { productId: item.productId, quantity: item.quantity },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
    }
    console.log('✅ Todos los productos sincronizados');
    
    // 3. Obtener carrito actualizado
    const { data } = await axios.get("/api/carts/my-carts", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    const userCart = Array.isArray(data) ? data[0] : data;
    console.log('✅ Carrito sincronizado completo:', userCart?.cartProducts?.length, 'items');
    
    return { type: 'sync-complete', cart: userCart };
  },
  {
    condition: (_, { getState }) => {
      const { cart } = getState();
      // No ejecutar si ya está cargando (otra sincronización en curso)
      if (cart.loading) {
        console.log('⚠️ Ya hay una sincronización en curso, abortando dispatch duplicado');
        return false;
      }
      return true;
    },
  }
);

// ============ Slice ============

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: null,
    cartItems: [],
    loading: false,
    error: null,
    isInitialized: false,
    needsSync: false,
  },
  reducers: {
    // Resetear todo el estado del carrito (al hacer logout)
    resetCartState: (state) => {
      state.cart = null;
      state.cartItems = [];
      state.loading = false;
      state.error = null;
      state.isInitialized = false;
      state.needsSync = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Initialize Cart
      .addCase(initializeCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(initializeCart.fulfilled, (state, action) => {
        state.loading = false;
        state.isInitialized = true;
        
        // Caso: Backend tiene carrito vacío pero hay items en memoria → marcar para sincronizar
        if (action.payload.needsSync) {
          console.log('🔔 needsSync = true - El hook debería sincronizar');
          state.needsSync = true;
          if (action.payload.cart) {
            state.cart = action.payload.cart;
          }
          return;
        }
        
        // Caso normal: Backend tiene carrito con items
        if (action.payload.type === 'backend' && action.payload.cart) {
          state.cart = action.payload.cart;
          
          const items = (action.payload.cart.cartProducts || [])
            .map((cp) => ({
              productId: cp.product?.id,
              quantity: cp.quantity,
              name: cp.product?.name,
              price: cp.product?.current_price || cp.product?.price,
              original_price: cp.product?.original_price,
              promotion: cp.product?.promotion,
              images: cp.product?.images,
              product: cp.product,
            }))
            .filter((item) => item.productId !== null);
          
          state.cartItems = items;
        }
      })
      .addCase(initializeCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.isInitialized = true;
      })
      
      // Add To Cart
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        
        if (action.payload.type === 'memory') {
          // Agregar a memoria
          const { product, quantity } = action.payload;
          const existingItem = state.cartItems.find(
            (item) => item.productId === product.id
          );
          
          if (existingItem) {
            existingItem.quantity += quantity;
          } else {
            state.cartItems.push({
              productId: product.id,
              quantity,
              name: product.name,
              price: product.current_price || product.price,
              original_price: product.original_price,
              promotion: product.promotion,
              images: product.images,
              product: product,
            });
          }
        } else {
          // Actualizar desde backend
          state.cart = action.payload.cart;
          
          const items = (action.payload.cart.cartProducts || [])
            .map((cp) => ({
              productId: cp.product?.id,
              quantity: cp.quantity,
              name: cp.product?.name,
              price: cp.product?.current_price || cp.product?.price,
              original_price: cp.product?.original_price,
              promotion: cp.product?.promotion,
              images: cp.product?.images,
              product: cp.product,
            }))
            .filter((item) => item.productId !== null);
          
          state.cartItems = items;
        }
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // Update Quantity
      .addCase(updateQuantity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateQuantity.fulfilled, (state, action) => {
        state.loading = false;
        
        if (action.payload.type === 'memory') {
          // Actualizar en memoria
          const { productId, quantity } = action.payload;
          
          if (quantity <= 0) {
            state.cartItems = state.cartItems.filter(
              (item) => item.productId !== productId
            );
          } else {
            const existingItem = state.cartItems.find(
              (item) => item.productId === productId
            );
            if (existingItem) {
              existingItem.quantity = quantity;
            }
          }
        } else {
          // Actualizar desde backend
          state.cart = action.payload.cart;
          
          const items = (action.payload.cart.cartProducts || [])
            .map((cp) => ({
              productId: cp.product?.id,
              quantity: cp.quantity,
              name: cp.product?.name,
              price: cp.product?.current_price || cp.product?.price,
              original_price: cp.product?.original_price,
              promotion: cp.product?.promotion,
              images: cp.product?.images,
              product: cp.product,
            }))
            .filter((item) => item.productId !== null);
          
          state.cartItems = items;
        }
      })
      .addCase(updateQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // Remove From Cart
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        
        if (action.payload.type === 'memory') {
          // Remover de memoria
          const { productId } = action.payload;
          state.cartItems = state.cartItems.filter(
            (item) => item.productId !== productId
          );
        } else {
          // Actualizar desde backend
          state.cart = action.payload.cart;
          
          const items = (action.payload.cart.cartProducts || [])
            .map((cp) => ({
              productId: cp.product?.id,
              quantity: cp.quantity,
              name: cp.product?.name,
              price: cp.product?.current_price || cp.product?.price,
              original_price: cp.product?.original_price,
              promotion: cp.product?.promotion,
              images: cp.product?.images,
              product: cp.product,
            }))
            .filter((item) => item.productId !== null);
          
          state.cartItems = items;
        }
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // Clear Cart
      .addCase(clearCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = null;
        state.cartItems = [];
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // Sync Memory Cart to Backend
      .addCase(syncMemoryCartToBackend.pending, (state) => {
        console.log('⏳ syncMemoryCartToBackend.pending');
        state.loading = true;
        state.error = null;
        state.needsSync = false; // Limpiar flag
      })
      .addCase(syncMemoryCartToBackend.fulfilled, (state, action) => {
        console.log('✅ syncMemoryCartToBackend.fulfilled:', action.payload);
        state.loading = false;
        
        if (action.payload.type === 'sync-complete') {
          // Actualizar con el carrito del backend
          state.cart = action.payload.cart;
          
          const items = (action.payload.cart.cartProducts || [])
            .map((cp) => ({
              productId: cp.product?.id,
              quantity: cp.quantity,
              name: cp.product?.name,
              price: cp.product?.current_price || cp.product?.price,
              original_price: cp.product?.original_price,
              promotion: cp.product?.promotion,
              images: cp.product?.images,
              product: cp.product,
            }))
            .filter((item) => item.productId !== null);
          
          state.cartItems = items;
          console.log('📊 CartItems sincronizados desde backend:', state.cartItems.length);
        }
      })
      .addCase(syncMemoryCartToBackend.rejected, (state, action) => {
        console.error('❌ syncMemoryCartToBackend.rejected:', action.error.message);
        state.loading = false;
        state.error = action.error.message;
        state.needsSync = false; // Limpiar flag aunque falle
      });
  },
});

export const { resetCartState } = cartSlice.actions;

export default cartSlice.reducer;

