import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';

const useStyles = makeStyles(theme => ({
  link: {
    display: 'block',
    width: '100%'
  },
  card: {
    width: 200,
    margin: '0 auto',
    backgroundColor: '#16161e',
    borderRadius: 12,
    color: theme.palette.common.white,
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
    overflow: 'hidden',
    transition: 'transform .25s ease, box-shadow .25s ease',
    position: 'relative',
    '&:hover': {
      transform: 'translateY(-6px)',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.55)',
    },
    '&:hover $bookOverlay': {
      opacity: 1,
      transform: 'translateY(0)',
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
    color: '#14141c',
    fontSize: '0.65rem',
    fontWeight: 800,
    padding: '2px 8px',
    borderRadius: '4px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    zIndex: 3,
  },
  bookOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    background: 'linear-gradient(to top, rgba(0,0,0,0.92) 60%, transparent)',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    padding: '20px 12px 14px',
    opacity: 0,
    transform: 'translateY(8px)',
    transition: 'opacity 0.25s ease, transform 0.25s ease',
    zIndex: 4,
    pointerEvents: 'none',
  },
  bookBtn: {
    background: 'linear-gradient(90deg, #b72429, #8b1c20)',
    color: '#14141c',
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
    fontSize: '0.95rem',
    fontWeight: 700,
    lineHeight: 1.3,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  meta: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '.06em',
    marginBottom: '4px',
  },
  cardContent: {
    padding: '10px 12px 12px',
    backgroundColor: '#16161e',
  }
}));

const MovieCardSimple = props => {
  const classes = useStyles();
  const { movie } = props;
  const imageUrl = (() => {
    if (!movie.image) return 'https://source.unsplash.com/featured/?movie,poster';
    if (movie.image.startsWith('http://') || movie.image.startsWith('https://')) {
      return movie.image;
    }
    return movie.image.startsWith('/') ? movie.image : `/${movie.image}`;
  })();
  const encodedImageUrl = encodeURI(imageUrl);

  return (
    <Link to={`/movie/${movie._id}`} className={classes.link} style={{ textDecoration: 'none' }}>
      <Card className={classes.card}>
        <CardActionArea component="div">
          <div className={classes.mediaWrapper}>
            <img className={classes.mediaImage} src={encodedImageUrl} alt={movie.title} />
            {movie.language && (
              <span className={classes.langBadge}>{movie.language}</span>
            )}
            <div className={classes.bookOverlay}>
              <button className={classes.bookBtn}>Book Tickets</button>
            </div>
          </div>
          <CardContent className={classes.cardContent}>
            <Typography className={classes.meta} variant="caption" color="inherit">
              {movie.duration} min{movie.genre ? ` • ${movie.genre.split(',')[0].trim()}` : ''}
            </Typography>
            <Typography
              className={classes.h5}
              gutterBottom
              variant="h5"
              component="h2"
              color="inherit">
              {movie.title}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Link>
  );
};

MovieCardSimple.propTypes = {
  movie: PropTypes.object.isRequired
};
export default MovieCardSimple;

