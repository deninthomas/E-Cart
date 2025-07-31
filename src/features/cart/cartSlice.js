import { createSlice } from '@reduxjs/toolkit';

// Helper function to load cart from localStorage
const loadCart = () => {
  try {
    const serializedCart = localStorage.getItem('cart');
    return serializedCart ? JSON.parse(serializedCart) : [];
  } catch (err) {
    console.error('Error loading cart from localStorage:', err);
    return [];
  }
};

// Helper function to save cart to localStorage
const saveCart = (cart) => {
  try {
    const serializedCart = JSON.stringify(cart);
    localStorage.setItem('cart', serializedCart);
  } catch (err) {
    console.error('Error saving cart to localStorage:', err);
  }
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: loadCart(),
  },
  reducers: {
    addToCart: (state, action) => {
      const { id, quantity = 1, ...product } = action.payload;
      const existingItem = state.items.find(item => item.id === id);
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({ ...product, id, quantity });
      }
      
      saveCart(state.items);
    },
    
    removeFromCart: (state, action) => {
      const itemId = action.payload;
      state.items = state.items.filter(item => item.id !== itemId);
      saveCart(state.items);
    },
    
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item.id === id);
      
      if (item) {
        item.quantity = Math.max(1, Math.min(10, quantity)); // Keep quantity between 1-10
        saveCart(state.items);
      }
    },
    
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem('cart');
    },
    
    // For syncing cart with user's account after login
    setCart: (state, action) => {
      state.items = action.payload;
      saveCart(state.items);
    },
  },
});

export const { 
  addToCart, 
  removeFromCart, 
  updateQuantity, 
  clearCart,
  setCart,
} = cartSlice.actions;

export default cartSlice.reducer;

// Selectors
export const selectCartItems = (state) => state.cart.items;

export const selectCartItem = (state, productId) =>
  state.cart.items.find(item => item.id === productId);

export const selectCartTotalItems = (state) =>
  state.cart.items.reduce((total, item) => total + item.quantity, 0);

export const selectCartTotal = (state) =>
  state.cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
