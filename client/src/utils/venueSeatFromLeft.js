const BOOKABLE = new Set([0, 1, 2, 3, 5, 6]);

/** Leftmost bookable cell = seat 1, increasing toward the right. */
export function getSeatNumberFromLeft(seatRow, colIndex) {
  if (!seatRow || !Array.isArray(seatRow)) return null;

  let seatNum = 0;
  for (let i = 0; i <= colIndex; i += 1) {
    const n = Number(seatRow[i]);
    if (BOOKABLE.has(n)) {
      seatNum += 1;
    }
  }

  const cell = Number(seatRow[colIndex]);
  return BOOKABLE.has(cell) ? seatNum : null;
}
