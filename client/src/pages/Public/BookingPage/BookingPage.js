import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles, Grid, Container, Typography } from '@material-ui/core';
import {
  getMovie,
  getCinemasUserModeling,
  getCinema,
  getCinemas,
  getShowtimes,
  getReservations,
  getSuggestedReservationSeats,
  setSelectedSeats,
  setSelectedCinema,
  setSelectedDate,
  setSelectedTime,
  setInvitation,
  toggleLoginPopup,
  showInvitationForm,
  resetCheckout,
  setAlert,
  addReservation,
  setSuggestedSeats,
  setQRCode
} from '../../../store/actions';
import { ResponsiveDialog } from '../../../components';
import LoginForm from '../Login/components/LoginForm';
import styles from './styles';
import MovieInfo from './components/MovieInfo/MovieInfo';
import BookingForm from './components/BookingForm/BookingForm';
import BookingSeats from './components/BookingSeats/BookingSeats';
import BookingCheckout from './components/BookingCheckout/BookingCheckout';
import BookingInvitation from './components/BookingInvitation/BookingInvitation';

import jsPDF from 'jspdf';

class BookingPage extends Component {
  didSetSuggestion = false;
  isValidObjectId = value => /^[a-f\d]{24}$/i.test(String(value || ''));
  state = {
    paymentMethod: '',
    paymentDetails: {
      cardNumber: '',
      nameOnCard: '',
      expiry: '',
      cvv: '',
      upiId: '',
      bankName: '',
      accountHolder: ''
    }
  };

  componentDidMount() {
    const {
      user,
      match,
      getMovie,
      getCinemas,
      getCinemasUserModeling,
      getShowtimes,
      getReservations,
      getSuggestedReservationSeats
    } = this.props;
    getMovie(match.params.id);
    user ? getCinemasUserModeling(user.username) : getCinemas();
    getShowtimes();
    getReservations();
    if (user) getSuggestedReservationSeats(user.username);
  }

  componentDidUpdate(prevProps) {
    const {
      selectedCinema,
      selectedDate,
      getCinema,
      location,
      setSelectedCinema,
      setSelectedTime
    } = this.props;
    const hasValidCinemaId = this.isValidObjectId(selectedCinema);
    const wasSeatsStep = prevProps.location.pathname.endsWith('/seats');
    const isSeatsStep = location.pathname.endsWith('/seats');

    // When user returns from seats to listing, clear sticky cinema/time filters
    // so all available cinemas are visible again by default.
    if (wasSeatsStep && !isSeatsStep) {
      setSelectedCinema('');
      setSelectedTime('');
      return;
    }

    if (
      hasValidCinemaId &&
      ((prevProps.selectedCinema !== selectedCinema) ||
        (prevProps.selectedDate !== selectedDate))
    ) {
      getCinema(selectedCinema);
    }
  }

  loadRazorpayScript = () =>
    new Promise(resolve => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  launchPayment = async amount => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      this.props.setAlert('Please login again to continue payment', 'error', 5000);
      return false;
    }

    const sdkLoaded = await this.loadRazorpayScript();
    if (!sdkLoaded) {
      this.props.setAlert('Unable to load payment SDK', 'error', 5000);
      return false;
    }

    const configResponse = await fetch('/payments/config', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const configData = await configResponse.json();
    if (!configResponse.ok || !configData.keyId) {
      this.props.setAlert(
        configData.error || 'Payment gateway is not configured',
        'error',
        5000
      );
      return false;
    }

    const orderResponse = await fetch('/payments/create-order', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ amount })
    });
    const orderData = await orderResponse.json();
    if (!orderResponse.ok || !orderData.order) {
      this.props.setAlert(
        orderData.error || 'Unable to create payment order',
        'error',
        5000
      );
      return false;
    }

    return new Promise(resolve => {
      const options = {
        key: configData.keyId,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: 'Cinema Plus',
        description: 'Movie ticket payment',
        order_id: orderData.order.id,
        handler: async response => {
          const verifyResponse = await fetch('/payments/verify', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(response)
          });
          const verifyData = await verifyResponse.json();
          if (!verifyResponse.ok || !verifyData.verified) {
            this.props.setAlert(
              verifyData.error || 'Payment verification failed',
              'error',
              5000
            );
            return resolve(false);
          }
          this.props.setAlert('Payment successful', 'success', 3000);
          return resolve(true);
        },
        prefill: {
          name: this.props.user && this.props.user.name ? this.props.user.name : '',
          contact: this.props.user && this.props.user.phone ? this.props.user.phone : ''
        },
        theme: {
          color: '#3f51b5'
        },
        modal: {
          ondismiss: () => resolve(false)
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    });
  };

  // JSpdf Generator For generating the PDF
  jsPdfGenerator = () => {
    const { movie, cinema, selectedDate, selectedTime, QRCode } = this.props;
    const doc = new jsPDF();
    doc.setFont('helvetica');
    doc.setFontType('bold');
    doc.setFontSize(22);
    doc.text(movie.title, 20, 20);
    doc.setFontSize(16);
    doc.text(cinema.name, 20, 30);
    doc.text(
      `Date: ${new Date(
        selectedDate
      ).toLocaleDateString()} - Time: ${selectedTime}`,
      20,
      40
    );
    doc.addImage(QRCode, 'JPEG', 15, 40, 160, 160);
    doc.save(`${movie.title}-${cinema.name}.pdf`);
  };

  onSelectSeat = (row, seat) => {
    const { cinema, setSelectedSeats } = this.props;
    const seats = [...cinema.seats];
    const newSeats = [...seats];
    if (seats[row][seat] === 1) {
      newSeats[row][seat] = 1;
    } else if (seats[row][seat] === 2) {
      newSeats[row][seat] = 0;
    } else if (seats[row][seat] === 3) {
      newSeats[row][seat] = 2;
    } else {
      newSeats[row][seat] = 2;
    }
    setSelectedSeats([row, seat]);
  };

  async checkout() {
    const {
      movie,
      cinema,
      selectedSeats,
      selectedDate,
      selectedTime,
      getReservations,
      isAuth,
      user,
      addReservation,
      toggleLoginPopup,
      showInvitationForm,
      setQRCode
    } = this.props;
    const { paymentMethod, paymentDetails } = this.state;

    if (selectedSeats.length === 0) return;
    if (!isAuth) return toggleLoginPopup();
    if (!paymentMethod)
      return this.props.setAlert('Please select a payment method', 'error', 5000);

    if (paymentMethod === 'card') {
      const cleanCardNumber = paymentDetails.cardNumber.replace(/\s+/g, '');
      const isValidCardNumber = /^\d{16}$/.test(cleanCardNumber);
      const isValidName = paymentDetails.nameOnCard.trim().length >= 3;
      const isValidExpiry = /^(0[1-9]|1[0-2])\/\d{2}$/.test(
        paymentDetails.expiry.trim()
      );
      const isValidCvv = /^\d{3,4}$/.test(paymentDetails.cvv.trim());
      if (
        !isValidCardNumber ||
        !isValidName ||
        !isValidExpiry ||
        !isValidCvv
      ) {
        return this.props.setAlert(
          'Invalid card details. Enter valid card number, name, expiry (MM/YY), and CVV.',
          'error',
          5000
        );
      }
    }
    if (paymentMethod === 'upi') {
      const isValidUpi = /^[a-zA-Z0-9.\-_]{2,}@[a-zA-Z]{2,}$/.test(
        paymentDetails.upiId.trim()
      );
      if (!isValidUpi) {
        return this.props.setAlert('Invalid UPI ID format', 'error', 5000);
      }
    }
    if (paymentMethod === 'netbanking') {
      const isValidBankName = paymentDetails.bankName.trim().length >= 2;
      const isValidAccountHolder = paymentDetails.accountHolder.trim().length >= 3;
      if (!isValidBankName || !isValidAccountHolder) {
        return this.props.setAlert(
          'Invalid net banking details. Check bank and account holder name.',
          'error',
          5000
        );
      }
    }

    const totalAmount = selectedSeats.length * cinema.ticketPrice;
    const paymentSuccess = await this.launchPayment(totalAmount);
    if (!paymentSuccess) return;

    const response = await addReservation({
      date: selectedDate,
      startAt: selectedTime,
      seats: this.bookSeats(),
      ticketPrice: cinema.ticketPrice,
      total: selectedSeats.length * cinema.ticketPrice,
      movieId: movie._id,
      cinemaId: cinema._id,
      username: user.username,
      phone: user.phone
    });
    if (response.status === 'success') {
      const { data } = response;
      setQRCode(data.QRCode);
      getReservations();
      showInvitationForm();
    }
  }

  onChangePaymentMethod = event =>
    this.setState({ paymentMethod: event.target.value });

  onPaymentFieldChange = event => {
    const { name, value } = event.target;
    this.setState(prevState => ({
      paymentDetails: {
        ...prevState.paymentDetails,
        [name]: value
      }
    }));
  };

  bookSeats() {
    const { cinema, selectedSeats } = this.props;
    const seats = [...cinema.seats];

    if (selectedSeats.length === 0) return;

    const bookedSeats = seats
      .map(row =>
        row.map((seat, i) => (seat === 2 ? i : -1)).filter(seat => seat !== -1)
      )
      .map((seats, i) => (seats.length ? seats.map(seat => [i, seat]) : -1))
      .filter(seat => seat !== -1)
      .reduce((a, b) => a.concat(b));

    return bookedSeats;
  }

  onFilterCinema() {
    const { cinemas, showtimes, selectedCinema, selectedTime } = this.props;
    const initialReturn = { uniqueCinemas: [], uniqueTimes: [] };
    if (!showtimes || !cinemas) return initialReturn;

    const uniqueCinemasId = showtimes
      .filter(showtime =>
        selectedTime ? showtime.startAt === selectedTime : true
      )
      .map(showtime => showtime.cinemaId)
      .filter((value, index, self) => self.indexOf(value) === index);

    const uniqueCinemas = cinemas.filter(cinema =>
      uniqueCinemasId.includes(cinema._id)
    );

    const uniqueTimes = showtimes
      .filter(showtime =>
        selectedCinema ? selectedCinema === showtime.cinemaId : true
      )
      .map(showtime => showtime.startAt)
      .filter((value, index, self) => self.indexOf(value) === index)
      .sort(
        (a, b) => new Date('1970/01/01 ' + a) - new Date('1970/01/01 ' + b)
      );

    return { ...initialReturn, uniqueCinemas, uniqueTimes };
  }

  onGetReservedSeats = () => {
    const { reservations, cinema, selectedDate, selectedTime } = this.props;

    if (!cinema) return [];
    const newSeats = [...cinema.seats];

    const filteredReservations = reservations.filter(
      reservation =>
        new Date(reservation.date).toLocaleDateString() ===
          new Date(selectedDate).toLocaleDateString() &&
        reservation.startAt === selectedTime
    );
    if (filteredReservations.length && selectedDate && selectedTime) {
      const reservedSeats = filteredReservations
        .map(reservation => reservation.seats)
        .reduce((a, b) => a.concat(b));
      reservedSeats.forEach(([row, seat]) => (newSeats[row][seat] = 1));
      return newSeats;
    }
    return newSeats;
  };

  onGetSuggestedSeats = (seats, suggestedSeats) => {
    const { numberOfTickets, positions } = suggestedSeats;

    const positionsArray = Object.keys(positions).map(key => {
      return [String(key), positions[key]];
    });

    positionsArray.sort((a, b) => {
      return b[1] - a[1];
    });

    if (positionsArray.every(position => position[1] === 0)) return;

    const step = Math.round(seats.length / 3);
    let indexArr = [];
    let suggested;
    for (let position of positionsArray) {
      switch (position[0]) {
        case 'front':
          indexArr = [0, step];
          suggested = this.checkSeats(indexArr, seats, numberOfTickets);
          break;
        case 'center':
          indexArr = [step, step * 2];
          suggested = this.checkSeats(indexArr, seats, numberOfTickets);
          break;
        case 'back':
          indexArr = [step * 2, step * 3];
          suggested = this.checkSeats(indexArr, seats, numberOfTickets);
          break;
        default:
          break;
      }
      if (suggested) this.getSeat(suggested, seats, numberOfTickets);
      break;
    }
  };

  checkSeats = (indexArr, seats, numberOfTickets) => {
    for (let i = indexArr[0]; i < indexArr[1]; i++) {
      for (let seat in seats[i]) {
        let seatNum = Number(seat);

        if (
          !seats[i][seatNum] &&
          seatNum + (numberOfTickets - 1) <= seats[i].length
        ) {
          let statusAvailability = [];
          for (let y = 1; y < numberOfTickets; y++) {
            //check the next seat if available
            if (!seats[i][seatNum + y]) {
              statusAvailability.push(true);
            } else {
              statusAvailability.push(false);
            }
          }
          if (statusAvailability.every(Boolean)) return [i, seatNum];
        }
      }
    }
    return null;
  };

  getSeat = (suggested, seats, numberOfTickets) => {
    const { setSuggestedSeats } = this.props;
    for (let i = suggested[1]; i < suggested[1] + numberOfTickets; i++) {
      const seat = [suggested[0], i];
      setSuggestedSeats(seat);
    }
  };

  onChangeCinema = event => this.props.setSelectedCinema(event.target.value);
  onChangeDate = date => this.props.setSelectedDate(date);
  onChangeTime = event => this.props.setSelectedTime(event.target.value);
  onProceedToSeats = (cinemaId, time) => {
    const { match, history, selectedDate, setSelectedCinema, setSelectedTime } = this.props;
    if (!this.isValidObjectId(cinemaId) || !time || !selectedDate) return;
    if (cinemaId) setSelectedCinema(cinemaId);
    if (time) setSelectedTime(time);
    history.push(`/movie/booking/${match.params.id}/seats`);
  };

  sendInvitations = async () => {
    const invitations = this.createInvitations();
    if (!invitations) return;
    try {
      const token = localStorage.getItem('jwtToken');
      const url = '/invitations';
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(invitations)
      });
      if (response.ok) {
        this.props.resetCheckout();
        this.props.setAlert('invitations Send', 'success', 5000);
        return { status: 'success', message: 'invitations Send' };
      }
    } catch (error) {
      this.props.setAlert(error.message, 'error', 5000);
      return {
        status: 'error',
        message: ' invitations have not send, try again.'
      };
    }
  };

  createInvitations = () => {
    const {
      user,
      movie,
      cinema,
      selectedDate,
      selectedTime,
      invitations
    } = this.props;

    const invArray = Object.keys(invitations)
      .map(key => ({
        to: invitations[key],
        host: user.name,
        movie: movie.title,
        time: selectedTime,
        date: new Date(selectedDate).toDateString(),
        cinema: cinema.name,
        image: cinema.image,
        seat: key
      }))
      .filter(inv => inv.to !== '');
    return invArray;
  };

  setSuggestionSeats = (seats, suggestedSeats) => {
    suggestedSeats.forEach(suggestedSeat => {
      seats[suggestedSeat[0]][suggestedSeat[1]] = 3;
    });
    return seats;
  };

  render() {
    const {
      classes,
      user,
      movie,
      cinema,
      showtimes,
      selectedSeats,
      selectedCinema,
      selectedDate,
      selectedTime,
      showLoginPopup,
      toggleLoginPopup,
      showInvitation,
      invitations,
      setInvitation,
      resetCheckout,
      suggestedSeats,
      suggestedSeat,
      match,
      location
    } = this.props;
    const isSeatsStep = location.pathname.endsWith('/seats');
    const { paymentMethod, paymentDetails } = this.state;
    const normalizeImage = value => {
      if (!value) return '';
      if (value.startsWith('http://') || value.startsWith('https://')) {
        return encodeURI(value);
      }
      return encodeURI(value.startsWith('/') ? value : `/${value}`);
    };
    const castCrew = Array.isArray(movie && movie.castCrew) ? movie.castCrew : [];
    const castMembers = castCrew.filter(
      member => String(member.role || '').toLowerCase() === 'cast'
    );
    const crewMembers = castCrew.filter(
      member => String(member.role || '').toLowerCase() !== 'cast'
    );
    const backdropImages = Array.isArray(movie && movie.backdropImages)
      ? movie.backdropImages
      : [];
    const { uniqueCinemas, uniqueTimes } = this.onFilterCinema();
    let seats = this.onGetReservedSeats();
    if (suggestedSeats && selectedTime && !suggestedSeat.length) {
      this.onGetSuggestedSeats(seats, suggestedSeats);
    }
    if (suggestedSeat.length && !this.didSetSuggestion) {
      seats = this.setSuggestionSeats(seats, suggestedSeat);
      this.didSetSuggestion = true;
    }

    return (
      <Container maxWidth="xl" className={classes.container}>
        <Grid container spacing={2} style={{ height: '100%' }}>
          <MovieInfo movie={movie} />
          <Grid item lg={9} xs={12} md={12}>
            {!isSeatsStep && (
              <BookingForm
                cinemas={uniqueCinemas}
                times={uniqueTimes}
                showtimes={showtimes}
                selectedCinema={selectedCinema}
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                onChangeCinema={this.onChangeCinema}
                onChangeDate={this.onChangeDate}
                onChangeTime={this.onChangeTime}
                onProceedToSeats={this.onProceedToSeats}
              />
            )}

            {!isSeatsStep &&
              (selectedCinema || selectedDate || selectedTime) &&
              (castMembers.length || crewMembers.length || backdropImages.length) && (
              <div className={classes.mediaSection}>
                {!!castMembers.length && (
                  <div className={classes.peopleBlock}>
                    <Typography variant="h5" className={classes.sectionTitle}>
                      Cast
                    </Typography>
                    <div className={classes.peopleScroller}>
                      {castMembers.map((member, index) => {
                        const memberImage = member.image
                          ? normalizeImage(member.image)
                          : 'https://source.unsplash.com/featured/?portrait';
                        return (
                          <div
                            key={`${member.name || 'cast'}-${index}`}
                            className={classes.personCard}>
                            <img
                              src={memberImage}
                              alt={member.name || 'Cast'}
                              className={classes.personImage}
                            />
                            <Typography variant="body2" className={classes.personName}>
                              {member.name || 'Unknown'}
                            </Typography>
                            <Typography variant="caption" className={classes.personRole}>
                              Cast
                            </Typography>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {!!crewMembers.length && (
                  <div className={classes.peopleBlock}>
                    <Typography variant="h5" className={classes.sectionTitle}>
                      Crew
                    </Typography>
                    <div className={classes.peopleScroller}>
                      {crewMembers.map((member, index) => {
                        const memberImage = member.image
                          ? normalizeImage(member.image)
                          : 'https://source.unsplash.com/featured/?portrait';
                        return (
                          <div
                            key={`${member.role || 'crew'}-${member.name || 'crew'}-${index}`}
                            className={classes.personCard}>
                            <img
                              src={memberImage}
                              alt={member.name || 'Crew'}
                              className={classes.personImage}
                            />
                            <Typography variant="body2" className={classes.personName}>
                              {member.name || 'Unknown'}
                            </Typography>
                            <Typography variant="caption" className={classes.personRole}>
                              {member.role || 'Crew'}
                            </Typography>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {!!backdropImages.length && (
                  <div className={classes.backdropBlock}>
                    <Typography variant="h5" className={classes.sectionTitle}>
                      Movie Stills
                    </Typography>
                    <Grid container spacing={2}>
                      {backdropImages.map((image, index) => (
                        <Grid item xs={12} sm={6} md={4} key={`${image}-${index}`}>
                          <div className={classes.backdropCard}>
                            <img
                              src={normalizeImage(image)}
                              alt={`Backdrop ${index + 1}`}
                              className={classes.backdropImage}
                            />
                          </div>
                        </Grid>
                      ))}
                    </Grid>
                  </div>
                )}
              </div>
            )}
            {showInvitation && !!selectedSeats.length && (
              <BookingInvitation
                selectedSeats={selectedSeats}
                sendInvitations={this.sendInvitations}
                ignore={resetCheckout}
                invitations={invitations}
                onSetInvitation={setInvitation}
                onDownloadPDF={this.jsPdfGenerator}
              />
            )}

            {isSeatsStep && cinema && selectedCinema && selectedTime && !showInvitation && (
              <>
                <BookingSeats
                  seats={seats}
                  onSelectSeat={(indexRow, index) =>
                    this.onSelectSeat(indexRow, index)
                  }
                />
                <BookingCheckout
                  user={user}
                  ticketPrice={cinema.ticketPrice}
                  seatsAvailable={cinema.seatsAvailable}
                  selectedSeats={selectedSeats.length}
                  paymentMethod={paymentMethod}
                  paymentDetails={paymentDetails}
                  onChangePaymentMethod={this.onChangePaymentMethod}
                  onPaymentFieldChange={this.onPaymentFieldChange}
                  onBookSeats={() => this.checkout()}
                />
              </>
            )}
          </Grid>
        </Grid>
        <ResponsiveDialog
          id="Edit-cinema"
          open={showLoginPopup}
          handleClose={() => toggleLoginPopup()}
          maxWidth="sm">
          <LoginForm />
        </ResponsiveDialog>
      </Container>
    );
  }
}

BookingPage.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

const mapStateToProps = (
  {
    authState,
    movieState,
    cinemaState,
    showtimeState,
    reservationState,
    checkoutState
  },
  ownProps
) => ({
  isAuth: authState.isAuthenticated,
  user: authState.user,
  movie: movieState.selectedMovie,
  cinema: cinemaState.selectedCinema,
  cinemas: cinemaState.cinemas,
  showtimes: showtimeState.showtimes.filter(
    showtime => showtime.movieId === ownProps.match.params.id
  ),
  reservations: reservationState.reservations,
  selectedSeats: checkoutState.selectedSeats,
  suggestedSeat: checkoutState.suggestedSeat,
  selectedCinema: checkoutState.selectedCinema,
  selectedDate: checkoutState.selectedDate,
  selectedTime: checkoutState.selectedTime,
  showLoginPopup: checkoutState.showLoginPopup,
  showInvitation: checkoutState.showInvitation,
  invitations: checkoutState.invitations,
  QRCode: checkoutState.QRCode,
  suggestedSeats: reservationState.suggestedSeats
});

const mapDispatchToProps = {
  getMovie,
  getCinema,
  getCinemasUserModeling,
  getCinemas,
  getShowtimes,
  getReservations,
  getSuggestedReservationSeats,
  addReservation,
  setSelectedSeats,
  setSuggestedSeats,
  setSelectedCinema,
  setSelectedDate,
  setSelectedTime,
  setInvitation,
  toggleLoginPopup,
  showInvitationForm,
  resetCheckout,
  setAlert,
  setQRCode
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(BookingPage));
