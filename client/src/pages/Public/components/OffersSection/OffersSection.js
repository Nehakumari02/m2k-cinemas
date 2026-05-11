import React, { useState, useRef, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Typography, Button, IconButton, Dialog, DialogContent, Slide } from '@material-ui/core';
import { ChevronLeft, ChevronRight, Close } from '@material-ui/icons';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getOffers } from '../../../../store/actions';
import { normalizeImage } from '../../../../utils/imageUrl';

const useStyles = makeStyles(theme => ({
  '@keyframes pulse': {
    '0%': { boxShadow: '0 0 0 0 rgba(183,36,41,0.4)' },
    '70%': { boxShadow: '0 0 0 10px rgba(183,36,41,0)' },
    '100%': { boxShadow: '0 0 0 0 rgba(183,36,41,0)' },
  },
  section: {
    padding: theme.spacing(6, 0, 8),
    background: '#f8fafc',
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
    color: '#0f172a',
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
    border: '1px solid rgba(15,23,42,0.12)',
    color: '#64748b',
    transition: 'all 0.2s ease',
    '&:hover': {
      borderColor: '#b72429',
      color: '#b72429',
      background: 'rgba(183,36,41,0.08)',
    },
    '&.Mui-disabled': {
      color: 'rgba(100,116,139,0.35)',
      borderColor: 'rgba(15,23,42,0.06)',
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
    padding: theme.spacing(0, 4, 2),
    // Use margin for horizontal scroll — translateX on this ancestor can mirror text
    // inside cards in Safari when combined with opacity / layers.
    transition: 'margin-left 0.4s cubic-bezier(0.25,0.8,0.25,1)',
    willChange: 'margin-left',
  },
  trackWrap: {
    overflowX: 'hidden',
    overflowY: 'visible',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(3),
  },
  cardInner: {
    position: 'relative',
    width: '100%',
    height: '100%',
    cursor: 'pointer',
    transformStyle: 'preserve-3d',
    WebkitTransformStyle: 'preserve-3d',
    transition: 'transform 0.75s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  cardContainer: {
    minWidth: '320px',
    maxWidth: '320px',
    height: '340px',
    flexShrink: 0,
    isolation: 'isolate',
    perspective: '1100px',
    WebkitPerspective: '1100px',
    '&:hover $cardInner': {
      transform: 'rotateY(180deg)',
    },
    '&:hover $cardFace': {
      animation: 'none',
    },
    '&:hover $cardFront': {
      pointerEvents: 'none',
    },
    '&:hover $cardBack': {
      pointerEvents: 'auto',
    },
  },
  cardFace: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    left: 0,
    top: 0,
    borderRadius: '14px',
    overflow: 'hidden',
    background: '#ffffff',
    border: '1px solid rgba(15,23,42,0.08)',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 4px 12px rgba(15,23,42,0.05)',
    backfaceVisibility: 'hidden',
    WebkitBackfaceVisibility: 'hidden',
  },
  cardFront: {
    transform: 'rotateY(0deg) translateZ(1px)',
    WebkitTransform: 'rotateY(0deg) translateZ(1px)',
    animation: '$pulse 3s infinite',
  },
  cardBack: {
    transform: 'rotateY(180deg) translateZ(1px)',
    WebkitTransform: 'rotateY(180deg) translateZ(1px)',
    pointerEvents: 'none',
  },
  card: {
    display: 'none', // deprecated by new structure but kept to avoid breakage if referenced elsewhere
  },
  cardImage: {
    width: '100%',
    height: '180px',
    flexShrink: 0,
    objectFit: 'cover',
    display: 'block',
    borderBottom: '1px solid rgba(15,23,42,0.08)',
  },
  cardBody: {
    flex: 1,
    minHeight: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    padding: theme.spacing(2, 2.5, 2),
  },
  cardBodyMain: {
    flex: '0 0 auto',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  cardTitle: {
    fontSize: '0.92rem',
    fontWeight: 700,
    color: '#0f172a',
    marginBottom: theme.spacing(0.5),
    marginTop: 0,
    lineHeight: 1.4,
    overflow: 'hidden',
    maxHeight: '2.8em',
    display: 'block',
  },
  cardDesc: {
    fontSize: '0.78rem',
    color: '#64748b',
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
    gap: theme.spacing(1),
    borderTop: '1px solid rgba(15,23,42,0.08)',
    marginTop: 'auto',
    paddingTop: theme.spacing(1.5),
  },
  validTill: {
    fontSize: '0.7rem',
    color: '#64748b',
    '& span': {
      color: '#334155',
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
    alignSelf: 'flex-start',
  },
  dialogPaper: {
    backgroundColor: '#ffffff',
    color: '#0f172a',
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
    color: '#64748b',
    backgroundColor: 'rgba(15,23,42,0.08)',
    '&:hover': {
      backgroundColor: 'rgba(15,23,42,0.16)',
      color: '#0f172a',
    },
  },
  dialogTitle: {
    fontSize: '1.4rem',
    fontWeight: 800,
    marginBottom: theme.spacing(2),
    color: '#0f172a',
  },
  dialogDesc: {
    fontSize: '0.95rem',
    color: '#334155',
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
    color: '#64748b',
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
    color: '#ffffff',
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
    color: '#64748b',
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
  }, [getOffers]);

  const getOfferImage = offer => {
    const fallback = '/images/offers/offer1.png';
    if (!offer || !offer.image) return fallback;
    return normalizeImage(offer.image);
  };

  useEffect(() => {
    const track = trackRef.current;
    if (track && track.parentElement) {
      setMaxScroll(Math.max(0, track.scrollWidth - track.parentElement.offsetWidth));
    }
  }, [offers.length]);

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
        <div style={{ padding: '0 32px', color: '#64748b' }}>
          <Typography variant="body2">No active offers available right now.</Typography>
        </div>
      ) : (
        <div className={classes.trackWrap}>
          <div
            ref={trackRef}
            className={classes.track}
            style={{ marginLeft: `-${scrollPos}px` }}>
            {offers.map(offer => (
              <div key={offer._id} className={classes.cardContainer}>
                <div className={classes.cardInner}>
                  {/* Front Face */}
                  <div className={`${classes.cardFace} ${classes.cardFront}`}>
                    <img
                      className={classes.cardImage}
                      src={getOfferImage(offer)}
                      alt={offer.title}
                    />
                    <div className={classes.cardBody}>
                      <div className={classes.cardBodyMain}>
                        <span className={classes.codeBadge}>{offer.code}</span>
                        <Typography className={classes.cardTitle}>{offer.title}</Typography>
                      </div>
                      <div className={classes.cardFooter}>
                        <span className={classes.validTill}>
                          Valid till: <span>{new Date(offer.validTill).toLocaleDateString()}</span>
                        </span>
                        <Typography variant="caption" style={{ color: '#b72429', fontWeight: 700 }}>
                          Hover to Reveal
                        </Typography>
                      </div>
                    </div>
                  </div>

                  {/* Back Face — same layout as front; 3D flip on hover */}
                  <div
                    className={`${classes.cardFace} ${classes.cardBack}`}
                    onClick={() => setSelectedOffer(offer)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedOffer(offer);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`Offer details: ${offer.title}`}>
                    <img
                      className={classes.cardImage}
                      src={getOfferImage(offer)}
                      alt=""
                    />
                    <div className={classes.cardBody}>
                      <div className={classes.cardBodyMain}>
                        <span className={classes.codeBadge}>{offer.code}</span>
                        <Typography className={classes.cardTitle}>{offer.title}</Typography>
                      </div>
                      <div className={classes.cardFooter}>
                        <span className={classes.validTill}>
                          Valid till: <span>{new Date(offer.validTill).toLocaleDateString()}</span>
                        </span>
                        <Button type="button" className={classes.viewBtn} size="small" tabIndex={-1}>
                          View details
                        </Button>
                      </div>
                    </div>
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
