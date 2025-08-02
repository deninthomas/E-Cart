import api from '../utils/api';

// Get user's cart
export const getCart = async () => {
  try {
    const response = await api.get('/cart');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Add item to cart
export const addToCart = async (productId, quantity = 1) => {
  try {
    const response = await api.post('/cart/items', { productId, quantity });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update cart item quantity
export const updateCartItem = async (productId, quantity) => {
  try {
    const response = await api.put(`/cart/items/${productId}`, { quantity });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Remove item from cart
export const removeFromCart = async (productId) => {
  try {
    const response = await api.delete(`/cart/items/${productId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Clear cart
export const clearCart = async () => {
  try {
    const response = await api.delete('/cart');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get cart summary
export const getCartSummary = async () => {
  try {
    const response = await api.get('/cart/summary');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Merge guest cart with user cart after login
export const mergeCarts = async (guestCart) => {
  try {
    const response = await api.post('/cart/merge', { guestCart });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
