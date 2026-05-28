import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/styles';
import classNames from 'classnames';
import { getSeatNumberFromRight } from '../../../../../utils/venueSeatFromRight';
import { getSeatNumberFromLeft } from '../../../../../utils/venueSeatFromLeft';
import { getSeatTicketPrice } from '../../../../../utils/seatPricing';

const SEAT_COLORS = {
  available: '#3a3a4a',
  reserved: '#1e1e26',
  selected: '#b72429',
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
    width: '82%',
    marginBottom: theme.spacing(5),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  screenCurve: {
    width: '100%',
    height: '10px',
    background:
      'linear-gradient(90deg, transparent, #b72429 20%, #b72429 80%, transparent)',
    borderRadius: '50% 50% 0 0 / 100% 100% 0 0',
    boxShadow: '0 -4px 28px rgba(183,36,41,0.45)',
    marginBottom: '4px'
  },
  screenLabel: {
    fontSize: '0.7rem',
    color: 'rgba(183,36,41,0.7)',
    letterSpacing: '0.35em',
    textTransform: 'uppercase',
    fontWeight: 700
  },

  /* ── Category Band ── */
  categoryBand: {
    display: 'flex',
    alignItems: 'center',
    width: '82%',
    margin: '10px 0 2px',
    gap: '8px'
  },
  categoryLine: {
    flex: 1,
    height: '1px',
    opacity: 0.3
  },
  categoryLabel: {
    fontSize: '0.65rem',
    fontWeight: 800,
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    padding: '2px 12px',
    borderRadius: '12px',
    whiteSpace: 'nowrap'
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
    width: '26px',
    height: '24px',
    borderRadius: '6px 6px 2px 2px',
    border: 'none',
    cursor: 'pointer',
    position: 'relative',
    transition: 'transform 0.12s ease, box-shadow 0.12s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.55rem',
    fontWeight: 700,
    color: '#0f172a',
    outline: 'none',
    '&::before': {
      content: '""',
      position: 'absolute',
      bottom: '-4px',
      left: '2px',
      right: '2px',
      height: '4px',
      borderRadius: '0 0 3px 3px',
      backgroundColor: 'inherit',
      filter: 'brightness(0.6)'
    },
    '&:hover:not($seatReserved)': {
      transform: 'scale(1.15) translateY(-2px)',
      boxShadow: '0 4px 14px rgba(183,36,41,0.45)'
    }
  },
  seatReserved: {
    cursor: 'not-allowed',
    opacity: 0.4,
    '&:hover': { transform: 'none', boxShadow: 'none' }
  },
  seatSelected: {
    boxShadow: '0 0 10px rgba(183,36,41,0.6)',
    color: '#fff'
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
    width: '82%',
    margin: '14px 0 18px',
    padding: '8px 0',
    textAlign: 'center',
    fontSize: '0.7rem',
    fontWeight: 800,
    letterSpacing: '0.35em',
    color: '#64748b',
    borderTop: '1px dashed rgba(100,116,139,0.45)',
    borderBottom: '1px dashed rgba(100,116,139,0.45)',
    userSelect: 'none'
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
    width: '18px',
    height: '16px',
    borderRadius: '4px 4px 2px 2px',
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
    categoryBand: { width: '100%' },
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
  if (seatNumbering === 'pitampura-screen3' && rowLabel) {
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
  const third = Math.ceil(totalRows / 3);
  if (rowIndex < third) return CATEGORIES[0]; // GOLD — front
  if (rowIndex < third * 2) return CATEGORIES[1]; // PREMIUM — middle
  return CATEGORIES[2]; // CLASSIC — back
}

function getSeatBgColor(seatValue, category) {
  if (seatValue === 1) return SEAT_COLORS.reserved;
  if (seatValue === 2) return SEAT_COLORS.selected;
  if (seatValue === 3) return SEAT_COLORS.suggested;
  if (seatValue === 5) return SEAT_COLORS.special; // special, unselected
  if (seatValue === 6) return '#FFB800';            // special, selected (deeper gold)
  // Use a visible version of category color for available seats
  return category.color + '33'; // 20% opacity hex
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
  middleGapThreeRows = [],
  shiftRightPartRowsRight = [],
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
  const selectedTotalPrice = selectedSeats.reduce(
    (sum, [, , seatValue]) => sum + getSeatTicketPrice(movie, cinema, seatValue),
    0
  );

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
        const previousCategory =
          displayRowIndex > 0
            ? getCategory(
                renderRows[displayRowIndex - 1].originalRowIndex,
                totalRows,
                getRowLabel(renderRows[displayRowIndex - 1].originalRowIndex),
                seatNumbering
              )
            : null;
        const showBand = displayRowIndex === 0 || previousCategory.key !== category.key;
        const rowLetter = getRowLabel(originalRowIndex);

        if (rowLetter === 'WAY') {
          return (
            <div key={originalRowIndex} className={classes.walkwayRow}>
              WAY
            </div>
          );
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
        const rowShiftRight = shouldShiftByFirstRow || shouldShiftWholeRowByLabel ? 1 : 0;

        let displayRow = paddedRow;
        let displaySeatSourceMap = paddedRow.map((_, idx) => idx);

        if (rowShiftRight > 0) {
          displayRow = [...Array(rowShiftRight).fill(EMPTY_SEAT), ...paddedRow].slice(0, gridWidth);
          displaySeatSourceMap = displayRow.map((_, idx) => idx - rowShiftRight);
        } else if (
          shouldShiftLeftClusterOnly ||
          (Array.isArray(middleGapThreeRows) && middleGapThreeRows.includes(rowLetter)) ||
          (Array.isArray(shiftRightPartRowsRight) && shiftRightPartRowsRight.includes(rowLetter))
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
            const shouldIncreaseMiddleGap = Array.isArray(middleGapThreeRows)
              ? middleGapThreeRows.includes(rowLetter)
              : false;
            const shouldShiftRightClusterOnly = Array.isArray(shiftRightPartRowsRight)
              ? shiftRightPartRowsRight.includes(rowLetter)
              : false;
            const nextRow = Array(gridWidth).fill(EMPTY_SEAT);
            const nextMap = Array(gridWidth).fill(-1);
            const leftShift = shouldShiftLeftClusterOnly ? 1 : 0;
            const rightShift = shouldShiftRightClusterOnly ? 1 : 0;
            const leftCount = leftEnd - leftStart + 1;
            const baseGap = typeof rightStart === 'number' ? rightStart - leftEnd - 1 : 0;
            const targetGap = shouldIncreaseMiddleGap ? 3 : baseGap;
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
              <div className={classes.categoryBand}>
                <div
                  className={classes.categoryLine}
                  style={{ background: category.color }}
                />
                <span
                  className={classes.categoryLabel}
                  style={{
                    color: category.color,
                    background: category.bg,
                    border: `1px solid ${category.color}`
                  }}>
                  {category.label}
                </span>
                <div
                  className={classes.categoryLine}
                  style={{ background: category.color }}
                />
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
                      ? getSeatTicketPrice(movie, cinema, seatValue)
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
              <span className={classes.rowLabel}>{rowLetter}</span>
            </div>
          </Fragment>
        );
      })}

      {/* ── Legend ── */}
      <div className={classes.legend}>
        <div className={classes.legendItem}>
          <div
            className={classes.legendSeat}
            style={{ backgroundColor: '#42a5f533' }}
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
        <div className={classes.legendItem}>
          <div
            className={classes.legendSeat}
            style={{ backgroundColor: SEAT_COLORS.suggested }}
          />
          Suggested
        </div>
        <div className={classes.legendItem}>
          <div
            className={classes.legendSeat}
            style={{ backgroundColor: SEAT_COLORS.special }}
          />
          Special (Diamond)
        </div>
        <div className={classes.legendItem}>
          <span style={{ color: '#42a5f5', fontWeight: 700 }}>●</span> SILVER
        </div>
        <div className={classes.legendItem}>
          <span style={{ color: '#b72429', fontWeight: 700 }}>●</span> GOLD
        </div>
        <div className={classes.legendItem}>
          <span style={{ color: '#e040fb', fontWeight: 700 }}>●</span> PLATINUM
        </div>
      </div>

      {selectedCount > 0 && (
        <div className={classes.selectedSeatPriceBar}>
          {selectedCount} seat{selectedCount > 1 ? 's' : ''} selected : ₹{selectedTotalPrice}
        </div>
      )}

      {screenAtBottom && (
        <div className={classes.screenWrapper}>
          <div className={classes.screenCurve} />
          <span className={classes.screenLabel}>
            All Eyes This Way Please!
          </span>
        </div>
      )}
    </div>
  );
}
