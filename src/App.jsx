import { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth, selectIsAuthenticated, logout } from './features/auth/authSlice';
import { selectCartItems, addToCart, removeFromCart, updateQuantity, clearCart } from './features/cart/cartSlice';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Orders from './pages/Orders';
import ChatButton from './components/ChatButton';

// Mock data for products
const mockProducts = [
  {
    id: 1,
    name: 'Product 1',
    price: 99.99,
    description: 'This is a sample product description.',
    image: 'https://via.placeholder.com/300',
    category: 'Electronics',
    rating: 4.5,
    reviews: 128,
    inStock: true
  },
  // Add more mock products as needed
];

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 500,
    },
    h2: {
      fontWeight: 500,
    },
    button: {
      textTransform: 'none',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)',
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 25px 0 rgba(0,0,0,0.1)',
          },
        },
      },
    },
  },
});

// Protected route component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

function App() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const cartItems = useSelector(selectCartItems);

  // Check authentication status on app load
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  // Handle logout
  const handleLogout = () => {
    dispatch(logout());
  };

  // Handle adding to cart
  const handleAddToCart = (product) => {
    dispatch(addToCart({ ...product, quantity: 1 }));
  };

  // Handle removing from cart
  const handleRemoveFromCart = (productId) => {
    dispatch(removeFromCart(productId));
  };

  // Handle updating quantity in cart
  const handleUpdateQuantity = (productId, quantity) => {
    dispatch(updateQuantity({ id: productId, quantity }));
  };

  // Handle clearing cart
  const handleClearCart = () => {
    dispatch(clearCart());
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar 
          isAuthenticated={isAuthenticated} 
          cartItemCount={cartItems.reduce((count, item) => count + item.quantity, 0)} 
          onLogout={handleLogout}
        />
        <Box component="main" sx={{ flexGrow: 1, p: 3, pt: { xs: 10, sm: 11 } }}>
          <ChatButton />
          <Routes>
            <Route path="/" element={<Home products={mockProducts} />} />
            <Route 
              path="/login" 
              element={isAuthenticated ? <Navigate to="/" /> : <Login />} 
            />
            <Route 
              path="/signup" 
              element={isAuthenticated ? <Navigate to="/" /> : <Signup />} 
            />
            <Route 
              path="/products" 
              element={<Products products={mockProducts} addToCart={handleAddToCart} />} 
            />
            <Route 
              path="/products/:id" 
              element={<ProductDetail products={mockProducts} addToCart={handleAddToCart} />} 
            />
            <Route 
              path="/cart" 
              element={
                <ProtectedRoute>
                  <Cart 
                    cartItems={cartItems} 
                    onRemoveItem={handleRemoveFromCart} 
                    onUpdateQuantity={handleUpdateQuantity}
                    onClearCart={handleClearCart}
                  />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/" />} />
            <Route 
              path="/checkout" 
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/order-success" 
              element={
                <ProtectedRoute>
                  <OrderSuccess />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/orders" 
              element={
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
