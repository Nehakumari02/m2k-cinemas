/**
 * M2K Pitampura — exact 19-column positions from venue diagram.
 * Rendered with standard BookingSeats UI (screen at top, row A nearest screen).
 */
const EMPTY = -1;
const AVAILABLE = 0;

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

/** Rows E–L: cols 1–4 gap, cols 5–17 seats 1–13, cols 18–19 gap. */
function buildMiddleSectionRow() {
  const r = row();
  for (let i = 4; i < 17; i += 1) {
    r[i] = AVAILABLE;
  }
  return r;
}

/** Row M: cols 1–3 gap (entry side), cols 4–18 seats 1–15, col 19 gap. */
function buildRowM() {
  return buildLowerBlockRow();
}

/** Row N: col 1 gap, cols 2–18 seats 1–17, col 19 gap. */
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
    buildMiddleSectionRow(), // L
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
    ticketPrice: 280,
    goldPrice: 300,
    silverPrice: 250,
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
