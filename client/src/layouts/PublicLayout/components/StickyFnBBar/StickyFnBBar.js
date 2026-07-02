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
    width: 'min(300px, calc(100% - 32px))',
    display: 'flex',
    alignItems: 'stretch',
    borderRadius: 14,
    overflow: 'hidden',
    boxShadow: '0 8px 32px rgba(15, 23, 42, 0.22), 0 2px 8px rgba(0,0,0,0.12)',
    border: '1px solid rgba(255,255,255,0.25)',
    [theme.breakpoints.down('xs')]: {
      width: 'min(300px, calc(100% - 20px))',
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
    position: 'relative',
    background: `url(${foodBg}) center 30% / cover no-repeat`,
    padding: theme.spacing(1.75, 2),
    transition: 'filter 0.2s ease, transform 0.15s ease',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.2)', // Lightened overlay for better image visibility
      transition: 'background-color 0.2s ease',
      zIndex: 1,
    },
    '&:hover': {
      transform: 'scale(1.02)',
      '&::before': {
        backgroundColor: 'rgba(0, 0, 0, 0.1)', // Even lighter on hover
      },
    },
  },
  fnbLabel: {
    color: '#ffffff',
    fontWeight: 800,
    fontSize: '0.82rem',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    position: 'relative',
    zIndex: 2,
    textShadow: '0px 2px 4px rgba(0,0,0,0.6)', // Added text shadow for readability on lighter background
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
          style={{ padding: 0, borderRadius: 0, border: 'none', cursor: 'pointer' }}
        >
          <MovieFilterIcon style={{ fontSize: 20 }} />
          Book tickets
        </Button>
      ) : (
        <Link to="/showtimings" className={classes.secondaryLink}>
          <MovieFilterIcon style={{ fontSize: 20 }} />
          Book tickets
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
