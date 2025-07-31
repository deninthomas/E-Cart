import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Mock data for orders
const mockOrders = [
  {
    id: 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Delivered',
    items: [
      { id: 1, name: 'Wireless Headphones', price: 99.99, quantity: 1, image: 'https://via.placeholder.com/80' },
      { id: 2, name: 'Phone Case', price: 19.99, quantity: 2, image: 'https://via.placeholder.com/80' }
    ],
    shippingAddress: {
      name: 'John Doe',
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      country: 'USA'
    },
    paymentMethod: 'Credit Card',
    paymentStatus: 'Paid',
    subtotal: 139.97,
    shipping: 0,
    tax: 12.80,
    total: 152.77,
    trackingNumber: '1Z999AA1234567890',
    trackingUpdates: [
      { date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), status: 'Delivered', location: 'New York, NY', details: 'Delivered to customer' },
      { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), status: 'Out for Delivery', location: 'New York, NY', details: 'Package is out for delivery' },
      { date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), status: 'In Transit', location: 'Jersey City, NJ', details: 'Arrived at local facility' },
      { date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), status: 'Shipped', location: 'Los Angeles, CA', details: 'Package has left the facility' },
      { date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), status: 'Order Processed', location: 'Los Angeles, CA', details: 'Order has been processed' }
    ]
  },
  // Add more mock orders as needed
];

const initialState = {
  orders: [],
  loading: false,
  error: null,
  selectedOrder: null
};

export const updateOrderStatus = createAsyncThunk(
  'orders/updateStatus',
  async ({ orderId, newStatus, update }, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const order = state.orders.orders.find(o => o.id === orderId);
      if (!order) {
        throw new Error('Order not found');
      }
      
      const updatedOrder = {
        ...order,
        status: newStatus,
        trackingUpdates: [
          ...(order.trackingUpdates || []),
          {
            date: new Date().toISOString(),
            status: newStatus,
            location: update?.location || 'Warehouse',
            details: update?.details || `Order status updated to ${newStatus}`
          }
        ]
      };
      
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 100));
      return { orderId, updatedOrder };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addNewOrder = createAsyncThunk(
  'orders/addNewOrder',
  async (orderData, { dispatch, rejectWithValue }) => {
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newOrder = {
        ...orderData,
        id: 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        date: new Date().toISOString(),
        status: 'Processing',
        trackingNumber: '1Z' + Math.random().toString().substr(2, 16),
        trackingUpdates: [
          { 
            date: new Date().toISOString(), 
            status: 'Order Processed', 
            location: 'Warehouse', 
            details: 'Order has been processed' 
          }
        ]
      };
      
      // Schedule status updates
      const scheduleStatusUpdate = (orderId, delay, status, update) => {
        setTimeout(() => {
          dispatch(updateOrderStatus({ 
            orderId, 
            newStatus: status,
            update
          }));
        }, delay);
      };
      
      // Schedule shipping update (4 minutes)
      scheduleStatusUpdate(
        newOrder.id, 
        4 * 60 * 1000, 
        'Shipped',
        { 
          location: 'Warehouse', 
          details: 'Your order has been shipped and is on its way' 
        }
      );
      
      // Schedule in-transit update (9 minutes - 4min + 5min)
      scheduleStatusUpdate(
        newOrder.id, 
        9 * 60 * 1000, 
        'In Transit',
        { 
          location: 'Local Distribution Center', 
          details: 'Your order is in transit to the delivery location' 
        }
      );
      
      // Schedule delivered update (14 minutes - 9min + 5min)
      scheduleStatusUpdate(
        newOrder.id, 
        14 * 60 * 1000, 
        'Delivered',
        { 
          location: 'Your Location', 
          details: 'Your order has been delivered' 
        }
      );
      
      return newOrder;
    } catch (error) {
      return rejectWithValue('Failed to create order');
    }
  }
);

export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Get orders from localStorage if available, otherwise use mock data
      const savedOrders = localStorage.getItem('userOrders');
      return savedOrders ? JSON.parse(savedOrders) : mockOrders;
    } catch (error) {
      return rejectWithValue('Failed to fetch orders');
    }
  }
);

export const cancelOrder = createAsyncThunk(
  'orders/cancelOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      return orderId;
    } catch (error) {
      return rejectWithValue('Failed to cancel order');
    }
  }
);

export const updateOrderPayment = createAsyncThunk(
  'orders/updateOrderPayment',
  async ({ orderId, paymentMethod, status }, { rejectWithValue, getState }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Update local storage if needed
      const currentOrders = [...(getState().orders.orders)];
      const orderIndex = currentOrders.findIndex(order => order.id === orderId);
      
      if (orderIndex !== -1) {
        const updatedOrder = {
          ...currentOrders[orderIndex],
          paymentMethod,
          paymentStatus: status,
          status: status === 'Paid' ? 'Processing' : 'Pending Payment'
        };
        
        // Update the order in the array
        currentOrders[orderIndex] = updatedOrder;
        
        // Save to localStorage
        localStorage.setItem('userOrders', JSON.stringify(currentOrders));
        
        return updatedOrder;
      }
      
      return rejectWithValue('Order not found');
    } catch (error) {
      return rejectWithValue('Failed to update payment');
    }
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    selectOrder: (state, action) => {
      state.selectedOrder = state.orders.find(order => order.id === action.payload);
    },
    clearSelectedOrder: (state) => {
      state.selectedOrder = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch orders
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add new order
      .addCase(addNewOrder.fulfilled, (state, action) => {
        // Check if order already exists to prevent duplicates
        const existingOrderIndex = state.orders.findIndex(o => o.id === action.payload.id);
        if (existingOrderIndex >= 0) {
          state.orders[existingOrderIndex] = action.payload;
        } else {
          state.orders.unshift(action.payload);
        }
        // Save to localStorage
        localStorage.setItem('userOrders', JSON.stringify(state.orders));
      })
      // Update order status
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const { orderId, updatedOrder } = action.payload;
        const orderIndex = state.orders.findIndex(o => o.id === orderId);
        if (orderIndex >= 0) {
          state.orders[orderIndex] = updatedOrder;
          // Update selected order if it's the one being updated
          if (state.selectedOrder && state.selectedOrder.id === orderId) {
            state.selectedOrder = updatedOrder;
          }
          // Save to localStorage
          localStorage.setItem('userOrders', JSON.stringify(state.orders));
        }
      })
      // Cancel order
      .addCase(cancelOrder.fulfilled, (state, action) => {
        const order = state.orders.find(o => o.id === action.payload);
        if (order) {
          order.status = 'Cancelled';
          // Update tracking
          order.trackingUpdates = [
            ...(order.trackingUpdates || []),
            {
              date: new Date().toISOString(),
              status: 'Cancelled',
              location: 'System',
              details: 'Order has been cancelled'
            }
          ];
          // Save to localStorage
          localStorage.setItem('userOrders', JSON.stringify(state.orders));
        }
      })
      .addCase(updateOrderPayment.fulfilled, (state, action) => {
        const index = state.orders.findIndex(order => order.id === action.payload.id);
        if (index !== -1) {
          state.orders[index] = action.payload;
          // Update selected order if it's the one being updated
          if (state.selectedOrder && state.selectedOrder.id === action.payload.id) {
            state.selectedOrder = action.payload;
          }
          // Save to localStorage
          localStorage.setItem('userOrders', JSON.stringify(state.orders));
        }
      });
  }
});

export const { selectOrder, clearSelectedOrder } = ordersSlice.actions;

export const selectAllOrders = (state) => state.orders.orders;
export const selectOrderById = (orderId) => (state) => 
  state.orders.orders.find(order => order.id === orderId);
export const selectSelectedOrder = (state) => state.orders.selectedOrder;
export const selectOrdersLoading = (state) => state.orders.loading;
export const selectOrdersError = (state) => state.orders.error;

export default ordersSlice.reducer;
