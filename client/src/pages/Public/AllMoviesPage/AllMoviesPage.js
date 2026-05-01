import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { makeStyles, Grid, Typography, Container } from '@material-ui/core';
import MovieCardSimple from '../components/MovieCardSimple/MovieCardSimple';
import { getMovies } from '../../../store/actions';

const useStyles = makeStyles(theme => ({
  page: {
    paddingTop: theme.spacing(12),
    paddingBottom: theme.spacing(6)
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
  sectionTitle: {
    fontSize: '1.8rem',
    fontWeight: 700,
    color: '#b72429',
    marginBottom: theme.spacing(3),
    borderLeft: '5px solid #b72429',
    paddingLeft: theme.spacing(2),
  },
  grid: {
    marginBottom: theme.spacing(8)
  },
  cardItem: {
    display: 'flex'
  },
  [theme.breakpoints.down('sm')]: {
    page: {
      paddingTop: theme.spacing(10)
    },
    title: {
      fontSize: '2rem',
      lineHeight: '2.2rem'
    }
  }
}));

function AllMoviesPage(props) {
  const { nowShowing, comingSoon, getMovies } = props;

  useEffect(() => {
    getMovies();
  }, [getMovies]);

  const classes = useStyles(props);

  return (
    <Container maxWidth="lg" className={classes.page}>
      <Typography className={classes.title} variant="h1">
        All Movies
      </Typography>
      <Typography className={classes.subtitle}>
        Discover the latest blockbusters and upcoming cinematic experiences.
      </Typography>

      {/* Now Showing Section */}
      <Typography className={classes.sectionTitle}>
        Now Showing
      </Typography>
      <Grid container spacing={4} className={classes.grid}>
        {nowShowing.length > 0 ? (
          nowShowing.map(movie => (
            <Grid key={movie._id} item xs={12} sm={6} md={4} lg={3} className={classes.cardItem}>
              <MovieCardSimple movie={movie} />
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography color="textSecondary">No movies currently showing.</Typography>
          </Grid>
        )}
      </Grid>

      {/* Coming Soon Section */}
      <Typography className={classes.sectionTitle}>
        Coming Soon
      </Typography>
      <Grid container spacing={4} className={classes.grid}>
        {comingSoon.length > 0 ? (
          comingSoon.map(movie => (
            <Grid key={movie._id} item xs={12} sm={6} md={4} lg={3} className={classes.cardItem}>
              <MovieCardSimple movie={movie} />
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography color="textSecondary">No upcoming movies at the moment.</Typography>
          </Grid>
        )}
      </Grid>
    </Container>
  );
}

const mapStateToProps = ({ movieState }) => ({
  nowShowing: movieState.nowShowing || [],
  comingSoon: movieState.comingSoon || []
});

const mapDispatchToProps = { getMovies };

export default connect(mapStateToProps, mapDispatchToProps)(AllMoviesPage);
