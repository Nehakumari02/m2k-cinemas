import React from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  makeStyles,
} from '@material-ui/core';

export const BOOKING_TERMS = [
  'Dear patron, the baggage counter facility is not available at this cinema. Inconvenience caused is deeply regretted.',
  'Ticket is compulsory for children of 3 years & above.',
  <>Patrons below the age of 18 years will not be allowed to watch the movies certified <strong>`A`</strong>.</>,
  'Due to security reason, except mobile & wallet nothing is allowed inside the cinema premises including handbags, carry bags, helmet, camera, laptop, knife, lighter, match-box, firearms & all kinds of inflammable objects, eatables like chocolate, chips, food item including pan-masala, chewing gum, Gutkas etc.',
  'Smoking cigarettes, consumption of alcohol and people under the influence of alcohol & drugs are strictly not allowed in the cinema premises.',
  'Re-Entry is not allowed in cinema.',
  'Decision(s) taken by M2K Management is final & abiding.',
  'Movie schedules and Ticket Prices are subject to change without prior notice.',
];

const useStyles = makeStyles(theme => ({
  paper: {
    borderRadius: 16,
    maxWidth: 560,
  },
  title: {
    fontWeight: 800,
    fontSize: '1.35rem',
    color: '#0f172a',
    paddingBottom: theme.spacing(0.5),
  },
  list: {
    margin: 0,
    paddingLeft: theme.spacing(2.5),
    color: '#334155',
    fontSize: '0.92rem',
    lineHeight: 1.55,
    '& li': {
      marginBottom: theme.spacing(1.25),
      paddingLeft: theme.spacing(0.5),
    },
  },
  actions: {
    padding: theme.spacing(2, 3, 2.5),
    gap: theme.spacing(1.5),
    justifyContent: 'center',
  },
  cancelBtn: {
    flex: 1,
    maxWidth: 200,
    borderRadius: 10,
    borderColor: '#b72429',
    color: '#b72429',
    fontWeight: 700,
    textTransform: 'none',
    padding: '10px 20px',
    '&:hover': {
      borderColor: '#8b1c20',
      backgroundColor: 'rgba(183,36,41,0.06)',
    },
  },
  acceptBtn: {
    flex: 1,
    maxWidth: 200,
    borderRadius: 10,
    backgroundColor: '#b72429',
    color: '#fff',
    fontWeight: 700,
    textTransform: 'none',
    padding: '10px 20px',
    boxShadow: 'none',
    '&:hover': {
      backgroundColor: '#8b1c20',
      boxShadow: 'none',
    },
  },
}));

export default function TermsAndConditionsModal({ open, onCancel, onAccept }) {
  const classes = useStyles();

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="sm"
      fullWidth
      classes={{ paper: classes.paper }}
      aria-labelledby="booking-terms-title">
      <DialogTitle id="booking-terms-title" disableTypography className={classes.title}>
        Terms &amp; Conditions
      </DialogTitle>
      <DialogContent dividers>
        <Typography component="ol" className={classes.list}>
          {BOOKING_TERMS.map((term, index) => (
            <li key={index}>{term}</li>
          ))}
        </Typography>
      </DialogContent>
      <DialogActions className={classes.actions}>
        <Button variant="outlined" className={classes.cancelBtn} onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="contained" className={classes.acceptBtn} onClick={onAccept}>
          Accept
        </Button>
      </DialogActions>
    </Dialog>
  );
}

TermsAndConditionsModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onAccept: PropTypes.func.isRequired,
};
