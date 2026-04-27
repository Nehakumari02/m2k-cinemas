import { GET_OFFERS, SELECT_OFFER } from '../types';
import { setAlert } from './alert';

// GET all offers (public)
export const getOffers = () => async dispatch => {
  try {
    const response = await fetch('/offers', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const offers = await response.json();
    if (response.ok) {
      dispatch({ type: GET_OFFERS, payload: offers });
    }
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
  }
};

// GET all offers including inactive (admin)
export const getAdminOffers = () => async dispatch => {
  try {
    const token = localStorage.getItem('jwtToken');
    const response = await fetch('/admin/offers', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const offers = await response.json();
    if (response.ok) {
      dispatch({ type: GET_OFFERS, payload: offers });
    }
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
  }
};

// SET selected offer
export const onSelectOffer = offer => dispatch => {
  dispatch({ type: SELECT_OFFER, payload: offer });
};

// UPLOAD offer image
export const uploadOfferImage = (id, image) => async dispatch => {
  try {
    const token = localStorage.getItem('jwtToken');
    const data = new FormData();
    data.append('file', image);
    const response = await fetch(`/offers/photo/${id}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: data
    });
    if (response.ok) {
      dispatch(setAlert('Image Uploaded', 'success', 5000));
    } else {
      const errText = await response.text();
      console.error('Upload failed with status', response.status, errText);
      dispatch(setAlert(`Failed to upload image: ${response.status}`, 'error', 5000));
    }
  } catch (error) {
    console.error('Upload error', error);
    dispatch(setAlert(error.message, 'error', 5000));
  }
};

// CREATE offer
export const createOffer = (image, offerData) => async dispatch => {
  try {
    const token = localStorage.getItem('jwtToken');
    const response = await fetch('/offers', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(offerData)
    });
    const offer = await response.json();
    if (response.ok) {
      dispatch(setAlert('Offer Created', 'success', 5000));
      if (image) await dispatch(uploadOfferImage(offer._id, image));
      dispatch(getAdminOffers());
      return { status: 'success' };
    }
    dispatch(setAlert('Failed to create offer', 'error', 5000));
    return { status: 'error' };
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
    return { status: 'error' };
  }
};

// UPDATE offer
export const updateOffer = (image, offerData, id) => async dispatch => {
  try {
    const token = localStorage.getItem('jwtToken');
    const response = await fetch(`/offers/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(offerData)
    });
    if (response.ok) {
      dispatch(setAlert('Offer Updated', 'success', 5000));
      if (image) await dispatch(uploadOfferImage(id, image));
      dispatch(getAdminOffers());
      return { status: 'success' };
    }
    dispatch(setAlert('Failed to update offer', 'error', 5000));
    return { status: 'error' };
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
    return { status: 'error' };
  }
};

// DELETE offer
export const removeOffer = id => async dispatch => {
  try {
    const token = localStorage.getItem('jwtToken');
    const response = await fetch(`/offers/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (response.ok) {
      dispatch(setAlert('Offer Deleted', 'success', 5000));
      dispatch(getAdminOffers());
      return { status: 'success' };
    }
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
    return { status: 'error' };
  }
};
