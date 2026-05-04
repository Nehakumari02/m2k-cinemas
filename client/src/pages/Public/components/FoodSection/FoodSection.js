import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  makeStyles, 
  Typography, 
  Container, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent,
  Button,
  Box
} from '@material-ui/core';
import FastfoodIcon from '@material-ui/icons/Fastfood';
import { getFood, addToCart } from '../../../../store/actions';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(10, 0),
    backgroundColor: '#f8fafc',
  },
  sectionHeader: {
    marginBottom: theme.spacing(6),
    textAlign: 'center',
  },
  title: {
    fontWeight: 900,
    color: '#0f172a',
    marginBottom: theme.spacing(1),
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  subtitle: {
    color: '#64748b',
    fontWeight: 500,
  },
  accent: {
    width: '60px',
    height: '4px',
    backgroundColor: '#b72429',
    margin: '16px auto',
    borderRadius: '2px',
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '16px',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    border: 'none',
    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
    '&:hover': {
      transform: 'translateY(-8px)',
      boxShadow: '0 12px 30px rgba(0,0,0,0.1)',
    },
  },
  media: {
    height: 200,
    position: 'relative',
  },
  priceBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#b72429',
    color: 'white',
    padding: '4px 12px',
    borderRadius: '20px',
    fontWeight: 800,
    fontSize: '0.9rem',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  itemName: {
    fontWeight: 800,
    fontSize: '1.2rem',
    color: '#0f172a',
    marginBottom: theme.spacing(1),
  },
  itemDesc: {
    color: '#64748b',
    fontSize: '0.85rem',
    lineHeight: 1.6,
    height: '3.2em',
    overflow: 'hidden',
  },
  actionArea: {
    padding: theme.spacing(0, 3, 3),
  },
  orderBtn: {
    backgroundColor: '#0f172a',
    color: 'white',
    fontWeight: 700,
    borderRadius: '8px',
    padding: '10px',
    '&:hover': {
      backgroundColor: '#1e293b',
    },
  }
}));

const FoodSection = ({ food, getFood }) => {
  const classes = useStyles();

  useEffect(() => {
    getFood();
  }, [getFood]);

  // Only show top 4 or top 8 combos/food
  const displayFood = (food || []).slice(0, 4);

  if (displayFood.length === 0) return null;

  return (
    <div className={classes.root}>
      <Container maxWidth="lg">
        <div className={classes.sectionHeader}>
          <Typography variant="h3" className={classes.title}>
            Hungry? Grab a Bite!
          </Typography>
          <div className={classes.accent} />
          <Typography variant="h6" className={classes.subtitle}>
            Delicious food & combos to make your movie experience complete
          </Typography>
        </div>

        <Grid container spacing={4}>
          {displayFood.map(item => (
            <Grid item key={item._id} xs={12} sm={6} md={3}>
              <Card className={classes.card}>
                <CardMedia
                  className={classes.media}
                  image={item.image || 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=500&q=80'}
                  title={item.name}
                >
                  <div className={classes.priceBadge}>₹{item.price}</div>
                </CardMedia>
                <CardContent className={classes.content}>
                  <Typography className={classes.itemName}>
                    {item.name}
                  </Typography>
                  <Typography className={classes.itemDesc}>
                    {item.description || 'The perfect companion for your blockbuster movie experience.'}
                  </Typography>
                </CardContent>
                <div className={classes.actionArea}>
                  <Button 
                    fullWidth 
                    variant="contained" 
                    className={classes.orderBtn}
                    startIcon={<FastfoodIcon />}
                    onClick={() => addToCart(item, 1)}
                  >
                    Add to Cart
                  </Button>
                </div>
              </Card>
            </Grid>
          ))}
        </Grid>
        
        <Box mt={6} textAlign="center">
          <Button 
            variant="outlined" 
            component={Link}
            to="/food-combos"
            style={{ borderColor: '#b72429', color: '#b72429', fontWeight: 800, padding: '12px 32px', borderRadius: '30px' }}
          >
            View Full Menu
          </Button>
        </Box>
      </Container>
    </div>
  );
};

const mapStateToProps = state => ({
  food: state.foodState.food
});

export default connect(mapStateToProps, { getFood, addToCart })(FoodSection);
