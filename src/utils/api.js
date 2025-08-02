import axios from 'axios';
import store from '../app/store';

// Get the base URL from environment variables or use a default
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Add a request interceptor to modify requests before they are sent
api.interceptors.request.use(
  (config) => {
    // Get the current state
    const state = store.getState();
    
    // Add auth token if available
    if (state?.auth?.token) {
      config.headers.Authorization = `Bearer ${state.auth.token}`;
    }
    
    // For file uploads, remove the content-type header to let the browser set it
    // with the correct boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    // Handle successful responses
    return response.data;
  },
  (error) => {
    // Handle errors
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const { status, data } = error.response;
      
      // Handle specific status codes
      if (status === 401) {
        // Handle unauthorized access (e.g., token expired)
        store.dispatch({ type: 'auth/logout' });
        return Promise.reject(new Error(data?.message || 'Your session has expired. Please log in again.'));
      }
      
      // Handle validation errors
      if (status === 400 && data?.errors) {
        return Promise.reject(new Error('Validation error: ' + Object.values(data.errors).join(' ')));
      }
      
      // Handle server errors
      if (status >= 500) {
        return Promise.reject(new Error('Server error. Please try again later.'));
      }
      
      // Handle other errors with a message from the server
      if (data?.message) {
        return Promise.reject(new Error(data.message));
      }
    } else if (error.request) {
      // The request was made but no response was received
      return Promise.reject(new Error('No response from server. Please check your connection.'));
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Request error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;
