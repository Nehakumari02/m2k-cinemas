import React from 'react';
import classnames from 'classnames';
import { Rating } from '@material-ui/lab';
import {
  Box,
  Typography,
  Button,
  makeStyles,
  withStyles
} from '@material-ui/core';
import { textTruncate } from '../../../../utils';
import { Link } from 'react-router-dom';
import ArrowRightAlt from '@material-ui/icons/ArrowRightAlt';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import { normalizeImage } from '../../../../utils/imageUrl';
import styles from './styles';

const useStyles = makeStyles(styles);

const StyledRating = withStyles({
  iconFilled: {
    color: '#b72429'
  },
  iconEmpty: {
    color: 'rgba(255,255,255,0.2)'
  }
})(Rating);

function MovieBanner(props) {
  const { movie, fullDescription } = props;
  const classes = useStyles(props);
  if (!movie) return null;
  const imageUrl = normalizeImage(movie.image);

  return (
    <div className={classes.movieHero}>
      <div
        className={classes.heroBackdrop}
        style={{
          backgroundImage: `url("${imageUrl}")`
        }}
      />
      <div className={classes.infoSection}>
        <header className={classes.movieHeader}>
          {/* Genre Tags */}
          {movie.genre && (
            <Box mb={1.5} display="flex" alignItems="center" flexWrap="wrap">
              {movie.genre.split(',').map((genre, index) => (
                <Typography
                  key={`${genre}-${index}`}
                  className={classes.tag}
                  variant="body1"
                  color="inherit">
                  {genre.trim()}
                </Typography>
              ))}
            </Box>
          )}

          {/* Title */}
          <Typography
            className={classes.movieTitle}
            variant="h1"
            color="inherit">
            {movie.title}
          </Typography>

          {/* Rating */}
          {fullDescription && (
            <Box display="flex" alignItems="center" mb={0.5}>
              <StyledRating
                value={4}
                readOnly
                size="small"
                emptyIcon={<StarBorderIcon fontSize="inherit" />}
              />
            </Box>
          )}

          {/* Description */}
          <Typography
            className={classes.descriptionText}
            variant="body1"
            color="inherit">
            {textTruncate(movie.description, 250)}
          </Typography>

          {/* Director */}
          <Typography className={classes.director} variant="h4" color="inherit">
            Directed by <span>{movie.director}</span>
          </Typography>

          {/* Duration & Genre pills */}
          <Box display="flex" alignItems="center" mt={1}>
            <Typography className={classes.duration} variant="body1" color="inherit">
              🕐 {movie.duration} min
            </Typography>
            <Typography className={classes.genre} variant="body1" color="inherit">
              {movie.genre}
            </Typography>
          </Box>
        </header>
      </div>

      {/* Poster */}
      <div className={classes.posterWrapper}>
        <img className={classes.posterImage} src={imageUrl} alt={movie.title} />
      </div>

      {/* Actions */}
      <div className={classes.movieActions}>
        {fullDescription ? (
          <Link to={`/movie/booking/${movie._id}`} style={{ textDecoration: 'none' }}>
            <Button variant="contained" className={classes.button}>
              Book Now
              <ArrowRightAlt className={classes.buttonIcon} />
            </Button>
          </Link>
        ) : (
          <>
            <Link to={`/movie/${movie._id}`} style={{ textDecoration: 'none' }}>
              <Button className={classnames(classes.button, classes.learnMore)}>
                View Details
                <ArrowRightAlt className={classes.buttonIcon} />
              </Button>
            </Link>
            <Link to={`/movie/booking/${movie._id}`} style={{ textDecoration: 'none' }}>
              <Button variant="contained" className={classes.button}>
                Book Now
                <ArrowRightAlt className={classes.buttonIcon} />
              </Button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default MovieBanner;
