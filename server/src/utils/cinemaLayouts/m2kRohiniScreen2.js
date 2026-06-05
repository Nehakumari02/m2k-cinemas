/**
 * M2K Rohini Screen 2 — 26-column grid from venue diagram.
 * Rows A–N; seat numbers decrease left → right (seat 1 on the right).
 */
const EMPTY = -1;
const AVAILABLE = 0;

const GRID_WIDTH = 26;

const row = () => Array(GRID_WIDTH).fill(EMPTY);

/** Row A: 21 seats — 21–12 | EXIT (3) | 11–1 */
function buildRowA() {
  const r = row();
  for (let i = 1; i <= 10; i += 1) {
    r[i] = AVAILABLE;
  }
  for (let i = 14; i <= 24; i += 1) {
    r[i] = AVAILABLE;
  }
  return r;
}

/** Row B: 17 seats — spacer | 17–10 | GOLD (5) | 9–1 (seat 1 @ col 22, under row A seat 3) */
function buildRowB() {
  const r = row();
  for (let i = 2; i <= 9; i += 1) {
    r[i] = AVAILABLE;
  }
  for (let i = 14; i <= 22; i += 1) {
    r[i] = AVAILABLE;
  }
  return r;
}

/** Rows C–L: 19 seats — 2 pad | 19–11 | aisle | 10–1 | spacer */
function buildRowCL() {
  const r = row();
  for (let i = 3; i <= 11; i += 1) {
    r[i] = AVAILABLE;
  }
  for (let i = 14; i <= 23; i += 1) {
    r[i] = AVAILABLE;
  }
  return r;
}

/** Row M: 17 seats — 4 pad | 17–11 | aisle | 10–1 | spacer */
function buildRowM() {
  const r = row();
  for (let i = 5; i <= 11; i += 1) {
    r[i] = AVAILABLE;
  }
  for (let i = 14; i <= 23; i += 1) {
    r[i] = AVAILABLE;
  }
  return r;
}

/** Row N: 16 seats — 5 pad | 16–11 | aisle | 10–1 | spacer */
function buildRowN() {
  const r = row();
  for (let i = 6; i <= 11; i += 1) {
    r[i] = AVAILABLE;
  }
  for (let i = 14; i <= 23; i += 1) {
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

function buildM2kRohiniScreen2Layout() {
  const seats = [
    buildRowA(),
    buildRowB(),
    buildWalkwayRow(),
    buildRowCL(), // C
    buildRowCL(), // D
    buildRowCL(), // E
    buildRowCL(), // F
    buildRowCL(), // G
    buildRowCL(), // H
    buildRowCL(), // J
    buildRowCL(), // K
    buildRowCL(), // L
    buildRowM(),
    buildRowN()
  ];

  const rowLabels = [
    'A',
    'B',
    'WAY',
    'C',
    'D',
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
    name: 'M2K ROHINI SCREEN 2',
    city: 'delhi',
    ticketPrice: 300,
    goldPrice: 300,
    silverPrice: 250,
    specialPrice: 480,
    layoutKey: 'm2k-venue',
    seatNumbering: 'rohini-screen2',
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
  buildM2kRohiniScreen2Layout,
  countBookableSeats
};
