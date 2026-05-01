import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Typography, Grid, Button, Card, CardMedia, CardContent, Container, Chip, CircularProgress } from '@material-ui/core';
import { connect } from 'react-redux';
import { setAlert } from '../../../store/actions/alert';
import { getFood } from '../../../store/actions';
import styles from './styles';

const useStyles = makeStyles(styles);

const FoodComboPage = ({ setAlert, getFood, foodState }) => {
  const classes = useStyles();
  const [addedItems, setAddedItems] = useState({});
  const { food, loading } = foodState;

  useEffect(() => {
    window.scrollTo(0, 0);
    getFood();
  }, [getFood]);

  const handleAdd = (item) => {
    setAlert(`${item.name} added to your order!`, 'success');
    setAddedItems(prev => ({
      ...prev,
      [item._id]: true
    }));

    // Reset button after 3 seconds
    setTimeout(() => {
      setAddedItems(prev => ({
        ...prev,
        [item._id]: false
      }));
    }, 3000);
  };

  return (
    <div className={classes.root}>
      <div className={classes.hero}>
        <Container maxWidth="md">
          <Typography variant="h1" className={classes.heroTitle}>
            Deliciously <span>Unmissable</span>
          </Typography>
          <Typography variant="h5" className={classes.heroSubtitle}>
            Grab your favorites and elevate your movie experience
          </Typography>
        </Container>
      </div>

      <Container maxWidth="lg" className={classes.container}>
        <div className={classes.filterSection}>
          <Typography variant="h4" className={classes.sectionTitle}>
            Menu
          </Typography>
          <div className={classes.categoryChips}>
            {['All', 'Popcorn', 'Combos', 'Snacks', 'Beverages'].map((cat) => (
              <Chip
                key={cat}
                label={cat}
                clickable
                className={cat === 'All' ? classes.activeChip : classes.chip}
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
            {food.map((item) => (
              <Grid item key={item._id} xs={12} sm={6} md={4}>
                <Card className={classes.card}>
                  <div className={classes.imageWrapper}>
                    <CardMedia
                      className={classes.media}
                      image={item.image}
                      title={item.name}
                    />
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
                        ₹{item.price}
                      </Typography>
                      <Button 
                        variant="contained" 
                        className={addedItems[item._id] ? classes.addedBtn : classes.addBtn}
                        onClick={() => handleAdd(item)}
                      >
                        {addedItems[item._id] ? 'Added' : 'Add'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </div>
  );
};

const mapStateToProps = ({ foodState }) => ({ foodState });
export default connect(mapStateToProps, { setAlert, getFood })(FoodComboPage);
