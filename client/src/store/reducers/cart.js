import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  UPDATE_CART_QUANTITY,
  CLEAR_CART,
  SAVE_SHIPPING_ADDRESS,
  CREATE_ORDER,
  GET_MY_ORDERS,
  GET_ALL_ORDERS,
  UPDATE_ORDER_STATUS,
  ORDER_ERROR
} from '../types';

const initialState = {
  cartItems: JSON.parse(localStorage.getItem('cartItems')) || [],
  shippingAddress: JSON.parse(localStorage.getItem('shippingAddress')) || {},
  orders: [],
  loading: true,
  error: {}
};

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case ADD_TO_CART:
      const existItem = state.cartItems.find(x => x._id === payload._id);
      let newCartItems;
      if (existItem) {
        newCartItems = state.cartItems.map(x =>
          x._id === existItem._id ? { ...payload, quantity: x.quantity + payload.quantity } : x
        );
      } else {
        newCartItems = [...state.cartItems, payload];
      }
      localStorage.setItem('cartItems', JSON.stringify(newCartItems));
      return {
        ...state,
        cartItems: newCartItems
      };
    case REMOVE_FROM_CART:
      const filteredItems = state.cartItems.filter(x => x._id !== payload);
      localStorage.setItem('cartItems', JSON.stringify(filteredItems));
      return {
        ...state,
        cartItems: filteredItems
      };
    case UPDATE_CART_QUANTITY:
      const updatedItems = state.cartItems.map(x =>
        x._id === payload.id ? { ...x, quantity: payload.quantity } : x
      );
      localStorage.setItem('cartItems', JSON.stringify(updatedItems));
      return {
        ...state,
        cartItems: updatedItems
      };
    case SAVE_SHIPPING_ADDRESS:
      localStorage.setItem('shippingAddress', JSON.stringify(payload));
      return {
        ...state,
        shippingAddress: payload
      };
    case CLEAR_CART:
      localStorage.removeItem('cartItems');
      return {
        ...state,
        cartItems: []
      };
    case GET_MY_ORDERS:
      return {
        ...state,
        orders: payload,
        loading: false
      };
    case CREATE_ORDER:
      return {
        ...state,
        orders: [payload, ...state.orders],
        loading: false
      };
    case GET_ALL_ORDERS:
      return {
        ...state,
        orders: payload,
        loading: false
      };
    case UPDATE_ORDER_STATUS:
      return {
        ...state,
        orders: state.orders.map(order => order._id === payload._id ? payload : order),
        loading: false
      };
    case ORDER_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };
    default:
      return state;
  }
}
