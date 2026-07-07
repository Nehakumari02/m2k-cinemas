import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/styles';
import classNames from 'classnames';
import { getSeatNumberFromRight } from '../../../../../utils/venueSeatFromRight';
import { getSeatNumberFromLeft } from '../../../../../utils/venueSeatFromLeft';
import { getSeatTicketPrice } from '../../../../../utils/seatPricing';

const SEAT_COLORS = {
  available: '#ffffff',
  reserved: '#e2e8f0',
  selected: '#4ade80',
  suggested: '#00bcd4',
  special: '#FFD700'
};

const useStyles = makeStyles(theme => ({
  wrapper: {
    width: '100%',
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(2),
    overflowX: 'auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },

  /* ── Screen ── */
  screenWrapper: {
    width: '100%',
    maxWidth: '400px',
    marginBottom: theme.spacing(6),
    marginTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  screenCurve: {
    width: '100%',
    height: '18px',
    background: '#e0f2fe',
    border: '1px solid #bae6fd',
    borderRadius: '4px',
    transform: 'perspective(120px) rotateX(15deg)',
    marginBottom: '10px'
  },
  screenLabel: {
    fontSize: '0.65rem',
    color: '#64748b',
    fontWeight: 500,
    textTransform: 'none'
  },

  /* ── Category Band ── */
  categoryBandFullWidth: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    maxWidth: '600px',
    margin: '16px auto 12px auto',
    gap: '8px'
  },
  categoryBandShiftRight: {
    paddingLeft: 44,
    boxSizing: 'border-box'
  },

  categoryLine: {
    width: '100%',
    height: '1px',
    background: '#e2e8f0'
  },
  categoryLabel: {
    fontSize: '0.75rem',
    fontWeight: 700,
    color: '#334155',
    whiteSpace: 'nowrap',
    letterSpacing: '0.5px'
  },

  /* ── Row ── */
  row: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: '3px'
  },
  rowLabel: {
    width: '22px',
    textAlign: 'center',
    fontSize: '0.65rem',
    fontWeight: 700,
    color: '#64748b',
    flexShrink: 0,
    userSelect: 'none'
  },
  seatsGroup: {
    display: 'grid',
    gap: '4px',
    flexWrap: 'nowrap',
    justifyContent: 'start'
  },
  seatsGroupFixed: {
    flex: '0 0 auto'
  },

  /* ── Seat ── */
  seat: {
    width: '24px',
    height: '24px',
    borderRadius: '4px',
    border: '1px solid #4ade80',
    cursor: 'pointer',
    position: 'relative',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.6rem',
    fontWeight: 700,
    color: '#4ade80',
    backgroundColor: '#fff',
    outline: 'none',
    '&:hover:not($seatReserved)': {
      backgroundColor: '#4ade80 !important',
      color: '#fff !important',
    }
  },
  seatReserved: {
    backgroundColor: '#e2e8f0 !important',
    borderColor: '#e2e8f0 !important',
    color: '#fff !important',
    cursor: 'not-allowed',
    opacity: 1,
    '&:hover': { transform: 'none', boxShadow: 'none' }
  },
  seatSelected: {
    backgroundColor: '#4ade80 !important',
    borderColor: '#4ade80 !important',
    color: '#fff !important',
    boxShadow: '0 2px 8px rgba(74, 222, 128, 0.4)'
  },
  seatSpecial: {
    boxShadow: '0 0 10px rgba(255, 215, 0, 0.4)',
    '&::after': {
      content: '"💎"',
      fontSize: '0.6rem',
      display: 'block'
    }
  },

  /* ── Aisle Gap ── */
  aisleGap: {
    width: '20px',
    flexShrink: 0
  },
  seatSpacer: {
    width: '26px',
    height: '24px',
    flexShrink: 0,
    [theme.breakpoints.down('sm')]: {
      width: '20px',
      height: '18px'
    }
  },
  walkwayRow: {
    width: '100%',
    height: '24px'
  },

  /* ── Legend ── */
  legend: {
    display: 'flex',
    gap: '24px',
    alignItems: 'center',
    marginTop: theme.spacing(4),
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: '12px 24px',
    background: '#ffffff',
    borderRadius: '12px',
    border: '1px solid rgba(15,23,42,0.1)'
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '7px',
    fontSize: '0.78rem',
    color: '#334155',
    fontWeight: 500
  },
  legendSeat: {
    width: '20px',
    height: '20px',
    borderRadius: '4px',
    border: '1px solid #e2e8f0',
    flexShrink: 0
  },
  selectedSeatPriceBar: {
    marginTop: theme.spacing(2),
    padding: '8px 14px',
    borderRadius: 12,
    border: '1px solid rgba(183,36,41,0.35)',
    backgroundColor: 'rgba(183,36,41,0.12)',
    color: '#b72429',
    fontWeight: 900,
    fontSize: '0.85rem',
    textAlign: 'center',
    width: '82%',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      padding: '8px 10px',
    },
  },

  [theme.breakpoints.down('sm')]: {
    seat: { width: '20px', height: '18px', fontSize: '0.5rem' },
    categoryBandFullWidth: { width: '100%' },
    screenWrapper: { width: '100%' }
  }
}));

const ROW_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const CATEGORIES = [
  {
    key: 'gold',
    label: 'GOLD',
    color: '#b72429',
    bg: 'rgba(183,36,41,0.12)'
  },
  {
    key: 'premium',
    label: 'PREMIUM',
    color: '#e040fb',
    bg: 'rgba(224,64,251,0.12)'
  },
  {
    key: 'classic',
    label: 'CLASSIC',
    color: '#42a5f5',
    bg: 'rgba(66,165,245,0.12)'
  }
];

function getCategory(rowIndex, totalRows, rowLabel, seatNumbering) {
  if (
    (seatNumbering === 'pitampura' || seatNumbering === 'pitampura-screen3') &&
    rowLabel &&
    rowLabel !== 'WAY'
  ) {
    if (rowLabel === 'N') {
      return {
        key: 'gold',
        label: 'GOLD',
        color: '#b72429',
        bg: 'rgba(183,36,41,0.12)',
      };
    }
    return {
      key: 'silver',
      label: 'SILVER',
      color: '#42a5f5',
      bg: 'rgba(66,165,245,0.12)',
    };
  }
  if (seatNumbering === 'pitampura-screen2' && rowLabel) {
    if (rowLabel === 'U') {
      return {
        key: 'platinum',
        label: 'PLATINUM',
        color: '#e040fb',
        bg: 'rgba(224,64,251,0.12)',
      };
    }
    if (rowLabel === 'T' || rowLabel === 'S') {
      return {
        key: 'gold',
        label: 'GOLD',
        color: '#b72429',
        bg: 'rgba(183,36,41,0.12)',
      };
    }
    if (/^[A-R]$/.test(rowLabel)) {
      return {
        key: 'silver',
        label: 'SILVER',
        color: '#42a5f5',
        bg: 'rgba(66,165,245,0.12)',
      };
    }
  }
  if (seatNumbering === 'rohini' && rowLabel && rowLabel !== 'WAY') {
    if (rowLabel === 'A' || rowLabel === 'B') {
      return {
        key: 'gold',
        label: 'GOLD',
        color: '#b72429',
        bg: 'rgba(183,36,41,0.12)',
      };
    }
    return {
      key: 'silver',
      label: 'SILVER',
      color: '#42a5f5',
      bg: 'rgba(66,165,245,0.12)',
    };
  }
  if (seatNumbering === 'rohini-screen2' && rowLabel && rowLabel !== 'WAY') {
    if (rowLabel === 'A' || rowLabel === 'B') {
      return {
        key: 'gold',
        label: 'GOLD',
        color: '#b72429',
        bg: 'rgba(183,36,41,0.12)',
      };
    }
    return {
      key: 'silver',
      label: 'SILVER',
      color: '#42a5f5',
      bg: 'rgba(66,165,245,0.12)',
    };
  }
  const third = Math.ceil(totalRows / 3);
  if (rowIndex < third) return CATEGORIES[0]; // GOLD — front
  if (rowIndex < third * 2) return CATEGORIES[1]; // PREMIUM — middle
  return CATEGORIES[2]; // CLASSIC — back
}

function getSeatBgColor(seatValue, category) {
  if (seatValue === 1) return SEAT_COLORS.reserved;
  if (seatValue === 2) return SEAT_COLORS.selected;
  if (seatValue === 3) return SEAT_COLORS.suggested;
  if (seatValue === 5) return SEAT_COLORS.special;
  if (seatValue === 6) return SEAT_COLORS.selected;
  return SEAT_COLORS.available;
}

const EMPTY_SEAT = -1;

function isBookableSeat(seatValue) {
  const n = Number(seatValue);
  return !Number.isNaN(n) && n >= 0;
}

export default function BookingSeats({
  seats,
  onSelectSeat,
  rowLabels,
  gridWidth: gridWidthProp,
  centerAisle = true,
  seatNumbering,
  movie,
  cinema,
  screenAtBottom = false,
  reverseRows = false,
  firstRowShiftRight = 0,
  rowShiftRightLabels = [],
  shiftRowLabelsRight = [],
  shiftRowLabelsLeft = [],
  middleGapThreeRows = [],
  middleGapFourRows = [],
  middleGapTwoRows = [],
  shiftRightPartRowsRight = [],
  shiftRightPartRowsRightTwice = [],
}) {
  const classes = useStyles();

  if (!seats || seats.length === 0) return null;

  const totalRows = seats.length;

  const maxWidth = seats.reduce((max, row) => Math.max(max, row.length), 0);
  const gridWidth = gridWidthProp || maxWidth;
  const aisleAt =
    centerAisle && gridWidth > 0 ? Math.floor(gridWidth / 2) : -1;
  const gridTemplate = `repeat(${gridWidth}, 26px)`;

  const getRowLabel = rowIndex =>
    (rowLabels && rowLabels[rowIndex]) || ROW_LETTERS[rowIndex] || String(rowIndex + 1);

  const padRow = seatRow => {
    if (seatRow.length >= gridWidth) return seatRow;
    return [...seatRow, ...Array(gridWidth - seatRow.length).fill(EMPTY_SEAT)];
  };
  const renderRows = seats.map((seatRow, originalRowIndex) => ({
    seatRow,
    originalRowIndex,
  }));
  if (reverseRows) renderRows.reverse();

  const selectedSeats = seats.reduce((acc, row, rowIndex) => {
    row.forEach((seatValue, seatIndex) => {
      if (seatValue === 2 || seatValue === 6) {
        acc.push([rowIndex, seatIndex, seatValue]);
      }
    });
    return acc;
  }, []);
  const selectedCount = selectedSeats.length;
  const selectedTotalPrice = selectedSeats.reduce((sum, [rowIndex, , seatValue]) => {
    const rowLabel = getRowLabel(rowIndex);
    return (
      sum +
      getSeatTicketPrice(movie, cinema, seatValue, rowLabel, seatNumbering)
    );
  }, 0);

  return (
    <div className={classes.wrapper}>
      {!screenAtBottom && (
        <div className={classes.screenWrapper}>
          <div className={classes.screenCurve} />
          <span className={classes.screenLabel}>
            All Eyes This Way Please!
          </span>
        </div>
      )}

      {/* ── Seat Grid ── */}
      {renderRows.map(({ seatRow, originalRowIndex }, displayRowIndex) => {
        const category = getCategory(
          originalRowIndex,
          totalRows,
          getRowLabel(originalRowIndex),
          seatNumbering
        );
        let previousCategory = null;
        for (let i = displayRowIndex - 1; i >= 0; i--) {
          const prevRowLabel = getRowLabel(renderRows[i].originalRowIndex);
          if (prevRowLabel !== 'WAY') {
            previousCategory = getCategory(
              renderRows[i].originalRowIndex,
              totalRows,
              prevRowLabel,
              seatNumbering
            );
            break;
          }
        }
        const showBand = displayRowIndex === 0 || (previousCategory && previousCategory.key !== category.key);
        const rowLetter = getRowLabel(originalRowIndex);

        if (rowLetter === 'WAY') {
          return <div key={originalRowIndex} className={classes.walkwayRow} />;
        }

        let seatNumber = 0;
        const paddedRow = padRow(seatRow);
        const shouldShiftByFirstRow = firstRowShiftRight > 0 && displayRowIndex === 0;
        const shouldShiftWholeRowByLabel = Array.isArray(rowShiftRightLabels)
          ? rowShiftRightLabels.includes(rowLetter)
          : false;
        const shouldShiftLeftClusterOnly = Array.isArray(shiftRowLabelsRight)
          ? shiftRowLabelsRight.includes(rowLetter)
          : false;
        const shouldShiftLeftClusterLeft = Array.isArray(shiftRowLabelsLeft)
          ? shiftRowLabelsLeft.includes(rowLetter)
          : false;
        const rowShiftRight = shouldShiftByFirstRow || shouldShiftWholeRowByLabel ? 1 : 0;

        let displayRow = paddedRow;
        let displaySeatSourceMap = paddedRow.map((_, idx) => idx);

        if (rowShiftRight > 0) {
          displayRow = [...Array(rowShiftRight).fill(EMPTY_SEAT), ...paddedRow].slice(0, gridWidth);
          displaySeatSourceMap = displayRow.map((_, idx) => idx - rowShiftRight);
        } else if (
          shouldShiftLeftClusterOnly ||
          shouldShiftLeftClusterLeft ||
          (Array.isArray(middleGapThreeRows) && middleGapThreeRows.includes(rowLetter)) ||
          (Array.isArray(middleGapFourRows) && middleGapFourRows.includes(rowLetter)) ||
          (Array.isArray(middleGapTwoRows) && middleGapTwoRows.includes(rowLetter)) ||
          (Array.isArray(shiftRightPartRowsRight) && shiftRightPartRowsRight.includes(rowLetter)) ||
          (Array.isArray(shiftRightPartRowsRightTwice) &&
            shiftRightPartRowsRightTwice.includes(rowLetter))
        ) {
          const runs = [];
          let runStart = -1;
          for (let i = 0; i < paddedRow.length; i += 1) {
            if (isBookableSeat(paddedRow[i])) {
              if (runStart === -1) runStart = i;
            } else if (runStart !== -1) {
              runs.push([runStart, i - 1]);
              runStart = -1;
            }
          }
          if (runStart !== -1) runs.push([runStart, paddedRow.length - 1]);

          if (runs.length) {
            const [leftStart, leftEnd] = runs[0];
            const [rightStart] = runs[1] || [];
            const shouldIncreaseMiddleGapThree = Array.isArray(middleGapThreeRows)
              ? middleGapThreeRows.includes(rowLetter)
              : false;
            const shouldIncreaseMiddleGapFour = Array.isArray(middleGapFourRows)
              ? middleGapFourRows.includes(rowLetter)
              : false;
            const shouldIncreaseMiddleGapTwo = Array.isArray(middleGapTwoRows)
              ? middleGapTwoRows.includes(rowLetter)
              : false;
            const shouldShiftRightClusterOnly = Array.isArray(shiftRightPartRowsRight)
              ? shiftRightPartRowsRight.includes(rowLetter)
              : false;
            const shouldShiftRightClusterTwice = Array.isArray(shiftRightPartRowsRightTwice)
              ? shiftRightPartRowsRightTwice.includes(rowLetter)
              : false;
            const nextRow = Array(gridWidth).fill(EMPTY_SEAT);
            const nextMap = Array(gridWidth).fill(-1);
            const leftShift = shouldShiftLeftClusterOnly
              ? 1
              : shouldShiftLeftClusterLeft
                ? -1
                : 0;
            const rightShift = shouldShiftRightClusterTwice
              ? 2
              : shouldShiftRightClusterOnly
                ? 1
                : 0;
            const leftCount = leftEnd - leftStart + 1;
            const baseGap = typeof rightStart === 'number' ? rightStart - leftEnd - 1 : 0;
            let targetGap = baseGap;
            if (shouldIncreaseMiddleGapFour) targetGap = 4;
            else if (shouldIncreaseMiddleGapThree) targetGap = 3;
            else if (shouldIncreaseMiddleGapTwo) targetGap = 2;
            const leftTargetStart = leftStart + leftShift;
            const rightTargetStart =
              typeof rightStart === 'number'
                ? leftTargetStart + leftCount + targetGap + rightShift
                : -1;

            for (let sourceIndex = 0; sourceIndex < paddedRow.length; sourceIndex += 1) {
              if (!isBookableSeat(paddedRow[sourceIndex])) continue;
              let targetIndex = sourceIndex;
              if (sourceIndex >= leftStart && sourceIndex <= leftEnd) {
                targetIndex = leftTargetStart + (sourceIndex - leftStart);
              } else if (typeof rightStart === 'number' && sourceIndex >= rightStart) {
                targetIndex = rightTargetStart + (sourceIndex - rightStart);
              }
              if (targetIndex >= 0 && targetIndex < gridWidth) {
                nextRow[targetIndex] = paddedRow[sourceIndex];
                nextMap[targetIndex] = sourceIndex;
              }
            }
            displayRow = nextRow;
            displaySeatSourceMap = nextMap;
          }
        }
        const useVenueNumbers =
          seatNumbering === 'rohini' ||
          seatNumbering === 'rohini-screen2' ||
          seatNumbering === 'pitampura-screen2' ||
          seatNumbering === 'pitampura-screen3';

        const getVenueSeat = (row, col) => {
          if (seatNumbering === 'pitampura-screen2') {
            return getSeatNumberFromLeft(row, col);
          }
          if (
            seatNumbering === 'rohini' ||
            seatNumbering === 'rohini-screen2' ||
            seatNumbering === 'pitampura-screen3'
          ) {
            return getSeatNumberFromRight(row, col);
          }
          return null;
        };

        return (
          <Fragment key={originalRowIndex}>
            {/* Category label band */}
            {showBand && (
              <div className={classes.row}>
                <span className={classes.rowLabel} />
                <div className={classes.categoryBandFullWidth}>
                  <span className={classes.categoryLabel}>
                    {getSeatTicketPrice(movie, cinema, 0, rowLetter, seatNumbering) ? `₹${getSeatTicketPrice(movie, cinema, 0, rowLetter, seatNumbering)} ` : ''}{category.label}
                  </span>
                  <div className={classes.categoryLine} />
                </div>
              </div>
            )}

            {/* Seat Row */}
            <div className={classes.row}>
              <span className={classes.rowLabel}>{rowLetter}</span>
              <div
                className={classNames(classes.seatsGroup, classes.seatsGroupFixed)}
                style={{ gridTemplateColumns: gridTemplate }}>
                {displayRow.map((displaySeatValue, seatIndex) => {
                  const sourceSeatIndex = displaySeatSourceMap[seatIndex];
                  const seatValue =
                    sourceSeatIndex >= 0 &&
                    sourceSeatIndex < paddedRow.length &&
                    isBookableSeat(paddedRow[sourceSeatIndex])
                      ? paddedRow[sourceSeatIndex]
                      : EMPTY_SEAT;

                  if (!isBookableSeat(seatValue)) {
                    return <div key={seatIndex} className={classes.seatSpacer} />;
                  }

                  const venueSeat = useVenueNumbers
                    ? getVenueSeat(paddedRow, sourceSeatIndex)
                    : null;
                  seatNumber += 1;
                  const displaySeat =
                    venueSeat != null ? venueSeat : seatNumber;
                  const seatPrice =
                    seatValue !== 1
                      ? getSeatTicketPrice(
                          movie,
                          cinema,
                          seatValue,
                          rowLetter,
                          seatNumbering
                        )
                      : null;

                  return (
                    <button
                      key={seatIndex}
                      className={classNames(
                        classes.seat,
                        seatValue === 1 && classes.seatReserved,
                        seatValue === 2 && classes.seatSelected,
                        (seatValue === 5 || seatValue === 6) && classes.seatSpecial
                      )}
                      style={{ backgroundColor: getSeatBgColor(seatValue, category) }}
                      onClick={() => {
                        if (seatValue === 1) return;
                        onSelectSeat(originalRowIndex, sourceSeatIndex);
                      }}
                      title={`Row ${rowLetter} Seat ${displaySeat}${
                        seatValue === 1 ? ' (Reserved)' : ''
                      }${seatPrice != null ? ` • ₹${seatPrice}` : ''}`}>
                      {displaySeat}
                    </button>
                  );
                })}
              </div>
            </div>
          </Fragment>
        );
      })}

      {screenAtBottom && (
        <div className={classes.screenWrapper}>
          <div className={classes.screenCurve} />
          <span className={classes.screenLabel}>
            All Eyes This Way Please!
          </span>
        </div>
      )}

      {/* ── Legend ── */}
      <div className={classes.legend}>
        <div className={classes.legendItem}>
          <div
            className={classes.legendSeat}
            style={{ backgroundColor: SEAT_COLORS.available, borderColor: SEAT_COLORS.selected }}
          />
          Available
        </div>
        <div className={classes.legendItem}>
          <div
            className={classes.legendSeat}
            style={{ backgroundColor: SEAT_COLORS.reserved }}
          />
          Booked
        </div>
        <div className={classes.legendItem}>
          <div
            className={classes.legendSeat}
            style={{ backgroundColor: SEAT_COLORS.selected }}
          />
          Selected
        </div>
      </div>

      {selectedCount > 0 && (
        <div className={classes.selectedSeatPriceBar}>
          {selectedCount} seat{selectedCount > 1 ? 's' : ''} selected : ₹{selectedTotalPrice}
        </div>
      )}

    </div>
  );
}
