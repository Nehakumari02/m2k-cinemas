import { getSeatNumberFromRight } from './venueSeatFromRight';
import { getSeatNumberFromLeft } from './venueSeatFromLeft';

const BOOKABLE = new Set([0, 1, 2, 3, 5, 6]);

export function getSeatDisplayLabel(cinema, rowIndex, colIndex) {
  const row = cinema && cinema.seats && cinema.seats[rowIndex];
  const rowLetter =
    (cinema && cinema.rowLabels && cinema.rowLabels[rowIndex]) ||
    String.fromCharCode(65 + rowIndex);

  if (cinema && cinema.seatNumbering === 'pitampura-screen2') {
    const venueSeat = getSeatNumberFromLeft(row, colIndex);
    if (venueSeat != null) {
      return { row: rowLetter, seat: venueSeat };
    }
  }

  if (
    cinema &&
    (cinema.seatNumbering === 'rohini' ||
      cinema.seatNumbering === 'rohini-screen2' ||
      cinema.seatNumbering === 'pitampura-screen3')
  ) {
    const venueSeat = getSeatNumberFromRight(row, colIndex);
    if (venueSeat != null) {
      return { row: rowLetter, seat: venueSeat };
    }
  }

  if (!row) {
    return { row: rowLetter, seat: colIndex + 1 };
  }

  let seatNum = 0;
  for (let i = 0; i <= colIndex; i += 1) {
    if (BOOKABLE.has(Number(row[i]))) {
      seatNum += 1;
    }
  }

  return { row: rowLetter, seat: seatNum || colIndex + 1 };
}
