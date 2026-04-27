import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid, Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  movieInfos: {
    background: 'linear-gradient(180deg, rgb(18,18,26) 0%, rgb(10,10,16) 100%)',
    position: 'relative',
    height: '100%',
    borderRadius: '14px',
    overflow: 'hidden',
    border: '1px solid rgba(183,36,41,0.08)',
  },
  background: {
    position: 'absolute',
    opacity: 0.35,
    top: 0,
    height: '70%',
    right: 0,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    width: '100%',
    zIndex: 1,
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: '60%',
      background: 'linear-gradient(transparent, rgb(18,18,26))',
    }
  },
  title: {
    position: 'absolute',
    top: '58%',
    right: 0,
    width: '100%',
    textAlign: 'center',
    color: '#b72429',
    fontSize: '1.3rem',
    fontWeight: 800,
    textTransform: 'capitalize',
    zIndex: 2,
    letterSpacing: '0.02em',
  },
  info: {
    position: 'absolute',
    padding: theme.spacing(3),
    top: '68%',
    right: 0,
    width: '100%',
  },
  infoBox: {
    color: theme.palette.common.white,
    marginBottom: theme.spacing(1.5),
  },
  infoLabel: {
    fontSize: '0.65rem',
    textTransform: 'uppercase',
    color: 'rgba(183,36,41,0.6)',
    letterSpacing: '0.1em',
    fontWeight: 700,
  },
  infoValue: {
    fontSize: '0.82rem',
    color: 'rgba(255,255,255,0.75)',
  },
  [theme.breakpoints.down('md')]: {
    movieInfos: { minHeight: '30vh', borderRadius: '10px' },
    background: { height: '100%' },
    title: { top: '80%' },
    info: { display: 'none' }
  }
}));

export default function MovieInfo(props) {
  const classes = useStyles(props);
  const { movie } = props;

  if (!movie)
    return (
      <Grid item xs={12} md={12} lg={3}>
        <div className={classes.movieInfos} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
          <Typography style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>
            Loading Movie...
          </Typography>
        </div>
      </Grid>
    );

  const imageUrl = (() => {
    if (!movie.image) return 'https://source.unsplash.com/featured/?movie';
    if (movie.image.startsWith('http://') || movie.image.startsWith('https://')) {
      return movie.image;
    }
    return movie.image.startsWith('/') ? movie.image : `/${movie.image}`;
  })();
  const encodedImageUrl = encodeURI(imageUrl);

  return (
    <Grid item xs={12} md={12} lg={3}>
      <div className={classes.movieInfos}>
        <div
          className={classes.background}
          style={{
            backgroundImage: `url("${encodedImageUrl}")`
          }}
        />
        <Typography className={classes.title}>{movie.title}</Typography>
        <div className={classes.info}>
          {movie.director && (
            <div className={classes.infoBox}>
              <Typography className={classes.infoLabel}>
                Director
              </Typography>
              <Typography className={classes.infoValue}>
                {movie.director}
              </Typography>
            </div>
          )}
          {movie.cast && (
            <div className={classes.infoBox}>
              <Typography className={classes.infoLabel}>
                Cast
              </Typography>
              <Typography className={classes.infoValue}>
                {movie.cast}
              </Typography>
            </div>
          )}
          {movie.genre && (
            <div className={classes.infoBox}>
              <Typography className={classes.infoLabel}>
                Genre
              </Typography>
              <Typography className={classes.infoValue}>
                {movie.genre}
              </Typography>
            </div>
          )}
        </div>
      </div>
    </Grid>
  );
}
