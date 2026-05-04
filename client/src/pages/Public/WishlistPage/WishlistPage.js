import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { makeStyles, Grid, Typography, Container, Box, CircularProgress } from '@material-ui/core';
import { getWishlist } from '../../../store/actions';
import MovieCardSimple from '../components/MovieCardSimple/MovieCardSimple';

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

function WishlistPage(props) {
  const { wishlist, getWishlist, user } = props;
  const classes = useStyles();

  useEffect(() => {
    if (user) {
      getWishlist();
    }
  }, [getWishlist, user]);

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
        My Wishlist
      </Typography>
      <Typography className={classes.subtitle}>
        Movies you've saved to watch later.
      </Typography>

      {wishlist && wishlist.length > 0 ? (
        <Grid container spacing={4}>
          {wishlist.map(movie => (
            <Grid key={movie._id} item xs={12} sm={6} md={4} lg={3}>
              <MovieCardSimple movie={movie} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <div className={classes.emptyState}>
          <Typography variant="h5" style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '16px' }}>
            Your wishlist is empty
          </Typography>
          <Typography variant="body1" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Start adding movies by clicking the heart icon on any movie poster!
          </Typography>
        </div>
      )}
    </Container>
  );
}

const mapStateToProps = state => ({
  wishlist: state.wishlistState.wishlist,
  user: state.authState.user
});

const mapDispatchToProps = { getWishlist };

export default connect(mapStateToProps, mapDispatchToProps)(WishlistPage);
