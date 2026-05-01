import { GET_FOOD, ADD_FOOD, DELETE_FOOD, UPDATE_FOOD, FOOD_ERROR } from '../types';

const initialState = {
  food: [],
  loading: true,
  error: {}
};

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_FOOD:
      return {
        ...state,
        food: payload,
        loading: false
      };
    case ADD_FOOD:
      return {
        ...state,
        food: [...state.food, payload],
        loading: false
      };
    case DELETE_FOOD:
      return {
        ...state,
        food: state.food.filter(item => item._id !== payload),
        loading: false
      };
    case UPDATE_FOOD:
      return {
        ...state,
        food: state.food.map(item => (item._id === payload._id ? payload : item)),
        loading: false
      };
    case FOOD_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };
    default:
      return state;
  }
}
