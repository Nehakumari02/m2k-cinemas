import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  bar: {
    width: '100%',
    background: 'linear-gradient(90deg, #b72429 0%, #8b1c20 100%)',
    padding: '0 5%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    flexWrap: 'wrap',
    boxShadow: '0 4px 24px rgba(183,36,41,0.25)',
    position: 'relative',
    zIndex: 10,
  },
  label: {
    fontWeight: 800,
    fontSize: '1rem',
    color: '#14141c',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
    padding: '18px 0',
    marginRight: '8px',
  },
  selectWrapper: {
    position: 'relative',
    flex: '1 1 180px',
    maxWidth: '260px',
    minWidth: '160px',
  },
  select: {
    width: '100%',
    padding: '12px 40px 12px 16px',
    backgroundColor: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '0.92rem',
    fontWeight: 600,
    color: '#14141c',
    cursor: 'pointer',
    appearance: 'none',
    WebkitAppearance: 'none',
    boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
    outline: 'none',
    '&:focus': {
      boxShadow: '0 0 0 3px rgba(183,36,41,0.5)'
    }
  },
  selectArrow: {
    position: 'absolute',
    right: '14px',
    top: '50%',
    transform: 'translateY(-50%)',
    pointerEvents: 'none',
    color: '#14141c',
    fontSize: '0.7rem',
  },
  bookBtn: {
    padding: '12px 32px',
    backgroundColor: '#14141c',
    color: '#b72429',
    border: 'none',
    borderRadius: '6px',
    fontSize: '0.95rem',
    fontWeight: 800,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
    boxShadow: '0 2px 10px rgba(0,0,0,0.25)',
    '&:hover': {
      backgroundColor: '#000',
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
    }
  },
  [theme.breakpoints.down('sm')]: {
    bar: {
      padding: '12px 16px',
      gap: '8px',
    },
    label: {
      display: 'none'
    },
    selectWrapper: {
      maxWidth: '100%',
      flex: '1 1 140px',
    }
  }
}));

function QuickBookBar({ movies = [], cinemas = [] }) {
  const classes = useStyles();
  const history = useHistory();
  const [selectedMovie, setSelectedMovie] = useState('');

  const today = new Date();
  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return {
      value: d.toISOString().split('T')[0],
      label: i === 0
        ? 'Today'
        : i === 1
        ? 'Tomorrow'
        : d.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })
    };
  });

  const handleBook = () => {
    if (selectedMovie) {
      history.push(`/movie/${selectedMovie}`);
    } else {
      history.push('/movie/category/nowShowing');
    }
  };

  return (
    <div className={classes.bar}>
      <span className={classes.label}>🎬 Quick Book</span>

      <div className={classes.selectWrapper}>
        <select
          className={classes.select}
          value={selectedMovie}
          onChange={e => setSelectedMovie(e.target.value)}
        >
          <option value="">Select Movie</option>
          {movies.map(m => (
            <option key={m._id} value={m._id}>{m.title}</option>
          ))}
        </select>
        <span className={classes.selectArrow}>▼</span>
      </div>

      <div className={classes.selectWrapper}>
        <select className={classes.select} defaultValue="">
          <option value="">Select Date</option>
          {dates.map(d => (
            <option key={d.value} value={d.value}>{d.label}</option>
          ))}
        </select>
        <span className={classes.selectArrow}>▼</span>
      </div>

      <div className={classes.selectWrapper}>
        <select className={classes.select} defaultValue="">
          <option value="">Select Cinema</option>
          {cinemas.map(c => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>
        <span className={classes.selectArrow}>▼</span>
      </div>

      <button className={classes.bookBtn} onClick={handleBook}>
        Book Now
      </button>
    </div>
  );
}

export default QuickBookBar;
