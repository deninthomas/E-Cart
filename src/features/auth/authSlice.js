import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Helper function to load state from localStorage
const loadAuthState = () => {
  try {
    const serializedState = localStorage.getItem('authState');
    if (serializedState === null) {
      return {
        user: null,
        token: null,
        isAuthenticated: false,
        status: 'idle',
        error: null
      };
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return {
      user: null,
      token: null,
      isAuthenticated: false,
      status: 'idle',
      error: null
    };
  }
};

// Async thunks for authentication
// Mock API calls - replace with actual API calls in production
export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { getState }) => {
    try {
      // In a real app, you would verify the token with your backend
      const { auth } = getState();
      if (auth.token) {
        // Mock token verification
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              user: auth.user || { id: '1', name: 'John Doe', email: 'john@example.com' },
              token: auth.token
            });
          }, 500);
        });
      }
      throw new Error('No token found');
    } catch (error) {
      throw error;
    }
  }
);
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      // Mock API call
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            user: { id: '1', name: 'John Doe', email },
            token: 'mock-jwt-token',
          });
        }, 1000);
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      // Mock API call
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            user: { id: '1', name, email },
            token: 'mock-jwt-token',
          });
        }, 1000);
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

const initialState = loadAuthState();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.status = 'idle';
      state.error = null;
      // Clear auth state from localStorage
      localStorage.removeItem('authState');
      localStorage.removeItem('cart'); // Clear cart on logout
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Login failed';
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Registration failed';
      });
  },
});

// Middleware to persist auth state to localStorage
const authMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  if (action.type.startsWith('auth/')) {
    const { auth } = store.getState();
    localStorage.setItem('authState', JSON.stringify({
      user: auth.user,
      token: auth.token,
      isAuthenticated: auth.isAuthenticated,
      status: auth.status,
      error: auth.error,
    }));
  }
  return result;
};

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthStatus = (state) => state.auth.status;
export const selectAuthError = (state) => state.auth.error;

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;

// Export the middleware
export { authMiddleware };
