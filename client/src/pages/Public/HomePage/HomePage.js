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

        {/* ── Footer ── */}
        <footer className={classes.footer}>
          <div className={classes.footerTop}>
            <div className={classes.footerBrand}>
              <img 
                src="https://m2kcinemas.com/Images/logo1.png" 
                alt="M2K Cinemas" 
                style={{ height: '50px', marginBottom: '12px', mixBlendMode: 'multiply' }} 
              />
              <Typography className={classes.footerTagline}>
                India's Finest Cinematic Experience
              </Typography>
            </div>
            <div className={classes.footerLinks}>
              <div className={classes.footerCol}>
                <Typography className={classes.footerColTitle}>Explore</Typography>
                <Link to="/movie/category/nowShowing" className={classes.footerLink}>Now Showing</Link>
                <Link to="/movie/category/comingSoon" className={classes.footerLink}>Coming Soon</Link>
                <Link to="/cinemas" className={classes.footerLink}>Cinemas</Link>
                <Link to="/offers" className={classes.footerLink}>Offers</Link>
                <Link to="/showtimings" className={classes.footerLink}>Showtimings</Link>
                <Link to="/about-us" className={classes.footerLink}>About Us</Link>
                <Link to="/contact-us" className={classes.footerLink}>Contact Us</Link>
              </div>
              <div className={classes.footerCol}>
                <Typography className={classes.footerColTitle}>Account</Typography>
                <Link to="/login" className={classes.footerLink}>Login</Link>
                <Link to="/register" className={classes.footerLink}>Register</Link>
                <Link to="/mydashboard" className={classes.footerLink}>My Dashboard</Link>
              </div>
              <div className={classes.footerCol}>
                <Typography className={classes.footerColTitle}>Experience</Typography>
                <Link to="/experience/imax" className={classes.footerLink}>IMAX</Link>
                <Link to="/experience/4dx" className={classes.footerLink}>4DX</Link>
                <Link to="/experience/gold" className={classes.footerLink}>GOLD</Link>
                <Link to="/experience/pxl" className={classes.footerLink}>PXL</Link>
              </div>
              <div className={classes.footerCol}>
                <Typography className={classes.footerColTitle}>Corporate</Typography>
                <Link to="/careers" className={classes.footerLink}>Careers</Link>
                <Link to="/media" className={classes.footerLink}>Media</Link>
                <Link to="/gallery" className={classes.footerLink}>Gallery</Link>
              </div>
              <div className={classes.footerCol}>
                <Typography className={classes.footerColTitle}>Advertise</Typography>
                <Link to="/advertise" className={classes.footerLink}>Advertise with Us</Link>
                <Typography variant="caption" style={{ color: '#64748b', marginTop: '8px', maxWidth: '180px', display: 'block', lineHeight: 1.4 }}>
                  Increase your brand visibility with our amazing branding options.
                </Typography>
              </div>
            </div>
          </div>
          <div className={classes.footerBottom}>
            <Typography className={classes.footerCopy}>
              © {new Date().getFullYear()} M2K Cinemas. All rights reserved.
            </Typography>
            <div className={classes.footerSocials}>
              {['📘', '🐦', '📸', '▶️'].map((icon, i) => (
                <span key={i} className={classes.socialIcon}>{icon}</span>
              ))}
            </div>
          </div>
        </footer>
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

