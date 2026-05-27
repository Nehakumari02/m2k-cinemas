import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles, Typography } from '@material-ui/core';
import { Button, TextField, MenuItem, ListSubheader } from '@material-ui/core';
import { groupCinemasByLocation } from '../../../../../utils/cinemaListing';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';

import styles from './styles';
import { addShowtime, updateShowtime, getShowtimes } from '../../../../../store/actions';

class AddShowtime extends Component {
  state = {
    startAt: '',
    startDate: null,
    endDate: null,
    movieId: '',
    cinemaId: ''
  };

  componentDidMount() {
    if (this.props.selectedShowtime) {
      const {
        startAt,
        startDate,
        endDate,
        movieId,
        cinemaId
      } = this.props.selectedShowtime;
      this.setState({
        startAt,
        startDate,
        endDate,
        movieId,
        cinemaId
      });
    }
  }

  handleChange = e => {
    this.setState({
      state: e.target.value
    });
  };

  handleFieldChange = (field, value) => {
    const newState = { ...this.state };
    newState[field] = value;
    this.setState(newState);
  };

  onAddShowtime = async () => {
    const { startAt, startDate, endDate, movieId, cinemaId } = this.state;
    if (!startAt || !startDate || !endDate || !movieId || !cinemaId) return;
    const showtime = { startAt, startDate, endDate, movieId, cinemaId };
    const result = await this.props.addShowtime(showtime);
    if (result && result.status === 'success') {
      this.props.getShowtimes();
    }
  };

  onUpdateShowtime = async () => {
    const { startAt, startDate, endDate, movieId, cinemaId } = this.state;
    if (!startAt || !startDate || !endDate || !movieId || !cinemaId) return;
    const showtime = { startAt, startDate, endDate, movieId, cinemaId };
    const result = await this.props.updateShowtime(showtime, this.props.selectedShowtime._id);
    if (result && result.status === 'success') {
      this.props.getShowtimes();
    }
  };

  onFilterMinDate = () => {
    const { movies } = this.props;
    const { movieId } = this.state;
    const selectedMovie = movies.find(movie => movie._id === movieId);
    if (selectedMovie) return new Date(selectedMovie.releaseDate);
    return new Date();
  };

  onFilterMaxDate = () => {
    const { movies } = this.props;
    const { movieId } = this.state;
    const selectedMovie = movies.find(movie => movie._id === movieId);
    if (selectedMovie) return new Date(selectedMovie.endDate);
    return false;
  };

  render() {
    const { nowShowing, movies, cinemas, classes, className } = this.props;
    const { startAt, startDate, endDate, movieId, cinemaId } = this.state;
    const movieOptions = movies;
    const cinemaGroups = groupCinemasByLocation(cinemas);

    const rootClassName = classNames(classes.root, className);
    const title = this.props.selectedShowtime
      ? 'Edit Showtime'
      : 'Add Showtime';
    const submitButton = this.props.selectedShowtime
      ? 'Update Showtime'
      : 'Save Details';
    const submitAction = this.props.selectedShowtime
      ? () => this.onUpdateShowtime()
      : () => this.onAddShowtime();

    return (
      <div className={rootClassName}>
        <Typography variant="h4" className={classes.title}>
          {title}
        </Typography>
        <form autoComplete="off" noValidate>
          <div className={classes.field}>
            <TextField
              fullWidth
              select
              className={classes.textField}
              helperText="Please specify the Time"
              label="Time"
              margin="dense"
              required
              value={startAt}
              variant="outlined"
              onChange={event =>
                this.handleFieldChange('startAt', event.target.value)
              }>
              {['18:00', '19:00', '20:00', '21:00', ' 22:00', '23:00'].map(
                time => (
                  <MenuItem key={`time-${time}`} value={time}>
                    {time}
                  </MenuItem>
                )
              )}
            </TextField>
          </div>
          <div className={classes.field}>
            <TextField
              fullWidth
              select
              className={classes.textField}
              label="Movie"
              margin="dense"
              required
              value={movieId}
              variant="outlined"
              onChange={event =>
                this.handleFieldChange('movieId', event.target.value)
              }>
              {movieOptions.map(movie => (
                <MenuItem key={movie._id} value={movie._id}>
                  {movie.title}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              select
              className={classes.textField}
              label="Cinema / Screen"
              margin="dense"
              required
              value={cinemaId}
              variant="outlined"
              helperText="All screens are listed — pick the auditorium for this showtime"
              onChange={event =>
                this.handleFieldChange('cinemaId', event.target.value)
              }>
              {cinemaGroups.map(group => [
                <ListSubheader key={`header-${group.label}`}>
                  {group.label}
                </ListSubheader>,
                ...group.cinemas.map(cinema => (
                  <MenuItem key={cinema._id} value={cinema._id}>
                    {cinema.name}
                  </MenuItem>
                )),
              ])}
            </TextField>
          </div>

          <div className={classes.field}>
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <KeyboardDatePicker
                className={classes.textField}
                inputVariant="outlined"
                margin="normal"
                id="start-date"
                label="Start Date"
                minDate={new Date()}
                maxDate={this.onFilterMaxDate()}
                value={startDate}
                onChange={date => this.handleFieldChange('startDate', date && (date._d || date))}
                KeyboardButtonProps={{
                  'aria-label': 'change date'
                }}
              />

              <KeyboardDatePicker
                className={classes.textField}
                inputVariant="outlined"
                margin="normal"
                id="end-date"
                label="End Date"
                minDate={new Date(startDate)}
                maxDate={this.onFilterMaxDate()}
                value={endDate}
                onChange={date => this.handleFieldChange('endDate', date && (date._d || date))}
                KeyboardButtonProps={{
                  'aria-label': 'change date'
                }}
              />
            </MuiPickersUtilsProvider>
          </div>
        </form>

        <Button
          className={classes.buttonFooter}
          color="primary"
          variant="contained"
          onClick={submitAction}>
          {submitButton}
        </Button>
      </div>
    );
  }
}

AddShowtime.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired
};

const mapStateToProps = ({ movieState, cinemaState }) => ({
  movies: movieState.movies,
  nowShowing: movieState.nowShowing,
  cinemas: cinemaState.cinemas
});

const mapDispatchToProps = { addShowtime, updateShowtime, getShowtimes };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(AddShowtime));
