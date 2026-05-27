import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles, Typography } from '@material-ui/core';
import styles from './styles';
import { AddShowtime, ShowtimesToolbar, ShowtimesTable } from './components';
import {
  getShowtimes,
  getMovies,
  getCinemas,
  toggleDialog,
  selectShowtime,
  selectAllShowtimes,
  deleteShowtime
} from '../../../store/actions';
import { ResponsiveDialog } from '../../../components';

class ShowtimeList extends Component {
  state = {
    editShowtimeId: null,
  };

  static propTypes = {
    className: PropTypes.string,
    classes: PropTypes.object.isRequired
  };

  componentDidMount() {
    const {
      showtimes,
      movies,
      cinemas,
      getShowtimes,
      getMovies,
      getCinemas
    } = this.props;
    if (!showtimes.length) getShowtimes();
    getMovies(true);
    if (!cinemas.length) getCinemas();
  }

  handleDeleteShowtime = () => {
    const { selectedShowtimes, deleteShowtime } = this.props;
    selectedShowtimes.forEach(element => deleteShowtime(element));
  };

  openAddDialog = () => {
    this.setState({ editShowtimeId: null });
    this.props.toggleDialog();
  };

  openEditDialog = showtimeId => {
    const { selectedShowtimes, selectShowtime, toggleDialog } = this.props;
    if (!selectedShowtimes.includes(showtimeId)) {
      selectShowtime(showtimeId);
    }
    this.setState({ editShowtimeId: showtimeId });
    toggleDialog();
  };

  openSelectedEditDialog = () => {
    const { selectedShowtimes } = this.props;
    if (selectedShowtimes.length === 1) {
      this.openEditDialog(selectedShowtimes[0]);
    }
  };

  closeDialog = () => {
    this.setState({ editShowtimeId: null });
    this.props.toggleDialog();
  };

  render() {
    const {
      classes,
      showtimes,
      selectedShowtimes,
      openDialog,
      selectShowtime,
      selectAllShowtimes
    } = this.props;
        const { editShowtimeId } = this.state;

    return (
      <div className={classes.root}>
        <ShowtimesToolbar
          showtimes={showtimes}
          toggleDialog={this.openAddDialog}
          editSelectedShowtime={this.openSelectedEditDialog}
          selectedShowtimes={selectedShowtimes}
          deleteShowtime={this.handleDeleteShowtime}
        />
        <div className={classes.content}>
          {!showtimes.length ? (
            <Typography variant="h6">There are no showtimes</Typography>
          ) : (
            <ShowtimesTable
              onSelectShowtime={selectShowtime}
              onEditShowtime={this.openEditDialog}
              selectedShowtimes={selectedShowtimes}
              selectAllShowtimes={selectAllShowtimes}
              showtimes={showtimes}
            />
          )}
        </div>
        <ResponsiveDialog
          id="Add-showtime"
          open={openDialog}
          handleClose={this.closeDialog}>
          <AddShowtime
            selectedShowtime={showtimes.find(
              showtime => showtime._id === (editShowtimeId || selectedShowtimes[0])
            )}
          />
        </ResponsiveDialog>
      </div>
    );
  }
}

const mapStateToProps = ({ showtimeState, movieState, cinemaState }) => ({
  openDialog: showtimeState.openDialog,
  showtimes: showtimeState.showtimes,
  selectedShowtimes: showtimeState.selectedShowtimes,
  movies: movieState.movies,
  cinemas: cinemaState.cinemas
});

const mapDispatchToProps = {
  getShowtimes,
  getMovies,
  getCinemas,
  toggleDialog,
  selectShowtime,
  selectAllShowtimes,
  deleteShowtime
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(ShowtimeList));
