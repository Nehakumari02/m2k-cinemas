import { GET_EVENTS, ADD_EVENT, DELETE_EVENT, UPDATE_EVENT, EVENT_ERROR } from '../types';
import { setAlert } from './alert';

// GET all events
export const getEvents = () => async dispatch => {
  try {
    const response = await fetch('/events', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const events = await response.json();
    if (response.ok) {
      dispatch({ type: GET_EVENTS, payload: events });
    }
  } catch (error) {
    dispatch({ type: EVENT_ERROR, payload: error.message });
  }
};

// ADD event
export const addEvent = eventData => async dispatch => {
  try {
    const token = localStorage.getItem('jwtToken');
    const response = await fetch('/events', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(eventData)
    });
    const event = await response.json();
    if (response.ok) {
      dispatch({ type: ADD_EVENT, payload: event });
      dispatch(setAlert('Event Added', 'success', 5000));
      return { status: 'success' };
    }
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
    return { status: 'error' };
  }
};

// DELETE event
export const removeEvent = id => async dispatch => {
  try {
    const token = localStorage.getItem('jwtToken');
    const response = await fetch(`/events/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (response.ok) {
      dispatch({ type: DELETE_EVENT, payload: id });
      dispatch(setAlert('Event Deleted', 'success', 5000));
      return { status: 'success' };
    }
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
    return { status: 'error' };
  }
};
// UPDATE event
export const updateEvent = (id, eventData) => async dispatch => {
  try {
    const token = localStorage.getItem('jwtToken');
    const response = await fetch(`/events/${id}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(eventData)
    });
    const event = await response.json();
    if (response.ok) {
      dispatch({ type: UPDATE_EVENT, payload: event });
      dispatch(setAlert('Event Updated', 'success', 5000));
      return { status: 'success' };
    }
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
    return { status: 'error' };
  }
};

// UPLOAD event image
export const uploadEventImage = image => async dispatch => {
  try {
    const token = localStorage.getItem('jwtToken');
    const formData = new FormData();
    formData.append('image', image);

    const response = await fetch('/events/upload', {
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
