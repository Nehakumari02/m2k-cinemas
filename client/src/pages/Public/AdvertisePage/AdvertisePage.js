import React from 'react';
import { makeStyles, Container, Typography, Grid, Paper, Box } from '@material-ui/core';
import { Announcement, ShowChart, LocalPlay, Group } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: theme.spacing(12),
    paddingBottom: theme.spacing(8),
    minHeight: '80vh',
    background: '#f8fafc',
  },
  hero: {
    textAlign: 'center',
    marginBottom: theme.spacing(8),
  },
  title: {
    fontWeight: 800,
    color: '#0f172a',
    marginBottom: theme.spacing(2),
    fontSize: '2.5rem',
  },
  subtitle: {
    color: '#64748b',
    maxWidth: '700px',
    margin: '0 auto',
    lineHeight: 1.6,
  },
  card: {
    padding: theme.spacing(4),
    height: '100%',
    borderRadius: '16px',
    transition: 'all 0.3s ease',
    border: '1px solid rgba(15,23,42,0.05)',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
    }
  },
  iconBox: {
    width: '60px',
    height: '60px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing(3),
    background: 'rgba(183,36,41,0.08)',
    color: '#b72429',
  },
  cardTitle: {
    fontWeight: 700,
    marginBottom: theme.spacing(2),
    color: '#0f172a',
  },
  cardText: {
    color: '#64748b',
    lineHeight: 1.6,
    fontSize: '0.9rem',
  },
  contactSection: {
    marginTop: theme.spacing(10),
    textAlign: 'center',
    padding: theme.spacing(6),
    borderRadius: '24px',
    background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
    color: '#ffffff',
  }
}));

const AdvertisePage = () => {
  const classes = useStyles();

  const options = [
    {
      title: 'Product Branding',
      icon: <Announcement fontSize="large" />,
      text: 'Perfect for product launches, on-floor contests, and sampling to a targeted audience of movie-goers.'
    },
    {
      title: 'Concession Branding',
      icon: <LocalPlay fontSize="large" />,
      text: 'Leverage our high-traffic concession stands with menu branding and popcorn bag advertisements.'
    },
    {
      title: 'Cinema Advertising',
      icon: <ShowChart fontSize="large" />,
      text: 'On-screen advertisements during movie screenings and interactive branding on cinema schedules.'
    },
    {
      title: 'Brand Activation',
      icon: <Group fontSize="large" />,
      text: 'Interactive branding opportunities on ticket jackets, elevator doors, and lobby area kiosks.'
    }
  ];

  return (
    <div className={classes.root}>
      <Container maxWidth="lg">
        <Box className={classes.hero}>
          <Typography variant="h1" className={classes.title}>
            Advertise With Us
          </Typography>
          <Typography variant="h6" className={classes.subtitle}>
            At M2K, we provide you with some amazing opportunities to increase your Brand's visibility. 
            We offer plenty of branding options to boost your product’s image amongst a premium set of audience.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {options.map((opt, i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <Paper className={classes.card} elevation={0}>
                <Box className={classes.iconBox}>
                  {opt.icon}
                </Box>
                <Typography variant="h5" className={classes.cardTitle}>
                  {opt.title}
                </Typography>
                <Typography className={classes.cardText}>
                  {opt.text}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Paper className={classes.contactSection} elevation={4}>
          <Typography variant="h4" style={{ fontWeight: 700, marginBottom: '16px' }}>
            Ready to grow your brand?
          </Typography>
          <Typography variant="body1" style={{ opacity: 0.8, marginBottom: '32px', maxWidth: '600px', margin: '0 auto' }}>
            Get in touch with our marketing team for customized advertising packages tailored to your brand goals.
          </Typography>
          <Typography variant="h6" style={{ color: '#ef4444' }}>
            Email: marketing@m2kcinemas.com
          </Typography>
        </Paper>
      </Container>
    </div>
  );
};

export default AdvertisePage;
