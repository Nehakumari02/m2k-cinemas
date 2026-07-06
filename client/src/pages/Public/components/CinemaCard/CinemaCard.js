import React from 'react';
import classNames from 'classnames';
import { makeStyles } from '@material-ui/core';
import { Typography } from '@material-ui/core';
import { Paper } from '../../../../components';
import { EventSeat, LocationOn, ArrowForward } from '@material-ui/icons';
import { formatPremiumSeatLabel } from '../../../../utils/seatPricing';
import { Link } from 'react-router-dom';
import { normalizeImage } from '../../../../utils/imageUrl';
import { formatCinemaAddress } from '../../../../constants/m2kAddresses';

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: '100%',
    cursor: 'pointer',
    borderRadius: 14,
    overflow: 'hidden',
    border: '1px solid rgba(15,23,42,0.1)',
    boxShadow: '0 8px 24px rgba(15,23,42,0.1)',
    transition: 'transform 0.22s ease, box-shadow 0.22s ease',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 14px 30px rgba(15,23,42,0.16)',
    },
  },
  imageWrapper: {
    height: '190px',
    margin: '0 auto',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  imageOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to top, rgba(15,23,42,0.65) 0%, rgba(15,23,42,0.08) 55%, transparent 100%)',
  },
  cityBadge: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    zIndex: 2,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    padding: '4px 10px',
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.92)',
    color: '#0f172a',
    fontSize: '0.72rem',
    fontWeight: 700,
    textTransform: 'capitalize',
  },
  details: { padding: theme.spacing(2.2, 2.2, 1.4) },
  name: {
    fontSize: '1.05rem',
    lineHeight: 1.3,
    marginTop: theme.spacing(0.5),
    textTransform: 'capitalize',
    fontWeight: 700,
    color: '#0f172a',
  },
  city: {
    lineHeight: '16px',
    minHeight: theme.spacing(3),
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    color: '#64748b',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  statsWrap: {
    padding: theme.spacing(0, 2.2, 2),
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(0.8),
  },
  stats: {
    display: 'flex',
    alignItems: 'center'
  },
  eventIcon: {
    color: '#64748b',
    fontSize: 18,
  },
  eventText: {
    marginLeft: theme.spacing(0.8),
    color: '#475569',
    fontSize: '0.82rem',
    fontWeight: 600,
  },
  ctaContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: theme.spacing(0, 2.2, 2.2),
    borderTop: '1px solid rgba(15,23,42,0.08)',
    paddingTop: theme.spacing(1.2),
  },
  cta: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    color: '#b72429',
    fontSize: '0.82rem',
    fontWeight: 700,
    letterSpacing: '0.01em',
  },
  mapBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    color: '#0f172a',
    fontSize: '0.75rem',
    fontWeight: 600,
    textDecoration: 'none',
    backgroundColor: '#f1f5f9',
    padding: '4px 8px',
    borderRadius: '6px',
    transition: 'background-color 0.2s',
    '&:hover': {
      backgroundColor: '#e2e8f0',
    }
  },
}));

function CinemaCard(props) {
  const classes = useStyles(props);
  const { className, cinema, linkToDetails = false, admin = false, minMoviePrice } = props;
  const premiumLabel = formatPremiumSeatLabel(cinema);
  const cinemaImage = normalizeImage(cinema && cinema.image);
  const venueAddress = formatCinemaAddress(cinema);

  const rootClassName = classNames(classes.root, className);
  const content = (
    <Paper className={rootClassName}>
      <div className={classes.imageWrapper}>
        <img alt="cinema" className={classes.image} src={cinemaImage} />
        <div className={classes.imageOverlay} />
        <div className={classes.cityBadge}>
          <LocationOn style={{ fontSize: 14 }} />
          {cinema.city}
        </div>
      </div>
      <div className={classes.details}>
        <Typography className={classes.name} variant="h4">
          {cinema.name}
        </Typography>
        <Typography className={classes.city} variant="body1">
          {venueAddress || cinema.city}
        </Typography>
      </div>

      <div className={classes.ctaContainer}>
        <div className={classes.cta}>
          View Showtimings
          <ArrowForward style={{ fontSize: 16 }} />
        </div>
        {(cinema.name && (cinema.name.toLowerCase().includes('rohini') || cinema.name.toLowerCase().includes('pitampura'))) && (
          <a
            href={`https://www.google.com/maps/search/?api=1&query=M2K+Cinemas+${cinema.name.toLowerCase().includes('rohini') ? 'Rohini' : 'Pitampura'}`}
            target="_blank"
            rel="noopener noreferrer"
            className={classes.mapBtn}
            onClick={(e) => e.stopPropagation()}
          >
            <LocationOn style={{ fontSize: 14 }} />
            Map
          </a>
        )}
      </div>
    </Paper>
  );

  if (linkToDetails) {
    return (
      <Link to={`/cinemas/${cinema._id}`} style={{ textDecoration: 'none' }}>
        {content}
      </Link>
    );
  }

  return content;
}

export default CinemaCard;
