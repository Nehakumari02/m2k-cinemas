/**
 * M2K Pitampura Screen 3 — 19-column grid from venue diagram.
 * Seats numbered right → left (1 = rightmost). Screen at front = row A.
 */
const EMPTY = -1;
const AVAILABLE = 0;

const GRID_WIDTH = 19;

const row = () => Array(GRID_WIDTH).fill(EMPTY);

/** Rows A–D: seats 1–15 (cols 2–16) */
function buildLowerBlockRow() {
  const r = row();
  for (let i = 2; i < 17; i += 1) {
    r[i] = AVAILABLE;
  }
  return r;
}

/** Rows E–L: seats 1–13 (cols 3–15); seat 1 aligns with D seat 3 */
function buildMiddleSectionRow() {
  const r = row();
  for (let i = 3; i < 16; i += 1) {
    r[i] = AVAILABLE;
  }
  return r;
}

/** Row M: seats 1–15 (cols 2–16); M2/L1, M14/L13 aligned */
function buildRowM() {
  const r = row();
  for (let i = 2; i < 17; i += 1) {
    r[i] = AVAILABLE;
  }
  return r;
}

/** Row N: seats 1–17 (cols 1–17); N16 @ col 2 under M15, N17 @ col 1 */
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

function buildM2kPitampuraScreen3Layout() {
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
    name: 'M2K PITAMPURA SCREEN 3',
    city: 'delhi',
    ticketPrice: 280,
    specialPrice: 450,
    layoutKey: 'm2k-venue',
    seatNumbering: 'pitampura-screen3',
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
  buildM2kPitampuraScreen3Layout,
  countBookableSeats
};
