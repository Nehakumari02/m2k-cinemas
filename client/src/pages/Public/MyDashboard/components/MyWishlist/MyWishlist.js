import React from 'react';
import { Grid, Typography, Box } from '@material-ui/core';
import MovieCardSimple from '../../../components/MovieCardSimple/MovieCardSimple';

const MyWishlist = ({ wishlist }) => {
  console.log('MyWishlist data:', wishlist);
  if (!wishlist || wishlist.length === 0) {
    return (
      <Box p={4} textAlign="center" style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
        <Typography variant="h6" style={{ color: 'rgba(255,255,255,0.5)' }}>
          Your wishlist is empty.
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={4} style={{ marginTop: '20px' }}>
      {wishlist.map(movie => (
        <Grid item key={movie._id} xs={12} sm={6} md={4} lg={3}>
          <MovieCardSimple movie={movie} />
        </Grid>
      ))}
    </Grid>
  );
};

export default MyWishlist;
