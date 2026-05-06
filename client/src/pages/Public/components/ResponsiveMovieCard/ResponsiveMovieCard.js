import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, Paper, Typography } from '@material-ui/core';
import styles from './styles';
import { useSelector, useDispatch } from 'react-redux';
import { addToWishlist, removeFromWishlist } from '../../../../store/actions/wishlist';
import IconButton from '@material-ui/core/IconButton';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import { textTruncate } from '../../../../utils';
import { Link } from 'react-router-dom';
import { normalizeImage } from '../../../../utils/imageUrl';

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
      <Paper className={classes.movieCard} elevation={20}>
        <div className={classes.infoSection}>
          <header className={classes.movieHeader}>
            <Typography
              className={classes.movieTitle}
              variant="h1"
              color="inherit">
              {movie.title}
            </Typography>
            <Typography
              className={classes.director}
              variant="h4"
              color="inherit">
              By: {movie.director}
            </Typography>
            <Typography
              className={classes.duration}
              variant="body1"
              color="inherit">
              {movie.duration} min
            </Typography>
            <Typography
              className={classes.genre}
              variant="body1"
              color="inherit">
              {movie.genre}
            </Typography>
          </header>

          <div className={classes.description}>
            <Typography
              className={classes.descriptionText}
              variant="body1"
              color="inherit">
              {textTruncate(movie.description, 250)}
            </Typography>
          </div>
          <div className={classes.footer} style={{ position: 'absolute', bottom: '15px', right: '15px', zIndex: 10 }}>
            <IconButton onClick={handleWishlistToggle} size="small" style={{ color: isWishlisted ? '#ff4d4d' : '#ccc', backgroundColor: 'rgba(0,0,0,0.5)' }}>
              {isWishlisted ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
          </div>
        </div>
        <div
          className={classes.blurBackground}
          style={{
            backgroundImage: `url("${imageUrl}")`
          }}
        />
      </Paper>
    </Link>
  );
};

MovieCard.propTypes = {
  movie: PropTypes.object.isRequired
};
export default withStyles(styles)(MovieCard);
