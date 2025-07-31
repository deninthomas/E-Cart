import { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  Divider,
  Grid,
  Checkbox,
  FormControlLabel,
  useTheme,
  useMediaQuery,
  TablePagination,
  Alert,
  Stack
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Cart = ({ cartItems: cart, onRemoveItem: removeFromCart, onUpdateQuantity, onClearCart }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  
  const [cartItems, setCartItems] = useState([...cart]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);

  // Update cart items when the cart prop changes
  useEffect(() => {
    setCartItems([...cart]);
  }, [cart]);

  // Calculate cart totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 0 ? (subtotal > 100 ? 0 : 9.99) : 0;
  const tax = subtotal * 0.1; // 10% tax
  const discount = couponApplied ? subtotal * couponDiscount : 0;
  const total = subtotal + shipping + tax - discount;

  // Handle quantity changes
  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      const updatedCart = cartItems.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      );
      setCartItems(updatedCart);
    }
  };

  // Handle item removal
  const handleRemoveItem = (id) => {
    removeFromCart(id);
  };

  // Handle select/deselect all items
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedItems(cartItems.map(item => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  // Handle individual item selection
  const handleSelectItem = (id) => {
    const selectedIndex = selectedItems.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = [...selectedItems, id];
    } else if (selectedIndex === 0) {
      newSelected = selectedItems.slice(1);
    } else if (selectedIndex === selectedItems.length - 1) {
      newSelected = selectedItems.slice(0, -1);
    } else if (selectedIndex > 0) {
      newSelected = [
        ...selectedItems.slice(0, selectedIndex),
        ...selectedItems.slice(selectedIndex + 1),
      ];
    }

    setSelectedItems(newSelected);
  };

  // Handle coupon code application
  const handleApplyCoupon = () => {
    // In a real app, you would validate the coupon with your backend
    const validCoupons = {
      'WELCOME10': 0.1,  // 10% off
      'SAVE20': 0.2,     // 20% off
      'FREESHIP': 0,     // Free shipping (handled separately)
    };

    if (couponCode in validCoupons) {
      setCouponApplied(true);
      setCouponDiscount(validCoupons[couponCode]);
      setCouponError('');
      
      // If it's a free shipping coupon
      if (couponCode === 'FREESHIP') {
        // In a real app, you would adjust the shipping cost
      }
    } else {
      setCouponError('Invalid coupon code');
      setCouponApplied(false);
      setCouponDiscount(0);
    }
  };

  // Handle checkout
  const handleCheckout = () => {
    // In a real app, you would proceed to checkout with the selected items
    if (selectedItems.length === 0) {
      // If no items selected, select all items
      navigate('/checkout', { state: { items: cartItems } });
    } else {
      // Only checkout selected items
      const itemsToCheckout = cartItems.filter(item => selectedItems.includes(item.id));
      navigate('/checkout', { state: { items: itemsToCheckout } });
    }
  };

  // Handle page change for pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Calculate pagination
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - cartItems.length) : 0;
  const paginatedItems = cartItems.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (cartItems.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 6, textAlign: 'center' }}>
        <ShoppingCartIcon sx={{ fontSize: 80, color: 'action.disabled', mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          Your cart is empty
        </Typography>
        <Typography color="text.secondary" paragraph>
          Looks like you haven't added any items to your cart yet.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
          <Button
            variant="outlined"
            onClick={onClearCart}
            disabled={cartItems.length === 0}
            startIcon={<DeleteIcon />}
          >
            Clear Cart
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/checkout')}
            disabled={cartItems.length === 0}
            sx={{ ml: 'auto' }}
          >
            Proceed to Checkout
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Shopping Cart
      </Typography>
      
      <Grid container spacing={4}>
        {/* Cart Items */}
        <Grid item xs={12} md={8}>
          <Paper elevation={0} variant="outlined" sx={{ p: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedItems.length === cartItems.length && cartItems.length > 0}
                    onChange={handleSelectAll}
                    indeterminate={selectedItems.length > 0 && selectedItems.length < cartItems.length}
                  />
                }
                label={`${selectedItems.length} item(s) selected`}
              />
              {selectedItems.length > 0 && (
                <Button 
                  color="error" 
                  size="small" 
                  startIcon={<DeleteIcon />}
                  onClick={() => {
                    selectedItems.forEach(id => removeFromCart(id));
                    setSelectedItems([]);
                  }}
                >
                  Remove Selected
                </Button>
              )}
            </Box>
            
            <Divider sx={{ mb: 2 }} />
            
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedItems.length === cartItems.length && cartItems.length > 0}
                        onChange={handleSelectAll}
                        indeterminate={selectedItems.length > 0 && selectedItems.length < cartItems.length}
                      />
                    </TableCell>
                    <TableCell>Product</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="center">Quantity</TableCell>
                    <TableCell align="right">Total</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedItems.map((item) => (
                    <TableRow key={item.id} hover>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedItems.indexOf(item.id) !== -1}
                          onChange={() => handleSelectItem(item.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box
                            component="img"
                            src={item.image || 'https://via.placeholder.com/80?text=Product'}
                            alt={item.name}
                            sx={{ width: 60, height: 60, objectFit: 'cover', mr: 2, borderRadius: 1 }}
                          />
                          <Box>
                            <Typography variant="subtitle2">{item.name}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {item.category}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        ${item.price.toFixed(2)}
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <IconButton 
                            size="small" 
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          >
                            <RemoveIcon fontSize="small" />
                          </IconButton>
                          <TextField
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                            type="number"
                            inputProps={{ min: 1, max: 10, style: { textAlign: 'center', width: '40px' } }}
                            size="small"
                            variant="outlined"
                            sx={{ mx: 1, maxWidth: '60px' }}
                          />
                          <IconButton 
                            size="small" 
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          >
                            <AddIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        ${(item.price * item.quantity).toFixed(2)}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton 
                          color="error" 
                          size="small"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={cartItems.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Button 
                component={RouterLink}
                to="/products"
                startIcon={<ArrowBackIcon />}
              >
                Continue Shopping
              </Button>
              
              <Button 
                variant="outlined" 
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => {
                  if (window.confirm('Are you sure you want to clear your cart?')) {
                    cartItems.forEach(item => removeFromCart(item.id));
                    setSelectedItems([]);
                  }
                }}
              >
                Clear Cart
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        {/* Order Summary */}
        <Grid item xs={12} md={4}>
          <Paper elevation={0} variant="outlined" sx={{ p: 3, position: 'sticky', top: 16 }}>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Subtotal:</Typography>
                <Typography>${subtotal.toFixed(2)}</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Shipping:</Typography>
                <Typography color={shipping === 0 ? 'success.main' : 'inherit'}>
                  {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Tax (10%):</Typography>
                <Typography>${tax.toFixed(2)}</Typography>
              </Box>
              
              {couponApplied && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Discount ({couponDiscount * 100}%):</Typography>
                  <Typography color="success.main">
                    -${discount.toFixed(2)}
                  </Typography>
                </Box>
              )}
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Total:</Typography>
                <Typography variant="h6">${total.toFixed(2)}</Typography>
              </Box>
              
              <Box sx={{ mt: 3, mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Have a coupon?
                </Typography>
                <Stack direction="row" spacing={1}>
                  <TextField
                    size="small"
                    placeholder="Enter coupon code"
                    fullWidth
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    error={!!couponError}
                    helperText={couponError}
                    disabled={couponApplied}
                  />
                  <Button 
                    variant="outlined" 
                    onClick={handleApplyCoupon}
                    disabled={!couponCode || couponApplied}
                  >
                    {couponApplied ? 'Applied' : 'Apply'}
                  </Button>
                </Stack>
                {couponApplied && (
                  <Alert severity="success" sx={{ mt: 1 }}>
                    Coupon applied successfully!
                  </Alert>
                )}
              </Box>
              
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleCheckout}
                sx={{ mt: 2, py: 1.5 }}
              >
                Proceed to Checkout
              </Button>
              
              <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
                or{' '}
                <RouterLink to="/products" style={{ color: theme.palette.primary.main }}>
                  Continue Shopping
                </RouterLink>
              </Typography>
            </Box>
          </Paper>
          
          {/* Secure Checkout Info */}
          <Paper elevation={0} variant="outlined" sx={{ p: 2, mt: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Box sx={{ color: 'success.main', mr: 1 }}>✓</Box>
              <Typography variant="body2">Secure checkout</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Box sx={{ color: 'success.main', mr: 1 }}>✓</Box>
              <Typography variant="body2">Easy returns</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ color: 'success.main', mr: 1 }}>✓</Box>
              <Typography variant="body2">Free shipping on orders over $100</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Cart;
