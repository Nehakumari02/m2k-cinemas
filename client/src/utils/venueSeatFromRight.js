const BOOKABLE = new Set([0, 1, 2, 3, 5, 6]);

/**
 * Venue seat label: rightmost bookable cell = 1, counting leftward.
 */
export function getSeatNumberFromRight(seatRow, colIndex) {
  if (!seatRow || !Array.isArray(seatRow)) return null;

  const bookableCols = [];
  seatRow.forEach((cell, i) => {
    const n = Number(cell);
    if (BOOKABLE.has(n)) {
      bookableCols.push(i);
    }
  });

  const pos = bookableCols.indexOf(colIndex);
  if (pos === -1) return null;

  return bookableCols.length - pos;
}
