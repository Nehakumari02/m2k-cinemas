import React, { useEffect, useState, useMemo } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Typography, Button, Dialog, DialogContent, Slide, IconButton } from '@material-ui/core';
import { Close, School } from '@material-ui/icons';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getOffers } from '../../../store/actions';
import { normalizeImage } from '../../../utils/imageUrl';
import styles from './styles';

const useStyles = makeStyles(styles);

const OFFERS = [
  {
    id: 1,
    image: '/images/offers/offer1.png',
    title: 'Flat 50% OFF on Movie Tickets',
    description: 'Use code CINEMA50 and get flat 50% discount on all movie tickets. Valid on all shows.',
    validTill: 'Thu, May 30, 2026',
    code: 'CINEMA50',
    category: 'standard',
  },
  {
    id: 2,
    image: '/images/offers/offer2.png',
    title: 'Buy 1 Get 1 FREE – Weekend Shows',
    description: 'Grab your popcorn! Buy one ticket and get another free on all weekend shows.',
    validTill: 'Sun, Jun 30, 2026',
    code: 'BOGO',
    category: 'standard',
  },
  {
    id: 3,
    image: '/images/offers/offer3.png',
    title: 'Cashback up to ₹250 on UPI Payments',
    description: 'Pay using any UPI app and get assured cashback up to ₹250 on your booking.',
    validTill: 'Sat, May 31, 2026',
    code: 'UPI250',
    category: 'standard',
  },
  {
    id: 4,
    image: '/images/offers/offer4.png',
    title: 'Student Special – Tickets at just ₹99',
    description: 'Show your valid student ID and enjoy movies at just ₹99. Valid Monday to Thursday.',
    validTill: 'Tue, Jul 31, 2026',
    code: 'STUDENT99',
    category: 'standard',
  },
  {
    id: 'school-1',
    image: '/images/offers/offer4.png',
    title: 'School Group Booking — 30% Off',
    description:
      'Groups of 30+ students get 30% off. Use code at checkout or submit a school enquiry.',
    validTill: 'Wed, Dec 31, 2026',
    code: 'SCHOOL30',
    category: 'school_group',
    minTickets: 30,
    discountPercentage: 30,
  },
];

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function OfferCard({ offer, classes, getOfferImage, formatValidTill, onSelect }) {
  return (
    <div className={classes.cardContainer}>
      <div className={classes.cardInner}>
        <div className={`${classes.cardFace} ${classes.cardFront}`}>
          <img className={classes.cardImage} src={getOfferImage(offer)} alt={offer.title} />
          <div className={classes.cardBody}>
            <div className={classes.cardBodyMain}>
              <span className={classes.codeBadge}>{offer.code}</span>
              <Typography className={classes.cardTitle}>{offer.title}</Typography>
            </div>
            <div className={classes.cardFooter}>
              <span className={classes.validTill}>
                Valid till: <span>{formatValidTill(offer)}</span>
              </span>
              <Typography variant="caption" style={{ color: '#b72429', fontWeight: 700 }}>
                Hover to Reveal
              </Typography>
            </div>
          </div>
        </div>
        <div
          className={`${classes.cardFace} ${classes.cardBack}`}
          onClick={() => onSelect(offer)}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onSelect(offer);
            }
          }}
          role="button"
          tabIndex={0}
          aria-label={`Offer details: ${offer.title}`}>
          <img className={classes.cardImage} src={getOfferImage(offer)} alt="" />
          <div className={classes.cardBody}>
            <div className={classes.cardBodyMain}>
              <span className={classes.codeBadge}>{offer.code}</span>
              <Typography className={classes.cardTitle}>{offer.title}</Typography>
            </div>
            <div className={classes.cardFooter}>
              <span className={classes.validTill}>
                Valid till: <span>{formatValidTill(offer)}</span>
              </span>
              <Button type="button" className={classes.viewBtn} size="small" tabIndex={-1}>
                View details
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OffersPage({ offers: storeOffers, getOffers }) {
  const classes = useStyles();
  const [selectedOffer, setSelectedOffer] = useState(null);
  const allOffers = storeOffers && storeOffers.length > 0 ? storeOffers : OFFERS;

  const { schoolOffers, standardOffers } = useMemo(() => {
    const school = allOffers.filter(o => o.category === 'school_group');
    const standard = allOffers.filter(o => o.category !== 'school_group');
    return { schoolOffers: school, standardOffers: standard };
  }, [allOffers]);

  useEffect(() => {
    window.scrollTo(0, 0);
    getOffers();
  }, [getOffers]);

  const getOfferImage = offer => {
    const fallback = '/images/offers/offer1.png';
    if (!offer || !offer.image) return fallback;
    return normalizeImage(offer.image);
  };

  const formatValidTill = offer => {
    if (!offer || !offer.validTill) return '';
    const d = new Date(offer.validTill);
    return Number.isNaN(d.getTime()) ? String(offer.validTill) : d.toLocaleDateString();
  };

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <Typography className={classes.title}>Offers For You</Typography>
        <Typography className={classes.subtitle}>Exclusive deals to make your movie experience better</Typography>
        <div className={classes.titleAccent} />
      </div>

      <div className={classes.schoolBanner}>
        <School style={{ fontSize: 40, marginBottom: 8 }} />
        <Typography className={classes.schoolBannerTitle}>School Group Booking</Typography>
        <Typography className={classes.schoolBannerText}>
          Special rates for schools and colleges — block bookings, private screenings, and dedicated
          promo codes for 30+ students.
        </Typography>
        <Button
          component={Link}
          to="/school-group-booking"
          className={classes.schoolBannerBtn}
          variant="contained">
          View school offers &amp; enquire
        </Button>
      </div>

      {schoolOffers.length > 0 && (
        <>
          <Typography className={classes.sectionHeading}>School group offers</Typography>
          <div className={classes.grid}>
            {schoolOffers.map(offer => (
              <OfferCard
                key={offer._id || offer.id || offer.code}
                offer={offer}
                classes={classes}
                getOfferImage={getOfferImage}
                formatValidTill={formatValidTill}
                onSelect={setSelectedOffer}
              />
            ))}
          </div>
        </>
      )}

      {standardOffers.length > 0 && (
        <>
          <Typography className={classes.sectionHeading} style={{ marginTop: 32 }}>
            General offers
          </Typography>
          <div className={classes.grid}>
            {standardOffers.map(offer => (
              <OfferCard
                key={offer._id || offer.id || offer.code}
                offer={offer}
                classes={classes}
                getOfferImage={getOfferImage}
                formatValidTill={formatValidTill}
                onSelect={setSelectedOffer}
              />
            ))}
          </div>
        </>
      )}

      <Dialog
        open={Boolean(selectedOffer)}
        onClose={() => setSelectedOffer(null)}
        TransitionComponent={Transition}
        keepMounted
        classes={{ paper: classes.dialogPaper }}>
        {selectedOffer && (
          <>
            <div style={{ position: 'relative' }}>
              <img
                src={getOfferImage(selectedOffer)}
                alt={selectedOffer.title}
                className={classes.dialogImage}
              />
              <IconButton className={classes.closeBtn} onClick={() => setSelectedOffer(null)} size="small">
                <Close />
              </IconButton>
            </div>
            <DialogContent className={classes.dialogContent}>
              <Typography className={classes.dialogTitle}>{selectedOffer.title}</Typography>
              <Typography className={classes.dialogDesc}>{selectedOffer.description}</Typography>

              {selectedOffer.category === 'school_group' && (
                <Typography variant="body2" style={{ marginBottom: 16, color: '#64748b' }}>
                  {selectedOffer.minTickets > 0
                    ? `Minimum ${selectedOffer.minTickets} tickets when using this code online. `
                    : ''}
                  {selectedOffer.inquiryOnly
                    ? 'Enquiry only — submit via School Group Booking.'
                    : 'Or submit a group enquiry for a custom slot.'}
                </Typography>
              )}

              <div className={classes.dialogCodeBox}>
                <Typography className={classes.dialogCodeLabel}>Use Promo Code</Typography>
                <Typography className={classes.dialogCodeValue}>{selectedOffer.code}</Typography>
              </div>

              {selectedOffer.category === 'school_group' ? (
                <Button
                  fullWidth
                  className={classes.dialogAction}
                  component={Link}
                  to="/school-group-booking"
                  onClick={() => setSelectedOffer(null)}
                  style={{ marginBottom: 8 }}>
                  School group enquiry
                </Button>
              ) : null}

              <Button fullWidth className={classes.dialogAction} onClick={() => setSelectedOffer(null)}>
                Got It
              </Button>

              <Typography className={classes.termsText}>
                *Terms & Conditions apply. Valid till {formatValidTill(selectedOffer)}. Offer cannot be
                clubbed with any other promotion.
              </Typography>
            </DialogContent>
          </>
        )}
      </Dialog>
    </div>
  );
}

const mapStateToProps = ({ offerState }) => ({
  offers: offerState.offers,
});

export default connect(mapStateToProps, { getOffers })(OffersPage);
