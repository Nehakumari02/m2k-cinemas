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

export const purchaseMembership = (planId, paymentMethod = 'wallet', razorpay = null) => async dispatch => {
  try {
    const token = localStorage.getItem('jwtToken');
    const body = { planId, paymentMethod };
    if (paymentMethod === 'online' && razorpay) {
      body.razorpay_order_id = razorpay.razorpay_order_id;
      body.razorpay_payment_id = razorpay.razorpay_payment_id;
      body.razorpay_signature = razorpay.razorpay_signature;
    }

    const response = await fetch('/memberships/purchase', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (response.ok) {
      dispatch({ type: PURCHASE_MEMBERSHIP, payload: data.user });
      dispatch(setAlert(data.message || 'Membership activated!', 'success', 6000));
      return true;
    }
    const errMsg =
      data.error?.message || data.error || 'Purchase failed. Try another payment method.';
    dispatch(setAlert(errMsg, 'error', 6000));
    return false;
  } catch (e) {
    dispatch(setAlert('Server error', 'error'));
    return false;
  }
};
