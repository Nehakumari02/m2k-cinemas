import React from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
  makeStyles,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles(theme => ({
  paper: {
    borderRadius: 12,
    maxWidth: 500,
  },
  titleRoot: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(2, 3, 1),
  },
  title: {
    fontWeight: 800,
    fontSize: '1.4rem',
    color: '#0f172a',
  },
  closeBtn: {
    padding: 8,
    color: '#0f172a',
  },
  content: {
    padding: theme.spacing(1, 3, 3),
    color: '#0f172a',
    fontSize: '1rem',
    lineHeight: 1.6,
  },
  actions: {
    padding: theme.spacing(0, 3, 3),
    justifyContent: 'center',
  },
  continueBtn: {
    width: '100%',
    borderRadius: 8,
    background: 'linear-gradient(90deg, #d81b60 0%, #ef5350 100%)',
    color: '#fff',
    fontWeight: 800,
    textTransform: 'none',
    fontSize: '1.1rem',
    padding: '12px 24px',
    boxShadow: 'none',
    '&:hover': {
      background: 'linear-gradient(90deg, #c2185b 0%, #e53935 100%)',
      boxShadow: 'none',
    },
  },
}));

export default function AdultWarningModal({ open, onCancel, onAccept }) {
  const classes = useStyles();

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="xs"
      fullWidth
      classes={{ paper: classes.paper }}
      aria-labelledby="adult-warning-title">
      <div className={classes.titleRoot}>
        <DialogTitle id="adult-warning-title" disableTypography className={classes.title} style={{ padding: 0 }}>
          Content Warning
        </DialogTitle>
        <IconButton className={classes.closeBtn} onClick={onCancel} aria-label="close">
          <CloseIcon />
        </IconButton>
      </div>
      <DialogContent className={classes.content}>
        <Typography variant="body1" style={{ fontSize: 'inherit', lineHeight: 'inherit' }}>
          This movie is rated "A" and is only for viewers above 18. Please carry a valid ID/Age Proof to the theatre. If you are denied entry due to age or ID issues, you will not get a refund.
        </Typography>
      </DialogContent>
      <DialogActions className={classes.actions}>
        <Button
          variant="contained"
          onClick={onAccept}
          className={classes.continueBtn}>
          Continue
        </Button>
      </DialogActions>
    </Dialog>
  );
}

AdultWarningModal.propTypes = {
  open: PropTypes.bool,
  onCancel: PropTypes.func,
  onAccept: PropTypes.func,
};
