/**
 * M2K Rohini Screen 2 — labels decrease left → right.
 */
export function getRohiniScreen2SeatNumber(rowLetter, colIndex) {
  if (rowLetter === 'WAY') return null;

  if (rowLetter === 'A') {
    if (colIndex >= 1 && colIndex <= 10) return 22 - colIndex;
    if (colIndex >= 14 && colIndex <= 24) return 25 - colIndex;
    return null;
  }

  if (rowLetter === 'B') {
    if (colIndex >= 2 && colIndex <= 9) return 19 - colIndex;
    if (colIndex >= 15 && colIndex <= 23) return 24 - colIndex;
    return null;
  }

  if (rowLetter === 'M') {
    if (colIndex >= 5 && colIndex <= 11) return 22 - colIndex;
    if (colIndex >= 14 && colIndex <= 23) return 24 - colIndex;
    return null;
  }

  if (rowLetter === 'N') {
    if (colIndex >= 6 && colIndex <= 11) return 22 - colIndex;
    if (colIndex >= 14 && colIndex <= 23) return 24 - colIndex;
    return null;
  }

  if (colIndex >= 3 && colIndex <= 11) return 22 - colIndex;
  if (colIndex >= 14 && colIndex <= 23) return 24 - colIndex;
  return null;
}
