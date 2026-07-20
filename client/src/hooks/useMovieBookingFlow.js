import { useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';

/**
 * Book flow: Terms & Conditions → booking page.
 */
export default function useMovieBookingFlow() {
  const history = useHistory();
  const [termsOpen, setTermsOpen] = useState(false);
  const [pendingMovie, setPendingMovie] = useState(null);

  const [adultWarningOpen, setAdultWarningOpen] = useState(false);

  const goToBooking = useCallback(
    movie => {
      if (movie?._id) {
        history.push(`/movie/booking/${movie._id}`);
      }
    },
    [history]
  );

  const proceedAfterTerms = useCallback(
    movie => {
      setTermsOpen(false);
      goToBooking(movie);
      setPendingMovie(null);
    },
    [goToBooking]
  );

  const startBooking = useCallback(movie => {
    if (!movie?._id) return;
    setPendingMovie(movie);
    if (movie.isAdult) {
      setAdultWarningOpen(true);
    } else {
      setTermsOpen(true);
    }
  }, []);

  const handleAdultWarningAccept = useCallback(() => {
    setAdultWarningOpen(false);
    setTermsOpen(true);
  }, []);

  const handleAdultWarningCancel = useCallback(() => {
    setAdultWarningOpen(false);
    setPendingMovie(null);
  }, []);

  const handleTermsAccept = useCallback(() => {
    if (pendingMovie) {
      proceedAfterTerms(pendingMovie);
    }
  }, [pendingMovie, proceedAfterTerms]);

  const handleTermsCancel = useCallback(() => {
    setTermsOpen(false);
    setPendingMovie(null);
  }, []);

  return {
    adultWarningOpen,
    termsOpen,
    pendingMovie,
    startBooking,
    handleAdultWarningAccept,
    handleAdultWarningCancel,
    handleTermsAccept,
    handleTermsCancel,
  };
}
