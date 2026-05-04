import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { makeStyles, Grid, Typography, Container, Box, CircularProgress } from '@material-ui/core';
import { getMyOrders } from '../../../store/actions';
import { MyOrderTable } from '../MyDashboard/components';

const useStyles = makeStyles(theme => ({
  page: {
    paddingTop: theme.spacing(12),
    paddingBottom: theme.spacing(6),
    minHeight: '80vh'
  },
  title: {
    fontSize: '2.8rem',
    lineHeight: '3.2rem',
    textAlign: 'center',
    fontWeight: 800,
    color: '#1f2937',
    marginBottom: theme.spacing(1),
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  subtitle: {
    textAlign: 'center',
    color: '#64748b',
    marginBottom: theme.spacing(6),
    fontSize: '1.1rem',
  },
  emptyState: {
    padding: theme.spacing(8),
    textAlign: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: '12px',
    marginTop: theme.spacing(4)
  }
}));

function OrdersPage(props) {
  const { orders, getMyOrders, user } = props;
  const classes = useStyles();

  useEffect(() => {
    if (user) {
      getMyOrders();
    }
  }, [getMyOrders, user]);

  if (!user) {
    return (
      <Container className={classes.page}>
         <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress style={{ color: '#b72429' }} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" className={classes.page}>
      <Typography className={classes.title} variant="h1">
        My Orders
      </Typography>
      <Typography className={classes.subtitle}>
        Track and manage your merchandise orders.
      </Typography>

      {orders && orders.length > 0 ? (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <MyOrderTable orders={orders} />
          </Grid>
        </Grid>
      ) : (
        <div className={classes.emptyState}>
          <Typography variant="h5" style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '16px' }}>
            No orders found
          </Typography>
          <Typography variant="body1" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Browse our shop to find snacks, combos, and more!
          </Typography>
        </div>
      )}
    </Container>
  );
}

const mapStateToProps = state => ({
  orders: state.cartState.orders,
  user: state.authState.user
});

const mapDispatchToProps = { getMyOrders };

export default connect(mapStateToProps, mapDispatchToProps)(OrdersPage);
