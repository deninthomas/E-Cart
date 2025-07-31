import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Badge, 
  Box, 
  Menu, 
  MenuItem, 
  Avatar, 
  Divider,
  Link
} from '@mui/material';
import { 
  ShoppingCart as ShoppingCartIcon,
  Person as PersonIcon,
  ExitToApp as LogoutIcon,
  AccountCircle as AccountIcon,
  Receipt as ReceiptIcon
} from '@mui/icons-material';
import { logout, selectCurrentUser } from '../features/auth/authSlice';
import { selectCartTotalItems } from '../features/cart/cartSlice';

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);
  const cartItemCount = useSelector(selectCartTotalItems);
  const isAuthenticated = !!user;
  const open = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    dispatch(logout());
    navigate('/');
  };

  const handleMyOrders = () => {
    handleClose();
    navigate('/orders');
  };

  return (
    <AppBar position="static" sx={{ mb: 4 }}>
      <Toolbar>
        <Typography 
          variant="h6" 
          component={RouterLink} 
          to="/" 
          sx={{ 
            flexGrow: 1, 
            textDecoration: 'none',
            color: 'inherit',
            fontWeight: 'bold'
          }}
        >
          E-Commerce Store
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Button 
            component={RouterLink} 
            to="/products" 
            color="inherit"
          >
            Products
          </Button>
          
          <IconButton 
            component={RouterLink} 
            to="/cart" 
            color="inherit"
            aria-label="shopping cart"
          >
            <Badge badgeContent={cartItemCount} color="secondary">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
          
          {isAuthenticated ? (
            <>
              <IconButton
                onClick={handleMenu}
                color="inherit"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
              >
                <Avatar 
                  sx={{ 
                    width: 32, 
                    height: 32, 
                    bgcolor: 'secondary.main',
                    textTransform: 'uppercase'
                  }}
                  alt={user?.name || 'User'}
                  src={user?.avatar}
                >
                  {user?.name ? user.name.charAt(0) : <PersonIcon fontSize="small" />}
                </Avatar>
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={open}
                onClose={handleClose}
                PaperProps={{
                  sx: {
                    mt: 1,
                    minWidth: 200,
                    '& .MuiAvatar-root': {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                  },
                }}
              >
                <Box sx={{ px: 2, py: 1 }}>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {user?.name || 'User'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {user?.email}
                  </Typography>
                </Box>
                <Divider />
                <MenuItem onClick={handleClose} component={RouterLink} to="/profile">
                  <AccountIcon sx={{ mr: 1 }} />
                  Profile
                </MenuItem>
                <MenuItem onClick={handleMyOrders}>
                  <ReceiptIcon sx={{ mr: 1 }} />
                  My Orders
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <LogoutIcon sx={{ mr: 1 }} />
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button 
                component={RouterLink} 
                to="/login" 
                color="inherit"
                variant="outlined"
                size="small"
                sx={{ ml: 1 }}
              >
                Login
              </Button>
              <Button 
                component={RouterLink} 
                to="/signup" 
                color="secondary" 
                variant="contained"
                size="small"
                sx={{ ml: 1 }}
              >
                Sign Up
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
