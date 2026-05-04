import React, { useState } from 'react';
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
    selectedFood,
    paymentMethod,
    paymentDetails,
    showFoodStep,
    onToggleFoodStep,
    onChangePaymentMethod,
    onPaymentFieldChange,
    onBookSeats,
    walletBalance = 0,
    loyaltyPoints = 0,
    pointsUsed = 0,
    onChangePointsUsed,
    appliedCoupon,
    discountPercentage,
    onApplyCoupon,
    onRemoveCoupon,
    totalTicketsPrice,
    offers = []
  } = props;

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const handleApplyCoupon = async () => {
    if (!couponInput) return;
    setIsApplyingCoupon(true);
    setCouponError('');
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await fetch('/offers/validate', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code: couponInput })
      });
      const data = await response.json();
      if (response.ok && data.valid) {
        onApplyCoupon(couponInput.toUpperCase(), data.discountPercentage);
        setCouponInput('');
      } else {
        setCouponError(data.error || 'Invalid coupon code');
      }
    } catch (err) {
      setCouponError('Error applying coupon');
    }
    setIsApplyingCoupon(false);
  };

  const foodTotal = Object.values(selectedFood || {}).reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const ticketsTotal = totalTicketsPrice !== undefined ? totalTicketsPrice : (ticketPrice * selectedSeats);
  const subTotal = ticketsTotal + foodTotal;
  const discountValue = Math.floor((subTotal * (discountPercentage || 0)) / 100);
  const afterDiscountTotal = subTotal - discountValue;
  const finalPrice = Math.max(0, afterDiscountTotal - (pointsUsed || 0));

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

        {foodTotal > 0 && (
          <div className={classes.infoBlock}>
            <Typography className={classes.bannerTitle}>Add-ons</Typography>
            <Typography className={classes.bannerContent}>
              ₹{foodTotal}
            </Typography>
          </div>
        )}

        <div className={classes.infoBlock}>
          <Typography className={classes.bannerTitle}>Total Payable</Typography>
          <Typography className={classes.priceHighlight}>
            ₹{finalPrice}
          </Typography>
          {discountValue > 0 && (
            <Typography variant="caption" style={{ color: '#22c55e', fontWeight: 'bold' }}>
              (-₹{discountValue} coupon)
            </Typography>
          )}
          {pointsUsed > 0 && (
            <Typography variant="caption" style={{ color: '#22c55e', fontWeight: 'bold' }}>
              (-₹{pointsUsed} pts)
            </Typography>
          )}
        </div>
      </div>

      {/* ── Payment Section ── */}
      <div className={classes.paymentSection}>
        {!showFoodStep ? (
          <Button
            className={classes.bookButton}
            disabled={selectedSeats === 0 || seatsAvailable <= 0}
            onClick={onToggleFoodStep}
          >
            Select Payment Method
          </Button>
        ) : (
          <>
            <Button
              variant="outlined"
              onClick={onToggleFoodStep}
              style={{ color: '#64748b', borderColor: '#cbd5e1', borderRadius: 8 }}
            >
              Back to Seats
            </Button>

            {!appliedCoupon ? (
              <Box display="flex" flexDirection="column" gridGap={8}>
                <Box display="flex" alignItems="flex-start" gridGap={8}>
                  <TextField
                    label="Promo Code"
                    variant="outlined"
                    size="small"
                    value={couponInput}
                    onChange={e => setCouponInput(e.target.value)}
                    error={!!couponError}
                    helperText={couponError}
                    style={{ width: 180 }}
                  />
                  <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={handleApplyCoupon}
                    disabled={isApplyingCoupon || !couponInput}
                    style={{ height: 40 }}
                  >
                    {isApplyingCoupon ? '...' : 'Apply'}
                  </Button>
                </Box>
                {offers && offers.length > 0 && (
                  <Box display="flex" flexWrap="wrap" gridGap={8}>
                    {offers.filter(offer => offer.isActive && new Date(offer.validTill) > new Date()).map(offer => (
                      <Button
                        key={offer._id}
                        size="small"
                        variant="outlined"
                        style={{ color: '#b72429', borderColor: 'rgba(183,36,41,0.5)', textTransform: 'none', padding: '2px 8px' }}
                        onClick={() => {
                          setCouponInput(offer.code);
                        }}
                      >
                        {offer.code} ({offer.discountPercentage}% OFF)
                      </Button>
                    ))}
                  </Box>
                )}
              </Box>
            ) : (
              <Box display="flex" alignItems="center" gridGap={8} bgcolor="#f0fdf4" p={1} borderRadius={4} border="1px solid #bbf7d0">
                <Typography variant="body2" style={{ color: '#166534', fontWeight: 'bold' }}>
                  {appliedCoupon} ({discountPercentage}% OFF)
                </Typography>
                <Button size="small" color="secondary" onClick={onRemoveCoupon}>
                  Remove
                </Button>
              </Box>
            )}

            {loyaltyPoints > 0 && (
              <TextField
                label={`Use Points (Max: ${Math.min(loyaltyPoints, afterDiscountTotal)})`}
                type="number"
                variant="outlined"
                size="small"
                value={pointsUsed || ''}
                onChange={onChangePointsUsed}
                InputProps={{ inputProps: { min: 0, max: Math.min(loyaltyPoints, afterDiscountTotal) } }}
                style={{ width: 180 }}
              />
            )}

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
              <MenuItem value="wallet">M2K Wallet (Balance: ₹{walletBalance})</MenuItem>
            </TextField>

            {paymentMethod === 'wallet' && finalPrice > 0 && (
              <Box ml={2}>
                <Typography variant="body2" style={{ color: walletBalance >= finalPrice ? '#22c55e' : '#ef4444', fontWeight: 700 }}>
                  {walletBalance >= finalPrice 
                    ? '✓ Sufficient balance' 
                    : `✗ Insufficient balance (Short by ₹${finalPrice - walletBalance})`}
                </Typography>
              </Box>
            )}

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
          </>
        )}
      </div>
    </div>
  );
}
