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
    fontSize: '2.5rem',
    lineHeight: '2.8rem',
    textAlign: 'center',
    textTransform: 'capitalize',
    marginBottom: theme.spacing(4)
  },
  grid: {
    marginTop: theme.spacing(1)
  },
  cardItem: {
    display: 'flex'
  },
  emptyText: {
    textAlign: 'center',
    color: theme.palette.text.secondary,
    marginTop: theme.spacing(2)
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

function MovieCategoryPage(props) {
  const { movies, getMovies } = props;
  const category = props.match.params.category;
  useEffect(() => {
    if (!movies.length) {
      getMovies();
    }
  }, [movies, getMovies]);

  const classes = useStyles(props);
  return (
    <Container maxWidth="lg" className={classes.page}>
      {!['nowShowing', 'comingSoon'].includes(category) ? (
        <Typography className={classes.title} variant="h2" color="inherit">
          Category Does not exist.
        </Typography>
      ) : (
        <>
          <Typography className={classes.title} variant="h2" color="inherit">
            {category === 'nowShowing' ? 'Now Showing' : 'Coming Soon'}
          </Typography>
          {!movies.length ? (
            <Typography className={classes.emptyText} variant="body1">
              No movies available in this section.
            </Typography>
          ) : (
            <Grid container spacing={3} className={classes.grid}>
              {movies.map(movie => (
                <Grid key={movie._id} item xs={12} sm={6} md={4} lg={3} className={classes.cardItem}>
                  <MovieCardSimple movie={movie} />
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}
    </Container>
  );
}

const mapStateToProps = ({ movieState }, ownProps) => ({
  movies: movieState[ownProps.match.params.category] || []
});

const mapDispatchToProps = { getMovies };

export default connect(mapStateToProps, mapDispatchToProps)(MovieCategoryPage);
