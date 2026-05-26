/**
 * M2K Rohini — labels decrease left to right (seat 1 on the right).
 */
export function getRohiniSeatNumber(rowLetter, colIndex) {
  if (rowLetter === 'WAY') return null;

  if (rowLetter === 'A') {
    if (colIndex >= 2 && colIndex <= 8) return 19 - colIndex;
    if (colIndex >= 11 && colIndex <= 20) return 21 - colIndex;
    return null;
  }

  if (rowLetter === 'B') {
    if (colIndex >= 2 && colIndex <= 9) return 19 - colIndex;
    if (colIndex >= 12 && colIndex <= 20) return 21 - colIndex;
    return null;
  }

  if (rowLetter === 'T' || rowLetter === 'U') {
    if (colIndex >= 2 && colIndex <= 10) return 16 - colIndex;
    if (colIndex >= 12 && colIndex <= 16) return 17 - colIndex;
    return null;
  }

  if (colIndex >= 2 && colIndex <= 10) return 20 - colIndex;
  if (colIndex >= 12 && colIndex <= 20) return 21 - colIndex;
  return null;
}
