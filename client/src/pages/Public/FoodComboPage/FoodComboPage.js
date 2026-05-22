import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import {
  Typography,
  Grid,
  Button,
  Card,
  CardMedia,
  CardContent,
  Container,
  Chip,
  CircularProgress,
  IconButton,
  Box,
  Paper
} from '@material-ui/core';
import { Add as AddIcon, Remove as RemoveIcon, ShoppingBasket as CartIcon } from '@material-ui/icons';
import { getFood, addToFoodCart, updateFoodCartQuantity } from '../../../store/actions';
import { normalizeImage } from '../../../utils/imageUrl';
import styles from './styles';

const useStyles = makeStyles(styles);

const FoodComboPage = ({ getFood, foodState, cartItems, addToFoodCart, updateFoodCartQuantity }) => {
  const classes = useStyles();
  const [activeCategory, setActiveCategory] = React.useState('All');
  const { food, loading } = foodState;

  const today = new Date();
  const isWeekday = today.getDay() >= 1 && today.getDay() <= 5;
  const isMonthlyDealTime = today.getDate() <= 7;

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  useEffect(() => {
    window.scrollTo(0, 0);
    getFood();
  }, [getFood]);

  const getQty = itemId => {
    const found = cartItems.find(x => x._id === itemId);
    return found ? found.quantity : 0;
  };

  const handleUpdateQuantity = (item, delta) => {
    const currentQty = getQty(item._id);
    const newQty = currentQty + delta;
    if (newQty <= 0 && currentQty > 0) {
      updateFoodCartQuantity(item._id, 0);
    } else if (newQty > 0 && currentQty === 0) {
      addToFoodCart(item, newQty);
    } else if (newQty > 0) {
      updateFoodCartQuantity(item._id, newQty);
    }
  };

  return (
    <div className={classes.root}>
      <div className={classes.hero}>
        <video autoPlay loop muted playsInline className={classes.videoBackground}>
          <source src="/videos/food-banner.mp4" type="video/mp4" />
        </video>
        <div className={classes.heroOverlay} />
        <div className={classes.heroContent}>
          <Container maxWidth="md">
            <Typography variant="h1" className={classes.heroTitle}>
              Deliciously <span>Unmissable</span>
            </Typography>
            <Typography variant="h5" className={classes.heroSubtitle}>
              Order for pickup at the concession counter — separate checkout from movie tickets
            </Typography>
          </Container>
        </div>
      </div>

      <Container maxWidth="lg" className={classes.container} style={{ paddingBottom: cartCount > 0 ? 100 : undefined }}>
        <div className={classes.filterSection}>
          <Typography variant="h4" className={classes.sectionTitle}>
            Menu
          </Typography>
          <div className={classes.categoryChips}>
            {['All', 'Popcorn', 'Combos', 'Snacks', 'Beverages', 'Deals'].map(cat => (
              <Chip
                key={cat}
                label={cat}
                clickable
                onClick={() => setActiveCategory(cat)}
                className={cat === activeCategory ? classes.activeChip : classes.chip}
              />
            ))}
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px', width: '100%' }}>
            <CircularProgress style={{ color: '#b72429' }} />
          </div>
        ) : (
          <Grid container spacing={4}>
            {food
              .filter(item => {
                if (activeCategory === 'All') return true;
                if (activeCategory === 'Deals')
                  return (
                    item.category === 'Combos' ||
                    item.isWeeklyOffer ||
                    item.isMonthlyOffer ||
                    (isWeekday && item.category === 'Combos')
                  );
                return item.category === activeCategory;
              })
              .map(item => {
                const qty = getQty(item._id);
                return (
                  <Grid item key={item._id} xs={12} sm={6} md={4}>
                    <Card className={classes.card}>
                      <div
                        className={classes.media}
                        style={{
                          backgroundImage: `url(${normalizeImage(item.image)})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }}>
                        {item.category === 'Combos' && <div className={classes.dealBadge}>Best Value</div>}
                        {(item.isWeeklyOffer || (isWeekday && item.category === 'Combos')) && (
                          <div className={classes.weekdayBadge}>⭐ Weekday Special</div>
                        )}
                        {(item.isMonthlyOffer ||
                          (isMonthlyDealTime && item.name.toLowerCase().includes('popcorn'))) && (
                          <div
                            className={classes.weekdayBadge}
                            style={{
                              backgroundColor: '#673ab7',
                              boxShadow: '0 4px 12px rgba(103, 58, 183, 0.3)',
                            }}>
                            📅 Monthly Offer
                          </div>
                        )}
                        <div className={classes.typeIndicator}>
                          <div className={item.type === 'veg' ? classes.vegDot : classes.nonVegDot} />
                        </div>
                      </div>
                      <CardContent className={classes.content}>
                        <Typography variant="overline" className={classes.category}>
                          {item.category}
                        </Typography>
                        <Typography variant="h5" className={classes.name}>
                          {item.name}
                        </Typography>
                        <Typography variant="body2" className={classes.description}>
                          {item.description}
                        </Typography>
                        <div className={classes.footer}>
                          <Typography variant="h6" className={classes.price}>
                            {(item.category === 'Combos' || item.isWeeklyOffer || item.isMonthlyOffer) && (
                              <span className={classes.originalPrice}>₹{Math.round(item.price * 1.2)}</span>
                            )}
                            ₹{item.price}
                          </Typography>
                          {qty > 0 ? (
                            <div className={classes.quantityControls}>
                              <IconButton
                                size="small"
                                className={classes.btn}
                                onClick={() => handleUpdateQuantity(item, -1)}>
                                <RemoveIcon fontSize="small" />
                              </IconButton>
                              <Typography className={classes.quantity}>{qty}</Typography>
                              <IconButton
                                size="small"
                                className={classes.btn}
                                onClick={() => handleUpdateQuantity(item, 1)}>
                                <AddIcon fontSize="small" />
                              </IconButton>
                            </div>
                          ) : (
                            <Button
                              variant="contained"
                              className={classes.addBtn}
                              onClick={() => handleUpdateQuantity(item, 1)}>
                              Add
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
          </Grid>
        )}
      </Container>

      {cartCount > 0 && (
        <Paper
          elevation={8}
          style={{
            position: 'fixed',
            bottom: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1200,
            padding: '14px 24px',
            borderRadius: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            maxWidth: '90vw',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}>
          <Box display="flex" alignItems="center" style={{ gap: 8 }}>
            <CartIcon style={{ color: '#b72429' }} />
            <Typography style={{ fontWeight: 700 }}>
              {cartCount} item{cartCount > 1 ? 's' : ''} · ₹{cartTotal}
            </Typography>
          </Box>
          <Button variant="outlined" component={Link} to="/food-cart" style={{ borderColor: '#b72429', color: '#b72429' }}>
            View cart
          </Button>
          <Button
            variant="contained"
            component={Link}
            to="/food-checkout"
            style={{ background: '#b72429', color: '#fff', fontWeight: 700 }}>
            Checkout & pay
          </Button>
        </Paper>
      )}
    </div>
  );
};

const mapStateToProps = state => ({
  foodState: state.foodState,
  cartItems: state.foodCartState.cartItems,
});

export default connect(mapStateToProps, { getFood, addToFoodCart, updateFoodCartQuantity })(FoodComboPage);
