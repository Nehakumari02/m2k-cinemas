import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useLocation } from 'react-router-dom';
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
    minHeight: '80vh',
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
  sectionWrapper: {
    marginBottom: theme.spacing(2),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  carousel: {
    width: '100%',
    maxWidth: 1200,
    margin: '0 auto',
    paddingBottom: theme.spacing(4),
  },
  emptyText: {
    textAlign: 'center',
    color: '#64748b',
    padding: theme.spacing(4, 2),
    marginBottom: theme.spacing(6),
  },
  [theme.breakpoints.down('sm')]: {
    page: {
      paddingTop: theme.spacing(10),
    },
    title: {
      fontSize: '2rem',
      lineHeight: '2.2rem',
    },
    carousel: {
      width: '95%',
    },
  },
}));

function AllMoviesPage(props) {
  const { nowShowing, comingSoon, getMovies } = props;
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const searchStr = (searchParams.get('search') || '').toLowerCase();

  const isMatch = (m) => {
    if (!searchStr) return true;
    if (m.title && m.title.toLowerCase().includes(searchStr)) return true;
    if (m.cast && m.cast.toLowerCase().includes(searchStr)) return true;
    if (m.director && m.director.toLowerCase().includes(searchStr)) return true;
    return false;
  };

  const filteredNowShowing = nowShowing.filter(isMatch);
  const filteredComingSoon = comingSoon.filter(isMatch);

  useEffect(() => {
    getMovies();
  }, [getMovies]);

  const classes = useStyles(props);

  return (
    <Container maxWidth={false} className={classes.page}>
      <Typography className={classes.title} variant="h1">
        All Movies
      </Typography>
      <Typography className={classes.subtitle}>
        Discover the latest blockbusters and upcoming cinematic experiences.
      </Typography>

      <div className={classes.sectionWrapper}>
        {filteredNowShowing.length > 0 ? (
          <MovieCarousel
            carouselClass={classes.carousel}
            title="Now Showing"
            to="/movie/category/nowShowing"
            autoScroll
            autoScrollSpeed={3200}
            movies={filteredNowShowing}
          />
        ) : (
          <Typography className={classes.emptyText} color="textSecondary">
            No movies currently showing.
          </Typography>
        )}
      </div>

      <div className={classes.sectionWrapper}>
        {filteredComingSoon.length > 0 ? (
          <MovieCarousel
            carouselClass={classes.carousel}
            title="Coming Soon"
            to="/movie/category/comingSoon"
            autoScroll
            autoScrollSpeed={3600}
            movies={filteredComingSoon}
          />
        ) : (
          <Typography className={classes.emptyText} color="textSecondary">
            No upcoming movies at the moment.
          </Typography>
        )}
      </div>

    </Container>
  );
}

const mapStateToProps = ({ movieState }) => ({
  nowShowing: movieState.nowShowing || [],
  comingSoon: movieState.comingSoon || [],
});

const mapDispatchToProps = { getMovies };

export default connect(mapStateToProps, mapDispatchToProps)(AllMoviesPage);
