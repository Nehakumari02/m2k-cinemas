import { setAlert } from './alert';

// GET wishlist
export const getWishlist = () => async dispatch => {
  try {
    const token = localStorage.getItem('jwtToken');
    const response = await fetch('/users/me/wishlist', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const wishlist = await response.json();
    if (response.ok) {
      dispatch({
        type: 'GET_WISHLIST',
        payload: wishlist
      });
      return wishlist;
    }
  } catch (error) {
    console.error(error);
  }
};

// ADD to wishlist
export const addToWishlist = movieId => async dispatch => {
  try {
    const token = localStorage.getItem('jwtToken');
    const response = await fetch('/users/me/wishlist', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ movieId })
    });
    const wishlist = await response.json();
    if (response.ok) {
      dispatch({
        type: 'UPDATE_WISHLIST',
        payload: wishlist
      });
      dispatch(setAlert('Added to Wishlist', 'success', 2000));
    }
  } catch (error) {
    dispatch(setAlert('Error adding to Wishlist', 'error', 2000));
  }
};

// REMOVE from wishlist
export const removeFromWishlist = movieId => async dispatch => {
  try {
    const token = localStorage.getItem('jwtToken');
    const response = await fetch(`/users/me/wishlist/${movieId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const wishlist = await response.json();
    if (response.ok) {
      dispatch({
        type: 'UPDATE_WISHLIST',
        payload: wishlist
      });
      dispatch(setAlert('Removed from Wishlist', 'info', 2000));
    }
  } catch (error) {
    dispatch(setAlert('Error removing from Wishlist', 'error', 2000));
  }
};
