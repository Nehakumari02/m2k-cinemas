import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles, Typography, IconButton } from '@material-ui/core';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

/** ~20% of a typical phone width */
export const PEEK_MENU_WIDTH = 108;

const QUICK_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/movies', label: 'Movies' },
  { to: '/showtimings', label: 'Shows' },
  { to: '/food-combos', label: 'Food' },
  { to: '/offers', label: 'Offers' },
];

const useStyles = makeStyles({
  root: {
    width: PEEK_MENU_WIDTH,
    maxHeight: '72vh',
    marginLeft: 6,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    borderRadius: '0 18px 18px 0',
    background: 'rgba(42, 42, 48, 0.9)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    boxShadow: '4px 0 24px rgba(0, 0, 0, 0.35)',
    padding: '12px 0 8px',
    boxSizing: 'border-box',
    overflow: 'hidden',
  },
  item: {
    display: 'block',
    padding: '13px 8px',
    textAlign: 'center',
    textDecoration: 'none',
    color: '#f8fafc',
    fontSize: '0.78rem',
    fontWeight: 500,
    letterSpacing: '0.02em',
    lineHeight: 1.25,
    borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
    transition: 'background 0.15s ease',
    '&:hover': {
      background: 'rgba(255, 255, 255, 0.1)',
    },
    '&:last-of-type': {
      borderBottom: 'none',
    },
  },
  moreWrap: {
    marginTop: 'auto',
    paddingTop: 6,
    borderTop: '1px solid rgba(255, 255, 255, 0.12)',
    display: 'flex',
    justifyContent: 'center',
  },
  moreBtn: {
    display: 'block',
    width: '100%',
    padding: '13px 8px',
    textAlign: 'center',
    cursor: 'pointer',
    color: '#e2e8f0',
    fontSize: '0.78rem',
    fontWeight: 500,
    border: 'none',
    background: 'none',
    transition: 'background 0.15s ease',
    '&:hover': {
      background: 'rgba(255, 255, 255, 0.1)',
    },
  },
});

export default function QuickSlideMenu({ onNavigate, onOpenFullMenu }) {
  const classes = useStyles();
  const close = () => onNavigate();

  return (
    <nav className={classes.root} aria-label="Quick navigation">
      {QUICK_LINKS.map(({ to, label }) => (
        <Link key={to} to={to} className={classes.item} onClick={close}>
          <Typography component="span" variant="body2" style={{ fontSize: 'inherit', fontWeight: 'inherit' }}>
            {label}
          </Typography>
        </Link>
      ))}
      <div className={classes.moreWrap} style={{ display: 'block', padding: 0 }}>
        <button
          className={classes.moreBtn}
          aria-label="Open full menu"
          onClick={() => {
            close();
            onOpenFullMenu();
          }}>
          <Typography component="span" variant="body2" style={{ fontSize: 'inherit', fontWeight: 'inherit' }}>
            Show more
          </Typography>
        </button>
      </div>
    </nav>
  );
}
