import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  withStyles,
  Grid,
  Container,
  Typography,
  Button,
  Paper,
  Chip,
  Box
} from '@material-ui/core';
import { Rating } from '@material-ui/lab';
import { Star as StarIcon } from '@material-ui/icons';
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
  setQRCode,
  getWalletData,
  getOffers,
  confirmReservation,
  cancelPendingReservation,
  setPendingReservation
} from '../../../store/actions';
import { normalizeImage } from '../../../utils/imageUrl';
import { ResponsiveDialog } from '../../../components';
import LoginForm from '../Login/components/LoginForm';
import styles from './styles';
import MovieInfo from './components/MovieInfo/MovieInfo';
import BookingForm from './components/BookingForm/BookingForm';
import BookingSeats from './components/BookingSeats/BookingSeats';
import BookingCheckout from './components/BookingCheckout/BookingCheckout';
import BookingInvitation from './components/BookingInvitation/BookingInvitation';
import BookingFood from './components/BookingFood/BookingFood';

import jsPDF from 'jspdf';

class BookingPage extends Component {
  didSetSuggestion = false;
  isValidObjectId = value => /^[a-f\d]{24}$/i.test(String(value || ''));
  state = {
    showFoodStep: false,
    reviews: [],
    loadingReviews: true,
    paymentMethod: '',
    paymentDetails: {
      cardNumber: '',
      nameOnCard: '',
      expiry: '',
      cvv: '',
      upiId: '',
      bankName: '',
      accountHolder: ''
    },
    pointsUsed: 0,
    appliedCoupon: null,
    discountPercentage: 0,
    timeLeft: 420 // 7 minutes
  };
  timer = null;

  componentDidMount() {
    const {
      user,
      match,
      getMovie,
      getCinemas,
      getCinemasUserModeling,
      getShowtimes,
      getReservations,
      getSuggestedReservationSeats,
      getWalletData
    } = this.props;
    getMovie(match.params.id);
    this.fetchReviews(match.params.id);
    user ? getCinemasUserModeling(user.username) : getCinemas();
    getShowtimes();
    getReservations();
    this.props.getOffers();
    if (user) {
      getSuggestedReservationSeats(user.username);
      getWalletData();
    }
  }

  fetchReviews = async movieId => {
    try {
      const response = await fetch(`/movies/${movieId}/reviews`);
      if (response.ok) {
        const data = await response.json();
        this.setState({ reviews: data || [], loadingReviews: false });
      } else {
        this.setState({ reviews: [], loadingReviews: false });
      }
    } catch (e) {
      this.setState({ reviews: [], loadingReviews: false });
    }
  };

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
    const prevMovieId = prevProps.movie && prevProps.movie._id;
    const movieId = this.props.movie && this.props.movie._id;
    const warningText = this.props.movie && this.props.movie.contentWarning;

    const wasDetailStep =
      prevProps.location.pathname.endsWith('/seats') ||
      prevProps.location.pathname.endsWith('/payment');
    const isDetailStep =
      location.pathname.endsWith('/seats') ||
      location.pathname.endsWith('/payment');

    // When user returns from seats to listing, clear sticky cinema/time filters
    // so all available cinemas are visible again by default.
    if (wasDetailStep && !isDetailStep) {
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

  componentWillUnmount() {
    this.stopTimer();
    const { pendingReservationId, cancelPendingReservation, resetCheckout } = this.props;
    if (pendingReservationId) {
      cancelPendingReservation(pendingReservationId);
      resetCheckout();
    }
  }

  startTimer = () => {
    this.stopTimer();
    this.setState({ timeLeft: 420 });
    this.timer = setInterval(() => {
      this.setState(prevState => {
        if (prevState.timeLeft <= 1) {
          this.stopTimer();
          this.props.setAlert('Session expired. Seats have been released.', 'warning', 5000);
          this.props.cancelPendingReservation(this.props.pendingReservationId);
          this.props.resetCheckout();
          this.setState({ showFoodStep: false });
          return { timeLeft: 0 };
        }
        return { timeLeft: prevState.timeLeft - 1 };
      });
    }, 1000);
  };

  stopTimer = () => {
    if (this.timer) clearInterval(this.timer);
  };

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
        name: 'M2k Cinemas',
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
    const { movie, cinema, selectedDate, selectedTime, QRCode, selectedFood } = this.props;
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

    let currentY = 50;
    const foodItems = Object.values(selectedFood || {});
    if (foodItems.length > 0) {
      doc.setFontSize(14);
      doc.text('Add-ons:', 20, currentY);
      currentY += 8;
      doc.setFontType('normal');
      doc.setFontSize(12);
      foodItems.forEach(item => {
        doc.text(`${item.name} x ${item.quantity} - ₹${item.price * item.quantity}`, 25, currentY);
        currentY += 7;
      });
      currentY += 5;
    }

    doc.setFontType('bold');
    const ticketsTotal = this.props.selectedSeats.length * cinema.ticketPrice;
    const foodTotal = foodItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    doc.text(`Total Paid: ₹${ticketsTotal + foodTotal}`, 20, currentY);

    doc.addImage(QRCode, 'JPEG', 15, currentY + 10, 140, 140);
    doc.save(`${movie.title}-${cinema.name}.pdf`);
  };

  onSelectSeat = (row, seat) => {
    const { cinema, setSelectedSeats } = this.props;
    const seats = [...cinema.seats];
    const val = seats[row][seat];

    if (val === 1) {
      // Reserved — do nothing
    } else if (val === 2) {
      // De-select normal seat
      seats[row][seat] = 0;
    } else if (val === 6) {
      // De-select special seat — restore to 5
      seats[row][seat] = 5;
    } else if (val === 3) {
      // Suggested seat → select
      seats[row][seat] = 2;
    } else if (val === 5) {
      // Special seat → selected special (value 6)
      seats[row][seat] = 6;
    } else {
      // Normal available seat → select
      seats[row][seat] = 2;
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
      setQRCode,
      pendingReservationId,
      confirmReservation
    } = this.props;
    const { paymentMethod, paymentDetails, pointsUsed } = this.state;

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

    const ticketsAmount = selectedSeats.reduce((acc, [row, col]) => {
      const seatVal = Number(cinema.seats[row][col]);
      // 6 = selected special seat, 5 = special seat (unselected)
      const isSpecial = seatVal === 6 || seatVal === 5;
      const price = isSpecial && cinema.specialPrice && Number(cinema.specialPrice) !== 0
        ? Number(cinema.specialPrice)
        : Number(cinema.ticketPrice);
      return acc + price;
    }, 0);
    const foodItems = Object.values(this.props.selectedFood || {}).map(item => ({
      foodId: item._id,
      name: item.name,
      price: item.price,
      quantity: item.quantity
    }));
    const foodAmount = foodItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const subTotal = ticketsAmount + foodAmount;

    // Apply coupon discount
    const discountValue = Math.floor((subTotal * this.state.discountPercentage) / 100);
    const afterDiscountTotal = subTotal - discountValue;

    // Apply points discount
    const finalAmount = Math.max(0, afterDiscountTotal - pointsUsed);

    let paymentSuccess = false;
    if (finalAmount === 0) {
      paymentSuccess = true;
    } else if (paymentMethod === 'wallet') {
      if (this.props.walletBalance < finalAmount) {
        return this.props.setAlert('Insufficient wallet balance', 'error', 5000);
      }
      try {
        const token = localStorage.getItem('jwtToken');
        const payResponse = await fetch('/wallet/pay', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            amount: finalAmount,
            description: `Booking for ${movie.title} at ${cinema.name}`
          })
        });
        const payData = await payResponse.json();
        if (payResponse.ok) {
          paymentSuccess = true;
          this.props.getWalletData(); // Refresh balance
        } else {
          return this.props.setAlert(payData.error || 'Wallet payment failed', 'error', 5000);
        }
      } catch (e) {
        return this.props.setAlert('Server error during wallet payment', 'error', 5000);
      }
    } else {
      paymentSuccess = await this.launchPayment(finalAmount);
    }

    const response = pendingReservationId 
      ? await this.props.confirmReservation(pendingReservationId, {
          total: afterDiscountTotal,
          pointsUsed: pointsUsed,
          foodItems
        })
      : await addReservation({
          date: selectedDate,
          startAt: selectedTime,
          seats: this.bookSeats(),
          ticketPrice: cinema.ticketPrice,
          total: afterDiscountTotal,
          pointsUsed: pointsUsed,
          foodItems,
          movieId: movie._id,
          cinemaId: cinema._id,
          username: user.username,
          phone: user.phone
        });

    if (response.status === 'success') {
      this.stopTimer();
      const { data } = response;
      setQRCode(data.QRCode || (data.reservation && data.reservation.QRCode));
      getReservations();
      showInvitationForm();
    }
  }

  onToggleFoodStep = async () => {
    const { 
      showFoodStep
    } = this.state;
    const { 
      selectedSeats, 
      isAuth, 
      toggleLoginPopup, 
      addReservation,
      selectedDate,
      selectedTime,
      cinema,
      movie,
      user,
      setPendingReservation,
      pendingReservationId,
      cancelPendingReservation
    } = this.props;

    const isPaymentStep = this.props.location.pathname.endsWith('/payment');

    if (!showFoodStep && !isPaymentStep) {
      // Moving TO payment step
      if (selectedSeats.length === 0) return;
      if (!isAuth) return toggleLoginPopup();

      const res = await addReservation({
        date: selectedDate,
        startAt: selectedTime,
        seats: this.bookSeats(),
        ticketPrice: Number(cinema.ticketPrice || 0),
        total: Number(selectedSeats.length * (cinema.ticketPrice || 0)),
        foodItems: [],
        movieId: movie._id,
        cinemaId: cinema._id,
        username: user.username,
        phone: user.phone,
        status: 'Pending'
      });

      if (res.status === 'success') {
        setPendingReservation(res.data.reservation._id, res.data.reservation.expiresAt);
        this.startTimer();
        this.setState({ showFoodStep: true });
        this.props.history.push(`/movie/booking/${this.props.match.params.id}/payment`);
      }
    } else {
      // Moving BACK to seats
      if (pendingReservationId) {
        cancelPendingReservation(pendingReservationId);
        setPendingReservation(null, null);
      }
      this.stopTimer();
      this.setState({ showFoodStep: false });
      this.props.history.push(`/movie/booking/${this.props.match.params.id}/seats`);
    }
  };

  onChangePaymentMethod = event =>
    this.setState({ paymentMethod: event.target.value });

  onPaymentFieldChange = event => {
    const { name, value } = event.target;
    this.setState({
      paymentDetails: {
        ...this.state.paymentDetails,
        [name]: value
      }
    });
  };

  onChangePointsUsed = event => {
    const val = parseInt(event.target.value, 10);
    this.setState({ pointsUsed: isNaN(val) ? 0 : val });
  };

  onApplyCoupon = (code, percentage) => {
    this.setState({ appliedCoupon: code, discountPercentage: percentage });
    this.props.setAlert(`Coupon applied! You get ${percentage}% off.`, 'success', 5000);
  };

  onRemoveCoupon = () => {
    this.setState({ appliedCoupon: null, discountPercentage: 0 });
    this.props.setAlert('Coupon removed.', 'info', 5000);
  };

  bookSeats() {
    const { cinema, selectedSeats } = this.props;
    if (!cinema || selectedSeats.length === 0) return [];
    const seats = [...cinema.seats];

    const bookedSeats = seats
      .map((row, rowIndex) =>
        row
          .map((seat, i) => (seat === 2 || seat === 6 ? i : -1))
          .filter(seat => seat !== -1)
          .map(seatIndex => [rowIndex, seatIndex])
      )
      .reduce((a, b) => a.concat(b), []);

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
    const { reservations, cinema, selectedDate, selectedTime, pendingReservationId } = this.props;

    if (!cinema) return [];
    const newSeats = JSON.parse(JSON.stringify(cinema.seats));

    const filteredReservations = reservations.filter(
      reservation =>
        new Date(reservation.date).toLocaleDateString() ===
        new Date(selectedDate).toLocaleDateString() &&
        reservation.startAt === selectedTime &&
        reservation._id !== pendingReservationId // Don't mark current user's pending seats as reserved for them
    );
    if (filteredReservations.length && selectedDate && selectedTime) {
      const reservedSeats = filteredReservations
        .map(reservation => reservation.seats)
        .reduce((a, b) => a.concat(b), []);
      reservedSeats.forEach(([row, seat]) => {
        if (newSeats[row] && newSeats[row][seat] !== undefined) {
          newSeats[row][seat] = 1;
        }
      });
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
      location,
    } = this.props;
    const isSeatsStep = location.pathname.endsWith('/seats');
    const isPaymentStep = location.pathname.endsWith('/payment');
    const {
      paymentMethod,
      paymentDetails,
      reviews,
      loadingReviews,
      contentWarningOpen
    } = this.state;
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
        <div className={classes.pageHeader}>
          <div>
            <Typography variant="overline" className={classes.pageEyebrow}>
              M-TICKET BOOKING
            </Typography>
            <Typography variant="h4" className={classes.pageTitle}>
              {movie && movie.title ? movie.title : 'Book Movie Tickets'}
            </Typography>
            <Typography variant="body2" className={classes.pageSubtitle}>
              {isSeatsStep
                ? 'Choose your preferred seats.'
                : isPaymentStep
                ? 'Add food combos and complete payment.'
                : 'Select your preferred cinema and showtime.'}
            </Typography>
          </div>
          <div className={classes.stepPills}>
            <span
              className={`${classes.stepPill} ${
                !isSeatsStep && !isPaymentStep ? classes.stepPillActive : ''
              }`}>
              1. Showtime
            </span>
            <span
              className={`${classes.stepPill} ${
                isSeatsStep ? classes.stepPillActive : ''
              }`}>
              2. Seats
            </span>
            <span
              className={`${classes.stepPill} ${
                isPaymentStep ? classes.stepPillActive : ''
              }`}>
              3. Food & Pay
            </span>
          </div>
        </div>
        <Grid container spacing={2} style={{ height: '100%' }}>
          <MovieInfo movie={movie} />
          <Grid item lg={9} xs={12} md={12}>
            {!isSeatsStep && !isPaymentStep && (
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
              !isPaymentStep &&
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
            {!isSeatsStep && !isPaymentStep && (
              <div className={classes.mediaSection}>
                <Typography variant="h5" className={classes.sectionTitle}>
                  User Reviews ({reviews.length})
                </Typography>
                {loadingReviews ? (
                  <Typography variant="body2" style={{ color: '#64748b' }}>
                    Loading reviews...
                  </Typography>
                ) : reviews.length ? (
                  reviews
                    .sort((a, b) => (b.isHighlighted ? 1 : 0) - (a.isHighlighted ? 1 : 0))
                    .slice(0, 6)
                    .map((rev, idx) => (
                      <Paper
                        key={`${rev._id || idx}`}
                        elevation={0}
                        style={{
                          padding: '18px',
                          borderRadius: 12,
                          border: rev.isHighlighted
                            ? '2px solid #fbbf24'
                            : '1px solid #e2e8f0',
                          marginBottom: 12,
                          background: rev.isHighlighted ? '#fffef0' : '#fff'
                        }}>
                        {rev.isHighlighted && (
                          <Chip
                            size="small"
                            icon={<StarIcon style={{ color: '#fff', fontSize: '0.8rem' }} />}
                            label="Featured"
                            style={{
                              marginBottom: 8,
                              background: '#fbbf24',
                              color: '#fff',
                              fontWeight: 800
                            }}
                          />
                        )}
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography variant="subtitle2" style={{ fontWeight: 700 }}>
                            {rev.userName || 'User'}
                          </Typography>
                          <Rating value={Number(rev.rating) || 0} readOnly size="small" />
                        </Box>
                        <Typography
                          variant="caption"
                          style={{ color: '#94a3b8', display: 'block', marginBottom: 8 }}>
                          {rev.createdAt
                            ? new Date(rev.createdAt).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })
                            : ''}
                        </Typography>
                        <Typography variant="body2" style={{ color: '#475569', lineHeight: 1.6 }}>
                          {rev.comment}
                        </Typography>
                      </Paper>
                    ))
                ) : (
                  <Typography variant="body2" style={{ color: '#64748b' }}>
                    No reviews yet.
                  </Typography>
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
                <div className={classes.proceedBar}>
                  <Button
                    className={classes.proceedButton}
                    disabled={!selectedSeats.length}
                    onClick={this.onToggleFoodStep}>
                    Continue to Food & Payment
                  </Button>
                </div>
              </>
            )}

            {isPaymentStep && cinema && selectedCinema && selectedTime && !showInvitation && (
              <>
                <BookingFood />
                <BookingCheckout
                  user={user}
                  ticketPrice={cinema.ticketPrice}
                  seatsAvailable={cinema.seatsAvailable}
                  selectedSeats={selectedSeats.length}
                  selectedFood={this.props.selectedFood}
                  paymentMethod={paymentMethod}
                  paymentDetails={paymentDetails}
                  showFoodStep
                  onToggleFoodStep={this.onToggleFoodStep}
                  onChangePaymentMethod={this.onChangePaymentMethod}
                  onPaymentFieldChange={this.onPaymentFieldChange}
                  onBookSeats={() => this.checkout()}
                  walletBalance={this.props.walletBalance}
                  loyaltyPoints={this.props.loyaltyPoints}
                  pointsUsed={this.state.pointsUsed}
                  onChangePointsUsed={this.onChangePointsUsed}
                  appliedCoupon={this.state.appliedCoupon}
                  discountPercentage={this.state.discountPercentage}
                  onApplyCoupon={this.onApplyCoupon}
                  onRemoveCoupon={this.onRemoveCoupon}
                  offers={this.props.offers}
                  timeLeft={this.state.timeLeft}
                  totalTicketsPrice={selectedSeats.reduce((acc, [row, col]) => {
                    const seatVal = Number(cinema.seats[row][col]);
                    const isSpecial = seatVal === 6 || seatVal === 5;
                    return acc + (isSpecial && cinema.specialPrice && Number(cinema.specialPrice) !== 0 ? Number(cinema.specialPrice) : Number(cinema.ticketPrice));
                  }, 0)}
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
    checkoutState,
    walletState,
    offerState
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
  selectedFood: checkoutState.selectedFood,
  pendingReservationId: checkoutState.pendingReservationId,
  reservationExpiresAt: checkoutState.reservationExpiresAt,
  suggestedSeats: reservationState.suggestedSeats,
  walletBalance: walletState.balance,
  loyaltyPoints: walletState.loyaltyPoints,
  offers: offerState.offers
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
  setQRCode,
  getWalletData,
  getOffers,
  confirmReservation,
  cancelPendingReservation,
  setPendingReservation
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(BookingPage));
