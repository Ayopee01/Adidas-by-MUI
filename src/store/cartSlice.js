import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cart: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { id, color, size, quantity } = action.payload;
      const exists = state.cart.find(
        (item) =>
          item.id === id &&
          item.color === color &&
          item.size === size
      );
      if (exists) {
        exists.quantity += quantity;
      } else {
        state.cart.push({ ...action.payload, quantity: quantity });
      }
    },
    removeFromCart: (state, action) => {
      state.cart = state.cart.filter(
        (item) =>
          !(
            item.id === action.payload.id &&
            item.color === action.payload.color &&
            item.size === action.payload.size
          )
      );
    },
    clearCart: (state) => {
      state.cart = [];
    },
    incrementQty: (state, action) => {
      const found = state.cart.find(
        (item) =>
          item.id === action.payload.id &&
          item.color === action.payload.color &&
          item.size === action.payload.size
      );
      if (found) found.quantity += 1;
    },
    decrementQty: (state, action) => {
      const found = state.cart.find(
        (item) =>
          item.id === action.payload.id &&
          item.color === action.payload.color &&
          item.size === action.payload.size
      );
      if (found) {
        if (found.quantity > 1) {
          found.quantity -= 1;
        } else {
          state.cart = state.cart.filter(
            (item) =>
              !(
                item.id === action.payload.id &&
                item.color === action.payload.color &&
                item.size === action.payload.size
              )
          );
        }
      }
    },
  },
});

export const { addToCart, removeFromCart, clearCart, incrementQty, decrementQty } = cartSlice.actions;
export default cartSlice.reducer;
