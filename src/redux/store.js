import { configureStore } from "@reduxjs/toolkit";
import productReducer, { productIDReducer } from "./slices/productSlice.js";
import promotionReducer, {
  productsOnSaleReducer,
} from "./slices/promotionSlice.js";
import orderReducer from "./slices/orderSlice.js";
import favoriteReducer from "./slices/favoriteSlice.js";
import userReducer from "./slices/userSlice.js";
import authReducer from "./slices/authSlice.js";
import categoryReducer from "./slices/categorySlice.js";
import adminProductsReducer from "./slices/Admin/adminProductsSlice.js";
import adminPromotionsReducer from "./slices/Admin/adminPromotionsSlice.js";
import adminCategoriesReducer from "./slices/Admin/adminCategoriesSlice.js";
import adminUsersReducer from "./slices/Admin/adminUsersSlice.js";
import adminOrdersReducer from "./slices/Admin/adminOrdersSlice.js";
import stripeReducer from "./slices/stripeSlice.js";
import cartReducer from "./slices/cartSlice.js";

export const store = configureStore({
  reducer: {
    products: productReducer,
    productDetail: productIDReducer,
    promotions: promotionReducer,
    productsOnSale: productsOnSaleReducer,
    orders: orderReducer,
    favorites: favoriteReducer,
    user: userReducer,
    auth: authReducer,
    categories: categoryReducer,
    adminProducts: adminProductsReducer,
    adminPromotions: adminPromotionsReducer,
    adminCategories: adminCategoriesReducer,
    adminUsers: adminUsersReducer,
    adminOrders: adminOrdersReducer,
    stripe: stripeReducer,
    cart: cartReducer,
  },
});
