// store/cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

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
      const { id, color, size, quantity, stock } = action.payload;
      const exists = state.cart.find(
        (item) =>
          item.id === id &&
          item.color === color &&
          item.size === size
      );
      const maxStock = stock !== undefined ? stock : Infinity;
      if (exists) {
        // **ห้ามเกิน stock**
        if (exists.quantity + quantity > maxStock) {
          exists.quantity = maxStock;
        } else {
          exists.quantity += quantity;
        }
      } else {
        // **ใส่ quantity ไม่เกิน stock**
        state.cart.push({
          ...action.payload,
          quantity: Math.min(quantity, maxStock)
        });
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
      // ต้องส่ง stock มาด้วย (action.payload.stock)
      const { id, color, size, stock } = action.payload;
      const found = state.cart.find(
        (item) =>
          item.id === id &&
          item.color === color &&
          item.size === size
      );
      const maxStock = stock !== undefined ? stock : Infinity;
      if (found && found.quantity < maxStock) {
        found.quantity += 1;
      }
      saveCartToLocalStorage(state.cart);
    },
    decrementQty: (state, action) => {
      const { id, color, size } = action.payload;
      const found = state.cart.find(
        (item) =>
          item.id === id &&
          item.color === color &&
          item.size === size
      );
      if (found) {
        if (found.quantity > 1) {
          found.quantity -= 1;
        } else {
          // เอาออกเมื่อ qty = 1 แล้วกด -
          state.cart = state.cart.filter(
            (item) =>
              !(
                item.id === id &&
                item.color === color &&
                item.size === size
              )
          );
        }
      }
      saveCartToLocalStorage(state.cart);
    },
    setQty: (state, action) => {
      // ตั้งจำนวน (เวลาพิมพ์เองใน input)
      // ต้องไม่เกิน stock
      const { id, color, size, quantity, stock } = action.payload;
      const found = state.cart.find(
        (item) =>
          item.id === id &&
          item.color === color &&
          item.size === size
      );
      const maxStock = stock !== undefined ? stock : Infinity;
      if (found) {
        found.quantity = Math.max(1, Math.min(quantity, maxStock));
      }
      saveCartToLocalStorage(state.cart);
    }
  },
});

export const { addToCart, removeFromCart, clearCart, incrementQty, decrementQty, setQty } = cartSlice.actions;
export default cartSlice.reducer;
