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
    const response = await fetch('/wallet/add', {
      method: 'POST',
      headers: {
        ...setAuthHeaders(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ amount })
    });
    const data = await response.json();
    if (response.ok) {
      dispatch({ type: ADD_WALLET_MONEY, payload: data });
      dispatch(setAlert(`Successfully added ₹${amount} to wallet`, 'success'));
      dispatch(getWalletData());
    } else {
      dispatch(setAlert(data.error || 'Error adding money', 'error'));
    }
  } catch (e) {
    dispatch(setAlert('Server Error', 'error'));
  }
};
