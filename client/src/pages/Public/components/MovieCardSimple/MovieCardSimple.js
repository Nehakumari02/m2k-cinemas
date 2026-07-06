import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Typography, Dialog, Box } from '@material-ui/core';
import { Link, useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import StarIcon from '@material-ui/icons/Star';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import CloseIcon from '@material-ui/icons/Close';
import ReactPlayer from 'react-player';
import { useSelector, useDispatch } from 'react-redux';
import { addToWishlist, removeFromWishlist } from '../../../../store/actions/wishlist';
import { toggleMovieInterest } from '../../../../store/actions/movies';
import { normalizeImage } from '../../../../utils/imageUrl';
import { MovieBookingModals } from '../../../../components';
import useMovieBookingFlow from '../../../../hooks/useMovieBookingFlow';

const useStyles = makeStyles(theme => ({
  link: {
    display: 'block',
    width: '100%',
  },
  card: {
    width: ({ variant }) => (variant === 'carousel' ? '100%' : 230),
    maxWidth: ({ variant }) => (variant === 'carousel' ? 220 : 'none'),
    margin: '0 auto',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    color: '#0f172a',
    boxShadow: '0 8px 24px rgba(15,23,42,0.14)',
    overflow: 'hidden',
    transition: 'transform .25s ease, box-shadow .25s ease',
    position: 'relative',
    '&:hover': {
      transform: 'translateY(-6px)',
      boxShadow: '0 20px 40px rgba(15,23,42,0.2)',
    },
  },
  mediaWrapper: {
    width: '100%',
    aspectRatio: '2 / 3',
    overflow: 'hidden',
    position: 'relative',
  },
  mediaImage: {
    width: '100%',
    height: '100%',
    display: 'block',
    objectFit: 'cover',
    transition: 'transform 0.35s ease',
    '$card:hover &': {
      transform: 'scale(1.04)',
    }
  },
  langBadge: {
    position: 'absolute',
    top: '10px',
    left: '10px',
    background: 'rgba(183,36,41,0.92)',
    color: '#fff',
    fontSize: '0.65rem',
    fontWeight: 800,
    padding: '2px 8px',
    borderRadius: '4px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    zIndex: 3,
  },
  formatBadge: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    background: 'rgba(0, 0, 0, 0.75)',
    color: '#fff',
    fontSize: '0.65rem',
    fontWeight: 800,
    padding: '2px 8px',
    borderRadius: '4px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    zIndex: 3,
    border: '1px solid rgba(255,255,255,0.2)',
    boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
  },
  wishlistBtn: {
    position: 'absolute',
    top: '5px',
    right: '5px',
    color: '#fff',
    backgroundColor: 'rgba(0,0,0,0.3)',
    '&:hover': {
      backgroundColor: 'rgba(0,0,0,0.6)',
    },
    zIndex: 5,
  },
  bookOverlay: {
    marginTop: '16px',
    width: '100%',
  },
  bookBtn: {
    width: '100%',
    padding: '12px 0',
    backgroundColor: '#0f172a',
    color: '#ffffff',
    border: 'none',
    borderRadius: 8,
    fontWeight: 700,
    fontSize: '0.9rem',
    cursor: 'pointer',
    transition: 'background-color .25s ease',
    '&:hover': {
      backgroundColor: '#1e293b',
    },
  },
  playOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '50px',
    height: '50px',
    color: '#fff',
    cursor: 'pointer',
    transition: 'transform .2s ease, background-color .2s ease',
    '&:hover': {
      transform: 'translate(-50%, -50%) scale(1.1)',
      backgroundColor: 'rgba(0,0,0,0.7)',
    },
    '& svg': {
      fontSize: '2.5rem',
    }
  },
  h5: {
    textTransform: 'capitalize',
    fontSize: '1rem',
    fontWeight: 700,
    lineHeight: 1.3,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  meta: {
    color: '#64748b',
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '.06em',
    marginBottom: '4px',
  },
  cardContent: {
    padding: '10px 12px 12px',
    backgroundColor: '#ffffff',
  },
  detailsRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '8px',
    marginBottom: '6px',
  },
  detailsLeft: {
    color: '#475569',
    fontSize: '0.73rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  ratingPill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '3px',
    background: '#fef3c7',
    color: '#92400e',
    borderRadius: 999,
    padding: '2px 7px',
    fontSize: '0.7rem',
    fontWeight: 800,
  },
  [theme.breakpoints.down('sm')]: {
    card: {
      width: 168,
    },
    cardContent: {
      padding: '8px 9px 10px',
    },
    detailsLeft: {
      fontSize: '0.62rem',
    },
    ratingPill: {
      fontSize: '0.62rem',
      padding: '1px 6px',
    },
    h5: {
      fontSize: '0.82rem',
    },
    bookBtn: {
      fontSize: '0.68rem',
      padding: '7px 0',
    },
  }
}));

const MovieCardSimple = props => {
  const { movie, variant } = props;
  const classes = useStyles({ variant });
  const history = useHistory();
  const dispatch = useDispatch();
  const wishlist = useSelector(state => state.wishlistState?.wishlist || []);
  const user = useSelector(state => state.authState?.user);
  const bookingFlow = useMovieBookingFlow();
  const [trailerOpen, setTrailerOpen] = useState(false);
  
  const isWishlisted = wishlist.some(w => (w._id || w) === movie._id);
  const isComingSoon = new Date(movie.releaseDate) > new Date();
  const isInterested = user && movie.interestedUsers && movie.interestedUsers.includes(user._id);

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      // You can trigger a login modal here if desired, or simply ignore
      alert('Please log in to add to wishlist');
      return;
    }
    if (isWishlisted) {
      dispatch(removeFromWishlist(movie._id));
    } else {
      dispatch(addToWishlist(movie._id));
    }
  };

  const imageUrl = normalizeImage(movie.image);
  const onBookTickets = event => {
    event.preventDefault();
    event.stopPropagation();
    bookingFlow.startBooking(movie);
  };

  const onWatchTrailer = event => {
    event.preventDefault();
    event.stopPropagation();
    setTrailerOpen(true);
  };

  const onShowInterest = event => {
    event.preventDefault();
    event.stopPropagation();
    if (!user) {
      alert('Please log in to show interest.');
      return;
    }
    dispatch(toggleMovieInterest(movie._id));
  };

  const onCardClick = event => {
    event.preventDefault();
    event.stopPropagation();
    bookingFlow.startBooking(movie);
  };

  return (
    <div className={classes.link}>
      <Card className={classes.card}>
        <CardActionArea component="div" onClick={onCardClick}>
          <div className={classes.mediaWrapper}>
            <img className={classes.mediaImage} src={imageUrl} alt={movie.title} />
            {movie.trailerUrl && (
              <div className={classes.playOverlay} onClick={onWatchTrailer}>
                <PlayCircleOutlineIcon />
              </div>
            )}
            {movie.language && (
              <span className={classes.langBadge}>{movie.language}</span>
            )}
            {movie.format && (
              <span className={classes.formatBadge}>{movie.format}</span>
            )}
            <IconButton className={classes.wishlistBtn} onClick={handleWishlistToggle} size="small" style={{ top: '38px' }}>
              {isWishlisted ? <FavoriteIcon style={{ color: '#ff4d4d' }} /> : <FavoriteBorderIcon />}
            </IconButton>
          </div>
          <CardContent className={classes.cardContent}>
            <div className={classes.detailsRow}>
              <Typography className={classes.detailsLeft} variant="caption" color="inherit">
                {(movie.language || 'LANG').toUpperCase()} • {movie.duration || '--'} MIN
              </Typography>
              <span className={classes.ratingPill}>
                <StarIcon style={{ fontSize: '0.8rem' }} />
                {movie.rating || '4.0'}
              </span>
            </div>
            <Typography className={classes.meta} variant="caption" color="inherit">
              {movie.genre ? movie.genre.split(',').slice(0, 2).join(' • ') : 'Drama • Action'}
            </Typography>
            <Typography
              className={classes.h5}
              gutterBottom
              variant="h5"
              component="h2"
              color="inherit">
              {movie.title}
            </Typography>
            <div className={classes.bookOverlay}>
              {isComingSoon ? (
                <button 
                  className={classes.bookBtn} 
                  style={{ backgroundColor: isInterested ? '#475569' : '#0f172a' }}
                  onClick={onShowInterest}
                >
                  {isInterested ? 'Interested' : 'Show Interest'}
                </button>
              ) : (
                <button className={classes.bookBtn} onClick={onBookTickets}>
                  Book Tickets
                </button>
              )}
            </div>
          </CardContent>
        </CardActionArea>
      </Card>

      <Dialog
        open={trailerOpen}
        onClose={() => setTrailerOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          style: {
            backgroundColor: '#000',
            boxShadow: 'none',
            overflow: 'hidden'
          }
        }}
      >
        <Box display="flex" justifyContent="flex-end" position="absolute" right={8} top={8} zIndex={1}>
          <IconButton onClick={() => setTrailerOpen(false)} style={{ color: '#fff' }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box style={{ paddingTop: '56.25%', position: 'relative' }}>
          <ReactPlayer
            url={movie.trailerUrl}
            playing={trailerOpen}
            controls
            width="100%"
            height="100%"
            style={{ position: 'absolute', top: 0, left: 0 }}
          />
        </Box>
      </Dialog>

      <MovieBookingModals flow={bookingFlow} />
    </div>
  );
};

MovieCardSimple.propTypes = {
  movie: PropTypes.object.isRequired,
  variant: PropTypes.oneOf(['carousel', 'default']),
};
MovieCardSimple.defaultProps = {
  variant: 'default',
};
export default MovieCardSimple;

