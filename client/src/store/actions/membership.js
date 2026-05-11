import { GET_MEMBERSHIPS, PURCHASE_MEMBERSHIP, MEMBERSHIP_ERROR } from '../types';
import { setAlert } from './alert';

export const getMemberships = () => async dispatch => {
  try {
    const response = await fetch('/memberships');
    const data = await response.json();
    dispatch({ type: GET_MEMBERSHIPS, payload: data });
  } catch (e) {
    dispatch({ type: MEMBERSHIP_ERROR });
  }
};

export const purchaseMembership = planId => async dispatch => {
  try {
    const token = localStorage.getItem('jwtToken');
    const response = await fetch('/memberships/purchase', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ planId }),
    });

    const data = await response.json();

    if (response.ok) {
      dispatch({ type: PURCHASE_MEMBERSHIP, payload: data.user });
      dispatch(setAlert(data.message, 'success'));
      return true;
    } else {
      dispatch(setAlert(data.error || 'Purchase failed', 'error'));
      return false;
    }
  } catch (e) {
    dispatch(setAlert('Server error', 'error'));
    return false;
  }
};
