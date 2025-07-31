import { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Paper, 
  TextField, 
  IconButton, 
  Typography, 
  Button, 
  Chip, 
  Card, 
  CardContent, 
  CardMedia 
} from '@mui/material';
import { Send as SendIcon, ShoppingCart, LocalShipping } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// Mock product data
const MOCK_PRODUCTS = [
  {
    id: 1,
    name: 'Wireless Headphones',
    price: 99.99,
    image: 'https://via.placeholder.com/80',
    category: 'Electronics',
    inStock: true,
    deliveryTime: '2-3 business days',
    description: 'High-quality wireless headphones with noise cancellation and 30-hour battery life.'
  },
  {
    id: 2,
    name: 'Smartphone X',
    price: 699.99,
    image: 'https://via.placeholder.com/80',
    category: 'Electronics',
    inStock: true,
    deliveryTime: '3-5 business days',
    description: 'Latest smartphone with advanced camera system and all-day battery life.'
  },
  {
    id: 3,
    name: 'Running Shoes',
    price: 79.99,
    image: 'https://via.placeholder.com/80',
    category: 'Fashion',
    inStock: false,
    deliveryTime: '1-2 weeks',
    description: 'Lightweight running shoes with responsive cushioning for maximum comfort.'
  },
  {
    id: 4,
    name: 'Laptop Backpack',
    price: 49.99,
    image: 'https://via.placeholder.com/80',
    category: 'Accessories',
    inStock: true,
    deliveryTime: '2-4 business days',
    description: 'Durable backpack with laptop compartment and USB charging port.'
  },
  {
    id: 5,
    name: 'Smart Watch',
    price: 199.99,
    image: 'https://via.placeholder.com/80',
    category: 'Electronics',
    inStock: true,
    deliveryTime: '1-3 business days',
    description: 'Feature-rich smartwatch with health monitoring and smartphone notifications.'
  }
];

const GlobalChat = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'support',
      text: 'Hi there! How can I help you today?',
      timestamp: new Date().toISOString()
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [showProducts, setShowProducts] = useState(false);
  const [showOrders, setShowOrders] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeOrder, setActiveOrder] = useState(null);
  
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const { orders = [] } = useSelector(state => state.orders || {});
  const navigate = useNavigate();
  
  // Filter products based on search query
  const filteredProducts = MOCK_PRODUCTS.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Get recent orders for the current user
  const userOrders = isAuthenticated && Array.isArray(orders) ? 
    orders.filter(order => !order.userId || order.userId === user?.id) : [];

  useEffect(() => {
    if (isOpen) {
      setMessages([
        {
          id: 'welcome',
          sender: 'support',
          text: 'Hi! I\'m your shopping assistant. Ask me about products, prices, or your orders!',
          timestamp: new Date().toISOString()
        }
      ]);
    }
  }, [isOpen]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    // Add user message
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: newMessage,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setNewMessage('');
    
    // Generate response
    setTimeout(() => {
      const response = generateAutoResponse(newMessage);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'support',
        text: response,
        timestamp: new Date().toISOString()
      }]);
    }, 500);
  };

  const generateAutoResponse = (userMessage) => {
    const lowerMsg = userMessage.toLowerCase();
    
    // Product search
    if (lowerMsg.includes('search') || lowerMsg.includes('find') || lowerMsg.includes('look for')) {
      const searchTerm = userMessage.replace(/.*?(search|find|look for)\s+/i, '');
      if (searchTerm) {
        setSearchQuery(searchTerm);
        setShowProducts(true);
        return `Here are products matching "${searchTerm}":`;
      }
    }
    
    // Product inquiry
    if (lowerMsg.includes('product') || lowerMsg.includes('item') || 
        lowerMsg.includes('buy') || lowerMsg.includes('purchase')) {
      setShowProducts(true);
      return 'Here are some products you might like:';
    }
    
    // Price inquiry
    if (lowerMsg.includes('price') || lowerMsg.includes('cost')) {
      return 'Prices vary by product. Could you tell me which item you\'re interested in?';
    }
    
    // Delivery inquiry
    if (lowerMsg.includes('delivery') || lowerMsg.includes('shipping')) {
      return 'Standard delivery takes 3-5 business days. Express options available at checkout.';
    }
    
    // Order status
    if (lowerMsg.includes('order') && (lowerMsg.includes('status') || lowerMsg.includes('track'))) {
      if (!isAuthenticated) {
        return 'Please sign in to check your order status.';
      }
      
      // Try to find a specific order if mentioned
      const orderIdMatch = userMessage.match(/order\s*#?(\w+)/i);
      if (orderIdMatch) {
        const orderId = orderIdMatch[1];
        const order = userOrders.find(o => o.id && o.id.toString().includes(orderId));
        if (order) {
          setActiveOrder(order);
          setShowProducts(false);
          setShowOrders(true);
          return `Here's the status of your order #${order.id}:`;
        } else {
          return `I couldn't find order #${orderId}. Please check the order number and try again.`;
        }
      }
      
      // Show recent orders if any exist
      if (userOrders.length > 0) {
        setShowProducts(false);
        setShowOrders(true);
        return `You have ${userOrders.length} order(s). Here are your recent orders:`;
      }
      
      return 'You don\'t have any orders yet. Would you like to browse our products?';
    }
    
    // Default response
    return 'I can help with product info, prices, and order status. What would you like to know?';
  };

  const handleProductSelect = (product) => {
    setMessages(prev => [
      ...prev,
      {
        id: Date.now(),
        sender: 'user',
        text: `Tell me about ${product.name}`,
        timestamp: new Date().toISOString()
      },
      {
        id: Date.now() + 1,
        sender: 'support',
        text: `${product.name} costs $${product.price}. ${product.inStock ? 'In stock' : 'Out of stock'}. ${product.deliveryTime} delivery.`,
        timestamp: new Date().toISOString(),
        actions: product.inStock ? [
          { text: 'Book Now', action: 'book', product },
          { text: 'View Details', action: 'details', product },
          { text: 'Cancel', action: 'cancel' }
        ] : [
          { text: 'Notify When Available', action: 'notify', product },
          { text: 'View Details', action: 'details', product }
        ]
      }
    ]);
    setShowProducts(false);
    setShowOrders(false);
  };
  
  const handleBookProduct = (product) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    const bookingMessage = `I'd like to book ${product.name} for $${product.price}.`;
    
    setMessages(prev => [
      ...prev,
      {
        id: Date.now(),
        sender: 'user',
        text: bookingMessage,
        timestamp: new Date().toISOString()
      },
      {
        id: Date.now() + 1,
        sender: 'support',
        text: `Great choice! I've added ${product.name} to your cart. Would you like to proceed to checkout or see more details?`,
        timestamp: new Date().toISOString(),
        actions: [
          { text: 'Proceed to Checkout', action: 'checkout', product },
          { text: 'View Cart', action: 'viewCart' },
          { text: 'Continue Shopping', action: 'continue' }
        ]
      }
    ]);
    
    // In a real app, you would add to cart here
    // dispatch(addToCart({ ...product, quantity: 1 }));
  };
  
  const handleTrackOrder = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    setShowProducts(false);
    setShowOrders(true);
    
    // Get fresh orders from Redux store
    const currentOrders = Array.isArray(orders) ? 
      orders.filter(order => !order.userId || order.userId === user?.id) : [];
    
    if (currentOrders.length > 0) {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          sender: 'user',
          text: 'Show me my orders',
          timestamp: new Date().toISOString()
        },
        {
          id: Date.now() + 1,
          sender: 'support',
          text: `Here are your recent orders (${userOrders.length}):`,
          timestamp: new Date().toISOString()
        }
      ]);
    } else {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          sender: 'user',
          text: 'Track my order',
          timestamp: new Date().toISOString()
        },
        {
          id: Date.now() + 1,
          sender: 'support',
          text: 'You don\'t have any orders yet. Would you like to browse our products?',
          timestamp: new Date().toISOString()
        }
      ]);
    }
  };

  // Render order summary
  const renderOrderSummary = (order) => {
    const getStatusColor = (status) => {
      switch(status) {
        case 'Delivered':
          return 'success.main';
        case 'In Transit':
        case 'Shipped':
          return 'info.main';
        case 'Processing':
          return 'warning.main';
        case 'Cancelled':
          return 'error.main';
        default:
          return 'text.secondary';
      }
    };
    
    const getStatusIcon = (status) => {
      switch(status) {
        case 'Delivered':
          return '✓';
        case 'In Transit':
          return '🚚';
        case 'Shipped':
          return '📦';
        case 'Processing':
          return '⏳';
        case 'Cancelled':
          return '✕';
        default:
          return 'ℹ️';
      }
    };
    
    return (
      <Card 
        variant="outlined" 
        sx={{ 
          mb: 2, 
          p: 2,
          borderLeft: `4px solid ${getStatusColor(order.status)}`,
          '&:hover': {
            boxShadow: 1,
            transform: 'translateY(-2px)',
            transition: 'all 0.2s'
          }
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="subtitle2" fontWeight="bold">
              Order #{order.id}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
              <Box sx={{ 
                width: 8, 
                height: 8, 
                borderRadius: '50%', 
                bgcolor: getStatusColor(order.status) 
              }} />
              <Typography variant="body2" color={getStatusColor(order.status)}>
                {order.status}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                {getStatusIcon(order.status)}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {new Date(order.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </Typography>
            <Typography variant="body1" fontWeight="bold" sx={{ mt: 1 }}>
              ${order.total?.toFixed(2) || '0.00'}
            </Typography>
          </Box>
          <Button 
            variant="outlined" 
            size="small"
            onClick={() => navigate(`/orders/${order.id}`)}
            sx={{ 
              textTransform: 'none',
              borderRadius: 2,
              px: 2,
              py: 0.5
            }}
          >
            View Details
          </Button>
        </Box>
        
        {order.trackingUpdates?.length > 0 && (
          <Box sx={{ mt: 2, pt: 2, borderTop: '1px dashed', borderColor: 'divider' }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
              LATEST UPDATE:
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
              <Box sx={{ 
                width: 8, 
                height: 8, 
                mt: 1,
                borderRadius: '50%', 
                bgcolor: 'primary.main' 
              }} />
              <Box>
                <Typography variant="body2">
                  {order.trackingUpdates[0].details}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date(order.trackingUpdates[0].date).toLocaleString()}
                </Typography>
              </Box>
            </Box>
          </Box>
        )}
      </Card>
    );
  };

  if (!isOpen) return null;

  return (
    <Box 
      sx={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        width: 350,
        maxHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'white',
        boxShadow: 3,
        borderRadius: 2,
        overflow: 'hidden',
        zIndex: 9999
      }}
    >
      <Box sx={{ 
        bgcolor: 'primary.main', 
        color: 'white', 
        p: 2, 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography variant="h6">Shopping Assistant</Typography>
        <Button 
          size="small" 
          onClick={onClose}
          sx={{ color: 'white' }}
        >
          Close
        </Button>
      </Box>
      
      <Box sx={{ 
        flex: 1, 
        p: 2, 
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 1
      }}>
        {messages.map((msg) => (
          <Box 
            key={msg.id}
            sx={{
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '80%'
            }}
          >
            <Paper
              elevation={1}
              sx={{
                p: 1.5,
                bgcolor: msg.sender === 'user' ? 'primary.main' : 'grey.100',
                color: msg.sender === 'user' ? 'white' : 'text.primary',
                borderRadius: 2
              }}
            >
              <Typography variant="body2">{msg.text}</Typography>
              <Typography variant="caption" sx={{ 
                display: 'block', 
                textAlign: 'right',
                opacity: 0.7,
                mt: 0.5
              }}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Typography>
            </Paper>
          </Box>
        ))}
        
        {showOrders && userOrders.length > 0 && (
          <Box sx={{ mt: 1, mb: 2 }}>
            {userOrders.map(order => renderOrderSummary(order))}
          </Box>
        )}
        
        {showProducts && (
          <Box sx={{ mt: 2, p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="subtitle2">
                {searchQuery ? 'Search Results' : 'Available Products'}
              </Typography>
              {searchQuery && (
                <Button 
                  size="small" 
                  onClick={() => setSearchQuery('')}
                  sx={{ minWidth: 'auto', p: 0 }}
                >
                  Clear
                </Button>
              )}
            </Box>
            <TextField
              fullWidth
              size="small"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ mb: 2 }}
            />
            {filteredProducts.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                No products found. Try a different search term.
              </Typography>
            ) : (
              filteredProducts.map((product) => (
                <Card 
                  key={product.id} 
                  onClick={() => handleProductSelect(product)}
                  sx={{ 
                    mb: 1, 
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'action.hover' }
                  }}
                >
                  <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <CardMedia
                      component="img"
                      sx={{ width: 50, height: 50, objectFit: 'contain' }}
                      image={product.image}
                      alt={product.name}
                    />
                    <Box>
                      <Typography variant="body2">{product.name}</Typography>
                      <Typography variant="body2" color="primary" fontWeight="bold">
                        ${product.price}
                      </Typography>
                      <Chip 
                        label={product.inStock ? 'In Stock' : 'Out of Stock'} 
                        size="small" 
                        color={product.inStock ? 'success' : 'default'}
                        sx={{ height: 20, fontSize: '0.6rem' }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              ))
            )}
          </Box>
        )}
      </Box>
      
      <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <IconButton 
            color="primary" 
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
          >
            <SendIcon />
          </IconButton>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1, flexWrap: 'wrap' }}>
          <Chip 
            icon={<ShoppingCart fontSize="small" />} 
            label={showProducts ? 'Hide Products' : 'Show Products'} 
            size="small"
            onClick={() => {
              setShowProducts(!showProducts);
              setShowOrders(false);
            }}
            variant={showProducts ? 'filled' : 'outlined'}
            sx={{ mb: 1 }}
          />
          <Chip 
            icon={<LocalShipping fontSize="small" />} 
            label="Track Order" 
            size="small"
            onClick={() => {
              handleTrackOrder();
              setShowProducts(false);
            }}
            variant={showOrders ? 'filled' : 'outlined'}
            color={showOrders ? 'primary' : 'default'}
            sx={{ mb: 1 }}
          />
          {isAuthenticated && (
            <Chip 
              label={`${userOrders.length} Order${userOrders.length !== 1 ? 's' : ''}`}
              size="small"
              onClick={() => navigate('/orders')}
              color="primary"
              variant="outlined"
              sx={{ mb: 1 }}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default GlobalChat;
