import { GET_EXPERIENCES, SELECT_EXPERIENCE } from '../types/experiences';

const initialState = {
  experiences: [],
  selectedExperience: null
};

export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case GET_EXPERIENCES:
      return { ...state, experiences: payload || [] };
    case SELECT_EXPERIENCE:
      return { ...state, selectedExperience: payload };
    default:
      return state;
  }
};
