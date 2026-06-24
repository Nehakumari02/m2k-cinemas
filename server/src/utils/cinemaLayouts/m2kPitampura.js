/**
 * M2K Pitampura — exact 19-column positions from venue diagram.
 * Rendered with standard BookingSeats UI (screen at top, row A nearest screen).
 */
const EMPTY = -1;
const AVAILABLE = 0;
const UNAVAILABLE = 1;

const GRID_WIDTH = 19;

const row = () => Array(GRID_WIDTH).fill(EMPTY);

/** Rows A–D: cols 1–3 gap, cols 4–18 seats 1–15, col 19 gap. */
function buildLowerBlockRow() {
  const r = row();
  for (let i = 3; i < 18; i += 1) {
    r[i] = AVAILABLE;
  }
  return r;
}

/** Rows E–K: cols 1–4 gap, cols 5–17 seats 1–13, cols 18–19 gap. */
function buildMiddleSectionRow() {
  const r = row();
  for (let i = 4; i < 17; i += 1) {
    r[i] = AVAILABLE;
  }
  return r;
}

/** Row L: 13 seats total. */
function buildRowL() {
  const r = row();
  for (let i = 4; i < 17; i += 1) {
    r[i] = AVAILABLE;
  }
  return r;
}

/** Row M: 15 seats total. */
function buildRowM() {
  const r = row();
  for (let i = 3; i < 18; i += 1) {
    r[i] = AVAILABLE;
  }
  return r;
}

/** Row N: 17 seats total. */
function buildRowN() {
  const r = row();
  for (let i = 1; i < 18; i += 1) {
    r[i] = AVAILABLE;
  }
  return r;
}

function buildWalkwayRow() {
  return row();
}

function countBookableSeats(seats) {
  return seats.reduce(
    (total, seatRow) =>
      total + seatRow.filter((cell) => cell === AVAILABLE || cell === 5).length,
    0
  );
}

/** Rows A → N (front near screen to back). */
function buildM2kPitampuraLayout() {
  const seats = [
    buildLowerBlockRow(), // A
    buildLowerBlockRow(), // B
    buildLowerBlockRow(), // C
    buildLowerBlockRow(), // D
    buildWalkwayRow(),
    buildMiddleSectionRow(), // E
    buildMiddleSectionRow(), // F
    buildMiddleSectionRow(), // G
    buildMiddleSectionRow(), // H
    buildMiddleSectionRow(), // J
    buildMiddleSectionRow(), // K
    buildRowL(), // L
    buildRowM(), // M
    buildRowN() // N
  ];

  const rowLabels = [
    'A',
    'B',
    'C',
    'D',
    'WAY',
    'E',
    'F',
    'G',
    'H',
    'J',
    'K',
    'L',
    'M',
    'N'
  ];

  return {
    name: 'M2K PITAMPURA',
    city: 'delhi',
    ticketPrice: 150,
    goldPrice: 180,
    silverPrice: 150,
    specialPrice: 450,
    layoutKey: 'm2k-venue',
    seatNumbering: 'pitampura',
    seats,
    rowLabels,
    gridWidth: GRID_WIDTH,
    centerAisle: false,
    seatsAvailable: countBookableSeats(seats)
  };
}

module.exports = {
  EMPTY,
  AVAILABLE,
  GRID_WIDTH,
  buildM2kPitampuraLayout,
  countBookableSeats
};
