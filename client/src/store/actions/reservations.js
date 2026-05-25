import { GET_RESERVATIONS, GET_RESERVATION_SUGGESTED_SEATS } from '../types';
import { setAlert } from './alert';

const parseReservationApiError = responseData => {
  if (!responseData) return 'Reservation could not be completed.';
  if (typeof responseData.error === 'string') return responseData.error;
  if (responseData.error?.message) return responseData.error.message;
  if (typeof responseData.message === 'string') return responseData.message;
  return 'Reservation could not be completed.';
};

export const getReservations = () => async dispatch => {
  try {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      dispatch(setAlert('Please login again to view reservations', 'error', 5000));
      return { status: 'error', data: [] };
    }
    const url = '/reservations';
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const responseText = await response.text();
    let responseData = [];
    try {
      responseData = responseText ? JSON.parse(responseText) : [];
    } catch (e) {
      responseData = [];
    }
    if (response.ok) {
      dispatch({ type: GET_RESERVATIONS, payload: responseData });
      return { status: 'success', data: responseData };
    }
    const message =
      (responseData && responseData.error) || 'Unable to load reservations';
    dispatch(setAlert(message, 'error', 5000));
    return { status: 'error', data: [] };
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
    return { status: 'error', data: [] };
  }
};

export const getSuggestedReservationSeats = username => async dispatch => {
  try {
    const token = localStorage.getItem('jwtToken');
    const url = '/reservations/usermodeling/' + username;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const reservationSeats = await response.json();
    if (response.ok) {
      dispatch({
        type: GET_RESERVATION_SUGGESTED_SEATS,
        payload: reservationSeats
      });
    }
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
  }
};

export const addReservation = reservation => async dispatch => {
  try {
    const token = localStorage.getItem('jwtToken');
    const url = '/reservations';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reservation)
    });
    const responseText = await response.text();
    let responseData = {};
    try {
      responseData = responseText ? JSON.parse(responseText) : {};
    } catch (e) {
      responseData = {};
    }
    if (response.ok) {
      const { reservation, QRCode } = responseData;
      dispatch(setAlert('Reservation Created', 'success', 5000));
      return {
        status: 'success',
        message: 'Reservation Created',
        data: { reservation, QRCode }
      };
    }
    const errMsg = parseReservationApiError(responseData);
    dispatch(setAlert(errMsg, 'error', 6000));
    return {
      status: 'error',
      message: errMsg,
      code: responseData.code,
    };
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
    return {
      status: 'error',
      message: ' Reservation have not been created, try again.'
    };
  }
};

export const updateReservation = (reservation, id) => async dispatch => {
  try {
    const token = localStorage.getItem('jwtToken');
    const url = '/reservations/' + id;
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reservation)
    });
    if (response.ok) {
      dispatch(setAlert('Reservation Updated', 'success', 5000));
      return { status: 'success', message: 'Reservation Updated' };
    }
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
    return {
      status: 'error',
      message: ' Reservation have not been updated, try again.'
    };
  }
};

export const removeReservation = id => async dispatch => {
  try {
    const token = localStorage.getItem('jwtToken');
    const url = '/reservations/' + id;
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (response.ok) {
      dispatch(setAlert('Reservation Deleted', 'success', 5000));
      return { status: 'success', message: 'Reservation Removed' };
    }
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
    return {
      status: 'error',
      message: ' Reservation have not been deleted, try again.'
    };
  }
};
export const confirmReservation = (id, finalData) => async dispatch => {
  try {
    const token = localStorage.getItem('jwtToken');
    const url = '/reservations/confirm/' + id;
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(finalData)
    });
    const responseData = await response.json();
    if (response.ok) {
      dispatch(setAlert('Reservation Confirmed', 'success', 5000));
      return { 
        status: 'success', 
        data: { 
          reservation: responseData.reservation, 
          QRCode: responseData.QRCode 
        } 
      };
    }
    const errMsg = parseReservationApiError(responseData);
    dispatch(setAlert(errMsg, 'error', 6000));
    return { status: 'error', message: errMsg, code: responseData.code };
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
    return { status: 'error' };
  }
};

export const cancelPendingReservation = id => async dispatch => {
  if (!id) return { status: 'skipped' };
  try {
    const token = localStorage.getItem('jwtToken');
    const url = '/reservations/pending/' + id;
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (response.ok) {
      await dispatch(getReservations());
      return { status: 'success' };
    }
  } catch (error) {
    console.error('Cancel pending reservation failed', error);
  }
  return { status: 'error' };
};
