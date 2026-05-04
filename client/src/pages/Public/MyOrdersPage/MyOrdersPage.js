import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { makeStyles, Typography, Container, Box, CircularProgress } from '@material-ui/core';
import { getMyOrders } from '../../../store/actions';
import { MyOrderTable } from '../MyDashboard/components';
import { Link } from 'react-router-dom';

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
    color: '#0f172a',
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
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    marginTop: theme.spacing(4),
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
  }
}));

function MyOrdersPage(props) {
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
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <Container maxWidth="lg" className={classes.page}>
        <Box mb={6} textAlign="center">
          <Typography className={classes.title} variant="h1">
            My Orders
          </Typography>
          <div style={{ margin: '12px auto', width: '60px', height: '4px', background: '#b72429', borderRadius: '2px' }} />
        </Box>

        {orders && orders.length > 0 ? (
          <MyOrderTable orders={orders} />
        ) : (
          <Box className={classes.emptyState}>
            <Typography variant="h5" style={{ color: '#0f172a', fontWeight: 700, marginBottom: '16px' }}>
              You haven't placed any orders yet
            </Typography>
            <Typography variant="body1" style={{ color: '#64748b' }}>
              Explore our shop for exclusive merchandise and more!
            </Typography>
            <Box mt={4}>
              <Link to="/shop" style={{ color: '#b72429', textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Visit Shop
              </Link>
            </Box>
          </Box>
        )}
      </Container>
    </div>
  );
}

const mapStateToProps = state => ({
  orders: state.cartState.orders,
  user: state.authState.user
});

const mapDispatchToProps = { getMyOrders };

export default connect(mapStateToProps, mapDispatchToProps)(MyOrdersPage);
