import { GET_OFFERS, SELECT_OFFER } from '../types';

const initialState = {
  offers: [],
  selectedOffer: null,
};

export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case GET_OFFERS:
      return { ...state, offers: payload };
    case SELECT_OFFER:
      return { ...state, selectedOffer: payload };
    default:
      return state;
  }
};
