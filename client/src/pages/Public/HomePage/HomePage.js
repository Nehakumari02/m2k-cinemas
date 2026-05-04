import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { withStyles, Grid, Typography } from '@material-ui/core';
import Slider from 'react-slick';
import {
  getMovies,
  getCinemas,
  getShowtimes,
  getMovieSuggestion
} from '../../../store/actions';
import MovieCarousel from '../components/MovieCarousel/MovieCarousel';
import MovieBanner from '../components/MovieBanner/MovieBanner';
import CinemaCard from '../components/CinemaCard/CinemaCard';
import QuickBookBar from '../components/QuickBookBar/QuickBookBar';
import ExperiencesSection from '../components/ExperiencesSection/ExperiencesSection';
import OffersSection from '../components/OffersSection/OffersSection';
import FoodSection from '../components/FoodSection/FoodSection';
import styles from './styles';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

class HomePage extends Component {
  state = { activeTab: 'nowShowing' };

  componentDidMount() {
    const {
      movies,
      cinemas,
      showtimes,
      suggested,
      getMovies,
      getCinemas,
      getShowtimes,
      getMovieSuggestion,
      user
    } = this.props;
    if (!movies.length) getMovies();
    if (!cinemas.length) getCinemas();
    if (!showtimes.length) getShowtimes();
    if (user) {
      if (!suggested.length) getMovieSuggestion(user.username);
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.user !== prevProps.user) {
      this.props.user &&
        this.props.getMovieSuggestion(this.props.user.username);
    }
  }

  scrollTo = id => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    this.setState({ activeTab: id });
  };

  render() {
    const {
      classes,
      movies,
      cinemas,
      randomMovie,
      comingSoon,
      nowShowing,
      suggested
    } = this.props;
    const { activeTab } = this.state;
    const heroMovies = (nowShowing && nowShowing.length ? nowShowing : movies).slice(0, 3);
    const heroSettings = {
      dots: true,
      arrows: false,
      infinite: heroMovies.length > 1,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: heroMovies.length > 1,
      autoplaySpeed: 4000,
      pauseOnHover: true
    };

    const TABS = [
      { id: 'nowShowing', label: '🎬 Now Showing' },
      { id: 'comingSoon', label: '🗓 Coming Soon' },
      { id: 'suggested', label: '⭐ Suggested' },
      { id: 'allMovies', label: '🎥 All Movies' },
      { id: 'cinemas', label: '🏛 Cinemas' },
    ];

    return (
      <Fragment>
        {/* ── Hero Banner ── */}
        <div className={classes.heroCarousel}>
          {heroMovies.length ? (
            <Slider {...heroSettings}>
              {heroMovies.map(movie => (
                <div key={movie._id}>
                  <MovieBanner movie={movie} height="68vh" />
                </div>
              ))}
            </Slider>
          ) : (
            <MovieBanner movie={randomMovie} height="68vh" />
          )}
        </div>

        {/* ── Quick Book Bar ── */}
        <QuickBookBar movies={movies} cinemas={cinemas} />

        {/* ── Section Tabs ── */}
        <div className={classes.tabsBar}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`${classes.tab} ${activeTab === tab.id ? classes.tabActive : ''}`}
              onClick={() => this.scrollTo(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Now Showing ── */}
        <div id="nowShowing" className={classes.sectionWrapper}>
          <MovieCarousel
            carouselClass={classes.carousel}
            title="Now Showing"
            to="/movie/category/nowShowing"
            movies={nowShowing}
          />
        </div>

        {/* ── Coming Soon ── */}
        <div id="comingSoon" className={classes.sectionWrapper}>
          <MovieCarousel
            carouselClass={classes.carousel}
            title="Coming Soon"
            to="/movie/category/comingSoon"
            movies={comingSoon}
          />
        </div>

        {/* ── Suggested ── */}
        <div id="suggested" className={classes.sectionWrapper}>
          <MovieCarousel
            carouselClass={classes.carousel}
            title="Suggested for You"
            movies={suggested}
          />
        </div>

        {/* ── All Movies ── */}
        <div id="allMovies" className={classes.sectionWrapper}>
          <MovieCarousel
            carouselClass={classes.carousel}
            title="All Movies"
            movies={movies}
          />
        </div>

        {/* ── PVR Experiences ── */}
        <ExperiencesSection />

        {/* ── Offers For You ── */}
        <OffersSection />

        {/* ── Food & Combos ── */}
        <FoodSection />

        {/* ── Cinemas ── */}
        <div id="cinemas" className={classes.cinemasSection}>
          <div className={classes.cinemasTitleBlock}>
            <Typography className={classes.sectionTitle} variant="h2">
              Our Cinemas
            </Typography>
            <div className={classes.titleAccent} />
          </div>
          <Grid container spacing={3}>
            {cinemas.slice(0, 4).map(cinema => (
              <Grid key={cinema._id} item xs={12} sm={6} md={4} lg={3}>
                <CinemaCard cinema={cinema} linkToDetails />
              </Grid>
            ))}
          </Grid>
        </div>

        {/* Footer is handled by PublicLayout */}
      </Fragment>
    );
  }
}

HomePage.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  movies: PropTypes.array.isRequired,
  latestMovies: PropTypes.array.isRequired
};

const mapStateToProps = ({ movieState, cinemaState, showtimeState, authState }) => ({
  movies: movieState.movies,
  cinemas: cinemaState.cinemas,
  randomMovie: movieState.randomMovie,
  latestMovies: movieState.latestMovies,
  comingSoon: movieState.comingSoon,
  nowShowing: movieState.nowShowing,
  showtimes: showtimeState.showtimes,
  suggested: movieState.suggested,
  user: authState.user
});

const mapDispatchToProps = { getMovies, getCinemas, getShowtimes, getMovieSuggestion };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(HomePage));

