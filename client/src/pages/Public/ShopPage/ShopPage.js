import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { makeStyles, Grid, Container, Typography, Card, CardMedia, CardContent, CardActions, Button, IconButton, Chip, Box } from '@material-ui/core';
import { AddShoppingCart as AddCartIcon, FilterList as FilterIcon } from '@material-ui/icons';
import { getProducts, addToCart } from '../../../store/actions';

const useStyles = makeStyles(theme => ({
  container: {
    paddingTop: theme.spacing(15),
    paddingBottom: theme.spacing(10),
    minHeight: '80vh',
  },
  header: {
    marginBottom: theme.spacing(5),
    textAlign: 'center',
  },
  title: {
    fontSize: '3.5rem',
    fontWeight: 800,
    background: 'linear-gradient(45deg, #b72429 30%, #ff5f6d 90%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: theme.spacing(2),
  },
  subtitle: {
    color: '#64748b',
    maxWidth: '600px',
    margin: '0 auto',
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '16px',
    transition: 'all 0.3s ease',
    border: '1px solid rgba(0,0,0,0.05)',
    '&:hover': {
      transform: 'translateY(-8px)',
      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
    },
  },
  media: {
    paddingTop: '100%', // 1:1 Aspect Ratio
    position: 'relative',
  },
  categoryChip: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255,255,255,0.9)',
    fontWeight: 'bold',
  },
  price: {
    fontWeight: 800,
    color: '#b72429',
    fontSize: '1.25rem',
  },
  productName: {
    fontWeight: 700,
    marginBottom: theme.spacing(1),
  },
  addToCartBtn: {
    borderRadius: '8px',
    textTransform: 'none',
    fontWeight: 600,
    padding: '8px 16px',
  },
}));

const ShopPage = ({ getProducts, addToCart, productState: { products, loading } }) => {
  const classes = useStyles();

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  const handleAddToCart = (product) => {
    addToCart(product, 1);
  };

  return (
    <Container className={classes.container}>
      <div className={classes.header}>
        <Typography variant="h1" className={classes.title}>M2K Merchandise</Typography>
        <Typography variant="body1" className={classes.subtitle}>
          Exclusive movie-themed apparel, collectibles, and more. Take home a piece of the cinema magic.
        </Typography>
      </div>

      <Grid container spacing={4}>
        {products.map(product => (
          <Grid item key={product._id} xs={12} sm={6} md={4} lg={3}>
            <Card className={classes.card}>
              <Box className={classes.media}>
                <CardMedia
                  style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: '100%' }}
                  image={product.image || 'https://via.placeholder.com/300?text=Merchandise'}
                  title={product.name}
                />
                <Chip label={product.category} className={classes.categoryChip} size="small" />
              </Box>
              <CardContent style={{ flexGrow: 1 }}>
                <Typography variant="h6" className={classes.productName}>{product.name}</Typography>
                <Typography variant="body2" color="textSecondary" style={{ minHeight: '3em' }}>
                  {product.description}
                </Typography>
                <Box mt={2} display="flex" justifyContent="space-between" alignItems="center">
                  <Typography className={classes.price}>₹{product.price}</Typography>
                  <Typography variant="caption" color={product.stock > 0 ? "textSecondary" : "error"}>
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                  </Typography>
                </Box>
              </CardContent>
              <CardActions style={{ padding: '16px' }}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.addToCartBtn}
                  startIcon={<AddCartIcon />}
                  disabled={product.stock === 0}
                  onClick={() => handleAddToCart(product)}
                >
                  Add to Cart
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

const mapStateToProps = state => ({
  productState: state.productState
});

export default connect(mapStateToProps, { getProducts, addToCart })(ShopPage);
