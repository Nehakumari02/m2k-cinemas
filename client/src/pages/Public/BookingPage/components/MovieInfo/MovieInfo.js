import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid, Typography } from '@material-ui/core';
import { normalizeImage } from '../../../../../utils/imageUrl';

function ordinalSuffix(day) {
  if (day >= 11 && day <= 13) return 'th';
  switch (day % 10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
}

/** e.g. 150 -> "2h 30m" */
function formatRuntimeMinutes(totalMins) {
  if (totalMins == null || totalMins === '') return '';
  const n = Number(totalMins);
  if (!Number.isFinite(n) || n <= 0) return '';
  const h = Math.floor(n / 60);
  const m = Math.round(n % 60);
  const parts = [];
  if (h) parts.push(`${h}h`);
  if (m) parts.push(`${m}m`);
  return parts.join(' ') || `${n}m`;
}

/** e.g. 8th May 2026 */
function formatReleaseDateLong(dateVal) {
  if (!dateVal) return '';
  const d = new Date(dateVal);
  if (Number.isNaN(d.getTime())) return '';
  const day = d.getDate();
  const month = d.toLocaleString('en-GB', { month: 'long' });
  const year = d.getFullYear();
  return `${day}${ordinalSuffix(day)} ${month} ${year}`;
}

function titleCaseGenre(str) {
  if (!str || typeof str !== 'string') return '';
  return str
    .split(',')
    .map(s =>
      s
        .trim()
        .split(/\s+/)
        .map(w => (w ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : ''))
        .join(' ')
    )
    .filter(Boolean)
    .join(', ');
}

function displayLanguages(movie) {
  if (movie.languages && String(movie.languages).trim()) return String(movie.languages).trim();
  if (movie.language && String(movie.language).trim()) return titleCaseGenre(movie.language.replace(/,/g, ', '));
  return '';
}

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
  const runtimeStr = formatRuntimeMinutes(movie.duration);
  const runtimeWithCert = [runtimeStr, movie.certificate && String(movie.certificate).trim()]
    .filter(Boolean)
    .join(' ');
  const genreDisplay = titleCaseGenre(movie.genre);
  const releaseDisplay = formatReleaseDateLong(movie.releaseDate);
  const languagesDisplay = displayLanguages(movie);
  const formatDisplay = (movie.format && String(movie.format).trim()) || '2D';

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
          {!!languagesDisplay && (
            <span className={classes.metaChip}>{languagesDisplay}</span>
          )}
          {!!runtimeWithCert && (
            <span className={classes.metaChip}>{runtimeWithCert}</span>
          )}
          {!!genreDisplay &&
            genreDisplay
              .split(',')
              .slice(0, 3)
              .map((item, idx) => (
                <span key={`${item}-${idx}`} className={classes.metaChip}>
                  {item.trim()}
                </span>
              ))}
        </div>
        <div className={classes.info}>
          {!!runtimeWithCert && (
            <div className={classes.infoBox}>
              <Typography className={classes.infoLabel}>
                Duration
              </Typography>
              <Typography className={classes.infoValue}>
                {runtimeWithCert}
              </Typography>
            </div>
          )}
          {!!genreDisplay && (
            <div className={classes.infoBox}>
              <Typography className={classes.infoLabel}>
                Genre
              </Typography>
              <Typography className={classes.infoValue}>
                {genreDisplay}
              </Typography>
            </div>
          )}
          {!!releaseDisplay && (
            <div className={classes.infoBox}>
              <Typography className={classes.infoLabel}>
                Release Date
              </Typography>
              <Typography className={classes.infoValue}>
                {releaseDisplay}
              </Typography>
            </div>
          )}
          {!!languagesDisplay && (
            <div className={classes.infoBox}>
              <Typography className={classes.infoLabel}>
                Languages
              </Typography>
              <Typography className={classes.infoValue}>
                {languagesDisplay}
              </Typography>
            </div>
          )}
          <div className={classes.infoBox}>
            <Typography className={classes.infoLabel}>
              Formats
            </Typography>
            <Typography className={classes.infoValue}>
              {formatDisplay}
            </Typography>
          </div>
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
