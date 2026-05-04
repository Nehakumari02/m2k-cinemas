const initialState = {
  wishlist: []
};

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case 'GET_WISHLIST':
      return {
        ...state,
        wishlist: payload
      };
    case 'UPDATE_WISHLIST':
      return {
        ...state,
        wishlist: payload
      };
    default:
      return state;
  }
}
