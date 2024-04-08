import { createSlice } from '@reduxjs/toolkit';

export const catalogSlice = createSlice({
    name: 'catalog',
    initialState: {
        products: [],
    },
    reducers: {
        addProduct: (state, action) => {
            state.products.push(action.payload);
        },
    },
});

export const { addProduct } = catalogSlice.actions;

export default catalogSlice.reducer;
