import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import { Link, useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import StarIcon from '@material-ui/icons/Star';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import { useSelector, useDispatch } from 'react-redux';
import { addToWishlist, removeFromWishlist } from '../../../../store/actions/wishlist';
import { normalizeImage } from '../../../../utils/imageUrl';
import { ContentWarningModal } from '../../../../components';

const useStyles = makeStyles(theme => ({
  link: {
    display: 'block',
    width: '100%'
  },
  card: {
    width: 230,
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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '10px',
  },
  bookBtn: {
    background: 'linear-gradient(90deg, #b72429, #8b1c20)',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    padding: '9px 0',
    width: '100%',
    fontSize: '0.8rem',
    fontWeight: 800,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    cursor: 'pointer',
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
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const wishlist = useSelector(state => state.wishlistState?.wishlist || []);
  const user = useSelector(state => state.authState?.user);
  const { movie } = props;
  const [showWarning, setShowWarning] = useState(false);
  
  const isWishlisted = wishlist.some(w => (w._id || w) === movie._id);

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
    if (movie.contentWarning) {
      setShowWarning(true);
    } else {
      history.push(`/movie/booking/${movie._id}`);
    }
  };

  const onCardClick = () => {
    history.push(`/movie/${movie._id}`);
  };

  const handleContinue = () => {
    setShowWarning(false);
    history.push(`/movie/booking/${movie._id}`);
  };

  return (
    <div className={classes.link}>
      <Card className={classes.card}>
        <CardActionArea component="div" onClick={onCardClick}>
          <div className={classes.mediaWrapper}>
            <img className={classes.mediaImage} src={imageUrl} alt={movie.title} />
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
              <button className={classes.bookBtn} onClick={onBookTickets}>
                Book Tickets
              </button>
            </div>
          </CardContent>
        </CardActionArea>
      </Card>
      <ContentWarningModal
        open={showWarning}
        handleClose={() => setShowWarning(false)}
        handleContinue={handleContinue}
        movie={movie}
      />
    </div>
  );
};

MovieCardSimple.propTypes = {
  movie: PropTypes.object.isRequired
};
export default MovieCardSimple;

