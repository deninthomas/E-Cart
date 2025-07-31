import { useState, useEffect } from 'react';
import { 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Button, 
  Container,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Rating,
  Pagination,
  CircularProgress
} from '@mui/material';
import { Link } from 'react-router-dom';

// Mock data - in a real app, this would come from an API
const mockProducts = [
  {
    id: 1,
    name: 'Wireless Headphones',
    price: 99.99,
    rating: 4.5,
    image: 'https://via.placeholder.com/300x200?text=Wireless+Headphones',
    category: 'Electronics',
    description: 'High-quality wireless headphones with noise cancellation.'
  },
  {
    id: 2,
    name: 'Smart Watch',
    price: 199.99,
    rating: 4.2,
    image: 'https://via.placeholder.com/300x200?text=Smart+Watch',
    category: 'Electronics',
    description: 'Feature-rich smartwatch with health tracking.'
  },
  {
    id: 3,
    name: 'Running Shoes',
    price: 79.99,
    rating: 4.7,
    image: 'https://via.placeholder.com/300x200?text=Running+Shoes',
    category: 'Fashion',
    description: 'Comfortable running shoes for all terrains.'
  },
  {
    id: 4,
    name: 'Laptop Backpack',
    price: 49.99,
    rating: 4.3,
    image: 'https://via.placeholder.com/300x200?text=Laptop+Backpack',
    category: 'Accessories',
    description: 'Durable backpack with laptop compartment.'
  },
  {
    id: 5,
    name: 'Bluetooth Speaker',
    price: 59.99,
    rating: 4.1,
    image: 'https://via.placeholder.com/300x200?text=Bluetooth+Speaker',
    category: 'Electronics',
    description: 'Portable speaker with rich sound quality.'
  },
  {
    id: 6,
    name: 'Yoga Mat',
    price: 29.99,
    rating: 4.6,
    image: 'https://via.placeholder.com/300x200?text=Yoga+Mat',
    category: 'Fitness',
    description: 'Non-slip yoga mat for comfortable workouts.'
  },
];

const categories = ['All', 'Electronics', 'Fashion', 'Accessories', 'Fitness'];

const Products = ({ addToCart }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [page, setPage] = useState(1);
  const productsPerPage = 6;

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setProducts(mockProducts);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === 'All' || product.category === category;
    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'priceLowHigh':
        return a.price - b.price;
      case 'priceHighLow':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  // Pagination
  const count = Math.ceil(sortedProducts.length / productsPerPage);
  const paginatedProducts = sortedProducts.slice(
    (page - 1) * productsPerPage,
    page * productsPerPage
  );

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Our Products
      </Typography>
      
      {/* Filters and Search */}
      <Box sx={{ mb: 4, display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
        <TextField
          label="Search products"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ minWidth: 200, flexGrow: 1 }}
        />
        
        <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            label="Category"
          >
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            label="Sort By"
          >
            <MenuItem value="featured">Featured</MenuItem>
            <MenuItem value="priceLowHigh">Price: Low to High</MenuItem>
            <MenuItem value="priceHighLow">Price: High to Low</MenuItem>
            <MenuItem value="rating">Top Rated</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {paginatedProducts.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="textSecondary">
            No products found matching your criteria.
          </Typography>
        </Box>
      ) : (
        <>
          <Grid container spacing={4}>
            {paginatedProducts.map((product) => (
              <Grid item key={product.id} xs={12} sm={6} md={4}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={product.image}
                    alt={product.name}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h6" component="h2">
                      <Link to={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        {product.name}
                      </Link>
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Rating value={product.rating} precision={0.5} readOnly />
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                        {product.rating}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {product.description}
                    </Typography>
                    <Typography variant="h6" color="primary" sx={{ mt: 'auto', mb: 2 }}>
                      ${product.price.toFixed(2)}
                    </Typography>
                  </CardContent>
                  <Box sx={{ p: 2, pt: 0 }}>
                    <Button 
                      variant="contained" 
                      fullWidth 
                      onClick={() => handleAddToCart(product)}
                    >
                      Add to Cart
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
          
          {/* Pagination */}
          {count > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination 
                count={count} 
                page={page} 
                onChange={handlePageChange} 
                color="primary"
                showFirstButton 
                showLastButton 
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default Products;
