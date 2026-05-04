import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/styles';
import classNames from 'classnames';

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
    display: 'flex',
    gap: '4px',
    flexWrap: 'nowrap',
    justifyContent: 'center'
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

function getCategory(rowIndex, totalRows) {
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

export default function BookingSeats({ seats, onSelectSeat }) {
  const classes = useStyles();

  if (!seats || seats.length === 0) return null;

  const totalRows = seats.length;
  const third = Math.ceil(totalRows / 3);
  const categoryBreaks = [0, third, third * 2];

  // Aisle gap in the middle
  const aisleAt = seats[0] ? Math.floor(seats[0].length / 2) : -1;

  return (
    <div className={classes.wrapper}>
      {/* ── Screen ── */}
      <div className={classes.screenWrapper}>
        <div className={classes.screenCurve} />
        <span className={classes.screenLabel}>
          All Eyes This Way Please!
        </span>
      </div>

      {/* ── Seat Grid ── */}
      {seats.map((seatRow, rowIndex) => {
        const category = getCategory(rowIndex, totalRows);
        const showBand = categoryBreaks.includes(rowIndex);
        const rowLetter = ROW_LETTERS[rowIndex] || String(rowIndex + 1);

        return (
          <Fragment key={rowIndex}>
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
              <div className={classes.seatsGroup}>
                {seatRow.map((seatValue, seatIndex) => {
                  return (
                    <Fragment key={seatIndex}>
                      {seatIndex === aisleAt && (
                        <div className={classes.aisleGap} />
                      )}
                      <button
                        className={classNames(
                          classes.seat,
                          seatValue === 1 && classes.seatReserved,
                          seatValue === 2 && classes.seatSelected,
                          (seatValue === 5 || seatValue === 6) && classes.seatSpecial
                        )}
                        style={{ backgroundColor: getSeatBgColor(seatValue, category) }}
                        onClick={() =>
                          seatValue !== 1 && onSelectSeat(rowIndex, seatIndex)
                        }
                        title={`Row ${rowLetter} Seat ${seatIndex + 1}${
                          seatValue === 1 ? ' (Reserved)' : ''
                        }`}>
                        {seatIndex + 1}
                      </button>
                    </Fragment>
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
          <span style={{ color: '#b72429', fontWeight: 700 }}>●</span> GOLD
        </div>
        <div className={classes.legendItem}>
          <span style={{ color: '#e040fb', fontWeight: 700 }}>●</span> PREMIUM
        </div>
        <div className={classes.legendItem}>
          <span style={{ color: '#42a5f5', fontWeight: 700 }}>●</span> CLASSIC
        </div>
      </div>
    </div>
  );
}
