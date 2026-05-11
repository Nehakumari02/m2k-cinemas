import React, { useEffect, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Container, Grid, Typography, Chip, MenuItem, TextField, Button } from '@material-ui/core';
import { getMovies, getCinemas, getShowtimes } from '../../../store/actions';
import { normalizeImage } from '../../../utils/imageUrl';
import { ContentWarningModal } from '../../../components';

const useStyles = makeStyles(theme => ({
  page: {
    paddingTop: theme.spacing(12),
    paddingBottom: theme.spacing(6),
    color: '#0f172a',
  },
  header: {
    marginBottom: theme.spacing(2),
  },
  title: {
    fontWeight: 800,
    marginBottom: theme.spacing(0.5),
  },
  subtitle: {
    color: '#64748b',
  },
  filterRow: {
    marginTop: theme.spacing(2.5),
    marginBottom: theme.spacing(2),
    display: 'flex',
    gap: theme.spacing(1.5),
    flexWrap: 'wrap',
  },
  field: {
    minWidth: 220,
    '& .MuiOutlinedInput-root': {
      borderRadius: 10,
      color: '#0f172a',
      backgroundColor: '#ffffff',
      '& fieldset': { borderColor: 'rgba(15,23,42,0.15)' },
      '&:hover fieldset': { borderColor: 'rgba(183,36,41,0.5)' },
      '&.Mui-focused fieldset': { borderColor: '#b72429' },
    },
    '& .MuiInputLabel-root': { color: '#64748b' },
    '& .MuiSelect-icon': { color: '#64748b' },
  },
  chipsRow: {
    display: 'flex',
    gap: theme.spacing(1),
    flexWrap: 'wrap',
    marginBottom: theme.spacing(3),
  },
  dateChip: {
    borderColor: 'rgba(15,23,42,0.2)',
    color: '#334155',
  },
  activeDateChip: {
    backgroundColor: '#b72429 !important',
    borderColor: '#b72429 !important',
    color: '#fff !important',
    '& .MuiChip-label': {
      color: '#fff !important',
    },
  },
  card: {
    display: 'flex',
    background: '#ffffff',
    borderRadius: 14,
    border: '1px solid rgba(15,23,42,0.1)',
    overflow: 'hidden',
    height: '100%',
  },
  poster: {
    width: 120,
    minWidth: 120,
    backgroundColor: '#f1f5f9',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  cardBody: {
    padding: theme.spacing(2),
    width: '100%',
  },
  movieTitle: {
    fontWeight: 700,
    marginBottom: theme.spacing(0.4),
  },
  meta: {
    color: '#64748b',
    marginBottom: theme.spacing(1),
  },
  cinemaName: {
    fontWeight: 600,
    color: '#1e293b',
    marginBottom: theme.spacing(1),
  },
  timingsRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(1.3),
  },
  timeChip: {
    borderColor: 'rgba(15,23,42,0.2)',
    color: '#334155',
    fontWeight: 600,
  },
  empty: {
    color: '#64748b',
  },
  bookButton: {
    backgroundColor: '#b72429',
    color: '#fff',
    fontWeight: 700,
    '&:hover': {
      backgroundColor: '#8b1c20',
    },
  },
  [theme.breakpoints.down('sm')]: {
    field: { minWidth: '100%' },
    card: { flexDirection: 'column' },
    poster: { width: '100%', minWidth: '100%', height: 170 },
  },
}));

const toDateKey = date => {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, '0');
  const d = `${date.getDate()}`.padStart(2, '0');
  return `${y}-${m}-${d}`;
};


function ShowtimingsPage({
  movies,
  cinemas,
  showtimes,
  getMovies,
  getCinemas,
  getShowtimes,
}) {
  const classes = useStyles();
  const history = useHistory();
  const [selectedDate, setSelectedDate] = useState('');
  const [warningMovie, setWarningMovie] = useState(null);

  const onBookTickets = (movie) => {
    if (movie.contentWarning) {
      setWarningMovie(movie);
    } else {
      history.push(`/movie/booking/${movie._id}`);
    }
  };

  const handleContinue = () => {
    const id = warningMovie._id;
    setWarningMovie(null);
    history.push(`/movie/booking/${id}`);
  };
  const [selectedMovie, setSelectedMovie] = useState('all');
  const [selectedCinema, setSelectedCinema] = useState('all');

  useEffect(() => {
    getMovies();
    getCinemas();
    getShowtimes();
  }, [getMovies, getCinemas, getShowtimes]);

  const dateOptions = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dateSet = new Set();
    (showtimes || []).forEach(showtime => {
      const start = new Date(showtime.startDate);
      const end = new Date(showtime.endDate);
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);
      const cursor = new Date(start);
      while (cursor <= end) {
        if (cursor >= today) dateSet.add(toDateKey(cursor));
        cursor.setDate(cursor.getDate() + 1);
      }
    });
    const dates = Array.from(dateSet).sort().slice(0, 10);
    if (!dates.length) {
      dates.push(toDateKey(today));
    }
    return dates;
  }, [showtimes]);

  useEffect(() => {
    if (!dateOptions.length) return;
    if (!selectedDate || !dateOptions.includes(selectedDate)) {
      setSelectedDate(dateOptions[0]);
    }
  }, [dateOptions, selectedDate]);

  const groupedShowtimes = useMemo(() => {
    if (!selectedDate) return [];
    const targetDate = new Date(selectedDate);
    targetDate.setHours(0, 0, 0, 0);

    const active = (showtimes || []).filter(showtime => {
      const start = new Date(showtime.startDate);
      const end = new Date(showtime.endDate);
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);
      const activeInDate = targetDate >= start && targetDate <= end;
      const moviePass = selectedMovie === 'all' || showtime.movieId === selectedMovie;
      const cinemaPass = selectedCinema === 'all' || showtime.cinemaId === selectedCinema;
      return activeInDate && moviePass && cinemaPass;
    });

    const map = new Map();
    active.forEach(showtime => {
      const key = `${showtime.movieId}__${showtime.cinemaId}`;
      if (!map.has(key)) {
        const movie = (movies || []).find(item => item._id === showtime.movieId);
        const cinema = (cinemas || []).find(item => item._id === showtime.cinemaId);
        if (!movie || !cinema) return;
        map.set(key, {
          key,
          movie,
          cinema,
          times: [],
        });
      }
      const group = map.get(key);
      group.times.push(showtime.startAt);
    });

    return Array.from(map.values())
      .map(group => ({
        ...group,
        times: Array.from(new Set(group.times)).sort(
          (a, b) => new Date(`1970-01-01T${a}`) - new Date(`1970-01-01T${b}`)
        ),
      }))
      .sort((a, b) => a.movie.title.localeCompare(b.movie.title));
  }, [showtimes, selectedDate, selectedMovie, selectedCinema, movies, cinemas]);

  return (
    <Container className={classes.page} maxWidth="lg">
      <div className={classes.header}>
        <Typography variant="h3" className={classes.title}>
          Showtimings
        </Typography>
        <Typography variant="body1" className={classes.subtitle}>
          Choose date, movie, and cinema to book your preferred show like PVR listings.
        </Typography>
      </div>

      <div className={classes.chipsRow}>
        {dateOptions.map(date => {
          const label = new Date(date).toLocaleDateString('en-IN', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
          });
          const active = date === selectedDate;
          return (
            <Chip
              key={date}
              label={label}
              clickable
              variant={active ? 'default' : 'outlined'}
              onClick={() => setSelectedDate(date)}
              className={`${classes.dateChip} ${active ? classes.activeDateChip : ''}`}
            />
          );
        })}
      </div>

      <div className={classes.filterRow}>
        <TextField
          select
          label="Movie"
          value={selectedMovie}
          variant="outlined"
          className={classes.field}
          onChange={event => setSelectedMovie(event.target.value)}
        >
          <MenuItem value="all">All Movies</MenuItem>
          {(movies || []).map(movie => (
            <MenuItem key={movie._id} value={movie._id}>
              {movie.title}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Cinema"
          value={selectedCinema}
          variant="outlined"
          className={classes.field}
          onChange={event => setSelectedCinema(event.target.value)}
        >
          <MenuItem value="all">All Cinemas</MenuItem>
          {(cinemas || []).map(cinema => (
            <MenuItem key={cinema._id} value={cinema._id}>
              {cinema.name}
            </MenuItem>
          ))}
        </TextField>
      </div>

      <Grid container spacing={2}>
        {groupedShowtimes.length ? (
          groupedShowtimes.map(item => (
            <Grid item xs={12} md={6} key={item.key}>
              <div className={classes.card}>
                <div
                  className={classes.poster}
                  style={{ backgroundImage: `url("${normalizeImage(item.movie.image)}")` }}
                />
                <div className={classes.cardBody}>
                  <Typography variant="h6" className={classes.movieTitle}>
                    {item.movie.title}
                  </Typography>
                  <Typography variant="body2" className={classes.meta}>
                    {(item.movie.language || 'Language N/A')} • {item.movie.duration || '--'} min
                  </Typography>
                  <Typography variant="body2" className={classes.cinemaName}>
                    {item.cinema.name}, {item.cinema.city}
                  </Typography>
                  <div className={classes.timingsRow}>
                    {item.times.map(time => (
                      <Chip
                        key={`${item.key}-${time}`}
                        label={time}
                        variant="outlined"
                        size="small"
                        className={classes.timeChip}
                      />
                    ))}
                  </div>
                  <Button
                    size="small"
                    variant="contained"
                    className={classes.bookButton}
                    onClick={() => onBookTickets(item.movie)}
                  >
                    Book Tickets
                  </Button>
                </div>
              </div>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography variant="body1" className={classes.empty}>
              No showtimings found for selected filters.
            </Typography>
          </Grid>
        )}
      </Grid>
      <ContentWarningModal
        open={!!warningMovie}
        handleClose={() => setWarningMovie(null)}
        handleContinue={handleContinue}
        movie={warningMovie}
      />
    </Container>
  );
}

const mapStateToProps = ({ movieState, cinemaState, showtimeState }) => ({
  movies: movieState.movies,
  cinemas: cinemaState.cinemas,
  showtimes: showtimeState.showtimes,
});

const mapDispatchToProps = {
  getMovies,
  getCinemas,
  getShowtimes,
};

export default connect(mapStateToProps, mapDispatchToProps)(ShowtimingsPage);
