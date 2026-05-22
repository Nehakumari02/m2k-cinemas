import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { makeStyles, Typography, Container } from '@material-ui/core';
import MovieCarousel from '../components/MovieCarousel/MovieCarousel';
import { getMovies } from '../../../store/actions';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const useStyles = makeStyles(theme => ({
  page: {
    paddingTop: theme.spacing(12),
    paddingBottom: theme.spacing(6),
    backgroundColor: '#f8fafc',
    minHeight: '70vh',
  },
  carousel: {
    width: '100%',
    maxWidth: 1200,
    margin: '0 auto',
    paddingBottom: theme.spacing(4),
  },
  emptyText: {
    textAlign: 'center',
    color: theme.palette.text.secondary,
    marginTop: theme.spacing(4),
  },
  [theme.breakpoints.down('sm')]: {
    page: {
      paddingTop: theme.spacing(10),
    },
    carousel: {
      width: '95%',
    },
  },
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

  if (!['nowShowing', 'comingSoon'].includes(category)) {
    return (
      <Container maxWidth="lg" className={classes.page}>
        <Typography variant="h2" align="center" color="inherit">
          Category does not exist.
        </Typography>
      </Container>
    );
  }

  const title = category === 'nowShowing' ? 'Now Showing' : 'Coming Soon';

  return (
    <Container maxWidth={false} className={classes.page}>
      {movies.length > 0 ? (
        <MovieCarousel
          carouselClass={classes.carousel}
          title={title}
          movies={movies}
        />
      ) : (
        <Typography className={classes.emptyText} variant="body1">
          No movies available in this section.
        </Typography>
      )}
    </Container>
  );
}

const mapStateToProps = ({ movieState }, ownProps) => ({
  movies: movieState[ownProps.match.params.category] || [],
});

const mapDispatchToProps = { getMovies };

export default connect(mapStateToProps, mapDispatchToProps)(MovieCategoryPage);
