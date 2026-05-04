import { GET_REVIEWS, UPDATE_REVIEW, DELETE_REVIEW } from '../types';

const initialState = {
  reviews: []
};

export default (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case GET_REVIEWS:
      return {
        ...state,
        reviews: payload
      };
    case UPDATE_REVIEW:
      return {
        ...state,
        reviews: state.reviews.map(review =>
          review._id === payload._id ? payload : review
        )
      };
    case DELETE_REVIEW:
      return {
        ...state,
        reviews: state.reviews.filter(review => review._id !== payload)
      };
    default:
      return state;
  }
};
