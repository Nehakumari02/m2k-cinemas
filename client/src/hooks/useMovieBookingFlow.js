import { useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';

/**
 * Book flow: Terms & Conditions → booking page.
 */
export default function useMovieBookingFlow() {
  const history = useHistory();
  const [termsOpen, setTermsOpen] = useState(false);
  const [pendingMovie, setPendingMovie] = useState(null);

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
    setTermsOpen(true);
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
    termsOpen,
    pendingMovie,
    startBooking,
    handleTermsAccept,
    handleTermsCancel,
  };
}
