import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Typography, Button, Chip } from '@material-ui/core';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import RestaurantIcon from '@material-ui/icons/Restaurant';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(3),
    padding: theme.spacing(2.5, 3),
    borderRadius: 14,
    background: 'linear-gradient(135deg, rgba(183, 36, 41, 0.12) 0%, rgba(15, 23, 42, 0.04) 100%)',
    border: '2px dashed rgba(183, 36, 41, 0.45)',
    boxShadow: '0 8px 24px rgba(183, 36, 41, 0.08)',
  },
  paidBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    color: '#166534',
    fontWeight: 700,
    fontSize: '0.85rem',
    marginBottom: theme.spacing(1.5),
  },
  eyebrow: {
    color: '#b72429',
    fontWeight: 800,
    fontSize: '0.7rem',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    marginBottom: theme.spacing(0.75),
  },
  title: {
    fontWeight: 800,
    color: '#0f172a',
    fontSize: '1.25rem',
    marginBottom: theme.spacing(1),
    lineHeight: 1.3,
  },
  subtitle: {
    color: '#475569',
    fontSize: '0.95rem',
    lineHeight: 1.6,
    marginBottom: theme.spacing(2),
  },
  discountBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#b72429',
    color: '#fff',
    fontWeight: 800,
    fontSize: '0.85rem',
    padding: '6px 14px',
    borderRadius: 999,
    marginBottom: theme.spacing(2),
  },
  codesLabel: {
    fontWeight: 700,
    color: '#64748b',
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: theme.spacing(1),
  },
  codesRow: {
    display: 'flex',
    flexWrap: 'wrap',
    marginBottom: theme.spacing(2),
  },
  codeChip: {
    marginRight: 8,
    marginBottom: 8,
    fontWeight: 700,
    backgroundColor: '#fff',
    border: '1px solid rgba(183, 36, 41, 0.35)',
    color: '#b72429',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: 'rgba(183, 36, 41, 0.08)',
    },
  },
  actions: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 12,
  },
  addBtn: {
    background: 'linear-gradient(90deg, #b72429, #8b1c20)',
    color: '#fff',
    fontWeight: 800,
    borderRadius: 8,
    padding: '10px 28px',
    textTransform: 'none',
    '&:hover': {
      background: 'linear-gradient(90deg, #8b1c20, #6d1518)',
    },
  },
  hint: {
    color: '#64748b',
    fontSize: '0.8rem',
  },
}));

const getActiveOffers = (offers = []) =>
  offers.filter(offer => offer.isActive && new Date(offer.validTill) > new Date());

export default function BookingFoodLastChance({
  variant = 'postPayment',
  offers = [],
  onOrderFood,
}) {
  const classes = useStyles();
  const activeOffers = getActiveOffers(offers);
  const maxDiscount = activeOffers.length
    ? Math.max(...activeOffers.map(o => Number(o.discountPercentage) || 0))
    : 10;

  const handleCodeClick = offer => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(offer.code);
    }
    if (onOrderFood) onOrderFood();
  };

  const isPostPayment = variant === 'postPayment';

  return (
    <div className={classes.root}>
      {isPostPayment && (
        <div className={classes.paidBadge}>
          <CheckCircleIcon style={{ fontSize: 18 }} />
          Payment successful — tickets booked!
        </div>
      )}
      <Typography className={classes.eyebrow}>Last chance</Typography>
      <Typography className={classes.title}>
        Forgot to add something? 🍿
      </Typography>
      <Typography className={classes.subtitle}>
        {isPostPayment
          ? 'You paid for tickets without snacks or combos. Order food now and use a code below for a discount at our Food & Combos counter or online.'
          : 'You skipped snacks & combos. Add food before you pay and save on your order.'}
      </Typography>

      <div className={classes.discountBadge}>
        <LocalOfferIcon style={{ fontSize: 18 }} />
        Up to {maxDiscount}% off on food & combos
      </div>

      {activeOffers.length > 0 ? (
        <>
          <Typography className={classes.codesLabel}>
            Your discount codes
          </Typography>
          <div className={classes.codesRow}>
            {activeOffers.map(offer => (
              <Chip
                key={offer._id}
                icon={<RestaurantIcon style={{ color: '#b72429' }} />}
                label={`${offer.code} — ${offer.discountPercentage}% OFF`}
                className={classes.codeChip}
                onClick={() => handleCodeClick(offer)}
                clickable
              />
            ))}
          </div>
          <Typography className={classes.hint} style={{ marginBottom: 16 }}>
            Tap a code to copy it, then order food.
          </Typography>
        </>
      ) : (
        <Typography className={classes.hint} style={{ marginBottom: 16 }}>
          Browse popcorn, combos, and drinks on our Food & Combos page.
        </Typography>
      )}

      <div className={classes.actions}>
        <Button className={classes.addBtn} onClick={onOrderFood}>
          Order Food & Combos
        </Button>
        <Typography className={classes.hint}>
          Show your code at the counter when you collect snacks.
        </Typography>
      </div>
    </div>
  );
}
