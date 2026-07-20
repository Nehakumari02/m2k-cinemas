// @ts-nocheck
import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { CircularProgress } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: { 
    background: theme.palette.common.black, 
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
}));

export default () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <CircularProgress color="secondary" />
    </div>
  );
};
