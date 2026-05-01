import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Typography, Grid, Button, Card, CardMedia, CardContent, CircularProgress, IconButton } from '@material-ui/core';
import { Add as AddIcon, Remove as RemoveIcon } from '@material-ui/icons';
import { connect } from 'react-redux';
import { getFood, setSelectedFood } from '../../../../../store/actions';
import styles from './styles';

const useStyles = makeStyles(styles);

const BookingFood = ({ getFood, foodState, selectedFood, setSelectedFood }) => {
  const classes = useStyles();
  const { food, loading } = foodState;

  useEffect(() => {
    getFood();
  }, [getFood]);

  const handleUpdateQuantity = (item, delta) => {
    const currentQty = selectedFood[item._id]?.quantity || 0;
    setSelectedFood(item, currentQty + delta);
  };

  return (
    <div className={classes.root}>
      <Typography variant="h5" className={classes.title}>
        Add some <span>Snacks & Combos</span>?
      </Typography>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
          <CircularProgress style={{ color: '#b72429' }} />
        </div>
      ) : (
        <Grid container spacing={3} className={classes.gridContainer}>
          {food.map((item) => {
            const qty = selectedFood[item._id]?.quantity || 0;
            return (
              <Grid item key={item._id} xs={12} sm={6} md={4}>
                <Card className={classes.card}>
                  <div className={classes.media} style={{ backgroundImage: `url(${item.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                    <div className={item.type === 'veg' ? classes.vegDot : classes.nonVegDot} />
                  </div>
                  <CardContent className={classes.content}>
                    <Typography className={classes.category}>
                      {item.category}
                    </Typography>
                    <Typography className={classes.name}>
                      {item.name}
                    </Typography>
                    <div className={classes.priceRow}>
                      <Typography className={classes.price}>
                        ₹{item.price}
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
                        <Button 
                          variant="contained" 
                          className={classes.addBtn}
                          onClick={() => handleUpdateQuantity(item, 1)}
                        >
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
