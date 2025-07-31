import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Rating,
  Divider,
  Chip,
  Paper,
  IconButton,
  TextField,
  useTheme,
  useMediaQuery,
  Breadcrumbs,
  Link as MuiLink,
  Alert,
  CircularProgress
} from '@mui/material';
import { Link } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Mock product data - in a real app, this would come from an API
const mockProduct = {
  id: 1,
  name: 'Wireless Noise-Cancelling Headphones',
  price: 299.99,
  rating: 4.7,
  reviewCount: 124,
  images: [
    'https://via.placeholder.com/800x600?text=Wireless+Headphones+Front',
    'https://via.placeholder.com/800x600?text=Wireless+Headphones+Side',
    'https://via.placeholder.com/800x600?text=Wireless+Headphones+Back',
    'https://via.placeholder.com/800x600?text=Wireless+Headphones+Case',
  ],
  category: 'Electronics',
  brand: 'AudioPro',
  description: 'Experience crystal-clear sound with our premium wireless noise-cancelling headphones. Perfect for music lovers and professionals who demand the best audio experience.',
  features: [
    'Active Noise Cancellation',
    '30-hour battery life',
    'Bluetooth 5.0',
    'Built-in microphone',
    'Touch controls',
    'Foldable design'
  ],
  inStock: true,
  sku: 'AUDIO-1001',
  weight: '0.5 kg',
  dimensions: '18.5 x 17.0 x 8.0 cm'
};

const ProductDetail = ({ addToCart }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      try {
        setProduct(mockProduct);
        // In a real app, you would fetch related products based on the current product's category
        setRelatedProducts([
          { id: 2, name: 'Bluetooth Speaker', price: 89.99, image: 'https://via.placeholder.com/300x200?text=Bluetooth+Speaker' },
          { id: 3, name: 'Earbuds Pro', price: 149.99, image: 'https://via.placeholder.com/300x200?text=Earbuds+Pro' },
          { id: 4, name: 'Portable DAC', price: 129.99, image: 'https://via.placeholder.com/300x200?text=Portable+DAC' },
        ]);
        setLoading(false);
      } catch (err) {
        setError('Failed to load product details');
        setLoading(false);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [id]);

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    const cartItem = {
      ...product,
      quantity,
      total: product.price * quantity
    };
    
    addToCart(cartItem);
    
    // Show success message (in a real app, you might want to use a toast/snackbar)
    setError('');
    setTimeout(() => {
      // Navigate to cart after a short delay
      navigate('/cart');
    }, 1000);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!product) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h5" color="error">
          {error || 'Product not found'}
        </Typography>
        <Button 
          variant="outlined" 
          color="primary" 
          sx={{ mt: 2 }}
          onClick={() => navigate('/products')}
        >
          Back to Products
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <MuiLink component={Link} to="/" color="inherit">
          Home
        </MuiLink>
        <MuiLink component={Link} to="/products" color="inherit">
          Products
        </MuiLink>
        <Typography color="text.primary">{product.name}</Typography>
      </Breadcrumbs>
      
      <Button 
        startIcon={<ArrowBackIcon />} 
        onClick={() => navigate(-1)}
        sx={{ mb: 2 }}
      >
        Back
      </Button>

      <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, mb: 6 }}>
        <Grid container spacing={4}>
          {/* Product Images */}
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2, borderRadius: 1, overflow: 'hidden' }}>
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                style={{ 
                  width: '100%', 
                  height: 'auto',
                  display: 'block',
                  borderRadius: '8px'
                }}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', py: 1 }}>
              {product.images.map((img, index) => (
                <Box
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  sx={{
                    width: 80,
                    height: 80,
                    minWidth: 80,
                    borderRadius: 1,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border: selectedImage === index ? `2px solid ${theme.palette.primary.main}` : '1px solid #e0e0e0',
                    opacity: selectedImage === index ? 1 : 0.8,
                    '&:hover': {
                      opacity: 1,
                    },
                  }}
                >
                  <img
                    src={img}
                    alt={`${product.name} ${index + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </Box>
              ))}
            </Box>
          </Grid>

          {/* Product Info */}
          <Grid item xs={12} md={6}>
            <Typography variant="h4" component="h1" gutterBottom>
              {product.name}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Rating value={product.rating} precision={0.5} readOnly />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                {product.rating} ({product.reviewCount} reviews)
              </Typography>
              <Chip 
                label={product.inStock ? 'In Stock' : 'Out of Stock'} 
                color={product.inStock ? 'success' : 'error'} 
                size="small" 
                sx={{ ml: 2 }}
              />
            </Box>

            <Typography variant="h4" color="primary" sx={{ mb: 3 }}>
              ${product.price.toFixed(2)}
            </Typography>

            <Typography variant="body1" paragraph>
              {product.description}
            </Typography>

            <Divider sx={{ my: 3 }} />

            {/* Quantity Selector */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
              <Typography variant="subtitle1" sx={{ mr: 2, minWidth: 100 }}>
                Quantity:
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <IconButton 
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  size="small"
                >
                  <RemoveIcon />
                </IconButton>
                <TextField
                  value={quantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                  type="number"
                  inputProps={{ min: 1, max: 10, style: { textAlign: 'center' } }}
                  sx={{ width: 70, mx: 1 }}
                  size="small"
                />
                <IconButton 
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= 10}
                  size="small"
                >
                  <AddIcon />
                </IconButton>
              </Box>
            </Box>

            {/* Add to Cart Button */}
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={<ShoppingCartIcon />}
              onClick={handleAddToCart}
              disabled={!product.inStock}
              fullWidth={isMobile}
              sx={{ py: 1.5, mb: 2 }}
            >
              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </Button>

            {/* Product Meta */}
            <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid #eee' }}>
              <Typography variant="body2" color="text.secondary">
                <strong>SKU:</strong> {product.sku} | <strong>Category:</strong> {product.category} | <strong>Brand:</strong> {product.brand}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Product Tabs */}
        <Box sx={{ mt: 6 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Typography variant="h6" component="h2">
              Product Details
            </Typography>
          </Box>
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>
                Features
              </Typography>
              <ul style={{ paddingLeft: 20, marginTop: 0 }}>
                {product.features.map((feature, index) => (
                  <li key={index}>
                    <Typography variant="body2">{feature}</Typography>
                  </li>
                ))}
              </ul>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>
                Specifications
              </Typography>
              <Box component="dl" sx={{ m: 0 }}>
                <Box sx={{ display: 'flex', py: 1, borderBottom: '1px solid #f5f5f5' }}>
                  <Box component="dt" sx={{ flex: '0 0 150px', color: 'text.secondary' }}>Weight</Box>
                  <Box component="dd" sx={{ m: 0 }}>{product.weight}</Box>
                </Box>
                <Box sx={{ display: 'flex', py: 1, borderBottom: '1px solid #f5f5f5' }}>
                  <Box component="dt" sx={{ flex: '0 0 150px', color: 'text.secondary' }}>Dimensions</Box>
                  <Box component="dd" sx={{ m: 0 }}>{product.dimensions}</Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            You May Also Like
          </Typography>
          <Grid container spacing={3}>
            {relatedProducts.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item.id}>
                <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
                  <Box sx={{ textAlign: 'center', mb: 2 }}>
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      style={{ maxWidth: '100%', height: 'auto', maxHeight: 150, objectFit: 'contain' }}
                    />
                  </Box>
                  <Typography variant="subtitle1" gutterBottom>
                    {item.name}
                  </Typography>
                  <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
                    ${item.price.toFixed(2)}
                  </Typography>
                  <Button 
                    component={Link}
                    to={`/products/${item.id}`}
                    variant="outlined"
                    size="small"
                    fullWidth
                  >
                    View Details
                  </Button>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Container>
  );
};

export default ProductDetail;
