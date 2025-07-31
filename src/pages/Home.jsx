import { Box, Button, Container, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import heroImage from '../assets/hero.jpg';

const Home = () => {
  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '60vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          textAlign: 'center',
          mb: 6,
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to Our Store
        </Typography>
        <Typography variant="h5" gutterBottom sx={{ mb: 4, maxWidth: '800px' }}>
          Discover amazing products at unbeatable prices
        </Typography>
        <Button
          component={RouterLink}
          to="/products"
          variant="contained"
          size="large"
          color="primary"
        >
          Shop Now
        </Button>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h4" component="h2" align="center" gutterBottom>
          Why Choose Us
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', mt: 4, gap: 4 }}>
          {[
            {
              title: 'Fast Delivery',
              description: 'Get your products delivered to your doorstep in no time.'
            },
            {
              title: 'Quality Products',
              description: 'We offer only the best quality products from trusted brands.'
            },
            {
              title: '24/7 Support',
              description: 'Our customer support team is always here to help you.'
            }
          ].map((feature, index) => (
            <Box key={index} sx={{ textAlign: 'center', maxWidth: 300 }}>
              <Box sx={{ 
                width: 80, 
                height: 80, 
                bgcolor: 'primary.main', 
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2,
                color: 'white',
                fontSize: '2rem'
              }}>
                {index + 1}
              </Box>
              <Typography variant="h6" gutterBottom>
                {feature.title}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {feature.description}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>

      {/* Call to Action */}
      <Box sx={{ bgcolor: 'primary.light', py: 6, mt: 6 }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="h4" component="h2" gutterBottom>
            Ready to start shopping?
          </Typography>
          <Typography variant="body1" paragraph sx={{ mb: 4 }}>
            Join thousands of satisfied customers who trust us for their shopping needs.
          </Typography>
          <Button 
            component={RouterLink} 
            to="/signup" 
            variant="contained" 
            size="large"
            sx={{ mr: 2 }}
          >
            Sign Up Now
          </Button>
          <Button 
            component={RouterLink} 
            to="/products" 
            variant="outlined" 
            size="large"
            sx={{ color: 'white', borderColor: 'white' }}
          >
            Browse Products
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
