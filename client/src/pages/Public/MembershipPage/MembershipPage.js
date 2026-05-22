import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
  Container,
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Paper,
  Box,
  makeStyles,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
} from '@material-ui/core';
import { CheckCircle, AccountBalanceWallet, CreditCard } from '@material-ui/icons';
import { Link, useHistory } from 'react-router-dom';
import { getMemberships, purchaseMembership, getWalletData, setAlert } from '../../../store/actions';
import { launchRazorpayPayment } from '../../../utils/razorpayCheckout';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(8, 0),
    backgroundColor: '#f5f5f5',
    minHeight: '100vh',
  },
  header: {
    textAlign: 'center',
    marginBottom: theme.spacing(6),
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
    borderRadius: 16,
    '&:hover': {
      transform: 'translateY(-10px)',
      boxShadow: '0 12px 20px rgba(0,0,0,0.1)',
    },
  },
  silver: { borderTop: '8px solid #C0C0C0' },
  gold: {
    borderTop: '8px solid #FFD700',
    transform: 'scale(1.05)',
    zIndex: 1,
    '&:hover': { transform: 'scale(1.08) translateY(-10px)' },
  },
  platinum: {
    borderTop: '8px solid #E5E4E2',
    background: 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)',
  },
  price: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    margin: theme.spacing(2, 0),
    color: '#b72429',
  },
  benefitIcon: { color: '#b72429', minWidth: 36 },
  button: {
    marginTop: 'auto',
    borderRadius: 25,
    padding: '10px 30px',
    fontWeight: 'bold',
  },
  currentPlan: {
    backgroundColor: '#b72429',
    color: '#fff',
    pointerEvents: 'none',
  },
  gstBanner: {
    background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)',
    color: '#fff',
    borderRadius: 16,
    padding: theme.spacing(3, 4),
    marginBottom: theme.spacing(4),
    textAlign: 'center',
  },
  gstHighlight: { color: '#fbbf24', fontWeight: 800 },
  walletBar: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing(2),
    background: '#fff',
    borderRadius: 12,
    padding: theme.spacing(2, 3),
    marginBottom: theme.spacing(3),
    border: '1px solid rgba(183,36,41,0.2)',
  },
  stepsPaper: {
    background: '#fff',
    borderRadius: 12,
    padding: theme.spacing(2.5, 3),
    marginBottom: theme.spacing(4),
    border: '1px solid #e2e8f0',
  },
  stepNum: { fontWeight: 800, color: '#b72429', marginRight: 8 },
  payOption: {
    border: '1px solid #e2e8f0',
    borderRadius: 10,
    padding: theme.spacing(1, 2),
    marginBottom: theme.spacing(1),
    width: '100%',
    marginLeft: 0,
    marginRight: 0,
  },
}));

const MembershipPage = ({
  getMemberships,
  purchaseMembership,
  getWalletData,
  setAlert,
  memberships,
  user,
  isAuthenticated,
  walletBalance,
}) => {
  const classes = useStyles();
  const history = useHistory();
  const [confirmPlan, setConfirmPlan] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('online');
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    getMemberships();
    if (isAuthenticated) {
      getWalletData();
    }
  }, [getMemberships, getWalletData, isAuthenticated]);

  const openPurchase = plan => {
    if (!isAuthenticated) {
      history.push('/login');
      return;
    }
    setPaymentMethod('online');
    setConfirmPlan(plan);
  };

  const handleConfirmPurchase = async () => {
    if (!confirmPlan) return;
    setPurchasing(true);

    let ok = false;

    if (paymentMethod === 'online') {
      const payResult = await launchRazorpayPayment({
        amount: confirmPlan.price,
        description: `${confirmPlan.name} membership (1 year)`,
        user,
        setAlert,
      });
      if (payResult?.ok && payResult.razorpay) {
        ok = await purchaseMembership(confirmPlan._id, 'online', payResult.razorpay);
      }
    } else {
      if ((walletBalance || 0) < confirmPlan.price) {
        setAlert('Insufficient wallet balance. Pay with Card/UPI or add money to wallet.', 'error', 6000);
        setPurchasing(false);
        return;
      }
      ok = await purchaseMembership(confirmPlan._id, 'wallet');
    }

    setPurchasing(false);
    if (ok) {
      setConfirmPlan(null);
      getWalletData();
    }
  };

  const getTierClass = name => {
    switch (name) {
      case 'Silver':
        return classes.silver;
      case 'Gold':
        return classes.gold;
      case 'Platinum':
        return classes.platinum;
      default:
        return '';
    }
  };

  const walletInsufficient =
    confirmPlan && (walletBalance || 0) < confirmPlan.price;

  return (
    <div className={classes.root}>
      <Container maxWidth="lg">
        <div className={classes.header}>
          <Typography variant="h3" gutterBottom style={{ fontWeight: 800, color: '#333' }}>
            Exclusive Membership Plans
          </Typography>
          <Typography variant="h6" color="textSecondary">
            Unlock premium benefits and save more on every visit to M2K Cinemas
          </Typography>
        </div>

        <Paper className={classes.gstBanner} elevation={0}>
          <Typography variant="h6" style={{ fontWeight: 800, marginBottom: 8 }}>
            Membership GST benefits
          </Typography>
          <Typography variant="body1" style={{ lineHeight: 1.7, opacity: 0.95 }}>
            <span className={classes.gstHighlight}>18% GST</span> on movie tickets is shown at
            checkout. Members get a{' '}
            <span className={classes.gstHighlight}>first booking 5% benefit</span> on ticket value,
            plus tier discounts.
          </Typography>
        </Paper>

        <Paper className={classes.stepsPaper} elevation={0}>
          <Typography variant="subtitle1" style={{ fontWeight: 800, marginBottom: 12, color: '#0f172a' }}>
            How to pay
          </Typography>
          <Typography variant="body2" color="textSecondary" style={{ marginBottom: 8 }}>
            <span className={classes.stepNum}>1.</span>
            Log in and choose a plan → <strong>Get Started</strong>.
          </Typography>
          <Typography variant="body2" color="textSecondary" style={{ marginBottom: 8 }}>
            <span className={classes.stepNum}>2.</span>
            Pay directly with <strong>Card, UPI, or Net Banking</strong> (Razorpay), or use{' '}
            <strong>M2K Wallet</strong> if you already have balance.
          </Typography>
          <Typography variant="body2" color="textSecondary">
            <span className={classes.stepNum}>3.</span>
            Membership is active for 1 year — discounts apply on your next booking.
          </Typography>
        </Paper>

        {isAuthenticated && (
          <Box className={classes.walletBar}>
            <Box display="flex" alignItems="center" style={{ gap: 12 }}>
              <AccountBalanceWallet style={{ color: '#b72429', fontSize: 32 }} />
              <Box>
                <Typography variant="caption" color="textSecondary">
                  Wallet balance (optional)
                </Typography>
                <Typography variant="h5" style={{ fontWeight: 800, color: '#0f172a' }}>
                  ₹{(walletBalance || 0).toLocaleString('en-IN')}
                </Typography>
              </Box>
            </Box>
            <Button component={Link} to="/wallet" variant="outlined" color="primary" style={{ fontWeight: 700 }}>
              Top up wallet
            </Button>
          </Box>
        )}

        <Grid container spacing={4} alignItems="center">
          {memberships.map(plan => (
            <Grid item xs={12} md={4} key={plan._id}>
              <Card className={`${classes.card} ${getTierClass(plan.name)}`}>
                <CardContent>
                  <Typography variant="h4" align="center" style={{ fontWeight: 700 }}>
                    {plan.name}
                  </Typography>
                  <Box display="flex" justifyContent="center" alignItems="baseline">
                    <Typography className={classes.price}>₹{plan.price}</Typography>
                    <Typography variant="subtitle1" color="textSecondary">
                      /year
                    </Typography>
                  </Box>
                  <List>
                    {plan.benefits.map((benefit, idx) => (
                      <ListItem key={idx} disableGutters>
                        <ListItemIcon className={classes.benefitIcon}>
                          <CheckCircle fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={benefit} />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
                <CardActions style={{ padding: 24 }}>
                  <Button
                    fullWidth
                    variant={
                      (user?.membership?._id || user?.membership) === plan._id
                        ? 'contained'
                        : 'outlined'
                    }
                    color="primary"
                    className={`${classes.button} ${
                      (user?.membership?._id || user?.membership) === plan._id ? classes.currentPlan : ''
                    }`}
                    onClick={() => openPurchase(plan)}
                    disabled={(user?.membership?._id || user?.membership) === plan._id}>
                    {(user?.membership?._id || user?.membership) === plan._id
                      ? 'Current Plan'
                      : 'Get Started'}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Dialog
          open={Boolean(confirmPlan)}
          onClose={() => !purchasing && setConfirmPlan(null)}
          maxWidth="sm"
          fullWidth>
          <DialogTitle style={{ fontWeight: 800 }}>Complete membership payment</DialogTitle>
          <DialogContent>
            {confirmPlan && (
              <>
                <Typography variant="body1" gutterBottom>
                  <strong>{confirmPlan.name}</strong> — ₹{confirmPlan.price}/year
                </Typography>

                <FormControl component="fieldset" style={{ width: '100%', marginTop: 16 }}>
                  <Typography variant="subtitle2" style={{ fontWeight: 700, marginBottom: 8 }}>
                    Payment method
                  </Typography>
                  <RadioGroup
                    value={paymentMethod}
                    onChange={e => setPaymentMethod(e.target.value)}>
                    <FormControlLabel
                      value="online"
                      className={classes.payOption}
                      control={<Radio color="primary" />}
                      label={
                        <Box display="flex" alignItems="center" style={{ gap: 8 }}>
                          <CreditCard fontSize="small" color="primary" />
                          <span>
                            <strong>Card / UPI / Net Banking</strong>
                            <Typography variant="caption" display="block" color="textSecondary">
                              Pay now — secure Razorpay checkout
                            </Typography>
                          </span>
                        </Box>
                      }
                    />
                    <FormControlLabel
                      value="wallet"
                      className={classes.payOption}
                      control={<Radio color="primary" />}
                      disabled={walletInsufficient}
                      label={
                        <Box display="flex" alignItems="center" style={{ gap: 8 }}>
                          <AccountBalanceWallet fontSize="small" color="primary" />
                          <span>
                            <strong>M2K Wallet</strong>
                            <Typography variant="caption" display="block" color="textSecondary">
                              Balance: ₹{(walletBalance || 0).toLocaleString('en-IN')}
                              {walletInsufficient ? ' — insufficient' : ''}
                            </Typography>
                          </span>
                        </Box>
                      }
                    />
                  </RadioGroup>
                </FormControl>
              </>
            )}
          </DialogContent>
          <DialogActions style={{ padding: 16 }}>
            <Button onClick={() => setConfirmPlan(null)} disabled={purchasing}>
              Cancel
            </Button>
            {paymentMethod === 'wallet' && walletInsufficient ? (
              <Button component={Link} to="/wallet" color="primary" variant="contained" onClick={() => setConfirmPlan(null)}>
                Top up wallet
              </Button>
            ) : (
              <Button color="primary" variant="contained" onClick={handleConfirmPurchase} disabled={purchasing}>
                {purchasing ? (
                  <CircularProgress size={22} color="inherit" />
                ) : paymentMethod === 'online' ? (
                  `Pay ₹${confirmPlan?.price} now`
                ) : (
                  `Pay ₹${confirmPlan?.price} from wallet`
                )}
              </Button>
            )}
          </DialogActions>
        </Dialog>
      </Container>
    </div>
  );
};

const mapStateToProps = state => ({
  memberships: state.membershipState.memberships,
  user: state.authState.user,
  isAuthenticated: state.authState.isAuthenticated,
  walletBalance: state.walletState.balance,
});

export default connect(mapStateToProps, {
  getMemberships,
  purchaseMembership,
  getWalletData,
  setAlert,
})(MembershipPage);
