import { Box, Button, Container, Paper, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const OrderSuccess = () => {
  const navigate = useNavigate();

  return (
    <Container component="main" maxWidth="sm">
      <Paper
        elevation={3}
        sx={{
          mt: 8,
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <CheckCircleIcon color="success" sx={{ fontSize: 80, mb: 2 }} />
        <Typography component="h1" variant="h4" gutterBottom>
          Order Placed Successfully!
        </Typography>
        <Typography variant="body1" paragraph>
          Thank you for your purchase. Your order has been received and is being processed.
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Order #: {Math.random().toString(36).substring(2, 10).toUpperCase()}
        </Typography>
        <Typography variant="body1" paragraph>
          We've sent a confirmation email with order details and tracking information.
        </Typography>
        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/')}
          >
            Back to Home
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate('/orders')}
          >
            View Orders
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default OrderSuccess;
