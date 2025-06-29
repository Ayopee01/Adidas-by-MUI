// Redux Toolkit
import { createSlice } from '@reduxjs/toolkit';

// Local storage key for the cart
const CART_KEY = "cart";

// Save cart to localStorage
function saveCartToLocalStorage(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// Load cart from localStorage
function loadCartFromLocalStorage() {
  try {
    const data = localStorage.getItem(CART_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

const initialState = {
  cart: loadCartFromLocalStorage(),
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
      saveCartToLocalStorage(state.cart);
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
      saveCartToLocalStorage(state.cart);
    },
    clearCart: (state) => {
      state.cart = [];
      saveCartToLocalStorage(state.cart);
    },
    incrementQty: (state, action) => {
      const found = state.cart.find(
        (item) =>
          item.id === action.payload.id &&
          item.color === action.payload.color &&
          item.size === action.payload.size
      );
      if (found) found.quantity += 1;
      saveCartToLocalStorage(state.cart);
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
      saveCartToLocalStorage(state.cart);
    },
  },
});

export const { addToCart, removeFromCart, clearCart, incrementQty, decrementQty } = cartSlice.actions;
export default cartSlice.reducer;