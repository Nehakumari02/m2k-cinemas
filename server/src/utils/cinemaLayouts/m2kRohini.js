/**
 * M2K Rohini — 24-column grid matching venue diagram exactly.
 * Numbers decrease left → right; seat 1 on the right with grey padding.
 */
const EMPTY = -1;
const AVAILABLE = 0;

const GRID_WIDTH = 24;

const row = () => Array(GRID_WIDTH).fill(EMPTY);

/** Rows C–N, P–S: 18 seats | 2-col aisle | 2 grey right of seat 1 */
function buildMainBlockRow() {
  const r = row();
  for (let i = 2; i <= 10; i += 1) {
    r[i] = AVAILABLE;
  }
  for (let i = 12; i <= 20; i += 1) {
    r[i] = AVAILABLE;
  }
  return r;
}

/** Row A: 17 seats — 17–11 | EXIT | 10–1 | 3 grey (seat 1 @ col 20) */
function buildRowA() {
  const r = row();
  for (let i = 2; i <= 8; i += 1) {
    r[i] = AVAILABLE;
  }
  for (let i = 11; i <= 20; i += 1) {
    r[i] = AVAILABLE;
  }
  return r;
}

/** Row B: 17 seats — 17–10 (cols 2–9) | 9–1 (cols 12–20) with center divider */
function buildRowB() {
  const r = row();
  for (let i = 2; i <= 9; i += 1) {
    r[i] = AVAILABLE;
  }
  for (let i = 12; i <= 20; i += 1) {
    r[i] = AVAILABLE;
  }
  return r;
}

/** Rows T–U: 14 seats — 14–6 | 1-col aisle | 5–1 (seat 1 @ col 16, under S seat 5) */
function buildRowTU() {
  const r = row();
  for (let i = 2; i <= 10; i += 1) {
    r[i] = AVAILABLE;
  }
  for (let i = 12; i <= 16; i += 1) {
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

function buildM2kRohiniLayout() {
  const seats = [
    buildRowA(),
    buildRowB(),
    buildWalkwayRow(),
    buildMainBlockRow(),
    buildMainBlockRow(),
    buildMainBlockRow(),
    buildMainBlockRow(),
    buildMainBlockRow(),
    buildMainBlockRow(),
    buildMainBlockRow(),
    buildMainBlockRow(),
    buildMainBlockRow(),
    buildMainBlockRow(),
    buildMainBlockRow(),
    buildWalkwayRow(),
    buildMainBlockRow(),
    buildMainBlockRow(),
    buildMainBlockRow(),
    buildMainBlockRow(),
    buildRowTU(),
    buildRowTU()
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
    'N',
    'WAY',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U'
  ];

  return {
    name: 'M2K ROHINI',
    city: 'delhi',
    ticketPrice: 300,
    specialPrice: 480,
    layoutKey: 'm2k-venue',
    seatNumbering: 'rohini',
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
  buildM2kRohiniLayout,
  countBookableSeats
};
