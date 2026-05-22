import React, { useState, useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import { useHistory, Link, Redirect } from 'react-router-dom';
import {
  makeStyles,
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  Paper,
  Box,
  Divider,
  MenuItem,
  CircularProgress,
  Chip
} from '@material-ui/core';
import { createFoodOrder, getWalletData, getOffers, getMemberships, loadUser } from '../../../store/actions';
import { calculateCartTotals } from '../../../utils/cartPricing';

const useStyles = makeStyles(theme => ({
  container: {
    paddingTop: theme.spacing(15),
    paddingBottom: theme.spacing(10),
    minHeight: '80vh',
  },
  paper: {
    padding: theme.spacing(4),
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
  },
  title: {
    fontWeight: 800,
    marginBottom: theme.spacing(4),
  },
  sectionTitle: {
    fontWeight: 700,
    marginBottom: theme.spacing(3),
    display: 'flex',
    alignItems: 'center',
    '&::before': {
      content: '""',
      width: '4px',
      height: '24px',
      backgroundColor: '#b72429',
      marginRight: '12px',
      borderRadius: '2px',
    },
  },
  submitBtn: {
    marginTop: theme.spacing(4),
    padding: '16px',
    borderRadius: '12px',
    fontWeight: 800,
    fontSize: '1.1rem',
    background: 'linear-gradient(90deg, #b72429, #8b1c20)',
    color: '#fff',
  },
  successBox: {
    textAlign: 'center',
    padding: theme.spacing(6),
  },
}));

const PICKUP_TIMES = [
  'Within 15 minutes',
  'Within 30 minutes',
  'Before show starts',
  'After show ends',
];

const FoodCheckoutPage = ({
  cartItems,
  user,
  isAuth,
  walletBalance,
  membershipPlans,
  createFoodOrder,
  getWalletData,
  getOffers,
  getMemberships,
  loadUser,
  offers,
}) => {
  const classes = useStyles();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(null);
  const [pointsUsed, setPointsUsed] = useState(0);
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [couponError, setCouponError] = useState('');

  const [pickup, setPickup] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    pickupTime: PICKUP_TIMES[0],
    notes: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('Card');

  useEffect(() => {
    getOffers();
    getMemberships();
    if (isAuth) {
      getWalletData();
      loadUser();
    }
  }, [getWalletData, getOffers, getMemberships, loadUser, isAuth]);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const pricing = useMemo(
    () =>
      calculateCartTotals({
        subtotal,
        discountPercentage,
        pointsUsed,
        user: isAuth ? user : null,
        membershipPlans,
        cartType: 'food',
      }),
    [subtotal, discountPercentage, pointsUsed, user, membershipPlans, isAuth]
  );
  const {
    membershipDiscount,
    membershipName,
    membershipDiscountPercent,
    foodGst,
    foodGstRate,
    couponDiscount,
    afterCoupon,
    finalTotal,
  } = pricing;
  const loyaltyPoints = user?.loyaltyPoints || 0;

  if (!isAuth) {
    return <Redirect to="/login" />;
  }

  if (cartItems.length === 0 && !orderComplete) {
    history.replace('/food-cart');
    return null;
  }

  const activeOffers = (offers || []).filter(
    o => o.isActive && new Date(o.validTill) > new Date()
  );

  const handlePickupChange = e => {
    setPickup({ ...pickup, [e.target.name]: e.target.value });
  };

  const handleApplyCoupon = async code => {
    const trimmed = (code || couponInput).trim().toUpperCase();
    if (!trimmed) return;
    setCouponError('');
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await fetch('/offers/validate', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: trimmed }),
      });
      const data = await response.json();
      if (response.ok && data.valid) {
        setAppliedCoupon(trimmed);
        setDiscountPercentage(data.discountPercentage);
        setCouponInput('');
      } else {
        setCouponError(data.error || 'Invalid coupon code');
      }
    } catch {
      setCouponError('Error applying coupon');
    }
  };

  const handlePlaceOrder = async e => {
    e.preventDefault();
    if (!pickup.fullName.trim() || !pickup.phone.trim()) return;
    setLoading(true);

    const orderData = {
      items: cartItems.map(item => ({
        food: item._id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      totalAmount: finalTotal,
      discountAmount: membershipDiscount + couponDiscount,
      membershipDiscount,
      couponCode: appliedCoupon || '',
      pointsUsed,
      pickupDetails: {
        ...pickup,
        location: 'M2K Concession Counter — Sector-51, Gurugram',
      },
      paymentMethod,
    };

    const res = await createFoodOrder(orderData);
    setLoading(false);
    if (res) setOrderComplete(res);
  };

  if (orderComplete) {
    return (
      <Container className={classes.container}>
        <Paper className={classes.paper}>
          <Box className={classes.successBox}>
            <Typography variant="h4" style={{ fontWeight: 800, color: '#166534', marginBottom: 16 }}>
              Order placed!
            </Typography>
            <Typography variant="h6" gutterBottom>
              Order #{orderComplete.orderNumber}
            </Typography>
            <Typography color="textSecondary" paragraph>
              Collect your food at the concession counter. Show this order number.
            </Typography>
            <Typography variant="body2" style={{ marginBottom: 24 }}>
              Pickup: {orderComplete.pickupDetails?.pickupTime || pickup.pickupTime}
            </Typography>
            <Button variant="contained" color="primary" component={Link} to="/food-combos" style={{ marginRight: 12 }}>
              Order more
            </Button>
            <Button variant="outlined" component={Link} to="/mydashboard">
              My dashboard
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  return (
    <Container className={classes.container}>
      <Typography variant="h3" className={classes.title}>
        Food Checkout
      </Typography>
      <Typography variant="body2" color="textSecondary" style={{ marginBottom: 24 }}>
        Pay here for snacks & combos — pickup at the cinema counter (not tied to ticket booking).
      </Typography>

      <form onSubmit={handlePlaceOrder}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={7}>
            <Paper className={classes.paper}>
              <Typography variant="h5" className={classes.sectionTitle}>
                Pickup details
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Full name"
                    name="fullName"
                    value={pickup.fullName}
                    onChange={handlePickupChange}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Phone"
                    name="phone"
                    value={pickup.phone}
                    onChange={handlePickupChange}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    required
                    fullWidth
                    label="Pickup time"
                    name="pickupTime"
                    value={pickup.pickupTime}
                    onChange={handlePickupChange}
                    variant="outlined">
                    {PICKUP_TIMES.map(t => (
                      <MenuItem key={t} value={t}>
                        {t}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Notes (optional)"
                    name="notes"
                    value={pickup.notes}
                    onChange={handlePickupChange}
                    variant="outlined"
                    placeholder="e.g. extra butter, no ice"
                  />
                </Grid>
              </Grid>

              <Box mt={4}>
                <Typography variant="h5" className={classes.sectionTitle}>
                  Promo code
                </Typography>
                {!appliedCoupon ? (
                  <>
                    <Box display="flex" alignItems="flex-start" style={{ gap: 8, marginBottom: 8 }}>
                      <TextField
                        label="Coupon code"
                        variant="outlined"
                        size="small"
                        value={couponInput}
                        onChange={e => setCouponInput(e.target.value)}
                        error={!!couponError}
                        helperText={couponError}
                        style={{ width: 200 }}
                      />
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleApplyCoupon()}
                        disabled={!couponInput}
                        style={{ height: 40 }}>
                        Apply
                      </Button>
                    </Box>
                    {activeOffers.length > 0 && (
                      <Box display="flex" flexWrap="wrap" style={{ gap: 8 }}>
                        {activeOffers.map(offer => (
                          <Chip
                            key={offer._id}
                            label={`${offer.code} (${offer.discountPercentage}% OFF)`}
                            onClick={() => handleApplyCoupon(offer.code)}
                            clickable
                            style={{ color: '#b72429', borderColor: 'rgba(183,36,41,0.4)' }}
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    )}
                  </>
                ) : (
                  <Box display="flex" alignItems="center" style={{ gap: 8 }}>
                    <Typography style={{ fontWeight: 700, color: '#166534' }}>
                      {appliedCoupon} ({discountPercentage}% off)
                    </Typography>
                    <Button
                      size="small"
                      onClick={() => {
                        setAppliedCoupon(null);
                        setDiscountPercentage(0);
                      }}>
                      Remove
                    </Button>
                  </Box>
                )}
              </Box>

              <Box mt={4}>
                <Typography variant="h5" className={classes.sectionTitle}>
                  Payment method
                </Typography>
                <TextField
                  select
                  fullWidth
                  label="Select payment"
                  value={paymentMethod}
                  onChange={e => setPaymentMethod(e.target.value)}
                  variant="outlined">
                  <MenuItem value="Card">Credit / Debit Card</MenuItem>
                  <MenuItem value="UPI">UPI</MenuItem>
                  <MenuItem value="NetBanking">Net Banking</MenuItem>
                  <MenuItem value="Wallet">M2K Wallet (₹{walletBalance})</MenuItem>
                </TextField>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={5}>
            <Paper className={classes.paper}>
              <Typography variant="h5" className={classes.sectionTitle}>
                Your order
              </Typography>
              {cartItems.map(item => (
                <Box key={item._id} display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">
                    {item.name} × {item.quantity}
                  </Typography>
                  <Typography variant="body2" style={{ fontWeight: 600 }}>
                    ₹{item.price * item.quantity}
                  </Typography>
                </Box>
              ))}
              <Divider style={{ margin: '16px 0' }} />
              {membershipName && (
                <Typography variant="caption" style={{ color: '#b72429', fontWeight: 700, display: 'block', marginBottom: 8 }}>
                  {membershipName} member — {membershipDiscountPercent}% off food
                </Typography>
              )}
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography color="textSecondary">Subtotal</Typography>
                <Typography>₹{subtotal}</Typography>
              </Box>
              {foodGst > 0 && (
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography color="textSecondary">GST on food ({foodGstRate}%)</Typography>
                  <Typography>₹{foodGst}</Typography>
                </Box>
              )}
              {membershipDiscount > 0 && (
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography color="textSecondary">Member discount</Typography>
                  <Typography style={{ color: '#22c55e' }}>-₹{membershipDiscount}</Typography>
                </Box>
              )}
              {couponDiscount > 0 && (
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography color="textSecondary">Coupon</Typography>
                  <Typography style={{ color: '#22c55e' }}>-₹{couponDiscount}</Typography>
                </Box>
              )}
              {loyaltyPoints > 0 && (
                <TextField
                  fullWidth
                  label={`Loyalty points (max ${Math.min(loyaltyPoints, afterCoupon)})`}
                  type="number"
                  variant="outlined"
                  size="small"
                  value={pointsUsed || ''}
                  onChange={e => {
                    const val = parseInt(e.target.value, 10) || 0;
                    setPointsUsed(Math.min(val, loyaltyPoints, afterCoupon));
                  }}
                  style={{ marginTop: 12, marginBottom: 12 }}
                />
              )}
              <Divider />
              <Box mt={2} display="flex" justifyContent="space-between">
                <Typography variant="h6" style={{ fontWeight: 800 }}>
                  Total payable
                </Typography>
                <Typography variant="h6" style={{ fontWeight: 800, color: '#b72429' }}>
                  ₹{finalTotal}
                </Typography>
              </Box>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                className={classes.submitBtn}
                disabled={loading || (paymentMethod === 'Wallet' && walletBalance < finalTotal)}>
                {loading ? <CircularProgress size={24} color="inherit" /> : `Pay ₹${finalTotal} & place order`}
              </Button>
              {paymentMethod === 'Wallet' && walletBalance < finalTotal && (
                <Typography color="error" variant="caption" align="center" display="block" style={{ marginTop: 8 }}>
                  Insufficient wallet balance.
                </Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

const mapStateToProps = state => ({
  cartItems: state.foodCartState.cartItems,
  user: state.authState.user,
  isAuth: state.authState.isAuthenticated,
  walletBalance: state.walletState.balance,
  offers: state.offerState.offers,
  membershipPlans: state.membershipState.memberships || [],
});

export default connect(mapStateToProps, {
  createFoodOrder,
  getWalletData,
  getOffers,
  getMemberships,
  loadUser,
})(FoodCheckoutPage);
