import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { makeStyles, Grid, Typography, Container, CircularProgress, Box } from '@material-ui/core';
import { getMovies, getReservations, getCinemas, getMyOrders, getMyRefunds } from '../../../store/actions';
import { MyReservationTable, MyRefundTable } from './components';
import Account from '../../Admin/Account';

const useStyles = makeStyles(theme => ({
  title: {
    fontSize: '3rem',
    lineHeight: '3rem',
    textAlign: 'center',
    textTransform: 'capitalize',
    marginTop: theme.spacing(15),
    marginBottom: theme.spacing(3)
  },
  [theme.breakpoints.down('sm')]: {
    fullWidth: { width: '100%' }
  },
  loyaltyCard: {
    background: 'linear-gradient(135deg, #b72429 0%, #7c1215 100%)',
    color: 'white',
    padding: theme.spacing(4),
    borderRadius: '16px',
    marginTop: theme.spacing(15),
    marginBottom: theme.spacing(4),
    boxShadow: '0 10px 25px rgba(183, 36, 41, 0.2)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  pointValue: {
    fontSize: '2.5rem',
    fontWeight: 800,
    lineHeight: 1
  },
  pointLabel: {
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    fontSize: '0.9rem',
    opacity: 0.8
  }
}));

function MyDashboard(props) {
  const [myRefunds, setMyRefunds] = React.useState([]);
  const {
    user,
    reservations,
    movies,
    cinemas,
    getMovies,
    getReservations,
    getCinemas,
    getMyRefunds
  } = props;

  useEffect(() => {
    getMovies();
    getReservations();
    getCinemas();
    
    const fetchRefunds = async () => {
      const refunds = await getMyRefunds();
      if (refunds) setMyRefunds(refunds);
    };
    fetchRefunds();
  }, [getMovies, getReservations, getCinemas, getMyRefunds]);

  const classes = useStyles(props);

  const myReservations = (reservations || []).filter(
    reservation => user && reservation.username === user.username
  );

  console.log(myReservations);

  return (
    <Container>
      {!user ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress style={{ color: '#b72429' }} />
        </Box>
      ) : (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <div className={classes.loyaltyCard}>
              <Box>
                <Typography className={classes.pointLabel}>My Loyalty Points</Typography>
                <Typography className={classes.pointValue}>{user.loyaltyPoints || 0}</Typography>
              </Box>
              <Box textAlign="right">
                <Typography className={classes.pointLabel}>Wallet Balance</Typography>
                <Typography className={classes.pointValue}>₹{user.walletBalance || 0}</Typography>
              </Box>
            </div>
          </Grid>
        {!!myReservations.length && (
          <>
            <Grid item xs={12}>
              <Typography
                className={classes.title}
                variant="h2"
                style={{ marginTop: 0 }}
                color="inherit">
                My Reservations
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <MyReservationTable
                reservations={myReservations}
                movies={movies}
                cinemas={cinemas}
              />
            </Grid>
          </>
        )}



        {myRefunds.length > 0 && (
          <>
            <Grid item xs={12}>
              <Typography className={classes.title} variant="h2" color="inherit">
                My Refund Requests
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <MyRefundTable refunds={myRefunds} />
            </Grid>
          </>
        )}
        <Grid item xs={12}>
          <Typography className={classes.title} variant="h2" color="inherit">
            My Account
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Account />
        </Grid>
      </Grid>
      )}
    </Container>
  );
}

const mapStateToProps = (state) => {
  const {
    authState,
    movieState,
    reservationState,
    cinemaState,
    cartState
  } = state;
  return {
    user: authState.user,
    movies: movieState.movies,
    reservations: reservationState.reservations,
    cinemas: cinemaState.cinemas
  };
};

const mapDispatchToProps = { getMovies, getReservations, getCinemas, getMyRefunds };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MyDashboard);
