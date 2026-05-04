import { GET_REVIEWS, UPDATE_REVIEW, DELETE_REVIEW } from '../types';
import { setAlert } from './alert';
import { getMovies } from './movies';

export const getAllReviews = () => async dispatch => {
  try {
    const token = localStorage.getItem('jwtToken');
    const response = await fetch('/movies/reviews/all', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const reviews = await response.json();
    if (response.ok) {
      dispatch({ type: GET_REVIEWS, payload: reviews });
    }
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
  }
};

export const updateReview = (reviewId, updates) => async dispatch => {
  try {
    const token = localStorage.getItem('jwtToken');
    const response = await fetch(`/movies/reviews/${reviewId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updates)
    });
    const data = await response.json();
    if (response.ok) {
      dispatch({ type: UPDATE_REVIEW, payload: data.review });
      dispatch(setAlert('Review updated successfully', 'success', 3000));
      // Refresh movies to update average rating if needed
      dispatch(getMovies(true));
    }
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
  }
};

export const deleteReview = reviewId => async dispatch => {
  try {
    const token = localStorage.getItem('jwtToken');
    const response = await fetch(`/movies/reviews/${reviewId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (response.ok) {
      dispatch({ type: DELETE_REVIEW, payload: reviewId });
      dispatch(setAlert('Review deleted successfully', 'success', 3000));
      dispatch(getMovies(true));
    }
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
  }
};
