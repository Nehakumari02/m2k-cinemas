import { GET_FOOD, ADD_FOOD, DELETE_FOOD, UPDATE_FOOD, FOOD_ERROR } from '../types';
import { setAlert } from './alert';

// GET all food
export const getFood = () => async dispatch => {
  try {
    const response = await fetch('/food', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const food = await response.json();
    if (response.ok) {
      dispatch({ type: GET_FOOD, payload: food });
    }
  } catch (error) {
    dispatch({ type: FOOD_ERROR, payload: error.message });
  }
};

// ADD food
export const addFood = foodData => async dispatch => {
  try {
    const token = localStorage.getItem('jwtToken');
    const response = await fetch('/food', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(foodData)
    });
    const food = await response.json();
    if (response.ok) {
      dispatch({ type: ADD_FOOD, payload: food });
      dispatch(setAlert('Food Item Added', 'success', 5000));
      return { status: 'success' };
    }
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
    return { status: 'error' };
  }
};

// DELETE food
export const removeFood = id => async dispatch => {
  try {
    const token = localStorage.getItem('jwtToken');
    const response = await fetch(`/food/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (response.ok) {
      dispatch({ type: DELETE_FOOD, payload: id });
      dispatch(setAlert('Food Item Deleted', 'success', 5000));
      return { status: 'success' };
    }
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
    return { status: 'error' };
  }
};
// UPDATE food
export const updateFood = (id, foodData) => async dispatch => {
  try {
    const token = localStorage.getItem('jwtToken');
    const response = await fetch(`/food/${id}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(foodData)
    });
    const food = await response.json();
    if (response.ok) {
      dispatch({ type: UPDATE_FOOD, payload: food });
      dispatch(setAlert('Food Item Updated', 'success', 5000));
      return { status: 'success' };
    }
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
    return { status: 'error' };
  }
};

// UPLOAD food image
export const uploadFoodImage = image => async dispatch => {
  try {
    const token = localStorage.getItem('jwtToken');
    const formData = new FormData();
    formData.append('image', image);

    const response = await fetch('/food/upload', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    });
    const data = await response.json();
    if (response.ok) {
      return { status: 'success', url: data.url };
    }
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
    return { status: 'error' };
  }
};
