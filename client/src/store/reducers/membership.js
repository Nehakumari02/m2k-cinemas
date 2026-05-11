import { GET_MEMBERSHIPS, MEMBERSHIP_ERROR } from '../types';

const initialState = {
  memberships: [],
  loading: true,
  error: {}
};

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_MEMBERSHIPS:
      return {
        ...state,
        memberships: payload,
        loading: false
      };
    case MEMBERSHIP_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };
    default:
      return state;
  }
}
