import React, { useEffect } from 'react';
import { Typography, Container, Grid, Box, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { LocalMovies, Stars, Visibility, Security } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: '#fff',
    minHeight: '100vh',
    overflowX: 'hidden',
  },
  heroSection: {
    position: 'relative',
    height: '60vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url("https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=2000")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    color: '#fff',
    textAlign: 'center',
    marginBottom: '80px',
  },
  heroTitle: {
    fontWeight: 900,
    fontSize: '3.5rem',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    [theme.breakpoints.down('sm')]: {
      fontSize: '2.2rem',
    }
  },
  sectionTitle: {
    fontWeight: 800,
    color: '#0f172a',
    marginBottom: '24px',
    position: 'relative',
    '&:after': {
      content: '""',
      position: 'absolute',
      bottom: '-8px',
      left: 0,
      width: '60px',
      height: '4px',
      backgroundColor: '#b72429',
      borderRadius: '2px',
    }
  },
  contentBody: {
    color: '#475569',
    fontSize: '1.1rem',
    lineHeight: 1.8,
    marginBottom: '24px',
  },
  featureCard: {
    padding: '40px 30px',
    textAlign: 'center',
    height: '100%',
    borderRadius: '20px',
    border: '1px solid rgba(15,23,42,0.06)',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-10px)',
      boxShadow: '0 20px 40px rgba(15,23,42,0.1)',
      borderColor: '#b72429',
    }
  },
  iconBox: {
    width: '70px',
    height: '70px',
    borderRadius: '16px',
    backgroundColor: 'rgba(183, 36, 41, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 24px',
    color: '#b72429',
  },
  statsBox: {
    background: '#0f172a',
    color: '#fff',
    padding: '80px 0',
    marginTop: '100px',
  },
  statItem: {
    textAlign: 'center',
  },
  statNumber: {
    fontSize: '3rem',
    fontWeight: 900,
    color: '#b72429',
    marginBottom: '8px',
  },
  statLabel: {
    fontSize: '0.9rem',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    opacity: 0.8,
  }
}));

const AboutUsPage = () => {
  const classes = useStyles();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={classes.root}>
      {/* ── Hero Section ── */}
      <Box className={classes.heroSection}>
        <Container maxWidth="md">
          <Typography className={classes.heroTitle}>M2K Cinemas</Typography>
          <Typography variant="h5" style={{ fontWeight: 500, opacity: 0.9 }}>
            Part of the M2K Group | Redefining Entertainment Since 2003
          </Typography>
        </Container>
      </Box>

      {/* ── About M2K Section ── */}
      <Container maxWidth="lg" style={{ marginBottom: '100px' }}>
        <Grid container spacing={8} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h3" className={classes.sectionTitle}>
              Legacy of <span style={{ color: '#b72429' }}>Excellence</span>
            </Typography>
            <Typography className={classes.contentBody}>
              M2K Cinemas is a premier entertainment brand in India, known for providing a sophisticated and immersive movie-viewing experience. As part of the diversified <strong>M2K Group</strong>, we bring decades of expertise in quality and customer satisfaction to the silver screen.
            </Typography>
            <Typography className={classes.contentBody}>
              With flagship multiplexes in <strong>Rohini</strong> and <strong>Pitampura</strong>, we have been at the forefront of the cinematic revolution in Delhi-NCR, combining state-of-the-art technology with unparalleled comfort.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <img 
              src="https://images.unsplash.com/photo-1517604401157-538a9663ecf3?auto=format&fit=crop&q=80&w=1200" 
              alt="M2K Cinema Hall" 
              style={{ width: '100%', borderRadius: '24px', boxShadow: '0 30px 60px rgba(0,0,0,0.15)' }} 
            />
          </Grid>
        </Grid>
      </Container>

      {/* ── Features Section ── */}
      <Box style={{ backgroundColor: '#f8fafc', padding: '100px 0' }}>
        <Container maxWidth="lg">
          <Box textAlign="center" marginBottom="60px">
            <Typography variant="h3" style={{ fontWeight: 900, color: '#0f172a', marginBottom: '16px' }}>
              Why Choose <span style={{ color: '#b72429' }}>M2K?</span>
            </Typography>
            <Typography variant="body1" style={{ color: '#64748b', maxWidth: '600px', margin: '0 auto' }}>
              We don't just show movies; we create memories with world-class facilities.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={0} className={classes.featureCard}>
                <Box className={classes.iconBox}><LocalMovies fontSize="large" /></Box>
                <Typography variant="h6" style={{ fontWeight: 800, marginBottom: '12px' }}>Ultra HD Projection</Typography>
                <Typography variant="body2" color="textSecondary">Crystal clear visuals with high-end digital projection systems.</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={0} className={classes.featureCard}>
                <Box className={classes.iconBox}><Stars fontSize="large" /></Box>
                <Typography variant="h6" style={{ fontWeight: 800, marginBottom: '12px' }}>Dolby Surround</Typography>
                <Typography variant="body2" color="textSecondary">Immersive soundscapes with Dolby Digital technology.</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={0} className={classes.featureCard}>
                <Box className={classes.iconBox}><Visibility fontSize="large" /></Box>
                <Typography variant="h6" style={{ fontWeight: 800, marginBottom: '12px' }}>Stadium Seating</Typography>
                <Typography variant="body2" color="textSecondary">Optimal viewing angles from every single seat in the house.</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={0} className={classes.featureCard}>
                <Box className={classes.iconBox}><Security fontSize="large" /></Box>
                <Typography variant="h6" style={{ fontWeight: 800, marginBottom: '12px' }}>Safe & Premium</Typography>
                <Typography variant="body2" color="textSecondary">Top-notch security and premium amenities for your family.</Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ── Vision Section ── */}
      <Container maxWidth="lg" style={{ padding: '100px 0' }}>
        <Box textAlign="center">
          <Typography variant="h3" style={{ fontWeight: 900, color: '#0f172a', marginBottom: '32px' }}>
            Our <span style={{ color: '#b72429' }}>Vision</span>
          </Typography>
          <Typography variant="h5" style={{ color: '#475569', fontStyle: 'italic', maxWidth: '800px', margin: '0 auto', lineHeight: 1.6 }}>
            "To exceed customer expectations and enrich their lives by delivering superior quality products, enhancing lifestyles through product differentiation, and providing value for money."
          </Typography>
        </Box>
      </Container>

      {/* ── Stats Bar ── */}
      <Box className={classes.statsBox}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={6} md={3} className={classes.statItem}>
              <Typography className={classes.statNumber}>20+</Typography>
              <Typography className={classes.statLabel}>Years of Legacy</Typography>
            </Grid>
            <Grid item xs={6} md={3} className={classes.statItem}>
              <Typography className={classes.statNumber}>1M+</Typography>
              <Typography className={classes.statLabel}>Happy Viewers</Typography>
            </Grid>
            <Grid item xs={6} md={3} className={classes.statItem}>
              <Typography className={classes.statNumber}>100%</Typography>
              <Typography className={classes.statLabel}>Digital Cinema</Typography>
            </Grid>
            <Grid item xs={6} md={3} className={classes.statItem}>
              <Typography className={classes.statNumber}>24/7</Typography>
              <Typography className={classes.statLabel}>Online Booking</Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </div>
  );
};

export default AboutUsPage;
