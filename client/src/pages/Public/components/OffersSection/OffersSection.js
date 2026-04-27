import React, { useState, useRef, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Typography, Button, IconButton, Dialog, DialogContent, Slide } from '@material-ui/core';
import { ChevronLeft, ChevronRight, Close } from '@material-ui/icons';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getOffers } from '../../../../store/actions';

const useStyles = makeStyles(theme => ({
  section: {
    padding: theme.spacing(6, 0, 8),
    background: 'rgb(14,14,20)',
    overflow: 'hidden',
  },
  headerRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(0, 4, 3),
  },
  titleBlock: {
    display: 'flex',
    flexDirection: 'column',
  },
  sectionTitle: {
    fontSize: '1.6rem',
    fontWeight: 800,
    color: '#fff',
    letterSpacing: '-0.01em',
  },
  titleAccent: {
    width: '45px',
    height: '3px',
    background: '#b72429',
    borderRadius: '2px',
    marginTop: '8px',
  },
  navGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  navBtn: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.1)',
    color: 'rgba(255,255,255,0.5)',
    transition: 'all 0.2s ease',
    '&:hover': {
      borderColor: '#b72429',
      color: '#b72429',
      background: 'rgba(183,36,41,0.08)',
    },
    '&.Mui-disabled': {
      color: 'rgba(255,255,255,0.15)',
      borderColor: 'rgba(255,255,255,0.05)',
    },
  },
  seeAllBtn: {
    color: '#b72429',
    fontWeight: 700,
    fontSize: '0.85rem',
    letterSpacing: '0.03em',
    textTransform: 'none',
    borderRadius: '10px',
    border: '1px solid rgba(183,36,41,0.3)',
    padding: '6px 18px',
    '&:hover': {
      background: 'rgba(183,36,41,0.08)',
      borderColor: '#b72429',
    },
  },
  track: {
    display: 'flex',
    gap: theme.spacing(3),
    padding: theme.spacing(0, 4),
    transition: 'transform 0.4s cubic-bezier(0.25,0.8,0.25,1)',
    willChange: 'transform',
  },
  card: {
    minWidth: '320px',
    maxWidth: '320px',
    borderRadius: '14px',
    overflow: 'hidden',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.06)',
    flexShrink: 0,
    transition: 'transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
    cursor: 'pointer',
    '&:hover': {
      transform: 'translateY(-4px)',
      borderColor: 'rgba(183,36,41,0.25)',
      boxShadow: '0 12px 30px rgba(0,0,0,0.4)',
    },
  },
  cardImage: {
    width: '100%',
    height: '180px',
    objectFit: 'cover',
    display: 'block',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
  },
  cardBody: {
    padding: theme.spacing(2, 2.5),
  },
  cardTitle: {
    fontSize: '0.92rem',
    fontWeight: 700,
    color: '#fff',
    marginBottom: theme.spacing(0.5),
    lineHeight: 1.4,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  cardDesc: {
    fontSize: '0.78rem',
    color: 'rgba(255,255,255,0.45)',
    lineHeight: 1.6,
    marginBottom: theme.spacing(1.5),
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  cardFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTop: '1px solid rgba(255,255,255,0.06)',
    paddingTop: theme.spacing(1.5),
  },
  validTill: {
    fontSize: '0.7rem',
    color: 'rgba(255,255,255,0.35)',
    '& span': {
      color: 'rgba(255,255,255,0.6)',
      fontWeight: 600,
    },
  },
  viewBtn: {
    fontSize: '0.78rem',
    fontWeight: 700,
    color: '#b72429',
    borderRadius: '8px',
    border: '1px solid rgba(183,36,41,0.3)',
    padding: '4px 16px',
    textTransform: 'none',
    minWidth: 'auto',
    '&:hover': {
      background: 'rgba(183,36,41,0.1)',
      borderColor: '#b72429',
    },
  },
  codeBadge: {
    display: 'inline-block',
    padding: '2px 10px',
    borderRadius: '6px',
    fontSize: '0.68rem',
    fontWeight: 800,
    letterSpacing: '0.08em',
    color: '#b72429',
    background: 'rgba(183,36,41,0.1)',
    border: '1px dashed rgba(183,36,41,0.35)',
    marginBottom: theme.spacing(1.5),
  },
  dialogPaper: {
    backgroundColor: '#1a1a24',
    color: '#fff',
    borderRadius: '16px',
    overflow: 'hidden',
    maxWidth: '500px',
  },
  dialogImage: {
    width: '100%',
    height: '250px',
    objectFit: 'cover',
    display: 'block',
  },
  dialogContent: {
    padding: theme.spacing(4),
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute',
    top: theme.spacing(2),
    right: theme.spacing(2),
    color: 'rgba(255,255,255,0.6)',
    backgroundColor: 'rgba(0,0,0,0.4)',
    '&:hover': {
      backgroundColor: 'rgba(0,0,0,0.6)',
      color: '#fff',
    },
  },
  dialogTitle: {
    fontSize: '1.4rem',
    fontWeight: 800,
    marginBottom: theme.spacing(2),
    color: '#fff',
  },
  dialogDesc: {
    fontSize: '0.95rem',
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 1.6,
    marginBottom: theme.spacing(3),
  },
  dialogCodeBox: {
    backgroundColor: 'rgba(183,36,41,0.1)',
    border: '2px dashed rgba(183,36,41,0.4)',
    borderRadius: '12px',
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: theme.spacing(3),
  },
  dialogCodeLabel: {
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: 'rgba(255,255,255,0.5)',
    marginBottom: theme.spacing(1),
  },
  dialogCodeValue: {
    fontSize: '1.4rem',
    fontWeight: 800,
    color: '#b72429',
    letterSpacing: '0.1em',
  },
  dialogAction: {
    backgroundColor: '#b72429',
    color: '#fff',
    padding: theme.spacing(1.5),
    fontWeight: 700,
    fontSize: '1rem',
    borderRadius: '8px',
    '&:hover': {
      backgroundColor: '#9a1e22',
    },
  },
  termsText: {
    fontSize: '0.7rem',
    color: 'rgba(255,255,255,0.4)',
    textAlign: 'center',
    marginTop: theme.spacing(3),
  }
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function OffersSection({ offers: storeOffers, getOffers }) {
  const classes = useStyles();
  const trackRef = useRef(null);
  const offers = storeOffers || [];
  const [scrollPos, setScrollPos] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  const [selectedOffer, setSelectedOffer] = useState(null);

  useEffect(() => {
    getOffers();
  }, [offers]);

  const getOfferImage = offer => {
    const fallback = '/images/offers/offer1.png';
    if (!offer || !offer.image) return fallback;
    if (offer.image.startsWith('http://') || offer.image.startsWith('https://')) {
      return encodeURI(offer.image);
    }
    return encodeURI(offer.image.startsWith('/') ? offer.image : `/${offer.image}`);
  };

  useEffect(() => {
    const track = trackRef.current;
    if (track) {
      setMaxScroll(track.scrollWidth - track.parentElement.offsetWidth);
    }
  }, []);

  const scroll = dir => {
    const step = 340;
    const next = dir === 'left'
      ? Math.max(0, scrollPos - step)
      : Math.min(maxScroll, scrollPos + step);
    setScrollPos(next);
  };

  return (
    <section className={classes.section}>
      <div className={classes.headerRow}>
        <div className={classes.titleBlock}>
          <Typography className={classes.sectionTitle}>Offers For You</Typography>
          <div className={classes.titleAccent} />
        </div>
        <div className={classes.navGroup}>
          <IconButton
            className={classes.navBtn}
            onClick={() => scroll('left')}
            disabled={scrollPos <= 0}
            size="small">
            <ChevronLeft />
          </IconButton>
          <IconButton
            className={classes.navBtn}
            onClick={() => scroll('right')}
            disabled={scrollPos >= maxScroll}
            size="small">
            <ChevronRight />
          </IconButton>
          <Button component={Link} to="/offers" className={classes.seeAllBtn}>
            See all →
          </Button>
        </div>
      </div>

      {!offers.length ? (
        <div style={{ padding: '0 32px', color: 'rgba(255,255,255,0.5)' }}>
          <Typography variant="body2">No active offers available right now.</Typography>
        </div>
      ) : (
        <div style={{ overflow: 'hidden', padding: '4px 0' }}>
          <div
            ref={trackRef}
            className={classes.track}
            style={{ transform: `translateX(-${scrollPos}px)` }}>
            {offers.map(offer => (
              <div
                key={offer._id}
                className={classes.card}
                onClick={() => setSelectedOffer(offer)}
              >
                <img
                  className={classes.cardImage}
                  src={getOfferImage(offer)}
                  alt={offer.title}
                />
                <div className={classes.cardBody}>
                  <span className={classes.codeBadge}>{offer.code}</span>
                  <Typography className={classes.cardTitle}>{offer.title}</Typography>
                  <Typography className={classes.cardDesc}>{offer.description}</Typography>
                  <div className={classes.cardFooter}>
                    <span className={classes.validTill}>
                      Valid till: <span>{new Date(offer.validTill).toLocaleDateString()}</span>
                    </span>
                    <Button className={classes.viewBtn} size="small">
                      View
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Dialog
        open={Boolean(selectedOffer)}
        onClose={() => setSelectedOffer(null)}
        TransitionComponent={Transition}
        keepMounted
        classes={{ paper: classes.dialogPaper }}
      >
        {selectedOffer && (
          <>
            <div style={{ position: 'relative' }}>
              <img src={getOfferImage(selectedOffer)} alt={selectedOffer.title} className={classes.dialogImage} />
              <IconButton className={classes.closeBtn} onClick={() => setSelectedOffer(null)} size="small">
                <Close />
              </IconButton>
            </div>
            <DialogContent className={classes.dialogContent}>
              <Typography className={classes.dialogTitle}>{selectedOffer.title}</Typography>
              <Typography className={classes.dialogDesc}>{selectedOffer.description}</Typography>
              
              <div className={classes.dialogCodeBox}>
                <Typography className={classes.dialogCodeLabel}>Use Promo Code</Typography>
                <Typography className={classes.dialogCodeValue}>{selectedOffer.code}</Typography>
              </div>

              <Button fullWidth className={classes.dialogAction} onClick={() => setSelectedOffer(null)}>
                Got It
              </Button>

              <Typography className={classes.termsText}>
                *Terms & Conditions apply. Valid till {selectedOffer.validTill}. Offer cannot be clubbed with any other promotion.
              </Typography>
            </DialogContent>
          </>
        )}
      </Dialog>
    </section>
  );
}

const mapStateToProps = ({ offerState }) => ({
  offers: offerState.offers,
});

export default connect(mapStateToProps, { getOffers })(OffersSection);
