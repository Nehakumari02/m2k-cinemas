import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Typography, Button, Dialog, DialogContent, Slide, IconButton } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { connect } from 'react-redux';
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
  },
  {
    id: 2,
    image: '/images/offers/offer2.png',
    title: 'Buy 1 Get 1 FREE – Weekend Shows',
    description: 'Grab your popcorn! Buy one ticket and get another free on all weekend shows.',
    validTill: 'Sun, Jun 30, 2026',
    code: 'BOGO',
  },
  {
    id: 3,
    image: '/images/offers/offer3.png',
    title: 'Cashback up to ₹250 on UPI Payments',
    description: 'Pay using any UPI app and get assured cashback up to ₹250 on your booking.',
    validTill: 'Sat, May 31, 2026',
    code: 'UPI250',
  },
  {
    id: 4,
    image: '/images/offers/offer4.png',
    title: 'Student Special – Tickets at just ₹99',
    description: 'Show your valid student ID and enjoy movies at just ₹99. Valid Monday to Thursday.',
    validTill: 'Tue, Jul 31, 2026',
    code: 'STUDENT99',
  },
];

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function OffersPage({ offers: storeOffers, getOffers }) {
  const classes = useStyles();
  const [selectedOffer, setSelectedOffer] = useState(null);
  const offers = (storeOffers && storeOffers.length > 0) ? storeOffers : OFFERS;

  useEffect(() => {
    window.scrollTo(0, 0);
    getOffers();
  }, []);

  const handleOfferClick = (offer) => {
    setSelectedOffer(offer);
  };

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <Typography className={classes.title}>Offers For You</Typography>
        <Typography className={classes.subtitle}>Exclusive deals to make your movie experience better</Typography>
        <div className={classes.titleAccent} />
      </div>

      <div className={classes.grid}>
        {offers.map(offer => (
          <div 
            key={offer.id} 
            className={classes.card}
            onClick={() => handleOfferClick(offer)}
          >
            <img
              className={classes.cardImage}
              src={normalizeImage(offer.image)}
              alt={offer.title}
            />
            <div className={classes.cardBody}>
              <span className={classes.codeBadge}>{offer.code}</span>
              <Typography className={classes.cardTitle}>{offer.title}</Typography>
              <Typography className={classes.cardDesc}>{offer.description}</Typography>
              <div className={classes.cardFooter}>
                <span className={classes.validTill}>
                  Valid till: <span>{offer.validTill}</span>
                </span>
                <Button className={classes.viewBtn} size="small">
                  View Offer
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

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
              <img src={normalizeImage(selectedOffer.image)} alt={selectedOffer.title} className={classes.dialogImage} />
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
    </div>
  );
}

const mapStateToProps = ({ offerState }) => ({
  offers: offerState.offers,
});

export default connect(mapStateToProps, { getOffers })(OffersPage);
