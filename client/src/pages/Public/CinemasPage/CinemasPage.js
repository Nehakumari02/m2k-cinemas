import React, { useEffect, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import {
  makeStyles,
  Grid,
  Typography,
  Container,
  TextField,
  MenuItem,
  InputAdornment,
} from '@material-ui/core';
import { Search } from '@material-ui/icons';
import { getCinemas, getMovies } from '../../../store/actions';
import CinemaCard from '../components/CinemaCard/CinemaCard';
import { filterPrimaryCinemas } from '../../../utils/cinemaListing';

const useStyles = makeStyles(theme => ({
  page: {
    paddingTop: theme.spacing(12),
    paddingBottom: theme.spacing(6),
  },
  hero: {
    borderRadius: 16,
    padding: theme.spacing(4),
    marginBottom: theme.spacing(3),
    background:
      'linear-gradient(135deg, rgba(183,36,41,0.12) 0%, rgba(183,36,41,0.04) 45%, rgba(255,255,255,1) 100%)',
    border: '1px solid rgba(183,36,41,0.2)',
  },
  title: {
    fontSize: '2.4rem',
    lineHeight: 1.15,
    fontWeight: 800,
    color: '#0f172a',
  },
  subtitle: {
    marginTop: theme.spacing(1),
    color: '#64748b',
    maxWidth: 760,
  },
  filtersRow: {
    marginTop: theme.spacing(3),
    display: 'flex',
    gap: theme.spacing(1.5),
    flexWrap: 'wrap',
  },
  filterField: {
    minWidth: 220,
    '& .MuiOutlinedInput-root': {
      borderRadius: 10,
      backgroundColor: '#fff',
      '& fieldset': { borderColor: 'rgba(15,23,42,0.12)' },
      '&:hover fieldset': { borderColor: 'rgba(183,36,41,0.35)' },
      '&.Mui-focused fieldset': { borderColor: '#b72429' },
    },
    '& .MuiInputLabel-root': { color: '#64748b' },
    '& .MuiInputBase-input': { color: '#0f172a' },
    '& .MuiSelect-icon': { color: '#64748b' },
    '& .MuiInputLabel-outlined.MuiInputLabel-shrink': {
      transform: 'translate(14px, -14px) scale(0.75)',
    }
  },
  sectionMeta: {
    marginBottom: theme.spacing(2),
    color: '#475569',
    fontWeight: 600,
  },
  empty: {
    textAlign: 'center',
    marginTop: theme.spacing(6),
    color: '#64748b',
  },
  [theme.breakpoints.down('sm')]: {
    title: { fontSize: '1.8rem' },
    filterField: { minWidth: '100%' },
  },
}));

function CinemasPage(props) {
  const classes = useStyles(props);
  const { cinemas, movies, getCinemas, getMovies } = props;
  const [search, setSearch] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');

  const normalize = value =>
    String(value || '')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/[^a-z0-9 ]/g, '');

  useEffect(() => {
    if (!cinemas.length) getCinemas();
    if (!movies.length) getMovies();
  }, [cinemas, movies, getCinemas, getMovies]);

  const listingCinemas = useMemo(() => filterPrimaryCinemas(cinemas), [cinemas]);

  const minMoviePrice = useMemo(() => {
    const prices = (movies || []).map(m => Number(m.ticketPrice)).filter(p => p > 0);
    return prices.length ? Math.min(...prices) : 0;
  }, [movies]);

  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    import('../../../utils/geolocation').then(({ getUserLocation }) => {
      getUserLocation().then(loc => setUserLocation(loc)).catch(() => {});
    });
  }, []);

  const cityOptions = useMemo(() => {
    const cities = listingCinemas
      .map(cinema => cinema.city)
      .filter(Boolean)
      .map(city => city.trim());
    return ['all', ...Array.from(new Set(cities)).sort((a, b) => a.localeCompare(b))];
  }, [listingCinemas]);

  const sortedCinemas = useMemo(() => {
    if (!userLocation) return listingCinemas;
    const { getCinemaCoordinates, calculateDistance } = require('../../../utils/distance');
    
    return [...listingCinemas].map(cinema => {
      const coords = getCinemaCoordinates(cinema);
      if (coords) {
        cinema.distance = calculateDistance(userLocation.latitude, userLocation.longitude, coords.latitude, coords.longitude);
      } else {
        cinema.distance = Infinity;
      }
      return cinema;
    }).sort((a, b) => a.distance - b.distance);
  }, [listingCinemas, userLocation]);

  const filteredCinemas = useMemo(() => {
    const term = normalize(search);
    return sortedCinemas.filter(cinema => {
      const cinemaName = normalize(cinema.name);
      const cinemaCity = normalize(cinema.city);
      const combined = `${cinemaName} ${cinemaCity}`.trim();
      const cityPass =
        selectedCity === 'all' ||
        normalize(cinema.city) === normalize(selectedCity);
      const searchPass =
        !term ||
        cinemaName.includes(term) ||
        cinemaCity.includes(term) ||
        combined.includes(term);
      return cityPass && searchPass;
    });
  }, [sortedCinemas, search, selectedCity]);

  return (
    <Container maxWidth="lg" className={classes.page}>
      <div className={classes.hero}>
        <Typography className={classes.title} variant="h2">
          Cinemas Near You
        </Typography>
        <Typography className={classes.subtitle} variant="body1">
          Discover premium cinema destinations with comfortable seating, curated showtimes, and the full big-screen experience.
        </Typography>

        <div className={classes.filtersRow}>
          <TextField
            className={classes.filterField}
            variant="outlined"
            select
            label="Select cinema"
            value={search}
            onChange={event => setSearch(event.target.value)}
          >
            <MenuItem value="">All Cinemas</MenuItem>
            {listingCinemas.map(cinema => (
              <MenuItem key={cinema._id} value={cinema.name}>
                {cinema.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            className={classes.filterField}
            variant="outlined"
            select
            label="City"
            value={selectedCity}
            onChange={event => setSelectedCity(event.target.value)}
          >
            <MenuItem value="all">All Cities</MenuItem>
            {cityOptions
              .filter(city => city !== 'all')
              .map(city => (
                <MenuItem key={city} value={city}>
                  {city}
                </MenuItem>
              ))}
          </TextField>
        </div>
      </div>

      <Typography className={classes.sectionMeta} variant="body2">
        {filteredCinemas.length} cinema{filteredCinemas.length !== 1 ? 's' : ''} available
      </Typography>

      <Grid container spacing={2}>
        {filteredCinemas.length ? (
          filteredCinemas.map(cinema => (
            <Grid key={cinema._id} item xs={12} sm={6} md={4} style={{ position: 'relative' }}>
              {cinema.distance && cinema.distance !== Infinity && cinema.distance === Math.min(...filteredCinemas.map(c => c.distance)) && (
                <div style={{ position: 'absolute', top: 4, right: 16, zIndex: 10, background: '#b72429', color: '#fff', padding: '4px 12px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 600, boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                  📍 Nearest to you ({cinema.distance.toFixed(1)} km)
                </div>
              )}
              <CinemaCard cinema={cinema} linkToDetails minMoviePrice={minMoviePrice} />
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography className={classes.empty} variant="body1">
              No cinemas found for your current filters.
            </Typography>
          </Grid>
        )}
      </Grid>
    </Container>
  );
}

const mapStateToProps = ({ cinemaState, movieState }) => ({
  cinemas: cinemaState.cinemas,
  movies: movieState.movies,
});

const mapDispatchToProps = { getCinemas, getMovies };

export default connect(mapStateToProps, mapDispatchToProps)(CinemasPage);
