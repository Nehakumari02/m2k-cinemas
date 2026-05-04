import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useHistory, Link } from 'react-router-dom';
import { makeStyles, Container, Grid, Typography, TextField, Button, Paper, Box, Divider, MenuItem, CircularProgress } from '@material-ui/core';
import { createOrder, saveShippingAddress, getWalletData } from '../../../store/actions';

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
    }
  },
  submitBtn: {
    marginTop: theme.spacing(4),
    padding: '16px',
    borderRadius: '12px',
    fontWeight: 800,
    fontSize: '1.1rem',
  },
}));

const MerchCheckoutPage = ({ cartState, user, walletBalance, createOrder, saveShippingAddress, getWalletData }) => {
  const { cartItems = [], shippingAddress = {} } = cartState || {};
  const classes = useStyles();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [pointsUsed, setPointsUsed] = useState(0);

  useEffect(() => {
    getWalletData();
  }, [getWalletData]);

  const [address, setAddress] = useState({
    fullName: shippingAddress.fullName || user?.name || '',
    email: shippingAddress.email || user?.email || '',
    address: shippingAddress.address || '',
    city: shippingAddress.city || '',
    postalCode: shippingAddress.postalCode || '',
    phone: shippingAddress.phone || user?.phone || '',
  });

  const [paymentMethod, setPaymentMethod] = useState('Card');

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const loyaltyPoints = user?.loyaltyPoints || 0;
  const finalTotal = Math.max(0, subtotal - pointsUsed);

  const handleInputChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const orderData = {
      items: cartItems.map(item => ({
        product: item._id,
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      totalAmount: finalTotal,
      shippingAddress: address,
      paymentMethod,
      pointsUsed
    };

    try {
      const res = await createOrder(orderData);
      if (res) {
        saveShippingAddress(address);
        // Wait for 2 seconds so the user can see the success message
        setTimeout(() => {
          window.location.href = '/#/mydashboard';
          window.location.reload();
        }, 2000);
      }
    } catch (err) {
      console.error('Order creation failed:', err);
    }
    setLoading(false);
  };

  if (cartItems.length === 0) {
    history.push('/shop');
    return null;
  }

  return (
    <Container className={classes.container}>
      <Typography variant="h3" className={classes.title}>Checkout</Typography>
      
      <form onSubmit={handlePlaceOrder}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={7}>
            <Paper className={classes.paper}>
              <Typography variant="h5" className={classes.sectionTitle}>Shipping Information</Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Full Name"
                    name="fullName"
                    value={address.fullName}
                    onChange={handleInputChange}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Email Address"
                    name="email"
                    type="email"
                    value={address.email}
                    onChange={handleInputChange}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Shipping Address"
                    name="address"
                    value={address.address}
                    onChange={handleInputChange}
                    variant="outlined"
                    multiline
                    rows={3}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="City"
                    name="city"
                    value={address.city}
                    onChange={handleInputChange}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Postal Code"
                    name="postalCode"
                    value={address.postalCode}
                    onChange={handleInputChange}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Phone Number"
                    name="phone"
                    value={address.phone}
                    onChange={handleInputChange}
                    variant="outlined"
                  />
                </Grid>
              </Grid>

              <Box mt={5}>
                <Typography variant="h5" className={classes.sectionTitle}>Payment Method</Typography>
                <TextField
                  select
                  fullWidth
                  label="Select Payment Method"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  variant="outlined"
                >
                  <MenuItem value="Card">Credit / Debit Card</MenuItem>
                  <MenuItem value="UPI">UPI / Google Pay</MenuItem>
                  <MenuItem value="NetBanking">Net Banking</MenuItem>
                  <MenuItem value="Wallet">M2K Wallet (Balance: ₹{walletBalance})</MenuItem>
                </TextField>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={5}>
            <Paper className={classes.paper}>
              <Typography variant="h5" className={classes.sectionTitle}>Your Order</Typography>
              <Box mb={3}>
                {cartItems.map(item => (
                  <Box key={item._id} display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2">{item.name} x {item.quantity}</Typography>
                    <Typography variant="body2" style={{ fontWeight: 600 }}>₹{item.price * item.quantity}</Typography>
                  </Box>
                ))}
              </Box>
              <Divider />
              <Box mt={3} mb={1} display="flex" justifyContent="space-between">
                <Typography color="textSecondary">Subtotal</Typography>
                <Typography style={{ fontWeight: 600 }}>₹{subtotal}</Typography>
              </Box>
              <Box mb={3} display="flex" justifyContent="space-between">
                <Typography color="textSecondary">Shipping</Typography>
                <Typography style={{ fontWeight: 600, color: '#22c55e' }}>FREE</Typography>
              </Box>
              <Divider />
              <Box mt={3} display="flex" justifyContent="space-between">
                <Typography variant="h6" style={{ fontWeight: 800 }}>Total Payable</Typography>
                <Typography variant="h6" style={{ fontWeight: 800, color: '#b72429' }}>₹{finalTotal}</Typography>
              </Box>

              {loyaltyPoints > 0 && (
                <Box mt={3}>
                  <TextField
                    fullWidth
                    label={`Use Loyalty Points (Available: ${loyaltyPoints})`}
                    type="number"
                    variant="outlined"
                    value={pointsUsed || ''}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10) || 0;
                      setPointsUsed(Math.min(val, loyaltyPoints, subtotal));
                    }}
                    helperText={`1 Point = ₹1 Discount`}
                  />
                  {pointsUsed > 0 && (
                    <Typography variant="caption" style={{ color: '#22c55e', fontWeight: 700, marginTop: 4, display: 'block' }}>
                      ✓ ₹{pointsUsed} discount applied from points!
                    </Typography>
                  )}
                </Box>
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submitBtn}
                disabled={loading || (paymentMethod === 'Wallet' && walletBalance < finalTotal)}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : `Place Order (₹${finalTotal})`}
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
  cartState: state.cartState,
  user: state.authState.user,
  walletBalance: state.walletState.balance
});

export default connect(mapStateToProps, { createOrder, saveShippingAddress, getWalletData })(MerchCheckoutPage);
