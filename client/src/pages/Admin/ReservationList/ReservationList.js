import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles, CircularProgress } from '@material-ui/core';
import styles from './styles';
import { ReservationsToolbar, ReservationsTable } from './components';
import { getReservations, getMovies, getCinemas } from '../../../store/actions';
import ReservationsCalendar from './components/ReservationsCalendar/ReservationsCalendar';
import { match } from '../../../utils';

class ReservationList extends Component {
  state = { mode: 'list', search: '', loading: true };

  static propTypes = {
    className: PropTypes.string,
    classes: PropTypes.object.isRequired
  };

  async componentDidMount() {
    const {
      reservations,
      movies,
      cinemas,
      getReservations,
      getMovies,
      getCinemas
    } = this.props;

    if (!reservations.length) await getReservations();
    await getMovies(true);
    if (!cinemas.length) await getCinemas();
    this.setState({ loading: false });
  }

  onChangeMode = () =>
    this.setState(({ mode }) => ({ mode: mode === 'grid' ? 'list' : 'grid' }));

  onChangeSearch = e => this.setState({ search: e.target.value });

  render() {
    const { mode, search, loading } = this.state;
    const { classes, reservations, movies, cinemas } = this.props;

    const filteredReservations = match(search, reservations, 'phone');

    return (
      <div className={classes.root}>
        <ReservationsToolbar
          reservations={filteredReservations}
          search={search}
          onChangeSearch={this.onChangeSearch}
          mode={mode}
          onChangeMode={this.onChangeMode}
        />
        <div className={classes.content}>
          {loading ? (
            <div className={classes.progressWrapper}>
              <CircularProgress />
            </div>
          ) : !filteredReservations.length ? (
            <div>No reservations found.</div>
          ) : mode === 'list' ? (
            <ReservationsTable
              reservations={filteredReservations}
              movies={movies}
              cinemas={cinemas}
            />
          ) : (
            <ReservationsCalendar
              reservations={filteredReservations}
              movies={movies}
              cinemas={cinemas}
            />
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ reservationState, movieState, cinemaState }) => ({
  reservations: reservationState.reservations,
  movies: movieState.movies,
  cinemas: cinemaState.cinemas
});

const mapDispatchToProps = {
  getReservations,
  getMovies,
  getCinemas
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(ReservationList));
