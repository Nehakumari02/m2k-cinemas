import React from 'react';
import { connect } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { makeStyles, Badge, Button } from '@material-ui/core';
import FastfoodIcon from '@material-ui/icons/Fastfood';
import MovieFilterIcon from '@material-ui/icons/MovieFilter';
import { MovieBookingModals } from '../../../../components';
import useMovieBookingFlow from '../../../../hooks/useMovieBookingFlow';
import foodBg from '../../../../assets/food-bg.png';

const useStyles = makeStyles(theme => ({
  wrap: {
    position: 'fixed',
    bottom: theme.spacing(2.5),
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 1100,
    width: 'min(360px, calc(100% - 32px))',
    display: 'flex',
    alignItems: 'stretch',
    borderRadius: 16,
    backgroundColor: '#ffffff',
    padding: '8px',
    gap: '8px',
    boxShadow: '0 8px 32px rgba(15, 23, 42, 0.22), 0 2px 8px rgba(0,0,0,0.12)',
    border: '1px solid rgba(255,255,255,0.25)',
    [theme.breakpoints.down('xs')]: {
      width: 'min(360px, calc(100% - 20px))',
      bottom: theme.spacing(1.5),
    },
  },
  fnbLink: {
    flex: 1,
    width: '50%',
    minWidth: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textDecoration: 'none',
    background: 'linear-gradient(180deg, #e0b0ff 0%, #cfa1ed 100%)',
    padding: theme.spacing(1.75, 2),
    borderRadius: 8,
    transition: 'filter 0.2s ease, transform 0.15s ease',
    overflow: 'hidden',
    '&:hover': {
      transform: 'scale(1.02)',
      filter: 'brightness(1.05)',
    },
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(1.75, 1.5),
    },
  },
  fnbLabel: {
    color: '#0f172a',
    fontWeight: 800,
    fontSize: '0.82rem',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    position: 'relative',
    zIndex: 2,
    [theme.breakpoints.down('xs')]: {
      fontSize: '0.72rem',
    },
  },
  secondaryLink: {
    flex: 1,
    width: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    textDecoration: 'none',
    background: 'linear-gradient(180deg, #fde047 0%, #facc15 100%)',
    color: '#0f172a',
    fontWeight: 800,
    fontSize: '0.82rem',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    padding: theme.spacing(1.75, 2),
    borderRadius: 8,
    whiteSpace: 'nowrap',
    transition: 'filter 0.2s ease, transform 0.15s ease',
    '&:hover': {
      filter: 'brightness(1.05)',
      transform: 'scale(1.02)',
    },
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(1.75, 1.5),
      fontSize: '0.72rem',
    },
  },
  cartBadge: {
    '& .MuiBadge-badge': {
      backgroundColor: '#b72429',
      color: '#fff',
      fontWeight: 800,
    },
  },
}));

const HIDE_ON_PATHS = ['/login', '/register', '/food-checkout', '/merch-checkout', '/events'];

function shouldHideBar(pathname) {
  if (HIDE_ON_PATHS.some(p => pathname === p || pathname.startsWith(`${p}/`))) {
    return true;
  }
  if (pathname.includes('/movie/booking/')) return true;
  return false;
}

function StickyFnBBar({ foodCartCount, selectedMovie }) {
  const classes = useStyles();
  const { pathname } = useLocation();
  const bookingFlow = useMovieBookingFlow();

  if (shouldHideBar(pathname)) return null;

  const itemCount = (foodCartCount || []).reduce((sum, item) => sum + (item.quantity || 0), 0);
  const isMoviePage = pathname.startsWith('/movie/') && selectedMovie;

  return (
    <div className={classes.wrap} role="navigation" aria-label="Quick actions">
      <Link to="/food-combos" className={classes.fnbLink}>
        <span className={classes.fnbLabel}>
          <FastfoodIcon fontSize="small" />
          Order F&amp;B
        </span>
      </Link>
      {isMoviePage ? (
        <Button 
          className={classes.secondaryLink} 
          onClick={() => bookingFlow.startBooking(selectedMovie)}
          style={{ padding: 0, border: 'none', cursor: 'pointer' }}
        >
          <MovieFilterIcon style={{ fontSize: 20 }} />
          Book tickets
        </Button>
      ) : (
        <Link to="/showtimings" className={classes.secondaryLink}>
          <MovieFilterIcon style={{ fontSize: 20 }} />
          Book Ticket
        </Link>
      )}
      <MovieBookingModals flow={bookingFlow} />
    </div>
  );
}

const mapStateToProps = state => ({
  foodCartCount: state.foodCartState.cartItems || [],
  selectedMovie: state.movieState.selectedMovie,
});

export default connect(mapStateToProps)(StickyFnBBar);
