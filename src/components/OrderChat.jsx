import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Box, 
  Paper, 
  TextField, 
  IconButton, 
  Avatar, 
  Typography, 
  Divider, 
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Tooltip,
  ClickAwayListener
} from '@mui/material';
import { 
  Send as SendIcon, 
  AttachMoney as PaymentIcon, 
  ErrorOutline as ErrorOutlineIcon,
  CheckCircleOutline as CheckCircleOutlineIcon
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { updateOrderPayment } from '../features/orders/ordersSlice';

const OrderChat = ({ order, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [retryMessageId, setRetryMessageId] = useState(null);
  const messagesEndRef = useRef(null);
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  // Initialize with order status message
  useEffect(() => {
    if (order) {
      const initialMessages = [
        {
          id: 1,
          sender: 'system',
          text: `Your order #${order._id} has been placed and is being processed.`,
          timestamp: new Date().toISOString()
        },
        {
          id: 2,
          sender: 'system',
          text: `Order total: $${order.total.toFixed(2)}`,
          timestamp: new Date().toISOString()
        },
        {
          id: 3,
          sender: 'system',
          text: `Payment method: ${order.paymentMethod}`,
          timestamp: new Date().toISOString()
        }
      ];
      setMessages(initialMessages);
    }
  }, [order]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const generateAutoResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Common order-related queries
    if (lowerMessage.includes('track') || lowerMessage.includes('where is my order')) {
      return `Your order #${order._id} is currently ${order.status}. ` +
             `You can track it using this number: ${order.trackingNumber || 'Not available yet'}.`;
    }
    
    if (lowerMessage.includes('payment') || lowerMessage.includes('pay')) {
      return `Your current payment method is ${order.paymentMethod} and the status is ${order.paymentStatus}. ` +
             `You can update your payment method using the "Update Payment" button above.`;
    }
    
    if (lowerMessage.includes('cancel') || lowerMessage.includes('return')) {
      return `To cancel or return your order, please visit the order details page and select the "Cancel Order" option. ` +
             `Our team will process your request within 24 hours.`;
    }
    
    if (lowerMessage.includes('contact') || lowerMessage.includes('speak to someone')) {
      return `You can reach our customer support at support@example.com or call us at +1 (555) 123-4567 ` +
             `from 9 AM to 6 PM, Monday to Friday.`;
    }
    
    // Default response
    return 'Thank you for your message. Our support team will get back to you soon. ' +
           'Is there anything else I can help you with?';
  };

  const sendMessage = async (messageText, messageId = null) => {
    if ((!messageText && !messageId) || isSending) return;
    
    const tempId = messageId || `temp-${Date.now()}`;
    const message = messageId 
      ? messages.find(m => m.id === messageId)
      : {
          id: tempId,
          sender: 'user',
          text: messageText,
          timestamp: new Date().toISOString(),
          status: 'sending'
        };
    
    // If this is a new message, add it to the list
    if (!messageId) {
      setMessages(prev => [...prev, message]);
      setNewMessage('');
    } else {
      // If retrying, update the existing message
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, status: 'sending', timestamp: new Date().toISOString() }
          : msg
      ));
    }
    
    setIsSending(true);
    setRetryMessageId(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate random failure (10% chance)
      const shouldFail = Math.random() < 0.1;
      
      if (shouldFail) {
        throw new Error('Failed to send message');
      }
      
      // Update message status to delivered
      setMessages(prev => prev.map(msg => 
        msg.id === tempId 
          ? { ...msg, id: Date.now().toString(), status: 'delivered' }
          : msg
      ));
      
      // Simulate support response
      setTimeout(() => {
        const response = {
          id: Date.now().toString(),
          sender: 'support',
          text: generateAutoResponse(message.text),
          timestamp: new Date().toISOString(),
          status: 'delivered'
        };
        setMessages(prev => [...prev, response]);
      }, 1000);
      
    } catch (error) {
      // Update message status to failed
      setMessages(prev => prev.map(msg => 
        msg.id === tempId 
          ? { ...msg, status: 'failed' }
          : msg
      ));
    } finally {
      setIsSending(false);
    }
  };
  
  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;
    sendMessage(newMessage.trim());
  };
  
  const handleRetryMessage = (messageId) => {
    sendMessage(null, messageId);
  };

  const handlePaymentUpdate = () => {
    if (!selectedPayment) return;
    
    // Dispatch action to update payment method
    dispatch(updateOrderPayment({
      orderId: order._id,
      paymentMethod: selectedPayment,
      status: selectedPayment === 'Cash on Delivery' ? 'Pending' : 'Paid'
    }));
    
    // Add system message
    const message = {
      id: messages.length + 1,
      sender: 'system',
      text: `Payment method updated to: ${selectedPayment}`,
      timestamp: new Date().toISOString()
    };
    
    setMessages([...messages, message]);
    setShowPaymentDialog(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!order) return null;

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Chat header */}
      <Box sx={{ 
        p: 2, 
        borderBottom: '1px solid #e0e0e0', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        backgroundColor: 'primary.main',
        color: 'primary.contrastText',
        borderRadius: '4px 4px 0 0'
      }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>Order #{order._id.slice(-6).toUpperCase()}</Typography>
          <Typography variant="caption">Status: {order.status}</Typography>
        </Box>
        <Button 
          variant="contained"
          color="secondary"
          startIcon={<PaymentIcon />}
          onClick={() => setShowPaymentDialog(true)}
          size="small"
          sx={{ 
            backgroundColor: 'background.paper',
            color: 'text.primary',
            '&:hover': {
              backgroundColor: 'background.default'
            }
          }}
        >
          Update Payment
        </Button>
      </Box>
      
      {/* Messages */}
      <Box sx={{ 
        flex: 1, 
        overflowY: 'auto', 
        p: 2,
        background: 'linear-gradient(180deg, #f9f9f9 0%, #f0f0f0 100%)',
        '&::-webkit-scrollbar': {
          width: '6px',
        },
        '&::-webkit-scrollbar-track': {
          background: '#f1f1f1',
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#888',
          borderRadius: '3px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          background: '#555',
        }
      }}>
        {messages.map((message, index) => {
          // Check if we need to show date separator
          const showDate = index === 0 || 
            new Date(message.timestamp).toDateString() !== 
            new Date(messages[index - 1].timestamp).toDateString();
            
          return (
            <React.Fragment key={message.id}>
              {showDate && (
                <Box sx={{ 
                  textAlign: 'center', 
                  my: 2,
                  '&:before, &:after': {
                    content: '""',
                    display: 'inline-block',
                    width: '30%',
                    height: '1px',
                    backgroundColor: 'divider',
                    verticalAlign: 'middle',
                    mx: 2
                  }
                }}>
                  <Typography variant="caption" color="text.secondary">
                    {formatDate(message.timestamp)}
                  </Typography>
                </Box>
              )}
              <Box 
                sx={{ 
                  display: 'flex', 
                  justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                  mb: 2,
                  animation: 'fadeIn 0.3s ease-in-out',
                  '@keyframes fadeIn': {
                    from: { opacity: 0, transform: 'translateY(10px)' },
                    to: { opacity: 1, transform: 'translateY(0)' }
                  }
                }}
              >
                {message.sender !== 'user' && (
                  <Avatar 
                    sx={{ 
                      mr: 1, 
                      alignSelf: 'flex-end',
                      bgcolor: message.sender === 'system' ? 'secondary.main' : 'primary.main',
                      width: 32,
                      height: 32,
                      fontSize: '0.8rem'
                    }}
                  >
                    {message.sender === 'system' ? 'SYS' : 'SUP'}
                  </Avatar>
                )}
                <Box sx={{ maxWidth: '80%' }}>
                  <Paper 
                    elevation={0}
                    onClick={() => message.status === 'failed' && setRetryMessageId(message.id)}
                    sx={{
                      cursor: message.status === 'failed' ? 'pointer' : 'default',
                      '&:hover': {
                        boxShadow: message.status === 'failed' ? '0 2px 8px rgba(0,0,0,0.2)' : '0 2px 4px rgba(0,0,0,0.1)'
                      },
                      p: 1.5, 
                      backgroundColor: message.sender === 'user' 
                        ? message.status === 'failed' 
                          ? 'error.light' 
                          : 'primary.main' 
                        : 'background.paper',
                      color: message.sender === 'user' 
                        ? message.status === 'failed' 
                          ? 'error.contrastText' 
                          : 'primary.contrastText' 
                        : 'text.primary',
                      borderRadius: message.sender === 'user' 
                        ? '16px 16px 4px 16px' 
                        : '16px 16px 16px 4px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      position: 'relative',
                      opacity: message.status === 'sending' ? 0.8 : 1,
                      transition: 'all 0.2s ease-in-out',
                      '&:after': {
                        content: '""',
                        position: 'absolute',
                        bottom: 0,
                        right: message.sender === 'user' ? '-6px' : 'auto',
                        left: message.sender === 'user' ? 'auto' : '-6px',
                        width: '12px',
                        height: '12px',
                        backgroundColor: message.sender === 'user' 
                          ? message.status === 'failed' 
                            ? 'error.light' 
                            : 'primary.main' 
                          : 'background.paper',
                        transform: 'rotate(45deg)',
                        zIndex: 0,
                        boxShadow: message.sender === 'user' && message.status !== 'failed'
                          ? '2px 2px 3px rgba(0,0,0,0.1)'
                          : 'none'
                      }
                    }}
                  >
                    <Box sx={{ position: 'relative', zIndex: 1 }}>
                      {message.status === 'failed' && retryMessageId === message.id && (
                        <ClickAwayListener onClickAway={() => setRetryMessageId(null)}>
                          <Tooltip 
                            open={true} 
                            title={
                              <Box sx={{ p: 1 }}>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                  Message not delivered
                                </Typography>
                                <Button 
                                  variant="contained" 
                                  color="primary" 
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRetryMessage(message.id);
                                  }}
                                  sx={{
                                    textTransform: 'none',
                                    fontSize: '0.75rem',
                                    py: 0.5,
                                    px: 1.5
                                  }}
                                >
                                  Tap to retry
                                </Button>
                              </Box>
                            }
                            placement="left"
                            arrow
                          >
                            <Box />
                          </Tooltip>
                        </ClickAwayListener>
                      )}
                      <Typography variant="caption" sx={{ 
                        display: 'block', 
                        mb: 0.5,
                        color: message.sender === 'user' 
                          ? 'rgba(255,255,255,0.8)' 
                          : 'text.secondary',
                        fontSize: '0.65rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        {message.sender === 'user' 
                          ? 'You' 
                          : message.sender === 'system' 
                            ? 'System' 
                            : 'Support Agent'}
                        <span style={{ margin: '0 6px' }}>•</span>
                        {formatTime(message.timestamp)}
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        lineHeight: 1.5,
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word'
                      }}>
                        {message.text}
                      </Typography>
                    </Box>
                  </Paper>
                  {message.sender === 'user' && (
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      mt: 0.5,
                      px: 1,
                      gap: 0.5
                    }}>
                      {message.status === 'sending' && (
                        <CircularProgress size={12} thickness={4} color="inherit" />
                      )}
                      {message.status === 'failed' && (
                        <ErrorOutlineIcon 
                          fontSize="small" 
                          color="error" 
                          sx={{ fontSize: '0.9rem', mr: 0.5 }} 
                        />
                      )}
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: message.status === 'failed' ? 'error.main' : 'text.secondary',
                          fontSize: '0.65rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5
                        }}
                      >
                        {message.status === 'sending' 
                          ? 'Sending...' 
                          : message.status === 'failed'
                            ? 'Not delivered. Tap to retry' 
                            : 'Delivered'}
                        {message.status === 'delivered' && (
                          <CheckCircleOutlineIcon fontSize="inherit" color="success" />
                        )}
                      </Typography>
                    </Box>
                  )}
                </Box>
                {message.sender === 'user' && (
                  <Avatar 
                    sx={{ 
                      ml: 1, 
                      alignSelf: 'flex-end',
                      bgcolor: 'primary.dark',
                      width: 32,
                      height: 32,
                      fontSize: '0.9rem'
                    }}
                  >
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </Avatar>
                )}
              </Box>
            </React.Fragment>
          );
        })}
        <div ref={messagesEndRef} />
      </Box>
      
      {/* Message input */}
      <Box sx={{ 
        p: 2, 
        borderTop: '1px solid #e0e0e0',
        backgroundColor: 'background.paper',
        borderBottomLeftRadius: '8px',
        borderBottomRightRadius: '8px',
        boxShadow: '0 -2px 10px rgba(0,0,0,0.05)'
      }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'flex-end',
          backgroundColor: 'background.paper',
          borderRadius: '24px',
          border: '1px solid',
          borderColor: 'divider',
          p: 1,
          transition: 'all 0.2s',
          '&:focus-within': {
            borderColor: 'primary.main',
            boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)'
          }
        }}>
          <TextField
            fullWidth
            variant="standard"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            multiline
            maxRows={4}
            sx={{ 
              mx: 1,
              '& .MuiInputBase-root': {
                '&:before, &:after': {
                  display: 'none'
                },
                '& .MuiInputBase-input': {
                  p: 1,
                  '&::placeholder': {
                    opacity: 0.6
                  }
                }
              }
            }}
            InputProps={{
              disableUnderline: true,
            }}
          />
          <Tooltip title={!newMessage.trim() ? 'Type a message to send' : ''} arrow>
            <span> {/* Wrapper span for disabled tooltip */}
              <IconButton 
                color="primary" 
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                sx={{ 
              alignSelf: 'flex-end',
              mb: 0.5,
              mr: 0.5,
              backgroundColor: 'primary.main',
              color: 'primary.contrastText',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
              '&:disabled': {
                backgroundColor: 'action.disabledBackground',
                color: 'action.disabled'
              },
              transition: 'all 0.2s',
              transform: newMessage.trim() ? 'scale(1.1)' : 'none',
              '&:active': {
                transform: 'scale(0.95)'
              }
            }}
          >
                <SendIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      </Box>

      {/* Payment Update Dialog */}
      <Dialog open={showPaymentDialog} onClose={() => setShowPaymentDialog(false)}>
        <DialogTitle>Update Payment Method</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="payment-method-label">Payment Method</InputLabel>
            <Select
              labelId="payment-method-label"
              value={selectedPayment}
              label="Payment Method"
              onChange={(e) => setSelectedPayment(e.target.value)}
            >
              <MenuItem value="Credit Card">Credit Card</MenuItem>
              <MenuItem value="PayPal">PayPal</MenuItem>
              <MenuItem value="Cash on Delivery">Cash on Delivery</MenuItem>
            </Select>
          </FormControl>
          {selectedPayment === 'Cash on Delivery' && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Note: Payment will be collected at the time of delivery.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPaymentDialog(false)}>Cancel</Button>
          <Button 
            onClick={handlePaymentUpdate} 
            variant="contained"
            disabled={!selectedPayment}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OrderChat;
