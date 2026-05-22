import {
  ADD_TO_FOOD_CART,
  REMOVE_FROM_FOOD_CART,
  UPDATE_FOOD_CART_QUANTITY,
  CLEAR_FOOD_CART,
  CREATE_FOOD_ORDER,
  GET_MY_FOOD_ORDERS
} from '../types';

const loadCart = () => {
  try {
    return JSON.parse(localStorage.getItem('foodCartItems')) || [];
  } catch {
    return [];
  }
};

const initialState = {
  cartItems: loadCart(),
  orders: [],
  loading: false
};

const persist = items => {
  localStorage.setItem('foodCartItems', JSON.stringify(items));
};

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case ADD_TO_FOOD_CART: {
      const exist = state.cartItems.find(x => x._id === payload._id);
      const cartItems = exist
        ? state.cartItems.map(x =>
            x._id === exist._id ? { ...payload, quantity: x.quantity + payload.quantity } : x
          )
        : [...state.cartItems, payload];
      persist(cartItems);
      return { ...state, cartItems };
    }
    case REMOVE_FROM_FOOD_CART: {
      const cartItems = state.cartItems.filter(x => x._id !== payload);
      persist(cartItems);
      return { ...state, cartItems };
    }
    case UPDATE_FOOD_CART_QUANTITY: {
      const cartItems = state.cartItems
        .map(x => (x._id === payload.id ? { ...x, quantity: payload.quantity } : x))
        .filter(x => x.quantity > 0);
      persist(cartItems);
      return { ...state, cartItems };
    }
    case CLEAR_FOOD_CART:
      persist([]);
      return { ...state, cartItems: [] };
    case CREATE_FOOD_ORDER:
      return { ...state, orders: [payload, ...state.orders] };
    case GET_MY_FOOD_ORDERS:
      return { ...state, orders: payload, loading: false };
    default:
      return state;
  }
}
