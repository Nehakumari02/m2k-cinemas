/** Whether a reservation should block seats on the seat map */
export function isReservationSeatHold(reservation) {
  if (!reservation || !reservation.seats?.length) return false;
  if (reservation.status === 'Paid' || reservation.status === 'Refund Requested') {
    return true;
  }
  if (reservation.status === 'Pending') {
    if (!reservation.expiresAt) return true;
    return new Date(reservation.expiresAt) > new Date();
  }
  return false;
}
