import { GET_WALLET_DATA, WALLET_ERROR, WALLET_LOADING, ADD_WALLET_MONEY } from '../types';

const initialState = {
  balance: 0,
  loyaltyPoints: 0,
  transactions: [],
  loading: false,
  error: null
};

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case WALLET_LOADING:
      return {
        ...state,
        loading: true
      };
    case GET_WALLET_DATA:
      return {
        ...state,
        balance: payload.balance,
        loyaltyPoints: payload.loyaltyPoints,
        transactions: payload.transactions,
        loading: false,
        error: null
      };
    case ADD_WALLET_MONEY:
      return {
        ...state,
        balance: payload.balance,
        loading: false,
        error: null
      };
    case WALLET_ERROR:
      return {
        ...state,
        loading: false,
        error: true
      };
    default:
      return state;
  }
}
