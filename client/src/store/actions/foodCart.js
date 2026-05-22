import {
  ADD_TO_FOOD_CART,
  REMOVE_FROM_FOOD_CART,
  UPDATE_FOOD_CART_QUANTITY,
  CLEAR_FOOD_CART,
  CREATE_FOOD_ORDER,
  GET_MY_FOOD_ORDERS
} from '../types';
import { setAlert } from './alert';

export const addToFoodCart = (item, quantity = 1) => dispatch => {
  dispatch({
    type: ADD_TO_FOOD_CART,
    payload: { ...item, quantity }
  });
  dispatch(setAlert(`${item.name} added to food cart`, 'success', 3000));
};

export const removeFromFoodCart = id => dispatch => {
  dispatch({ type: REMOVE_FROM_FOOD_CART, payload: id });
};

export const updateFoodCartQuantity = (id, quantity) => dispatch => {
  dispatch({ type: UPDATE_FOOD_CART_QUANTITY, payload: { id, quantity } });
};

export const clearFoodCart = () => ({ type: CLEAR_FOOD_CART });

export const createFoodOrder = orderData => async dispatch => {
  try {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      dispatch(setAlert('Please login to place a food order', 'error', 5000));
      return null;
    }
    const res = await fetch('/food-orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(orderData)
    });
    const data = await res.json();
    if (res.ok) {
      dispatch({ type: CREATE_FOOD_ORDER, payload: data });
      dispatch(clearFoodCart());
      dispatch(setAlert('Food order placed! Collect at the concession counter.', 'success', 6000));
      return data;
    }
    dispatch(setAlert(data.error || 'Food order failed', 'error', 5000));
    return null;
  } catch (err) {
    dispatch(setAlert('Server error. Please try again.', 'error', 5000));
    return null;
  }
};

export const getMyFoodOrders = () => async dispatch => {
  try {
    const token = localStorage.getItem('jwtToken');
    if (!token) return;
    const res = await fetch('/food-orders/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (res.ok) {
      dispatch({ type: GET_MY_FOOD_ORDERS, payload: data });
    }
  } catch (err) {
    console.error(err);
  }
};
