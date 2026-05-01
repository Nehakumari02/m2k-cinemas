import React from 'react';
import { connect } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { makeStyles, Container, Grid, Typography, Button, IconButton, List, ListItem, ListItemAvatar, ListItemText, ListItemSecondaryAction, Avatar, Divider, Box, Paper } from '@material-ui/core';
import { Delete as DeleteIcon, Add as AddIcon, Remove as RemoveIcon, LocalMall as BagIcon, ArrowBack as BackIcon } from '@material-ui/icons';
import { removeFromCart, updateCartQuantity } from '../../../store/actions';

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
  checkoutBtn: {
    marginTop: theme.spacing(3),
    borderRadius: '12px',
    padding: '12px',
    fontWeight: 700,
  },
  emptyCart: {
    textAlign: 'center',
    padding: theme.spacing(10, 0),
  },
}));

const CartPage = ({ cartState: { cartItems }, removeFromCart, updateCartQuantity }) => {
  const classes = useStyles();
  const history = useHistory();

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleUpdateQty = (id, currentQty, delta) => {
    const newQty = currentQty + delta;
    if (newQty > 0) {
      updateCartQuantity(id, newQty);
    }
  };

  if (cartItems.length === 0) {
    return (
      <Container className={classes.container}>
        <div className={classes.emptyCart}>
          <BagIcon style={{ fontSize: 100, color: '#cbd5e1', marginBottom: 24 }} />
          <Typography variant="h4" gutterBottom>Your cart is empty</Typography>
          <Typography color="textSecondary" paragraph>Looks like you haven't added any merchandise yet.</Typography>
          <Button component={Link} to="/shop" variant="contained" color="primary" startIcon={<BackIcon />} style={{ marginTop: 24, borderRadius: 8 }}>
            Back to Shop
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className={classes.container}>
      <Typography variant="h3" className={classes.title}>Shopping Cart</Typography>
      
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
                        src={item.image} 
                        style={{ width: 80, height: 80, marginRight: 20 }}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={<Typography variant="h6" style={{ fontWeight: 700 }}>{item.name}</Typography>}
                      secondary={
                        <Box mt={1}>
                          <Typography variant="body2" color="textSecondary">{item.category}</Typography>
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
                        <IconButton edge="end" onClick={() => removeFromCart(item._id)} style={{ color: '#ef4444', marginTop: 10 }}>
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
            <Typography variant="h5" style={{ fontWeight: 800, marginBottom: 24 }}>Order Summary</Typography>
            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography color="textSecondary">Subtotal</Typography>
              <Typography style={{ fontWeight: 600 }}>₹{subtotal}</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography color="textSecondary">Shipping</Typography>
              <Typography style={{ fontWeight: 600, color: '#22c55e' }}>FREE</Typography>
            </Box>
            <Divider style={{ margin: '20px 0' }} />
            <Box display="flex" justifyContent="space-between" mb={4}>
              <Typography variant="h6" style={{ fontWeight: 800 }}>Total</Typography>
              <Typography className={classes.totalPrice}>₹{subtotal}</Typography>
            </Box>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              className={classes.checkoutBtn}
              onClick={() => history.push('/merch-checkout')}
            >
              Proceed to Checkout
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

const mapStateToProps = state => ({
  cartState: state.cartState
});

export default connect(mapStateToProps, { removeFromCart, updateCartQuantity })(CartPage);
