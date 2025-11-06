import {configureStore} from '@reduxjs/toolkit';
import productReducer, { productIDReducer } from './slices/productSlice.js';
import promotionReducer, {productsOnSaleReducer} from './slices/promotionSlice.js';
import orderReducer from './slices/orderSlice.js';
import favoriteReducer from './slices/favoriteSlice.js';

export const store = configureStore({
    reducer: {
        products: productReducer,
        productDetail: productIDReducer,
        promotions: promotionReducer,
        productsOnSale: productsOnSaleReducer,
        orders: orderReducer,
        favorites: favoriteReducer,
        
    }
}) ;

