import React from 'react';
import { Grid, Box, TextField, MenuItem, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';

const useStyles = makeStyles(theme => ({
  formWrapper: {
    padding: theme.spacing(2, 0),
  },
  field: {
    '& .MuiOutlinedInput-root': {
      borderRadius: '10px',
      backgroundColor: 'rgba(255,255,255,0.05)',
      color: '#fff',
      '& fieldset': { borderColor: 'rgba(255,255,255,0.12)' },
      '&:hover fieldset': { borderColor: 'rgba(183,36,41,0.4)' },
      '&.Mui-focused fieldset': { borderColor: '#b72429' },
    },
    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' },
    '& .MuiSelect-icon': { color: 'rgba(255,255,255,0.5)' },
    '& .MuiIconButton-root': { color: 'rgba(255,255,255,0.5)' },
  },
  emptyMessage: {
    fontSize: '1.4rem',
    color: 'rgba(255,255,255,0.5)',
    fontWeight: 600,
  }
}));

export default function BookingForm(props) {
  const classes = useStyles();
  const {
    cinemas,
    showtimes,
    selectedCinema,
    onChangeCinema,
    selectedDate,
    onChangeDate,
    times,
    selectedTime,
    onChangeTime
  } = props;

  const showtime = showtimes.find(
    showtime => showtime.cinemaId === selectedCinema
  );

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
      <Grid container spacing={3}>
        <Grid item xs>
          <TextField
            fullWidth
            select
            value={selectedCinema}
            label="Select Cinema"
            variant="outlined"
            onChange={onChangeCinema}
            className={classes.field}>
            {cinemas.map(cinema => (
              <MenuItem key={cinema._id} value={cinema._id}>
                {cinema.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        {showtime && (
          <Grid item xs>
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <KeyboardDatePicker
                inputVariant="outlined"
                margin="none"
                fullWidth
                id="start-date"
                label="Select Date"
                minDate={new Date(showtime.startDate)}
                maxDate={new Date(showtime.endDate)}
                value={selectedDate}
                onChange={date => onChangeDate(date._d)}
                className={classes.field}
                KeyboardButtonProps={{
                  'aria-label': 'change date'
                }}
              />
            </MuiPickersUtilsProvider>
          </Grid>
        )}
        {selectedDate && (
          <Grid item xs>
            <TextField
              fullWidth
              select
              value={selectedTime}
              label="Select Time"
              variant="outlined"
              onChange={onChangeTime}
              className={classes.field}>
              {times.map((time, index) => (
                <MenuItem key={time + '-' + index} value={time}>
                  {time}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        )}
      </Grid>
    </div>
  );
}
