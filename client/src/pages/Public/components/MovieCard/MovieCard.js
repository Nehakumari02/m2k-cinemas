import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, Typography } from '@material-ui/core';
import styles from './styles';
import { textTruncate } from '../../../../utils';
import { Link } from 'react-router-dom';
import { normalizeImage } from '../../../../utils/imageUrl';
import { useSelector, useDispatch } from 'react-redux';
import { addToWishlist, removeFromWishlist } from '../../../../store/actions/wishlist';
import IconButton from '@material-ui/core/IconButton';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';

const MovieCard = props => {
  const dispatch = useDispatch();
  const wishlist = useSelector(state => state.wishlistState?.wishlist || []);
  const user = useSelector(state => state.authState?.user);
  const { classes, movie } = props;

  const isWishlisted = wishlist.some(w => (w._id || w) === movie._id);

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
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

  return (
    <Link to={`/movie/${movie._id}`} style={{ textDecoration: 'none' }}>
      <div className={classes.card}>
        <header
          className={classes.header}
          style={{
            backgroundImage: `url("${imageUrl}")`,
            position: 'relative'
          }}>
          <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 10 }}>
            <IconButton onClick={handleWishlistToggle} size="small" style={{ color: isWishlisted ? '#ff4d4d' : '#fff', backgroundColor: 'rgba(0,0,0,0.4)' }}>
              {isWishlisted ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
          </div>
          {movie.format && (
            <span className={classes.formatBadge}>{movie.format}</span>
          )}
          <Typography className={classes.h4} variant="h4" color="inherit">
            {movie.genre}
          </Typography>
        </header>
        <div className={classes.body}>
          <p>{movie.duration}</p>
          <h2>{movie.title}</h2>
          <p>{movie.language}</p>
          <p>{movie.cast}</p>
          <p>{movie.director}</p>
          <p>{textTruncate(movie.description)}</p>
        </div>
      </div>
    </Link>
  );
};

MovieCard.propTypes = {
  movie: PropTypes.object.isRequired
};
export default withStyles(styles)(MovieCard);
