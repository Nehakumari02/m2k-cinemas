import React from 'react';
import { makeStyles, Container, Typography, Grid, Paper, Box, Divider } from '@material-ui/core';
import { Description, Event } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: theme.spacing(12),
    paddingBottom: theme.spacing(8),
    minHeight: '80vh',
    background: '#f8fafc',
  },
  header: {
    marginBottom: theme.spacing(6),
    borderBottom: '4px solid #b72429',
    display: 'inline-block',
    paddingBottom: theme.spacing(1),
  },
  newsCard: {
    padding: theme.spacing(4),
    borderRadius: '16px',
    backgroundColor: '#ffffff',
    border: '1px solid rgba(15,23,42,0.06)',
    marginBottom: theme.spacing(4),
    transition: 'all 0.3s ease',
    '&:hover': {
      boxShadow: '0 12px 30px rgba(0,0,0,0.06)',
    }
  },
  newsTitle: {
    fontWeight: 700,
    color: '#0f172a',
    marginBottom: theme.spacing(2),
    cursor: 'pointer',
    '&:hover': { color: '#b72429' }
  },
  newsMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    color: '#64748b',
    fontSize: '0.85rem',
    marginBottom: theme.spacing(3),
  },
  newsExerpt: {
    color: '#334155',
    lineHeight: 1.7,
  }
}));

const MediaPage = () => {
  const classes = useStyles();

  const news = [
    {
      title: 'M2K Cinemas Launches New Dolby Atmos Theater',
      date: 'March 15, 2024',
      category: 'Launch',
      text: 'Experience the next level of sound with our newly inaugurated Dolby Atmos screen at Rohini. This marks a new milestone in our commitment to cinematic excellence.'
    },
    {
      title: 'Expansion Plans: M2K Cinemas to add 20 new screens',
      date: 'January 10, 2024',
      category: 'Corporate',
      text: 'M2K Group has announced its expansion strategy to strengthen its footprint in Northern India with state-of-the-art cinematic technology and premium seating.'
    },
    {
      title: 'Awarded Finest Cinematic Experience 2023',
      date: 'December 05, 2023',
      category: 'Awards',
      text: 'M2K Cinemas has been recognized for its outstanding service and technological innovation at the National Cinema Excellence Awards.'
    }
  ];

  return (
    <div className={classes.root}>
      <Container maxWidth="lg">
        <Typography variant="h3" className={classes.header}>Media & Press</Typography>
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            {news.map((item, i) => (
              <Paper key={i} className={classes.newsCard} elevation={0}>
                <Box className={classes.newsMeta}>
                  <Box style={{ display: 'flex', alignItems: 'center' }}>
                    <Event fontSize="small" style={{ marginRight: '6px' }} />
                    {item.date}
                  </Box>
                  <Divider orientation="vertical" flexItem />
                  <Box style={{ color: '#b72429', fontWeight: 600 }}>{item.category}</Box>
                </Box>
                <Typography variant="h4" className={classes.newsTitle}>
                  {item.title}
                </Typography>
                <Typography className={classes.newsExerpt}>
                  {item.text}
                </Typography>
              </Paper>
            ))}
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper style={{ padding: '24px', borderRadius: '16px' }} elevation={0}>
              <Typography variant="h6" style={{ fontWeight: 700, marginBottom: '20px' }}>Media Contacts</Typography>
              <Typography variant="body2" color="textSecondary" style={{ marginBottom: '16px' }}>
                For media inquiries, press releases, or interview requests, please contact our PR department.
              </Typography>
              <Box style={{ background: '#f1f5f9', padding: '16px', borderRadius: '12px' }}>
                <Typography variant="subtitle2" style={{ fontWeight: 700 }}>PR Manager</Typography>
                <Typography variant="body2">Email: pr@m2kcinemas.com</Typography>
                <Typography variant="body2">Phone: +91 11 2706 1000</Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default MediaPage;
