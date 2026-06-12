import React from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import { useLocation } from 'react-router-dom';
import { logout } from '../../store/actions';
import { Navbar, Footer, StickyFnBBar } from './components';
import { SlideMenuShell } from './components/SlideMenu';
import PushNotificationPrompt from '../../components/PushNotificationPrompt';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.primary,
    height: '100%',
    paddingTop: props => (props.keepTopSpacing ? '64px' : 0),
  },
  content: {
    paddingBottom: props => (props.showStickyFnB ? theme.spacing(11) : 0),
  },
}));

function PublicLayout(props) {
  const location = useLocation();
  const keepTopSpacing = location.pathname === '/';
  const hideStickyFnB =
    ['/login', '/register', '/food-checkout', '/merch-checkout', '/events'].some(
      p => location.pathname === p || location.pathname.startsWith(`${p}/`)
    ) || location.pathname.includes('/movie/booking/');
  const classes = useStyles({ keepTopSpacing, showStickyFnB: !hideStickyFnB });
  const {
    children,
    withFooter = true,
    isAuth,
    user,
    logout: doLogout,
    cartItems,
    foodCartItems,
  } = props;
  const cartCount = (cartItems || []).reduce((acc, item) => acc + item.quantity, 0);
  const foodCartCount = (foodCartItems || []).reduce((acc, item) => acc + item.quantity, 0);

  return (
    <SlideMenuShell
      isAuth={isAuth}
      user={user}
      onLogout={doLogout}
      cartCount={cartCount}
      foodCartCount={foodCartCount}>
      <div className={classes.root}>
        <Navbar />
        <div className={classes.content}>{children}</div>
        {withFooter && <Footer />}
        {!hideStickyFnB && <StickyFnBBar />}
        <PushNotificationPrompt />
      </div>
    </SlideMenuShell>
  );
}

const mapStateToProps = state => ({
  isAuth: state.authState.isAuthenticated,
  user: state.authState.user,
  cartItems: state.cartState.cartItems,
  foodCartItems: state.foodCartState.cartItems,
});

export default connect(mapStateToProps, { logout })(PublicLayout);
