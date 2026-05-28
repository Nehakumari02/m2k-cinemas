import React, { useMemo } from 'react';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import { makeStyles, Typography, Button, useMediaQuery, useTheme } from '@material-ui/core';
import Slider from 'react-slick';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import MovieCardSimple from '../MovieCardSimple/MovieCardSimple';
import styles from './styles';

const useStyles = makeStyles(styles);

function CarouselArrow({ direction, onClick, currentSlide, slideCount, infinite }) {
  const classes = useStyles();
  const isPrev = direction === 'prev';
  const atStart = currentSlide === 0;
  const atEnd =
    slideCount != null && currentSlide != null && currentSlide >= slideCount - 1;
  const disabled = !infinite && (isPrev ? atStart : atEnd);

  return (
    <button
      type="button"
      className={classnames(
        classes.arrowBtn,
        isPrev ? classes.prevArrow : classes.nextArrow,
        disabled && classes.arrowDisabled
      )}
      onClick={onClick}
      aria-label={isPrev ? 'Previous movies' : 'Next movies'}>
      {isPrev ? <ChevronLeftIcon /> : <ChevronRightIcon />}
    </button>
  );
}

function buildSettings(movieCount, isMobile) {
  const count = Math.max(movieCount, 1);

  if (isMobile) {
    return {
      dots: true,
      arrows: true,
      infinite: count > 1,
      speed: 420,
      cssEase: 'cubic-bezier(0.4, 0, 0.2, 1)',
      slidesToShow: 1,
      slidesToScroll: 1,
      centerMode: true,
      centerPadding: '28px',
      swipeToSlide: true,
      touchThreshold: 6,
      waitForAnimate: false,
      lazyLoad: 'ondemand',
    };
  }

  const desktopShow = Math.min(5, count);
  const canInfinite = count > desktopShow;

  return {
    dots: count > desktopShow,
    arrows: true,
    infinite: canInfinite,
    speed: 480,
    cssEase: 'cubic-bezier(0.4, 0, 0.2, 1)',
    slidesToShow: desktopShow,
    slidesToScroll: Math.min(2, Math.max(1, desktopShow - 1)),
    swipeToSlide: true,
    touchThreshold: 8,
    waitForAnimate: false,
    lazyLoad: 'ondemand',
    responsive: [
      {
        breakpoint: 1400,
        settings: {
          slidesToShow: Math.min(4, count),
          slidesToScroll: 2,
          infinite: count > 4,
          dots: count > 4,
        },
      },
      {
        breakpoint: 1100,
        settings: {
          slidesToShow: Math.min(3, count),
          slidesToScroll: 2,
          infinite: count > 3,
          dots: count > 3,
        },
      },
      {
        breakpoint: 900,
        settings: {
          slidesToShow: Math.min(2, count),
          slidesToScroll: 1,
          infinite: count > 2,
          dots: count > 2,
          centerMode: count === 1,
          centerPadding: count === 1 ? '40px' : '0px',
        },
      },
    ],
  };
}

function MovieCarousel({
  carouselClass,
  movies = [],
  title,
  to = null,
  autoScroll = false,
  autoScrollSpeed = 3500,
}) {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const baseSettings = useMemo(() => buildSettings(movies.length, isMobile), [
    movies.length,
    isMobile,
  ]);

  const settings = useMemo(
    () => ({
      ...baseSettings,
      autoplay: autoScroll && movies.length > 1,
      autoplaySpeed: autoScrollSpeed,
      pauseOnHover: true,
      nextArrow: <CarouselArrow direction="next" infinite={baseSettings.infinite} />,
      prevArrow: <CarouselArrow direction="prev" infinite={baseSettings.infinite} />,
    }),
    [baseSettings, autoScroll, autoScrollSpeed, movies.length]
  );

  if (!movies.length) return null;

  return (
    <div className={classnames(classes.root, carouselClass)}>
      <div className={classes.container}>
        <div className={classes.titleBlock}>
          <Typography className={classes.h2} variant="h2" component="h2">
            {title}
          </Typography>
          <div className={classes.titleAccent} />
          <Typography className={classes.countBadge} component="p">
            {movies.length} {movies.length === 1 ? 'title' : 'titles'}
          </Typography>
        </div>
        {to ? (
          <Link to={to} style={{ textDecoration: 'none' }}>
            <Button className={classes.button} variant="outlined">
              Explore All
            </Button>
          </Link>
        ) : null}
      </div>

      <div className={classes.trackWrap}>
        <div className={classes.edgeFadeLeft} aria-hidden />
        <div className={classes.edgeFadeRight} aria-hidden />
        <Slider {...settings}>
          {movies.map(movie => (
            <div key={movie._id} className={classes.slide}>
              <MovieCardSimple movie={movie} variant="carousel" />
            </div>
          ))}
        </Slider>
      </div>

      <Typography className={classes.swipeHint} component="p">
        Swipe or use arrows to browse more
      </Typography>
    </div>
  );
}

export default MovieCarousel;
