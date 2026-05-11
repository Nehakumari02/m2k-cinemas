import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid, Typography } from '@material-ui/core';
import { normalizeImage } from '../../../../../utils/imageUrl';

const useStyles = makeStyles(theme => ({
  movieInfos: {
    background: '#ffffff',
    position: 'relative',
    height: '100%',
    minHeight: '600px',
    borderRadius: '14px',
    overflow: 'hidden',
    border: '1px solid #d8e2f0',
    boxShadow: '0 8px 20px rgba(15,23,42,0.06)',
    display: 'flex',
    flexDirection: 'column',
  },
  background: {
    position: 'relative',
    height: '400px',
    width: '100%',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    zIndex: 1,
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: '100%',
      background: 'linear-gradient(to bottom, transparent 60%, #ffffff 100%)',
    }
  },
  title: {
    padding: theme.spacing(2, 2.5, 1),
    color: '#122947',
    fontSize: '1.25rem',
    fontWeight: 800,
    textTransform: 'capitalize',
    letterSpacing: '0.02em',
  },
  metaRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(0.8),
    padding: theme.spacing(0, 2.5, 1.5),
  },
  metaChip: {
    fontSize: '0.72rem',
    fontWeight: 700,
    color: '#19365a',
    background: '#eef4ff',
    border: '1px solid #cfddf7',
    borderRadius: 999,
    padding: theme.spacing(0.35, 1),
    lineHeight: 1.3,
  },
  info: {
    padding: theme.spacing(0, 2.5, 2.5),
    width: '100%',
  },
  infoBox: {
    color: '#0f172a',
    marginBottom: theme.spacing(1.5),
  },
  infoLabel: {
    fontSize: '0.66rem',
    textTransform: 'uppercase',
    color: '#5a6c85',
    letterSpacing: '0.1em',
    fontWeight: 700,
  },
  infoValue: {
    fontSize: '0.84rem',
    color: '#24364d',
    fontWeight: 600,
  },
  synopsisBox: {
    borderTop: '1px dashed #d8e2f0',
    marginTop: theme.spacing(1),
    paddingTop: theme.spacing(1.2),
  },
  synopsisText: {
    fontSize: '0.8rem',
    color: '#41556f',
    lineHeight: 1.45,
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
          <Typography style={{ color: '#64748b', fontWeight: 600 }}>
            Loading Movie...
          </Typography>
        </div>
      </Grid>
    );

  const imageUrl = normalizeImage(movie.image);

  return (
    <Grid item xs={12} md={12} lg={3}>
      <div className={classes.movieInfos}>
        <div
          className={classes.background}
          style={{
            backgroundImage: `url("${imageUrl}")`
          }}
        />
        <Typography className={classes.title}>{movie.title}</Typography>
        <div className={classes.metaRow}>
          {!!movie.language && (
            <span className={classes.metaChip}>{movie.language}</span>
          )}
          {!!movie.duration && (
            <span className={classes.metaChip}>{movie.duration} mins</span>
          )}
          {!!movie.genre &&
            movie.genre
              .split(',')
              .slice(0, 2)
              .map((item, idx) => (
                <span key={`${item}-${idx}`} className={classes.metaChip}>
                  {item.trim()}
                </span>
              ))}
        </div>
        <div className={classes.info}>
          {!!movie.duration && (
            <div className={classes.infoBox}>
              <Typography className={classes.infoLabel}>
                Duration
              </Typography>
              <Typography className={classes.infoValue}>
                {movie.duration} mins
              </Typography>
            </div>
          )}
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
          {movie.description && (
            <div className={classes.synopsisBox}>
              <Typography className={classes.infoLabel}>
                Synopsis
              </Typography>
              <Typography className={classes.synopsisText}>
                {movie.description}
              </Typography>
            </div>
          )}
        </div>
      </div>
    </Grid>
  );
}
