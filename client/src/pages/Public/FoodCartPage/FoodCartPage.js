import React, { useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import {
  makeStyles,
  Container,
  Grid,
  Typography,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Avatar,
  Divider,
  Box,
  Paper
} from '@material-ui/core';
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Fastfood as FoodIcon,
  ArrowBack as BackIcon
} from '@material-ui/icons';
import { removeFromFoodCart, updateFoodCartQuantity, getMemberships, loadUser } from '../../../store/actions';
import { normalizeImage } from '../../../utils/imageUrl';
import { calculateCartTotals } from '../../../utils/cartPricing';

const useStyles = makeStyles(theme => ({
  container: {
    paddingTop: theme.spacing(15),
    paddingBottom: theme.spacing(10),
    minHeight: '80vh',
  },
  title: {
    fontWeight: 800,
    marginBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(3),
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
  },
  summaryPaper: {
    padding: theme.spacing(3),
    borderRadius: '16px',
    backgroundColor: '#f8fafc',
    position: 'sticky',
    top: 120,
  },
  itemPrice: {
    fontWeight: 700,
    color: '#b72429',
  },
  totalPrice: {
    fontWeight: 800,
    fontSize: '1.5rem',
    color: '#b72429',
  },
  savingsLine: {
    color: '#16a34a',
    fontWeight: 700,
  },
  checkoutBtn: {
    marginTop: theme.spacing(3),
    borderRadius: '12px',
    padding: '12px',
    fontWeight: 700,
    background: 'linear-gradient(90deg, #b72429, #8b1c20)',
    color: '#fff',
  },
  emptyCart: {
    textAlign: 'center',
    padding: theme.spacing(10, 0),
  },
}));

const FoodCartPage = ({
  cartItems,
  user,
  isAuth,
  membershipPlans,
  removeFromFoodCart,
  updateFoodCartQuantity,
  getMemberships,
  loadUser,
}) => {
  const classes = useStyles();
  const history = useHistory();

  useEffect(() => {
    getMemberships();
    if (isAuth) loadUser();
  }, [getMemberships, loadUser, isAuth]);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const pricing = useMemo(
    () =>
      calculateCartTotals({
        subtotal,
        user: isAuth ? user : null,
        membershipPlans,
        cartType: 'food',
      }),
    [subtotal, user, membershipPlans, isAuth]
  );

  const handleUpdateQty = (id, currentQty, delta) => {
    const newQty = currentQty + delta;
    if (newQty > 0) updateFoodCartQuantity(id, newQty);
  };

  if (cartItems.length === 0) {
    return (
      <Container className={classes.container}>
        <div className={classes.emptyCart}>
          <FoodIcon style={{ fontSize: 100, color: '#cbd5e1', marginBottom: 24 }} />
          <Typography variant="h4" gutterBottom>
            Your food cart is empty
          </Typography>
          <Typography color="textSecondary" paragraph>
            Add popcorn, combos, and drinks from our menu.
          </Typography>
          <Button
            component={Link}
            to="/food-combos"
            variant="contained"
            color="primary"
            startIcon={<BackIcon />}
            style={{ marginTop: 24, borderRadius: 8 }}>
            Browse Food & Combos
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className={classes.container}>
      <Typography variant="h3" className={classes.title}>
        Food & Combos Cart
      </Typography>
      <Typography variant="body2" color="textSecondary" style={{ marginBottom: 24 }}>
        Separate from movie tickets and shop merchandise — checkout here for concession pickup.
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper className={classes.paper}>
            <List disablePadding>
              {cartItems.map((item, index) => (
                <React.Fragment key={item._id}>
                  <ListItem style={{ padding: '20px 0' }}>
                    <ListItemAvatar>
                      <Avatar
                        variant="rounded"
                        src={normalizeImage(item.image)}
                        style={{ width: 80, height: 80, marginRight: 20 }}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="h6" style={{ fontWeight: 700 }}>
                          {item.name}
                        </Typography>
                      }
                      secondary={
                        <Box mt={1}>
                          <Typography variant="body2" color="textSecondary">
                            {item.category}
                          </Typography>
                          <Box display="flex" alignItems="center" mt={1}>
                            <IconButton size="small" onClick={() => handleUpdateQty(item._id, item.quantity, -1)}>
                              <RemoveIcon fontSize="small" />
                            </IconButton>
                            <Typography style={{ margin: '0 15px', fontWeight: 700 }}>{item.quantity}</Typography>
                            <IconButton size="small" onClick={() => handleUpdateQty(item._id, item.quantity, 1)}>
                              <AddIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Box textAlign="right">
                        <Typography className={classes.itemPrice}>₹{item.price * item.quantity}</Typography>
                        <IconButton
                          edge="end"
                          onClick={() => removeFromFoodCart(item._id)}
                          style={{ color: '#ef4444', marginTop: 10 }}>
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </ListItemSecondaryAction>
                  </ListItem>
                  {index < cartItems.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper className={classes.summaryPaper} elevation={0}>
            <Typography variant="h5" style={{ fontWeight: 800, marginBottom: 24 }}>
              Order Summary
            </Typography>
            {pricing.membershipName && (
              <Typography variant="caption" style={{ color: '#b72429', fontWeight: 700, display: 'block', marginBottom: 12 }}>
                {pricing.membershipName} member — {pricing.membershipDiscountPercent}% off food
              </Typography>
            )}
            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography color="textSecondary">Subtotal</Typography>
              <Typography style={{ fontWeight: 600 }}>₹{subtotal}</Typography>
            </Box>
            {pricing.membershipDiscount > 0 && (
              <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography className={classes.savingsLine}>Member discount</Typography>
                <Typography className={classes.savingsLine}>-₹{pricing.membershipDiscount}</Typography>
              </Box>
            )}
            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography color="textSecondary">Pickup</Typography>
              <Typography style={{ fontWeight: 600, color: '#22c55e' }}>At counter</Typography>
            </Box>
            <Divider style={{ margin: '20px 0' }} />
            <Box display="flex" justifyContent="space-between" mb={4}>
              <Typography variant="h6" style={{ fontWeight: 800 }}>
                Total
              </Typography>
              <Typography className={classes.totalPrice}>₹{pricing.finalTotal}</Typography>
            </Box>
            <Button
              fullWidth
              variant="contained"
              className={classes.checkoutBtn}
              onClick={() => history.push('/food-checkout')}>
              Proceed to Food Checkout
            </Button>
            <Button fullWidth component={Link} to="/food-combos" style={{ marginTop: 12 }}>
              Add more items
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

const mapStateToProps = state => ({
  cartItems: state.foodCartState.cartItems,
  user: state.authState.user,
  isAuth: state.authState.isAuthenticated,
  membershipPlans: state.membershipState.memberships || [],
});

export default connect(mapStateToProps, {
  removeFromFoodCart,
  updateFoodCartQuantity,
  getMemberships,
  loadUser,
})(FoodCartPage);
