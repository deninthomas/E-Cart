import api from '../utils/api';

// Register a new user
export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Login user
export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get user profile
export const getProfile = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update user profile
export const updateProfile = async (userData) => {
  try {
    const response = await api.put('/auth/updatedetails', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update user password
export const updatePassword = async (currentPassword, newPassword) => {
  try {
    const response = await api.put('/auth/updatepassword', {
      currentPassword,
      newPassword
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Forgot password
export const forgotPassword = async (email) => {
  try {
    const response = await api.post('/auth/forgotpassword', { email });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Reset password
export const resetPassword = async (token, password) => {
  try {
    const response = await api.put(`/auth/resetpassword/${token}`, { password });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Logout user
export const logout = async () => {
  try {
    // Clear any stored tokens or user data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // If using cookies, you might want to clear them here
    document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    
    // Optionally call a logout endpoint if you have one
    // await api.post('/auth/logout');
    
    return { success: true };
  } catch (error) {
    console.error('Logout failed:', error);
    throw error.response?.data || error.message;
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  // Check if token exists and is not expired
  const token = localStorage.getItem('token');
  if (!token) return false;
  
  // Optional: Decode token to check expiration
  try {
    const decoded = JSON.parse(atob(token.split('.')[1]));
    return decoded.exp > Date.now() / 1000;
  } catch (e) {
    return false;
  }
};
