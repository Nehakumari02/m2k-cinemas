import { setAlert } from './alert';

// SUBMIT refund request
export const submitRefundRequest = refundData => async dispatch => {
  try {
    const token = localStorage.getItem('jwtToken');
    const response = await fetch('/refunds', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(refundData)
    });
    const refund = await response.json();
    if (response.ok) {
      dispatch(setAlert('Refund Request Submitted Successfully', 'success', 5000));
      return { status: 'success', refund };
    }
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
    return { status: 'error' };
  }
};

// GET current user's refund requests
export const getMyRefunds = () => async dispatch => {
  try {
    const token = localStorage.getItem('jwtToken');
    const response = await fetch('/refunds/me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const refunds = await response.json();
    if (response.ok) {
      return refunds;
    }
  } catch (error) {
    console.error(error);
  }
};

// GET all refund requests (Admin)
export const getAllRefunds = () => async dispatch => {
  try {
    const token = localStorage.getItem('jwtToken');
    const response = await fetch('/refunds', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const refunds = await response.json();
    if (response.ok) {
      return refunds;
    }
  } catch (error) {
    console.error(error);
  }
};

// UPDATE refund status (Admin)
export const updateRefundStatus = (id, refundData) => async dispatch => {
  try {
    const token = localStorage.getItem('jwtToken');
    const response = await fetch(`/refunds/${id}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(refundData)
    });
    const refund = await response.json();
    if (response.ok) {
      dispatch(setAlert(`Refund ${refund.status}`, 'success', 5000));
      return { status: 'success', refund };
    }
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
    return { status: 'error' };
  }
};
