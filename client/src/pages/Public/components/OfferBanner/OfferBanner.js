import React from 'react';
import {
  Box,
  Typography,
  Button,
  makeStyles,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import ArrowRightAlt from '@material-ui/icons/ArrowRightAlt';
import ConfirmationNumberIcon from '@material-ui/icons/ConfirmationNumber';
import { normalizeImage } from '../../../../utils/imageUrl';
import styles from './styles';

const useStyles = makeStyles(styles);

function OfferBanner(props) {
  const { offer } = props;
  const classes = useStyles(props);

  if (!offer) return null;
  const imageUrl = normalizeImage(offer.image);

  return (
    <div className={classes.movieHero}>
      <div
        className={classes.heroBackdrop}
        style={{
          backgroundImage: `url("${imageUrl}")`
        }}
      />
      <div className={classes.infoSection}>
        <div className={classes.offerHeader}>
          <span className={classes.tag}>Limited Time Offer</span>

          <Typography
            className={classes.offerTitle}
            variant="h1"
            color="inherit">
            {offer.title}
          </Typography>

          <Typography
            className={classes.descriptionText}
            variant="body1"
            color="inherit">
            {offer.description}
          </Typography>

          <div className={classes.codeSection}>
            <div className={classes.promoCode}>
              {offer.code}
            </div>
            <Typography className={classes.validity} variant="body1">
              Valid until: <span>{new Date(offer.validTill).toLocaleDateString()}</span>
            </Typography>
          </div>

          <div className={classes.offerActions}>
            <Button variant="contained" className={classes.button} component={Link} to="/offers">
              Claim Now
              <ArrowRightAlt style={{ marginLeft: '8px' }} />
            </Button>
            <Button variant="contained" className={`${classes.button} ${classes.secondaryButton}`} component={Link} to="/offers">
              <ConfirmationNumberIcon style={{ marginRight: '8px', fontSize: '1.2rem' }} />
              View All Offers
            </Button>
          </div>
        </div>
      </div>

      {/* Poster-like image on the right */}
      <div className={classes.posterWrapper}>
        <img className={classes.posterImage} src={imageUrl} alt={offer.title} />
      </div>
    </div>
  );
}

export default OfferBanner;
