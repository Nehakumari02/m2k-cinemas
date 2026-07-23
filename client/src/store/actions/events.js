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

const parseJsonSafe = async response => {
  try {
    return await response.json();
  } catch {
    return {};
  }
};

const errorMessageFromBody = (data, response) => {
  if (!data || typeof data !== 'object') return `Request failed (${response.status})`;
  if (typeof data.error === 'string') return data.error;
  if (data.error && typeof data.error.message === 'string') return data.error.message;
  if (typeof data.message === 'string') return data.message;
  if (data.errors && typeof data.errors === 'object') {
    const first = Object.values(data.errors)[0];
    if (typeof first === 'string') return first;
    if (first && first.message) return first.message;
  }
  return `Request failed (${response.status})`;
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
    const data = await parseJsonSafe(response);
    if (response.ok) {
      dispatch({ type: ADD_EVENT, payload: data });
      dispatch(setAlert('Event Added', 'success', 5000));
      return { status: 'success' };
    }
    dispatch(setAlert(errorMessageFromBody(data, response), 'error', 5000));
    return { status: 'error' };
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
    const data = await parseJsonSafe(response);
    if (response.ok) {
      dispatch({ type: DELETE_EVENT, payload: id });
      dispatch(setAlert('Event Deleted', 'success', 5000));
      return { status: 'success' };
    }
    dispatch(setAlert(errorMessageFromBody(data, response), 'error', 5000));
    return { status: 'error' };
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
    const data = await parseJsonSafe(response);
    if (response.ok) {
      dispatch({ type: UPDATE_EVENT, payload: data });
      dispatch(setAlert('Event Updated', 'success', 5000));
      return { status: 'success' };
    }
    dispatch(setAlert(errorMessageFromBody(data, response), 'error', 5000));
    return { status: 'error' };
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
    const data = await parseJsonSafe(response);
    if (response.ok) {
      return { status: 'success', url: data.url };
    }
    dispatch(setAlert(errorMessageFromBody(data, response), 'error', 5000));
    return { status: 'error' };
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
    return { status: 'error' };
  }
};
