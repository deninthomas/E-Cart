import api from '../utils/api';

// Create a new order
export const createOrder = async (orderData) => {
  try {
    const response = await api.post('/orders', orderData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get order by ID
export const getOrderById = async (orderId) => {
  try {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Pay for an order
export const payOrder = async (orderId, paymentResult) => {
  try {
    const response = await api.put(`/orders/${orderId}/pay`, paymentResult);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get logged in user's orders
export const getMyOrders = async () => {
  try {
    const response = await api.get('/orders/myorders');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get all orders (admin only)
export const getAllOrders = async () => {
  try {
    const response = await api.get('/orders');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update order to delivered (admin only)
export const deliverOrder = async (orderId) => {
  try {
    const response = await api.put(`/orders/${orderId}/deliver`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get order statistics (admin only)
export const getOrderStats = async () => {
  try {
    const response = await api.get('/orders/stats');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get monthly sales (admin only)
export const getMonthlySales = async () => {
  try {
    const response = await api.get('/orders/monthly-sales');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update order status (admin only)
export const updateOrderStatus = async (orderId, statusData) => {
  try {
    const response = await api.put(`/orders/${orderId}/status`, statusData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
