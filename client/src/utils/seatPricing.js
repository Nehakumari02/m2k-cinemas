/**
 * Ticket pricing: base price comes from the movie; premium/special seats add cinema.specialPrice.
 * Legacy DB rows may still store specialPrice as an absolute seat price (>= base); those are honored.
 */

export function getMovieBaseTicketPrice(movie, cinema) {
  const moviePrice = Number(movie && movie.ticketPrice);
  if (moviePrice > 0) return moviePrice;
  const cinemaPrice = Number(cinema && cinema.ticketPrice);
  if (cinemaPrice > 0) return cinemaPrice;
  return 0;
}

export function getSeatTicketPrice(movie, cinema, seatValue, rowLabel, seatNumbering) {
  let base = getMovieBaseTicketPrice(movie, cinema);
  const isRohiniVenue =
    seatNumbering === 'rohini' || seatNumbering === 'rohini-screen2';
  if (isRohiniVenue && rowLabel && rowLabel !== 'WAY') {
    const gold =
      Number(cinema && cinema.goldPrice) ||
      Number(cinema && cinema.ticketPrice) ||
      300;
    const silver = Number(cinema && cinema.silverPrice) || 250;
    base = rowLabel === 'A' || rowLabel === 'B' ? gold : silver;
  }

  if (seatNumbering === 'pitampura-screen2' && rowLabel && rowLabel !== 'WAY') {
    const platinum = Number(cinema && cinema.platinumPrice) || 330;
    const gold = Number(cinema && cinema.goldPrice) || 180;
    const silver = Number(cinema && cinema.silverPrice) || 150;
    if (rowLabel === 'U') base = platinum;
    else if (rowLabel === 'T' || rowLabel === 'S') base = gold;
    else base = silver;
  }

  const isPitampuraNGold =
    seatNumbering === 'pitampura' || seatNumbering === 'pitampura-screen3';
  if (isPitampuraNGold && rowLabel && rowLabel !== 'WAY') {
    const gold =
      Number(cinema && cinema.goldPrice) ||
      Number(cinema && cinema.ticketPrice) ||
      280;
    const silver = Number(cinema && cinema.silverPrice) || 250;
    base = rowLabel === 'N' ? gold : silver;
  }

  const isSpecial = Number(seatValue) === 5 || Number(seatValue) === 6;
  if (!isSpecial) return base;

  const special = Number(cinema && cinema.specialPrice) || 0;
  if (!special) return base;

  // Legacy: specialPrice stored as full premium seat price
  if (special >= base && special > 150) return special;

  return base + special;
}

export function getPremiumSeatSurcharge(cinema) {
  return Number(cinema && cinema.specialPrice) || 0;
}

export function formatPremiumSeatLabel(cinema) {
  const surcharge = getPremiumSeatSurcharge(cinema);
  if (!surcharge) return null;
  return `Premium seats: +₹${surcharge}`;
}
