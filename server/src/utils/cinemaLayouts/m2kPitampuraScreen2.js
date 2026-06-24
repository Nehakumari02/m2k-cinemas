/**
 * M2K Pitampura Screen 2 — 28-column grid from venue diagram.
 * Bottom (A–K): 11 + aisle + 12 seats, numbers 1→23 left to right.
 * Top (L–U): staggered seat-1 column; screen at front = row A.
 */
const EMPTY = -1;
const AVAILABLE = 0;

const GRID_WIDTH = 28;

const row = () => Array(GRID_WIDTH).fill(EMPTY);

/** Rows A–K: seats 1–11 | aisle | 12–23 */
function buildBottomSectionRow() {
  const r = row();
  for (let i = 2; i <= 12; i += 1) {
    r[i] = AVAILABLE;
  }
  for (let i = 15; i <= 26; i += 1) {
    r[i] = AVAILABLE;
  }
  return r;
}

/** Row U (Platinum): 18 seats in one centred block — seats 8–11 at auditorium centre */
function buildRowU() {
  const r = row();
  for (let i = 5; i <= 22; i += 1) {
    r[i] = AVAILABLE;
  }
  return r;
}

/** Row T: 1–10 | 11–20 (T10 @ col 11/S7; T11 @ col 15/S8) */
function buildRowT() {
  const r = row();
  for (let i = 2; i <= 11; i += 1) {
    r[i] = AVAILABLE;
  }
  for (let i = 15; i <= 24; i += 1) {
    r[i] = AVAILABLE;
  }
  return r;
}

/** Row S: 1–7 | 8–15 (S7 under T9 col 11; S8 under T12 col 18) */
function buildRowS() {
  const r = row();
  for (let i = 5; i <= 11; i += 1) {
    r[i] = AVAILABLE;
  }
  for (let i = 15; i <= 22; i += 1) {
    r[i] = AVAILABLE;
  }
  return r;
}

/** Rows R, Q, P, N, M, L: 1–8 | 9–17 (seat 1 @ col 4, one right of S) */
function buildRowRL() {
  const r = row();
  for (let i = 4; i <= 11; i += 1) {
    r[i] = AVAILABLE;
  }
  for (let i = 15; i <= 23; i += 1) {
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

function buildM2kPitampuraScreen2Layout() {
  const seats = [
    buildBottomSectionRow(), // A
    buildBottomSectionRow(), // B
    buildBottomSectionRow(), // C
    buildBottomSectionRow(), // D
    buildBottomSectionRow(), // E
    buildBottomSectionRow(), // F
    buildBottomSectionRow(), // G
    buildBottomSectionRow(), // H
    buildBottomSectionRow(), // J
    buildBottomSectionRow(), // K
    buildWalkwayRow(),
    buildRowRL(), // L
    buildRowRL(), // M
    buildRowRL(), // N
    buildRowRL(), // P
    buildRowRL(), // Q
    buildRowRL(), // R
    buildRowS(), // S
    buildRowT(), // T
    buildRowU() // U
  ];

  const rowLabels = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'J',
    'K',
    'WAY',
    'L',
    'M',
    'N',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U'
  ];

  return {
    name: 'M2K PITAMPURA SCREEN 2',
    city: 'delhi',
    ticketPrice: 150,
    platinumPrice: 330,
    goldPrice: 180,
    silverPrice: 150,
    specialPrice: 450,
    layoutKey: 'm2k-venue',
    seatNumbering: 'pitampura-screen2',
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
  buildM2kPitampuraScreen2Layout,
  countBookableSeats
};
