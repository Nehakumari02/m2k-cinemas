import React, { useEffect, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Container, Grid, Typography, Button, Chip, Box } from '@material-ui/core';
import { getCinema, getShowtimes, getMovies } from '../../../store/actions';
import { normalizeImage } from '../../../utils/imageUrl';

const useStyles = makeStyles(theme => ({
  page: {
    paddingTop: theme.spacing(10),
    paddingBottom: theme.spacing(6),
    color: '#0f172a',
  },
  hero: {
    borderRadius: 16,
    overflow: 'hidden',
    minHeight: 360,
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(4),
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    marginBottom: theme.spacing(4),
    position: 'relative',
    border: '1px solid rgba(15,23,42,0.08)',
  },
  heroImage: {
    position: 'absolute',
    inset: 0,
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
    transform: 'scale(1.01)',
  },
  heroBackdrop: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(90deg, rgba(2,6,23,.85) 18%, rgba(2,6,23,.52) 60%, rgba(2,6,23,.3) 100%)',
  },
  heroOverlay: {
    position: 'relative',
    zIndex: 2,
    width: '62%',
  },
  title: {
    fontWeight: 800,
    marginBottom: theme.spacing(1),
    color: '#ffffff',
    textShadow: '0 8px 26px rgba(0,0,0,0.45)',
  },
  subtitle: {
    color: '#e2e8f0',
    textShadow: '0 6px 18px rgba(0,0,0,0.35)',
  },
  chip: {
    marginRight: theme.spacing(1),
    marginTop: theme.spacing(1),
    color: '#fff',
    backgroundColor: 'rgba(15,23,42,0.58)',
    border: '1px solid rgba(255,255,255,0.2)',
  },
  ctaRow: {
    marginTop: theme.spacing(2.5),
    display: 'flex',
    gap: theme.spacing(1.5),
  },
  sectionTitle: { marginTop: theme.spacing(3), marginBottom: theme.spacing(2), fontWeight: 700 },
  movieCard: {
    background: '#ffffff',
    borderRadius: 12,
    border: '1px solid rgba(15,23,42,0.1)',
    padding: theme.spacing(2.2),
    height: '100%',
  },
  movieTitle: { fontWeight: 700, marginBottom: theme.spacing(0.7) },
  meta: { color: '#64748b', marginBottom: theme.spacing(1.2) },
  showtimeRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(1.5),
  },
  timeChip: {
    borderColor: 'rgba(15,23,42,0.2)',
    color: '#334155',
  },
  dateRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
  dateChip: {
    borderColor: 'rgba(15,23,42,0.2)',
    color: '#334155',
  },
  dateChipActive: {
    backgroundColor: '#b72429',
    color: '#fff',
    borderColor: '#b72429',
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
    hero: { minHeight: 300, padding: theme.spacing(2.5) },
    heroOverlay: { width: '100%' },
    title: { fontSize: '2rem' },
  },
}));

function CinemaDetailPage({ match, cinema, movies, showtimes, getCinema, getShowtimes, getMovies }) {
  const classes = useStyles();
  const cinemaId = match.params.id;
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    getCinema(cinemaId);
    getShowtimes();
    getMovies();
  }, [cinemaId, getCinema, getShowtimes, getMovies]);

  const cinemaShowtimes = (showtimes || []).filter(st => st.cinemaId === cinemaId);
  const availableDates = useMemo(() => {
    const datesSet = new Set();
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const maxDays = 14;

    cinemaShowtimes.forEach(showtime => {
      const start = new Date(showtime.startDate);
      const end = new Date(showtime.endDate);
      const cursor = new Date(start);
      cursor.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);
      while (cursor <= end) {
        if (cursor >= today) {
          datesSet.add(cursor.toISOString().slice(0, 10));
        }
        cursor.setDate(cursor.getDate() + 1);
      }
    });

    return Array.from(datesSet).sort().slice(0, maxDays);
  }, [cinemaShowtimes]);

  useEffect(() => {
    if (!availableDates.length) return;
    if (!selectedDate || !availableDates.includes(selectedDate)) {
      setSelectedDate(availableDates[0]);
    }
  }, [availableDates, selectedDate]);

  const showtimesForSelectedDate = cinemaShowtimes.filter(st => {
    if (!selectedDate) return true;
    const date = new Date(selectedDate);
    const start = new Date(st.startDate);
    const end = new Date(st.endDate);
    date.setHours(0, 0, 0, 0);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    return date >= start && date <= end;
  });

  const movieIds = showtimesForSelectedDate.map(st => st.movieId);
  const cinemaMovies = (movies || []).filter(m => movieIds.includes(m._id));
  const uniqueMovies = cinemaMovies.filter(
    (movie, index, self) => self.findIndex(m => m._id === movie._id) === index
  );

  const image = cinema && cinema.image ? cinema.image : 'https://source.unsplash.com/featured/?cinema';

  if (!cinema) {
    return (
      <Container className={classes.page}>
        <Typography variant="h5">Loading cinema details...</Typography>
      </Container>
    );
  }

  return (
    <Container className={classes.page} maxWidth="lg">
      <div className={classes.hero}>
        <div className={classes.heroImage} style={{ backgroundImage: `url("${normalizeImage(image)}")` }} />
        <div className={classes.heroBackdrop} />
        <div className={classes.heroOverlay}>
          <Typography variant="h3" className={classes.title}>{cinema.name}</Typography>
          <Typography variant="body1" className={classes.subtitle}>{cinema.city}</Typography>
          <Box mt={1}>
            <Chip className={classes.chip} label={`Ticket Price: ${cinema.ticketPrice} EUR`} />
            <Chip className={classes.chip} label={`Seats: ${cinema.seatsAvailable}`} />
          </Box>
          <div className={classes.ctaRow}>
            <Button
              component={Link}
              to="/cinemas"
              variant="outlined"
              size="small"
              style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.5)', backgroundColor: 'rgba(15,23,42,0.24)' }}
            >
              All Cinemas
            </Button>
          </div>
        </div>
      </div>

      <Typography variant="h5" className={classes.sectionTitle}>Now Showing In This Cinema</Typography>
      {!!availableDates.length && (
        <div className={classes.dateRow}>
          {availableDates.map(date => {
            const formatted = new Date(date).toLocaleDateString('en-IN', {
              weekday: 'short',
              day: 'numeric',
              month: 'short'
            });
            const active = selectedDate === date;
            return (
              <Chip
                key={date}
                label={formatted}
                clickable
                onClick={() => setSelectedDate(date)}
                variant="outlined"
                className={`${classes.dateChip} ${active ? classes.dateChipActive : ''}`}
              />
            );
          })}
        </div>
      )}
      <Grid container spacing={2}>
        {uniqueMovies.length ? (
          uniqueMovies.map(movie => (
            <Grid item xs={12} sm={6} md={4} key={movie._id}>
              <div className={classes.movieCard}>
                <Typography className={classes.movieTitle} variant="h6">{movie.title}</Typography>
                <Typography className={classes.meta} variant="body2">
                  {movie.language} • {movie.duration} min
                </Typography>
                <div className={classes.showtimeRow}>
                  {showtimesForSelectedDate
                    .filter(st => st.movieId === movie._id)
                    .map(st => st.startAt)
                    .filter((time, idx, self) => self.indexOf(time) === idx)
                    .sort((a, b) => new Date(`1970/01/01 ${a}`) - new Date(`1970/01/01 ${b}`))
                    .map(time => (
                      <Chip key={`${movie._id}-${time}`} label={time} variant="outlined" className={classes.timeChip} size="small" />
                    ))}
                </div>
                <Button
                  component={Link}
                  to={`/movie/booking/${movie._id}`}
                  variant="contained"
                  size="small"
                  className={classes.bookButton}
                >
                  Book Tickets
                </Button>
              </div>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography variant="body1" className={classes.meta}>
              No showtimes configured yet for this cinema.
            </Typography>
          </Grid>
        )}
      </Grid>
    </Container>
  );
}

const mapStateToProps = ({ cinemaState, movieState, showtimeState }) => ({
  cinema: cinemaState.selectedCinema,
  movies: movieState.movies,
  showtimes: showtimeState.showtimes,
});

const mapDispatchToProps = {
  getCinema,
  getShowtimes,
  getMovies,
};

export default connect(mapStateToProps, mapDispatchToProps)(CinemaDetailPage);
