import { GET_EXPERIENCES, SELECT_EXPERIENCE } from '../types/experiences';
import { setAlert } from './alert';

export const getExperiences = () => async dispatch => {
  try {
    const response = await fetch('/experiences', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const raw = await response.text();
    let data = [];
    try {
      data = raw ? JSON.parse(raw) : [];
    } catch (e) {
      dispatch(setAlert('Experiences API returned non-JSON response', 'error', 5000));
      return;
    }
    if (response.ok) {
      dispatch({ type: GET_EXPERIENCES, payload: data });
      return;
    }
    dispatch(setAlert((data && data.error) || 'Unable to load experiences', 'error', 5000));
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
  }
};

export const getAdminExperiences = () => async dispatch => {
  try {
    const token = localStorage.getItem('jwtToken');
    const response = await fetch('/admin/experiences', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const raw = await response.text();
    let data = [];
    try {
      data = raw ? JSON.parse(raw) : [];
    } catch (e) {
      dispatch(setAlert('Admin experiences API returned non-JSON response', 'error', 5000));
      return;
    }
    if (response.ok) {
      dispatch({ type: GET_EXPERIENCES, payload: data });
      return;
    }
    dispatch(setAlert((data && data.error) || 'Unable to load admin experiences', 'error', 5000));
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
  }
};

export const onSelectExperience = experience => ({
  type: SELECT_EXPERIENCE,
  payload: experience
});

export const uploadExperienceImage = (id, image) => async dispatch => {
  try {
    const token = localStorage.getItem('jwtToken');
    const data = new FormData();
    data.append('file', image);
    const response = await fetch(`/experiences/photo/${id}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: data
    });
    if (!response.ok) {
      dispatch(setAlert('Failed to upload experience image', 'error', 5000));
      return { status: 'error' };
    }
    return { status: 'success' };
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
    return { status: 'error' };
  }
};

export const createExperience = (image, payload) => async dispatch => {
  try {
    const token = localStorage.getItem('jwtToken');
    const response = await fetch('/experiences', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    const created = await response.json();
    if (response.ok) {
      if (image && created && created._id) {
        await dispatch(uploadExperienceImage(created._id, image));
      }
      dispatch(setAlert('Experience Created', 'success', 5000));
      dispatch(getAdminExperiences());
      return { status: 'success' };
    }
    dispatch(setAlert('Failed to create experience', 'error', 5000));
    return { status: 'error' };
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
    return { status: 'error' };
  }
};

export const updateExperience = (id, image, payload) => async dispatch => {
  try {
    const token = localStorage.getItem('jwtToken');
    const response = await fetch(`/experiences/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    if (response.ok) {
      if (image) {
        await dispatch(uploadExperienceImage(id, image));
      }
      dispatch(setAlert('Experience Updated', 'success', 5000));
      dispatch(getAdminExperiences());
      return { status: 'success' };
    }
    dispatch(setAlert('Failed to update experience', 'error', 5000));
    return { status: 'error' };
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
    return { status: 'error' };
  }
};

export const removeExperience = id => async dispatch => {
  try {
    const token = localStorage.getItem('jwtToken');
    const response = await fetch(`/experiences/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (response.ok) {
      dispatch(setAlert('Experience Deleted', 'success', 5000));
      dispatch(getAdminExperiences());
      return { status: 'success' };
    }
    return { status: 'error' };
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
    return { status: 'error' };
  }
};
