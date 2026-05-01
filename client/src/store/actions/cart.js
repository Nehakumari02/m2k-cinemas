import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  UPDATE_CART_QUANTITY,
  CLEAR_CART,
  SAVE_SHIPPING_ADDRESS,
  CREATE_ORDER,
  GET_MY_ORDERS,
  GET_ALL_ORDERS,
  UPDATE_ORDER_STATUS,
  ORDER_ERROR
} from '../types';
import { setAlert } from './alert';

// Add to cart
export const addToCart = (product, quantity) => dispatch => {
  dispatch({
    type: ADD_TO_CART,
    payload: { ...product, quantity }
  });
  dispatch(setAlert('Added to Cart', 'success'));
};

// Remove from cart
export const removeFromCart = id => dispatch => {
  dispatch({
    type: REMOVE_FROM_CART,
    payload: id
  });
};

// Update cart quantity
export const updateCartQuantity = (id, quantity) => dispatch => {
  dispatch({
    type: UPDATE_CART_QUANTITY,
    payload: { id, quantity }
  });
};

// Clear cart
export const clearCart = () => dispatch => {
  dispatch({ type: CLEAR_CART });
};

// Save shipping address
export const saveShippingAddress = data => dispatch => {
  dispatch({
    type: SAVE_SHIPPING_ADDRESS,
    payload: data
  });
};

// Create order
export const createOrder = order => async dispatch => {
  try {
    const token = localStorage.getItem('jwtToken');
    const res = await fetch('/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(order)
    });
    const data = await res.json();
    if (res.ok) {
      dispatch({
        type: CREATE_ORDER,
        payload: data
      });
      dispatch(clearCart());
      dispatch(setAlert('Order Placed Successfully!', 'success'));
      return data;
    } else {
      dispatch(setAlert(data.error || 'Order failed', 'error'));
      return null;
    }
  } catch (err) {
    dispatch(setAlert('Server Error. Please try again.', 'error'));
    return null;
  }
};

// Get my orders
export const getMyOrders = () => async dispatch => {
  try {
    const token = localStorage.getItem('jwtToken');
    const res = await fetch('/orders/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    dispatch({
      type: GET_MY_ORDERS,
      payload: data
    });
  } catch (err) {
    dispatch({
      type: ORDER_ERROR,
      payload: { msg: err.response?.statusText, status: err.response?.status }
    });
  }
};

// Get all orders (admin)
export const getAllOrders = () => async dispatch => {
  try {
    const token = localStorage.getItem('jwtToken');
    const res = await fetch('/admin/orders', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    dispatch({
      type: GET_ALL_ORDERS,
      payload: data
    });
  } catch (err) {
    dispatch({
      type: ORDER_ERROR,
      payload: { msg: err.response?.statusText, status: err.response?.status }
    });
  }
};

// Update order status (admin)
export const updateOrderStatus = (id, statusData) => async dispatch => {
  try {
    const token = localStorage.getItem('jwtToken');
    const res = await fetch(`/admin/orders/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(statusData)
    });
    const data = await res.json();
    if (res.ok) {
      dispatch({
        type: UPDATE_ORDER_STATUS,
        payload: data
      });
      dispatch(setAlert('Order Status Updated', 'success'));
      return data;
    }
  } catch (err) {
    dispatch({
      type: ORDER_ERROR,
      payload: { msg: err.response?.statusText, status: err.response?.status }
    });
  }
};
