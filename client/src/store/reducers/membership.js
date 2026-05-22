import { GET_MEMBERSHIPS, PURCHASE_MEMBERSHIP, MEMBERSHIP_ERROR } from '../types';

const initialState = {
  memberships: [],
  loading: false,
  error: {},
};

export default function membershipReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_MEMBERSHIPS:
      return {
        ...state,
        memberships: payload,
        loading: false,
      };
    case PURCHASE_MEMBERSHIP:
      return {
        ...state,
        loading: false,
      };
    case MEMBERSHIP_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };
    default:
      return state;
  }
}
