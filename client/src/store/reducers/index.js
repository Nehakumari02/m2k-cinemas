import { combineReducers } from 'redux';
import alert from './alert';
import auth from './auth';
import users from './users';
import movies from './movies';
import cinemas from './cinemas';
import reservations from './reservations';
import showtimes from './showtimes';
import checkout from './checkout';
import offers from './offers';
import experiences from './experiences';
import food from './food';
import events from './events';
import wallet from './wallet';
import products from './products';
import cart from './cart';

export default combineReducers({
  alertState: alert,
  authState: auth,
  userState: users,
  movieState: movies,
  cinemaState: cinemas,
  reservationState: reservations,
  showtimeState: showtimes,
  checkoutState: checkout,
  offerState: offers,
  experienceState: experiences,
  foodState: food,
  eventState: events,
  walletState: wallet,
  productState: products,
  cartState: cart
});
