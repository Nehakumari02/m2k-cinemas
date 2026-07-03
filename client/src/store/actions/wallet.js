import { GET_WALLET_DATA, WALLET_ERROR, WALLET_LOADING, ADD_WALLET_MONEY } from '../types';
import { setAlert } from './alert';
import { setAuthHeaders } from '../../utils';

export const getWalletData = () => async dispatch => {
  dispatch({ type: WALLET_LOADING });
  try {
    const response = await fetch('/wallet/me', {
      headers: setAuthHeaders()
    });
    const data = await response.json();
    if (response.ok) {
      dispatch({ type: GET_WALLET_DATA, payload: data });
    } else {
      dispatch({ type: WALLET_ERROR });
      dispatch(setAlert(data.error || 'Error fetching wallet data', 'error'));
    }
  } catch (e) {
    dispatch({ type: WALLET_ERROR });
    dispatch(setAlert('Server Error', 'error'));
  }
};

export const addWalletMoney = (amount) => async dispatch => {
  try {
    // 1. Get the payload from the backend
    const response = await fetch('/wallet/icici/initiate', {
      method: 'POST',
      headers: {
        ...setAuthHeaders(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ amount })
    });
    const data = await response.json();
    
    if (response.ok && data.paymentUrl) {
      // 2. Redirect to ICICI Payment URL
      window.location.href = data.paymentUrl;
    } else {
      dispatch(setAlert(data.error || 'Error initiating payment', 'error'));
    }
  } catch (e) {
    dispatch(setAlert('Server Error during checkout', 'error'));
  }
};
