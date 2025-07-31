import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Paper, 
  Stepper, 
  Step, 
  StepLabel, 
  Typography, 
  Button, 
  Box, 
  Grid, 
  TextField, 
  FormControl, 
  FormLabel, 
  RadioGroup, 
  FormControlLabel, 
  Radio,
  Divider,
  useTheme,
  Alert
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart, selectCartTotal, selectCartItems } from '../features/cart/cartSlice';
import { addNewOrder } from '../features/orders/ordersSlice';

const steps = ['Shipping', 'Payment', 'Review & Place Order'];

const Checkout = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [nameOnCard, setNameOnCard] = useState('');
  const [address, setAddress] = useState({
    firstName: '',
    lastName: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
    country: '',
  });
  const [error, setError] = useState('');
  
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const total = useSelector(selectCartTotal);
  const cartItems = useSelector(state => state.cart.items);

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      // Process payment on final step
      processPayment();
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const processPayment = async () => {
    try {
      // Create order object
      const order = {
        items: [...cartItems],
        shippingAddress: { ...address },
        paymentMethod: paymentMethod === 'credit' ? 'Credit Card' : 
                       paymentMethod === 'paypal' ? 'PayPal' : 'Cash on Delivery',
        paymentStatus: 'Paid',
        subtotal: total,
        shipping: 0, // You might want to calculate this
        tax: total * 0.1, // Example tax calculation (10%)
        total: total * 1.1, // Subtotal + tax
      };

      // Save the order
      await dispatch(addNewOrder(order)).unwrap();
      
      // Clear cart and show success
      dispatch(clearCart());
      navigate('/order-success');
    } catch (err) {
      console.error('Payment failed:', err);
      setError('Payment processing failed. Please try again.');
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="First Name"
                name="firstName"
                value={address.firstName}
                onChange={handleAddressChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Last Name"
                name="lastName"
                value={address.lastName}
                onChange={handleAddressChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Address Line 1"
                name="address1"
                value={address.address1}
                onChange={handleAddressChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address Line 2"
                name="address2"
                value={address.address2}
                onChange={handleAddressChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                required
                fullWidth
                label="City"
                name="city"
                value={address.city}
                onChange={handleAddressChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                required
                fullWidth
                label="State/Province/Region"
                name="state"
                value={address.state}
                onChange={handleAddressChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                required
                fullWidth
                label="ZIP / Postal code"
                name="zip"
                value={address.zip}
                onChange={handleAddressChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Country"
                name="country"
                value={address.country}
                onChange={handleAddressChange}
                margin="normal"
              />
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Box>
            <FormControl component="fieldset" fullWidth>
              <FormLabel component="legend">Select Payment Method</FormLabel>
              <RadioGroup
                aria-label="payment method"
                name="paymentMethod"
                value={paymentMethod}
                onChange={handlePaymentMethodChange}
              >
                <FormControlLabel
                  value="credit"
                  control={<Radio />}
                  label="Credit/Debit Card"
                />
                <FormControlLabel
                  value="paypal"
                  control={<Radio />}
                  label="PayPal"
                />
                <FormControlLabel
                  value="cod"
                  control={<Radio />}
                  label="Cash on Delivery"
                />
              </RadioGroup>
            </FormControl>

            {paymentMethod === 'credit' && (
              <Box mt={3}>
                <TextField
                  fullWidth
                  label="Name on Card"
                  value={nameOnCard}
                  onChange={(e) => setNameOnCard(e.target.value)}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Card Number"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  margin="normal"
                  placeholder="1234 5678 9012 3456"
                />
                <Box display="flex" gap={2}>
                  <TextField
                    fullWidth
                    label="Expiry Date"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    margin="normal"
                    placeholder="MM/YY"
                  />
                  <TextField
                    fullWidth
                    label="CVV"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    margin="normal"
                    placeholder="123"
                  />
                </Box>
              </Box>
            )}

            {paymentMethod === 'paypal' && (
              <Box mt={3} p={2} bgcolor="#f5f5f5" borderRadius={1}>
                <Typography>You will be redirected to PayPal to complete your payment.</Typography>
              </Box>
            )}

            {paymentMethod === 'cod' && (
              <Box mt={3} p={2} bgcolor="#f5f5f5" borderRadius={1}>
                <Typography>Pay with cash upon delivery.</Typography>
              </Box>
            )}
          </Box>
        );
      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>Order Summary</Typography>
            <Box mb={3} border={1} borderColor="divider" p={2} borderRadius={1}>
              {cartItems.map((item) => (
                <Box key={item.id} display="flex" justifyContent="space-between" mb={1}>
                  <Typography>
                    {item.name} x {item.quantity}
                  </Typography>
                  <Typography>${(item.price * item.quantity).toFixed(2)}</Typography>
                </Box>
              ))}
              <Divider sx={{ my: 2 }} />
              <Box display="flex" justifyContent="space-between">
                <Typography variant="subtitle1">Total</Typography>
                <Typography variant="subtitle1">${total.toFixed(2)}</Typography>
              </Box>
            </Box>

            <Box mb={3}>
              <Typography variant="subtitle2">Shipping Address</Typography>
              <Typography>
                {address.firstName} {address.lastName}<br />
                {address.address1}<br />
                {address.address2 && <>{address.address2}<br /></>}
                {address.city}, {address.state} {address.zip}<br />
                {address.country}
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2">Payment Method</Typography>
              <Typography>
                {paymentMethod === 'credit' ? 'Credit/Debit Card' : 
                 paymentMethod === 'paypal' ? 'PayPal' : 'Cash on Delivery'}
              </Typography>
              {paymentMethod === 'credit' && cardNumber && (
                <Typography>Card ending in {cardNumber.slice(-4)}</Typography>
              )}
            </Box>
          </Box>
        );
      default:
        throw new Error('Unknown step');
    }
  };

  return (
    <Container component="main" maxWidth="md" sx={{ mb: 4, mt: 4 }}>
      <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
        <Typography component="h1" variant="h4" align="center" gutterBottom>
          Checkout
        </Typography>
        <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {activeStep === steps.length ? (
          <Box textAlign="center">
            <Typography variant="h5" gutterBottom>
              Thank you for your order.
            </Typography>
            <Typography variant="subtitle1">
              Your order has been placed. We have emailed your order
              confirmation, and will send you an update when your order has
              shipped.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/')}
              sx={{ mt: 3 }}
            >
              Back to Home
            </Button>
          </Box>
        ) : (
          <>
            {getStepContent(activeStep)}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
              {activeStep !== 0 && (
                <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                  Back
                </Button>
              )}
              <Button
                variant="contained"
                onClick={handleNext}
                sx={{ mt: 3, ml: 1 }}
              >
                {activeStep === steps.length - 1 ? 'Place order' : 'Next'}
              </Button>
            </Box>
          </>
        )}
      </Paper>
    </Container>
  );
};

export default Checkout;
