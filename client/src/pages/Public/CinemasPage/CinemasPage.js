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
import { getCinemas } from '../../../store/actions';
import CinemaCard from '../components/CinemaCard/CinemaCard';

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
  const { cinemas, getCinemas } = props;
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
  }, [cinemas, getCinemas]);

  const cityOptions = useMemo(() => {
    const cities = (cinemas || [])
      .map(cinema => cinema.city)
      .filter(Boolean)
      .map(city => city.trim());
    return ['all', ...Array.from(new Set(cities)).sort((a, b) => a.localeCompare(b))];
  }, [cinemas]);

  const filteredCinemas = useMemo(() => {
    const term = normalize(search);
    return (cinemas || []).filter(cinema => {
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
  }, [cinemas, search, selectedCity]);

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
            label="Search cinema"
            value={search}
            onChange={event => setSearch(event.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search fontSize="small" style={{ color: '#64748b' }} />
                </InputAdornment>
              ),
            }}
          />
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
            <Grid key={cinema._id} item xs={12} sm={6} md={4}>
              <CinemaCard cinema={cinema} linkToDetails />
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

const mapStateToProps = ({ cinemaState }) => ({
  cinemas: cinemaState.cinemas
});

const mapDispatchToProps = { getCinemas };

export default connect(mapStateToProps, mapDispatchToProps)(CinemasPage);
