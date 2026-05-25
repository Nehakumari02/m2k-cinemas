import React from 'react';
import { makeStyles } from '@material-ui/core';
import { useLocation } from 'react-router-dom';
import { Navbar, Footer, StickyFnBBar } from './components';

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
    ['/login', '/register', '/food-checkout', '/merch-checkout'].some(
      p => location.pathname === p || location.pathname.startsWith(`${p}/`)
    ) || location.pathname.includes('/movie/booking/');
  const classes = useStyles({ keepTopSpacing, showStickyFnB: !hideStickyFnB });
  const { children, withFooter = true } = props;
  return (
    <div className={classes.root}>
      <Navbar />
      <div className={classes.content}>
        {children}
      </div>
      {withFooter && <Footer />}
      {!hideStickyFnB && <StickyFnBBar />}
    </div>
  );
}

export default PublicLayout;
