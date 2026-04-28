import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Box, Grid, Typography, Button, TextField, MenuItem } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  checkoutBar: {
    marginTop: theme.spacing(3),
    background: '#ffffff',
    borderRadius: '14px',
    border: '1px solid rgba(15,23,42,0.1)',
    overflow: 'hidden',
  },
  infoRow: {
    padding: '20px 24px',
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '24px',
  },
  infoBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  bannerTitle: {
    fontSize: '0.65rem',
    textTransform: 'uppercase',
    color: '#64748b',
    letterSpacing: '0.1em',
    fontWeight: 700,
  },
  bannerContent: {
    fontSize: '1rem',
    fontWeight: 700,
    color: '#0f172a',
    textTransform: 'capitalize',
  },
  priceHighlight: {
    color: '#b72429',
    fontWeight: 800,
    fontSize: '1.1rem',
  },
  paymentSection: {
    padding: '16px 24px',
    borderTop: '1px solid rgba(15,23,42,0.08)',
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '12px',
  },
  selectField: {
    minWidth: 170,
    '& .MuiOutlinedInput-root': {
      borderRadius: '8px',
      backgroundColor: '#fff',
      color: '#0f172a',
      '& fieldset': { borderColor: 'rgba(15,23,42,0.15)' },
      '&:hover fieldset': { borderColor: 'rgba(183,36,41,0.4)' },
      '&.Mui-focused fieldset': { borderColor: '#b72429' },
    },
    '& .MuiInputLabel-root': { color: '#64748b' },
    '& .MuiSelect-icon': { color: '#64748b' },
  },
  textField: {
    '& .MuiOutlinedInput-root': {
      borderRadius: '8px',
      backgroundColor: '#fff',
      color: '#0f172a',
      '& fieldset': { borderColor: 'rgba(15,23,42,0.15)' },
      '&:hover fieldset': { borderColor: 'rgba(183,36,41,0.4)' },
      '&.Mui-focused fieldset': { borderColor: '#b72429' },
    },
    '& .MuiInputLabel-root': { color: '#64748b' },
  },
  bookButton: {
    marginLeft: 'auto',
    background: 'linear-gradient(90deg, #b72429, #8b1c20)',
    color: '#fff',
    fontWeight: 800,
    fontSize: '0.9rem',
    letterSpacing: '0.06em',
    padding: '12px 36px',
    borderRadius: '8px',
    textTransform: 'uppercase',
    transition: 'all 0.2s ease',
    '&:hover': {
      background: 'linear-gradient(90deg, #8b1c20, #6d1518)',
      boxShadow: '0 6px 24px rgba(183,36,41,0.35)',
      transform: 'translateY(-1px)',
    },
    '&:disabled': {
      background: 'rgba(15,23,42,0.08)',
      color: '#94a3b8',
    }
  },
  [theme.breakpoints.down('sm')]: {
    infoRow: { gap: '12px', padding: '14px 16px' },
    paymentSection: { padding: '12px 16px' },
    bookButton: { width: '100%', marginLeft: 0, marginTop: theme.spacing(1) },
  }
}));

export default function BookingCheckout(props) {
  const classes = useStyles(props);
  const {
    user,
    ticketPrice,
    selectedSeats,
    seatsAvailable,
    paymentMethod,
    paymentDetails,
    onChangePaymentMethod,
    onPaymentFieldChange,
    onBookSeats
  } = props;

  const totalPrice = ticketPrice * selectedSeats;

  return (
    <div className={classes.checkoutBar}>
      {/* ── Info Row ── */}
      <div className={classes.infoRow}>
        {user && user.name && (
          <div className={classes.infoBlock}>
            <Typography className={classes.bannerTitle}>Name</Typography>
            <Typography className={classes.bannerContent}>{user.name}</Typography>
          </div>
        )}
        <div className={classes.infoBlock}>
          <Typography className={classes.bannerTitle}>Tickets</Typography>
          <Typography className={classes.bannerContent}>
            {selectedSeats > 0 ? `${selectedSeats} ticket${selectedSeats > 1 ? 's' : ''}` : '0'}
          </Typography>
        </div>
        <div className={classes.infoBlock}>
          <Typography className={classes.bannerTitle}>Total</Typography>
          <Typography className={classes.priceHighlight}>
            ₹{totalPrice}
          </Typography>
        </div>
      </div>

      {/* ── Payment Fields ── */}
      <div className={classes.paymentSection}>
        <TextField
          select
          value={paymentMethod}
          label="Payment Method"
          variant="outlined"
          size="small"
          onChange={onChangePaymentMethod}
          className={classes.selectField}
          style={{ minWidth: 180 }}
        >
          <MenuItem value="card">Card</MenuItem>
          <MenuItem value="upi">UPI</MenuItem>
          <MenuItem value="netbanking">Net Banking</MenuItem>
        </TextField>

        {paymentMethod === 'card' && (
          <>
            <TextField
              label="Card Number"
              name="cardNumber"
              value={paymentDetails.cardNumber}
              variant="outlined"
              size="small"
              onChange={onPaymentFieldChange}
              className={classes.textField}
              style={{ minWidth: 200 }}
            />
            <TextField
              label="Name on Card"
              name="nameOnCard"
              value={paymentDetails.nameOnCard}
              variant="outlined"
              size="small"
              onChange={onPaymentFieldChange}
              className={classes.textField}
              style={{ minWidth: 180 }}
            />
            <TextField
              label="Expiry (MM/YY)"
              name="expiry"
              value={paymentDetails.expiry}
              variant="outlined"
              size="small"
              onChange={onPaymentFieldChange}
              className={classes.textField}
              style={{ minWidth: 130 }}
            />
            <TextField
              label="CVV"
              name="cvv"
              value={paymentDetails.cvv}
              variant="outlined"
              size="small"
              onChange={onPaymentFieldChange}
              className={classes.textField}
              style={{ minWidth: 90 }}
            />
          </>
        )}
        {paymentMethod === 'upi' && (
          <TextField
            label="UPI ID"
            name="upiId"
            value={paymentDetails.upiId}
            variant="outlined"
            size="small"
            onChange={onPaymentFieldChange}
            className={classes.textField}
            style={{ minWidth: 240 }}
          />
        )}
        {paymentMethod === 'netbanking' && (
          <>
            <TextField
              label="Bank Name"
              name="bankName"
              value={paymentDetails.bankName}
              variant="outlined"
              size="small"
              onChange={onPaymentFieldChange}
              className={classes.textField}
              style={{ minWidth: 200 }}
            />
            <TextField
              label="Account Holder"
              name="accountHolder"
              value={paymentDetails.accountHolder}
              variant="outlined"
              size="small"
              onChange={onPaymentFieldChange}
              className={classes.textField}
              style={{ minWidth: 200 }}
            />
          </>
        )}

        <Button
          className={classes.bookButton}
          disabled={seatsAvailable <= 0}
          onClick={() => onBookSeats()}
        >
          Pay & Book
        </Button>
      </div>
    </div>
  );
}
