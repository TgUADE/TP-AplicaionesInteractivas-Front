import {configureStore} from '@reduxjs/toolkit';
import productReducer, { productIDReducer } from './slices/productSlice.js';
import promotionReducer, {productsOnSaleReducer} from './slices/promotionSlice.js';
export const store = configureStore({
    reducer: {
        products: productReducer,
        productDetail: productIDReducer,
        promotions: promotionReducer,
        productsOnSale: productsOnSaleReducer,
    }
}) ;

