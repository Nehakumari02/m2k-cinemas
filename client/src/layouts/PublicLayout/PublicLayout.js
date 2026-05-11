import React from 'react';
import { makeStyles } from '@material-ui/core';
import { useLocation } from 'react-router-dom';
import { Navbar, Footer } from './components';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.primary,
    height: '100%',
    paddingTop: props => (props.keepTopSpacing ? '64px' : 0)
  }
}));

function PublicLayout(props) {
  const location = useLocation();
  const keepTopSpacing = location.pathname === '/';
  const classes = useStyles({ keepTopSpacing });
  const { children, withFooter = true } = props;
  return (
    <div className={classes.root}>
      <Navbar />
      <div className={classes.content}>
        {children}
      </div>
      {withFooter && <Footer />}
    </div>
  );
}

export default PublicLayout;
