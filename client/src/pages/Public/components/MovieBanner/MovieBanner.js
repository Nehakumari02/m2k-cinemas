import React, { useState } from 'react';
import classnames from 'classnames';
import { Rating } from '@material-ui/lab';
import {
  Box,
  Typography,
  Button,
  makeStyles,
  withStyles,
  Dialog,
  IconButton
} from '@material-ui/core';
import { textTruncate } from '../../../../utils';
import { Link, useHistory } from 'react-router-dom';
import ArrowRightAlt from '@material-ui/icons/ArrowRightAlt';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import CloseIcon from '@material-ui/icons/Close';
import ReactPlayer from 'react-player';
import { normalizeImage } from '../../../../utils/imageUrl';
import { MovieBookingModals } from '../../../../components';
import useMovieBookingFlow from '../../../../hooks/useMovieBookingFlow';
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
  const history = useHistory();
  const bookingFlow = useMovieBookingFlow();
  const [trailerOpen, setTrailerOpen] = useState(false);

  if (!movie) return null;
  const imageUrl = normalizeImage(movie.image);

  const onBookTickets = e => {
    if (e) e.preventDefault();
    bookingFlow.startBooking(movie);
  };

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
          <Box display="flex" alignItems="center" mt={0.5}>
            <Typography className={classes.duration} variant="body1" color="inherit">
              🕐 {movie.duration} min
            </Typography>
            <Typography className={classes.genre} variant="body1" color="inherit">
              {movie.genre}
            </Typography>
          </Box>
          
          {/* Actions */}
          <div className={classes.movieActions}>
            {fullDescription ? (
              <Button variant="contained" className={classes.button} onClick={onBookTickets}>
                Book Now
                <ArrowRightAlt className={classes.buttonIcon} />
              </Button>
            ) : (
              <>
                <Link to={`/movie/${movie._id}`} style={{ textDecoration: 'none' }}>
                  <Button className={classnames(classes.button, classes.learnMore)}>
                    View Details
                    <ArrowRightAlt className={classes.buttonIcon} />
                  </Button>
                </Link>
                <Button variant="contained" className={classes.button} onClick={onBookTickets}>
                  Book Now
                  <ArrowRightAlt className={classes.buttonIcon} />
                </Button>
              </>
            )}
            
            {movie.trailerUrl && (
              <Button 
                className={classnames(classes.button, classes.learnMore)}
                style={{ marginLeft: fullDescription ? '16px' : '0px' }}
                onClick={() => setTrailerOpen(true)}
              >
                Watch Trailer
                <PlayCircleOutlineIcon className={classes.buttonIcon} />
              </Button>
            )}
          </div>
        </header>
      </div>

      {/* Poster or Trailer Video */}
      {movie.trailerUrl ? (
        <div className={classes.trailerVideoWrapper}>
          <ReactPlayer
            url={movie.trailerUrl}
            playing={true}
            muted={true}
            loop={true}
            controls={false}
            width="100%"
            height="100%"
            style={{ pointerEvents: 'none' }}
          />
        </div>
      ) : (
        <div className={classes.posterWrapper}>
          <img className={classes.posterImage} src={imageUrl} alt={movie.title} />
        </div>
      )}

      {/* Trailer Modal */}
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
}

export default MovieBanner;
