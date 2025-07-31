import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Avatar,
  CircularProgress,
  Alert,
  Tabs,
  Tab
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Cancel as CancelIcon,
  Chat as ChatIcon,
  LocalShipping as ShippingIcon,
  Payment as PaymentIcon,
  Refresh as RefreshIcon,
  Receipt as ReceiptIcon,
  CheckCircle as CheckCircleIcon,
  AccessTime as PendingIcon,
  Close as CloseIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { fetchOrders, cancelOrder, selectAllOrders, selectOrdersLoading, selectOrdersError } from '../features/orders/ordersSlice';

const OrderStatusChip = ({ status }) => {
  const theme = useTheme();
  
  const statusColors = {
    'Processing': { bg: theme.palette.info.light, color: theme.palette.info.contrastText },
    'Shipped': { bg: theme.palette.primary.light, color: theme.palette.primary.contrastText },
    'Delivered': { bg: theme.palette.success.light, color: theme.palette.success.contrastText },
    'Cancelled': { bg: theme.palette.error.light, color: theme.palette.error.contrastText },
    'Returned': { bg: theme.palette.warning.light, color: theme.palette.warning.contrastText },
  };

  return (
    <Chip
      label={status}
      size="small"
      sx={{
        backgroundColor: statusColors[status]?.bg || theme.palette.grey[300],
        color: statusColors[status]?.color || theme.palette.text.primary,
        fontWeight: 500,
        textTransform: 'capitalize',
      }}
    />
  );
};

const OrderItem = ({ order, onViewDetails, onCancelOrder }) => {
  const theme = useTheme();
  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
  
  return (
    <Card variant="outlined" sx={{ mb: 2, '&:hover': { boxShadow: 2 } }}>
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <Box display="flex" alignItems="center">
              <ReceiptIcon color="action" sx={{ mr: 1 }} />
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  ORDER #{order.id}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {new Date(order.date).toLocaleDateString()}
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                {totalItems} {totalItems === 1 ? 'item' : 'items'}
              </Typography>
              <OrderStatusChip status={order.status} />
            </Box>
          </Grid>
          <Grid item xs={12} sm={4} sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
            <Typography variant="h6" component="div" sx={{ fontWeight: 500 }}>
              ${order.total.toFixed(2)}
            </Typography>
            <Box sx={{ mt: 1, display: 'flex', gap: 1, justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}>
              <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={() => onViewDetails(order.id)}
                  size="small"
                >
                  View Details
                </Button>
              </Box>
              {order.status === 'Processing' && (
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  startIcon={<CancelIcon />}
                  onClick={() => onCancelOrder(order.id)}
                >
                  Cancel
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

const OrderDetails = ({ order, onClose }) => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    // Set active step based on order status
    const statusSteps = {
      'Processing': 0,
      'Shipped': 1,
      'Out for Delivery': 2,
      'Delivered': 3,
      'Cancelled': 0
    };
    setActiveStep(statusSteps[order.status] || 0);
  }, [order.status]);

  const handleCancelOrder = () => {
    dispatch(cancelOrder(order.id));
    setCancelDialogOpen(false);
    onClose();
  };

  const steps = [
    { label: 'Order Placed', description: 'We\'ve received your order' },
    { label: 'Shipped', description: 'Your order is on its way' },
    { label: 'Out for Delivery', description: 'Your order is out for delivery' },
    { label: 'Delivered', description: 'Your order has been delivered' },
  ];

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" component="h2">
          Order Details
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Box mb={4}>
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 2 }}>
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel>{step.label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Typography variant="body2" color="text.secondary" align="center">
          {steps[activeStep]?.description}
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Typography variant="h6" gutterBottom>
            Order Items
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="center">Quantity</TableCell>
                  <TableCell align="right">Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {order.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Avatar src={item.image} alt={item.name} sx={{ width: 56, height: 56, mr: 2 }} />
                        <Typography variant="body2">{item.name}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right">${item.price.toFixed(2)}</TableCell>
                    <TableCell align="center">{item.quantity}</TableCell>
                    <TableCell align="right">${(item.price * item.quantity).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        <Grid item xs={12} md={4}>
          <Box mb={3}>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText primary="Subtotal" />
                <Typography>${order.subtotal.toFixed(2)}</Typography>
              </ListItem>
              <ListItem>
                <ListItemText primary="Shipping" />
                <Typography>${order.shipping.toFixed(2)}</Typography>
              </ListItem>
              <ListItem>
                <ListItemText primary="Tax" />
                <Typography>${order.tax.toFixed(2)}</Typography>
              </ListItem>
              <Divider sx={{ my: 1 }} />
              <ListItem>
                <ListItemText primary="Total" />
                <Typography variant="h6">${order.total.toFixed(2)}</Typography>
              </ListItem>
            </List>
          </Box>

          <Box mb={3}>
            <Typography variant="h6" gutterBottom>
              Shipping Address
            </Typography>
            <Typography>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</Typography>
            <Typography>{order.shippingAddress.address1}</Typography>
            {order.shippingAddress.address2 && (
              <Typography>{order.shippingAddress.address2}</Typography>
            )}
            <Typography>
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
            </Typography>
            <Typography>{order.shippingAddress.country}</Typography>
          </Box>

          <Box>
            <Typography variant="h6" gutterBottom>
              Payment Method
            </Typography>
            <Box display="flex" alignItems="center">
              <PaymentIcon color="action" sx={{ mr: 1 }} />
              <Typography>{order.paymentMethod}</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              {order.paymentStatus}
            </Typography>
          </Box>

          {order.status === 'Processing' && (
            <Box mt={3}>
              <Button
                variant="outlined"
                color="error"
                fullWidth
                startIcon={<CancelIcon />}
                onClick={() => setCancelDialogOpen(true)}
              >
                Cancel Order
              </Button>
            </Box>
          )}
        </Grid>
      </Grid>

      <Dialog open={cancelDialogOpen} onClose={() => setCancelDialogOpen(false)}>
        <DialogTitle>Cancel Order</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Are you sure you want to cancel this order?
          </Typography>
          <TextField
            select
            fullWidth
            label="Reason for cancellation"
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            sx={{ mt: 2 }}
          >
            <MenuItem value="">Select a reason</MenuItem>
            <MenuItem value="Found better price">Found better price</MenuItem>
            <MenuItem value="Ordered by mistake">Ordered by mistake</MenuItem>
            <MenuItem value="Shipping takes too long">Shipping takes too long</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialogOpen(false)}>No, Keep It</Button>
          <Button 
            onClick={handleCancelOrder} 
            color="error"
            disabled={!cancelReason}
          >
            Yes, Cancel Order
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

const Orders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  
  const orders = useSelector(selectAllOrders);
  const loading = useSelector(selectOrdersLoading);
  const error = useSelector(selectOrdersError);
  const selectedOrder = orders.find(order => order.id === selectedOrderId);

  useEffect(() => {
    // Fetch orders when component mounts
    const loadOrders = async () => {
      try {
        await dispatch(fetchOrders()).unwrap();
      } catch (error) {
        console.error('Failed to load orders:', error);
      }
    };
    
    loadOrders();
    
    // Set up polling to refresh orders periodically
    const pollInterval = setInterval(() => {
      dispatch(fetchOrders());
    }, 30000); // Poll every 30 seconds
    
    return () => clearInterval(pollInterval);
  }, [dispatch]);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleViewDetails = (orderId) => {
    setSelectedOrderId(orderId);
    dispatch(selectOrder(orderId));
  };

  const handleCloseDetails = () => {
    setSelectedOrderId(null);
  };

  const handleCancelOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      await dispatch(cancelOrder(orderId));
      dispatch(fetchOrders());
    }
  };

  // Sort orders by date (newest first)
  const sortedOrders = [...orders].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  );
  
  // Filter orders based on selected tab
  const filteredOrders = selectedTab === 0 
    ? sortedOrders 
    : sortedOrders.filter(order => order.status === 'Delivered');
    
  // Get the selected order with the latest data
  const currentSelectedOrder = selectedOrderId 
    ? orders.find(order => order.id === selectedOrderId) || selectedOrder
    : null;

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" alignItems="center" mb={3}>
        <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4">My Orders</Typography>
      </Box>

      <Paper sx={{ mb: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" component="h1" sx={{ fontWeight: 500, mb: 1 }}>
              My Orders
            </Typography>
            <Tabs value={selectedTab} onChange={handleTabChange} aria-label="order tabs">
              <Tab label={`All (${orders.length})`} />
              <Tab label={`Delivered (${orders.filter(o => o.status === 'Delivered').length})`} />
            </Tabs>
          </Box>
        </Box>
      </Paper>

      {currentSelectedOrder && (
        <OrderDetails 
          order={currentSelectedOrder} 
          onClose={handleCloseDetails} 
        />
      )}

      {!selectedOrder && (
        <Box sx={{ mt: 2 }}>
          {filteredOrders.length === 0 ? (
            <Box textAlign="center" py={6}>
              <ReceiptIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                No orders found
              </Typography>
              <Typography color="text.secondary" paragraph>
                You haven't placed any orders yet.
              </Typography>
              <Button 
                variant="contained" 
                color="primary"
                onClick={() => navigate('/products')}
              >
                Start Shopping
              </Button>
            </Box>
          ) : (
            <Box sx={{ '& > :not(style)': { mb: 2 } }}>
              {filteredOrders.map((order) => (
                <OrderItem
                  key={order.id}
                  order={order}
                  onViewDetails={handleViewDetails}
                  onCancelOrder={handleCancelOrder}
                />
              ))}
            </Box>
          )}
        </Box>
      )}
    </Container>
  );
};

export default Orders;
