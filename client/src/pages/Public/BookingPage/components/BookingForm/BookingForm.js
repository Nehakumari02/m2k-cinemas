import React, { useEffect, useMemo, useState } from 'react';
import { Grid, Box, TextField, MenuItem, Typography, Chip, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(theme => ({
  formWrapper: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  bookingShell: {
    background: '#ffffff',
    border: '1px solid #d9e1ef',
    borderRadius: 14,
    overflow: 'hidden',
    boxShadow: '0 8px 22px rgba(15, 23, 42, 0.08)',
  },
  headerStrip: {
    background: 'linear-gradient(90deg, #0f2847 0%, #1f3f68 100%)',
    color: '#fff',
    padding: theme.spacing(1.5, 2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
  },
  headerTitle: {
    fontWeight: 700,
  },
  headerMeta: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: '0.78rem',
  },
  dateRow: {
    display: 'flex',
    gap: theme.spacing(1),
    flexWrap: 'wrap',
    marginBottom: theme.spacing(1.5),
    padding: theme.spacing(1.5, 2, 0),
  },
  dateChip: {
    borderColor: '#c7d3e9',
    color: '#1d3557',
    fontWeight: 700,
    borderRadius: 8,
    background: '#f8fbff',
  },
  activeDateChip: {
    backgroundColor: '#f0b429',
    color: '#1d2a44',
    borderColor: '#f0b429',
    boxShadow: '0 2px 8px rgba(240,180,41,0.4)',
  },
  body: {
    padding: theme.spacing(1.5, 2, 2),
  },
  filterCard: {
    border: '1px solid #dce6f6',
    borderRadius: 10,
    background: '#f8fbff',
    padding: theme.spacing(1.5),
    marginBottom: theme.spacing(1.5),
  },
  filterTitle: {
    color: '#1f3f68',
    fontWeight: 700,
    marginBottom: theme.spacing(1.2),
  },
  topFilterBar: {
    display: 'flex',
    gap: theme.spacing(1.5),
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  searchField: {
    flex: 1,
    minWidth: 220,
    '& .MuiOutlinedInput-root': {
      borderRadius: '10px',
      backgroundColor: '#fff',
    },
  },
  field: {
    minWidth: 180,
    maxWidth: 240,
    flex: '0 0 220px',
    '& .MuiOutlinedInput-root': {
      borderRadius: '10px',
      backgroundColor: '#fff',
      color: '#0f172a',
      '& fieldset': { borderColor: 'rgba(15,23,42,0.15)' },
      '&:hover fieldset': { borderColor: 'rgba(31,63,104,0.4)' },
      '&.Mui-focused fieldset': { borderColor: '#1f3f68' },
    },
    '& .MuiInputLabel-root': { color: '#64748b' },
    '& .MuiSelect-icon': { color: '#64748b' },
  },
  emptyMessage: {
    fontSize: '1.4rem',
    color: '#64748b',
    fontWeight: 600,
  },
  hint: {
    color: '#64748b',
    marginBottom: theme.spacing(1),
    fontWeight: 600,
  },
  legendRow: {
    display: 'flex',
    gap: theme.spacing(2),
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: theme.spacing(1.2),
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.7),
    color: '#475569',
    fontSize: '0.78rem',
    fontWeight: 600,
  },
  legendDot: {
    width: 9,
    height: 9,
    borderRadius: '50%',
    display: 'inline-block',
  },
  cinemaCard: {
    border: '1px solid #d6e1f2',
    borderRadius: 12,
    background: '#fff',
    padding: theme.spacing(2),
    marginBottom: theme.spacing(1.5),
  },
  cinemaHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  cinemaName: {
    fontWeight: 700,
    color: '#152d4d',
  },
  cinemaSubtitle: {
    color: '#64748b',
    fontWeight: 600,
  },
  slotTag: {
    color: '#64748b',
    fontWeight: 700,
    fontSize: '0.74rem',
    marginBottom: theme.spacing(0.8),
  },
  slotWrap: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
  },
  timeButton: {
    borderRadius: 8,
    borderColor: '#86d89a',
    color: '#136f2d',
    fontWeight: 700,
    minWidth: 96,
    background: '#f3fff5',
  },
  activeTimeButton: {
    borderColor: '#1f3f68',
    color: '#1f3f68',
    backgroundColor: 'rgba(31,63,104,0.1)',
  },
  noSlots: {
    color: '#94a3b8',
    fontWeight: 600,
  },
  resetButton: {
    color: '#334155',
    borderColor: '#cbd5e1',
    whiteSpace: 'nowrap',
    height: 40,
    flexShrink: 0,
  },
  [theme.breakpoints.down('sm')]: {
    topFilterBar: {
      flexDirection: 'column',
      alignItems: 'stretch',
    },
    searchField: {
      width: '100%',
      minWidth: '100%',
    },
    field: {
      width: '100%',
      minWidth: '100%',
      maxWidth: '100%',
      flex: '1 1 auto',
    },
    resetButton: {
      width: '100%',
    },
    timeButton: {
      minWidth: 84,
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
    },
  },
}));

const toDateKey = date => {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, '0');
  const d = `${date.getDate()}`.padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export default function BookingForm(props) {
  const classes = useStyles();
  const [search, setSearch] = useState('');
  const {
    cinemas,
    showtimes,
    selectedCinema,
    onChangeCinema,
    selectedDate,
    onChangeDate,
    selectedTime,
    onChangeTime,
    onProceedToSeats
  } = props;

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
    return Array.from(dateSet).sort().slice(0, 7);
  }, [showtimes]);

  useEffect(() => {
    if (!dateOptions.length || selectedDate) return;
    onChangeDate(new Date(dateOptions[0]));
  }, [dateOptions, selectedDate, onChangeDate]);

  const selectedDateKey = selectedDate ? toDateKey(new Date(selectedDate)) : '';

  const cinemasWithSlots = useMemo(() => {
    const targetDate = selectedDateKey ? new Date(selectedDateKey) : null;
    if (targetDate) targetDate.setHours(0, 0, 0, 0);

    return (cinemas || [])
      .filter(cinema =>
        search.trim()
          ? cinema.name.toLowerCase().includes(search.trim().toLowerCase())
          : true
      )
      .map(cinema => {
        const slots = (showtimes || [])
          .filter(showtime => {
            if (showtime.cinemaId !== cinema._id || !targetDate) return false;
            const start = new Date(showtime.startDate);
            const end = new Date(showtime.endDate);
            start.setHours(0, 0, 0, 0);
            end.setHours(0, 0, 0, 0);
            return targetDate >= start && targetDate <= end;
          })
          .map(showtime => showtime.startAt);

        const uniqueSorted = Array.from(new Set(slots)).sort(
          (a, b) => new Date(`1970-01-01T${a}`) - new Date(`1970-01-01T${b}`)
        );
        return { cinema, slots: uniqueSorted };
      });
  }, [cinemas, search, selectedDateKey, showtimes]);

  if (!cinemas.length)
    return (
      <Box
        display="flex"
        width={1}
        height={1}
        alignItems="center"
        justifyContent="center">
        <Typography align="center" variant="h2" className={classes.emptyMessage}>
          No Cinema Available.
        </Typography>
      </Box>
    );

  return (
    <div className={classes.formWrapper}>
      <div className={classes.bookingShell}>
        <div className={classes.headerStrip}>
          <Typography variant="subtitle1" className={classes.headerTitle}>
            Select Showtime
          </Typography>
          <Typography className={classes.headerMeta}>
            Choose date, cinema and showtime
          </Typography>
        </div>

        <div className={classes.dateRow}>
          {dateOptions.map(date => {
            const label = new Date(date).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              weekday: 'short'
            });
            const active = selectedDateKey === date;
            return (
              <Chip
                key={date}
                label={label}
                clickable
                variant="outlined"
                className={`${classes.dateChip} ${active ? classes.activeDateChip : ''}`}
                onClick={() => onChangeDate(new Date(date))}
              />
            );
          })}
        </div>

        <div className={classes.body}>
          <div className={classes.filterCard}>
            <Typography variant="body2" className={classes.filterTitle}>
              Filters
            </Typography>
            <div className={classes.topFilterBar}>
              <TextField
                variant="outlined"
                placeholder="Search for cinema"
                value={search}
                onChange={event => setSearch(event.target.value)}
                className={classes.searchField}
              />
              <TextField
                select
                value={selectedCinema || ''}
                label="Select Cinema"
                variant="outlined"
                onChange={onChangeCinema}
                className={classes.field}
              >
                <MenuItem value="">All Cinemas</MenuItem>
                {cinemas.map(cinema => (
                  <MenuItem key={cinema._id} value={cinema._id}>
                    {cinema.name}
                  </MenuItem>
                ))}
              </TextField>
              <Button
                variant="outlined"
                className={classes.resetButton}
                onClick={() => {
                  setSearch('');
                  onChangeCinema({ target: { value: '' } });
                  onChangeTime({ target: { value: '' } });
                }}
              >
                Reset
              </Button>
            </div>
          </div>

          <Typography variant="body2" className={classes.hint}>
            Select a showtime to continue booking seats.
          </Typography>

          <div className={classes.legendRow}>
            <div className={classes.legendItem}>
              <span className={classes.legendDot} style={{ background: '#16a34a' }} />
              Available
            </div>
            <div className={classes.legendItem}>
              <span className={classes.legendDot} style={{ background: '#f59e0b' }} />
              Filling Fast
            </div>
            <div className={classes.legendItem}>
              <span className={classes.legendDot} style={{ background: '#ef4444' }} />
              Sold Out
            </div>
          </div>

          <Grid container spacing={1}>
            {cinemasWithSlots
              .filter(item => (selectedCinema ? item.cinema._id === selectedCinema : true))
              .map(item => (
                <Grid item xs={12} key={item.cinema._id}>
                  <div className={classes.cinemaCard}>
                    <div className={classes.cinemaHeader}>
                      <Typography variant="h6" className={classes.cinemaName}>
                        {item.cinema.name}
                      </Typography>
                      <Typography variant="caption" className={classes.cinemaSubtitle}>
                        {item.cinema.city || 'City N/A'}
                      </Typography>
                    </div>
                    {item.slots.length ? (
                      <>
                        <Typography className={classes.slotTag}>Digital 2D</Typography>
                        <div className={classes.slotWrap}>
                          {item.slots.map(time => {
                            const active =
                              selectedCinema === item.cinema._id && selectedTime === time;
                            return (
                              <Button
                                key={`${item.cinema._id}-${time}`}
                                variant="outlined"
                                size="small"
                                className={`${classes.timeButton} ${active ? classes.activeTimeButton : ''}`}
                                onClick={() => {
                                  onChangeCinema({ target: { value: item.cinema._id } });
                                  onChangeTime({ target: { value: time } });
                                  if (onProceedToSeats) {
                                    onProceedToSeats(item.cinema._id, time);
                                  }
                                }}
                              >
                                {time}
                              </Button>
                            );
                          })}
                        </div>
                      </>
                    ) : (
                      <Typography variant="body2" className={classes.noSlots}>
                        No shows available for selected date.
                      </Typography>
                    )}
                  </div>
                </Grid>
              ))}
          </Grid>
        </div>
      </div>
    </div>
  );
}
