import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Typography, Grid, Button, Card, CardContent, CircularProgress, IconButton, Box, Chip } from '@material-ui/core';
import { Add as AddIcon, Remove as RemoveIcon } from '@material-ui/icons';
import { connect } from 'react-redux';
import { getFood, setSelectedFood } from '../../../../../store/actions';
import { normalizeImage } from '../../../../../utils/imageUrl';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4, 0),
    background: '#fff',
    borderRadius: 16,
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(4),
  },
  headerBox: {
    padding: theme.spacing(0, 3),
    marginBottom: theme.spacing(3),
  },
  title: {
    fontWeight: 800,
    color: '#111827',
    fontSize: '1.8rem',
  },
  categoryChips: {
    display: 'flex',
    gap: theme.spacing(1),
    overflowX: 'auto',
    padding: theme.spacing(0, 3, 2, 3),
    marginBottom: theme.spacing(2),
    '&::-webkit-scrollbar': { height: 0 },
  },
  chip: {
    backgroundColor: '#f3f4f6',
    color: '#4b5563',
    fontWeight: 600,
    padding: '20px 10px',
    fontSize: '0.9rem',
    cursor: 'pointer',
    '&:hover': { backgroundColor: '#e5e7eb' }
  },
  activeChip: {
    backgroundColor: '#b72429',
    color: '#fff',
    fontWeight: 600,
    padding: '20px 10px',
    fontSize: '0.9rem',
    cursor: 'pointer',
    '&:hover': { backgroundColor: '#9a1e22' }
  },
  gridContainer: {
    padding: theme.spacing(0, 3),
  },
  card: {
    position: 'relative',
    height: '100%',
    borderRadius: '16px',
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    border: 'none',
    boxShadow: '0 12px 28px rgba(0,0,0,0.12), 0 4px 10px rgba(0,0,0,0.08)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    '&:hover': {
      transform: 'translateY(-8px)',
      boxShadow: '0 24px 48px rgba(0,0,0,0.18), 0 8px 16px rgba(0,0,0,0.12)'
    }
  },
  imageWrapper: {
    position: 'relative',
    overflow: 'hidden',
    height: 200,
  },
  media: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  typeIndicator: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#fff',
    padding: 6,
    borderRadius: '50%',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
  },
  vegDot: {
    width: 12, height: 12, borderRadius: '2px', border: '2px solid #2e7d32', position: 'relative',
    '&:after': { content: '""', position: 'absolute', width: 6, height: 6, borderRadius: '50%', backgroundColor: '#2e7d32', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }
  },
  nonVegDot: {
    width: 12, height: 12, borderRadius: '2px', border: '2px solid #c62828', position: 'relative',
    '&:after': { content: '""', position: 'absolute', width: 6, height: 6, borderRadius: '50%', backgroundColor: '#c62828', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }
  },
  content: {
    padding: theme.spacing(3)
  },
  category: {
    color: '#b72429',
    fontWeight: 700,
    fontSize: '0.75rem',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  name: {
    fontWeight: 800,
    color: '#111827',
    fontSize: '1.2rem',
    marginBottom: 8,
  },
  description: {
    color: '#6b7280',
    fontSize: '0.85rem',
    marginBottom: theme.spacing(3),
    minHeight: '40px',
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTop: '1px solid #f3f4f6',
    paddingTop: theme.spacing(2)
  },
  price: {
    fontWeight: 800,
    color: '#111827',
    fontSize: '1.2rem',
  },
  originalPrice: {
    textDecoration: 'line-through',
    color: '#9ca3af',
    fontSize: '0.9rem',
    fontWeight: 500,
    marginRight: 8,
  },
  addBtn: {
    backgroundColor: '#b72429',
    color: '#fff',
    borderRadius: '8px',
    padding: '6px 20px',
    fontWeight: 700,
    textTransform: 'none',
    '&:hover': { backgroundColor: '#9a1e22' }
  },
  quantityControls: { display: 'flex', alignItems: 'center', gap: 8 },
  btn: { minWidth: 32, width: 32, height: 32, borderRadius: 8, background: '#f1f5f9', color: '#0f172a', '&:hover': { background: '#e2e8f0' } },
  quantity: { fontWeight: 800, color: '#0f172a', minWidth: 20, textAlign: 'center' },
  weeklyOfferBadge: { position: 'absolute', top: 16, left: 16, backgroundColor: '#f59e0b', color: '#fff', fontWeight: 800, fontSize: '0.7rem', padding: '4px 10px', borderRadius: '20px' },
  monthlyOfferBadge: { position: 'absolute', top: 16, left: 16, backgroundColor: '#8b5cf6', color: '#fff', fontWeight: 800, fontSize: '0.7rem', padding: '4px 10px', borderRadius: '20px' },
}));

const BookingFood = ({ getFood, foodState, selectedFood, setSelectedFood, onSkip }) => {
  const classes = useStyles();
  const { food, loading } = foodState;
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Combos', 'Popcorn', 'Beverages', 'Snacks'];

  useEffect(() => {
    getFood();
  }, [getFood]);

  const handleUpdateQuantity = (item, delta) => {
    const currentQty = selectedFood[item._id]?.quantity || 0;
    setSelectedFood(item, currentQty + delta);
  };

  const filteredFood = food.filter(item => {
    if (activeCategory === 'All') return true;
    return item.category === activeCategory;
  });

  return (
    <div id="booking-food-section" className={classes.root}>
      <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" className={classes.headerBox}>
        <Typography className={classes.title}>
          Snacks & Combos
        </Typography>
        {onSkip && (
          <Button variant="text" onClick={onSkip} style={{ color: '#64748b', fontWeight: 600, textTransform: 'none' }}>
            Skip — tickets only
          </Button>
        )}
      </Box>

      <div className={classes.categoryChips}>
        {categories.map((category) => (
          <Chip
            key={category}
            label={category}
            onClick={() => setActiveCategory(category)}
            className={activeCategory === category ? classes.activeChip : classes.chip}
          />
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
          <CircularProgress style={{ color: '#b72429' }} />
        </div>
      ) : (
        <Grid container spacing={3} className={classes.gridContainer}>
          {filteredFood.map((item) => {
            const qty = selectedFood[item._id]?.quantity || 0;
            return (
              <Grid item key={item._id} xs={12} sm={6} md={4}>
                <Card className={classes.card}>
                  <div className={classes.imageWrapper}>
                    <img src={normalizeImage(item.image)} alt={item.name} className={classes.media} />
                    {item.isWeeklyOffer && <div className={classes.weeklyOfferBadge}>⭐ Weekly Offer</div>}
                    {item.isMonthlyOffer && !item.isWeeklyOffer && <div className={classes.monthlyOfferBadge}>📅 Monthly Offer</div>}
                    <div className={classes.typeIndicator}>
                      <div className={item.type === 'veg' ? classes.vegDot : classes.nonVegDot} />
                    </div>
                  </div>
                  
                  <CardContent className={classes.content}>
                    <Typography className={classes.category}>
                      {item.category}
                    </Typography>
                    <Typography className={classes.name}>
                      {item.name}
                    </Typography>
                    <Typography className={classes.description}>
                      {item.description}
                    </Typography>
                    
                    <div className={classes.footer}>
                      <Typography className={classes.price}>
                        {item.offerPrice > 0 ? (
                          <>
                            <span className={classes.originalPrice}>₹{item.price}</span>
                            ₹{item.offerPrice}
                          </>
                        ) : (
                          <>₹{item.price}</>
                        )}
                      </Typography>
                      {qty > 0 ? (
                        <div className={classes.quantityControls}>
                          <IconButton size="small" className={classes.btn} onClick={() => handleUpdateQuantity(item, -1)}>
                            <RemoveIcon fontSize="small" />
                          </IconButton>
                          <Typography className={classes.quantity}>{qty}</Typography>
                          <IconButton size="small" className={classes.btn} onClick={() => handleUpdateQuantity(item, 1)}>
                            <AddIcon fontSize="small" />
                          </IconButton>
                        </div>
                      ) : (
                        <Button variant="contained" className={classes.addBtn} onClick={() => handleUpdateQuantity(item, 1)}>
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
    </div>
  );
};

const mapStateToProps = ({ foodState, checkoutState }) => ({ 
  foodState, 
  selectedFood: checkoutState.selectedFood 
});
export default connect(mapStateToProps, { getFood, setSelectedFood })(BookingFood);
