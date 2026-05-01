import React from 'react';
import { makeStyles, Container, Typography, Grid, Box, Tabs, Tab } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: theme.spacing(12),
    paddingBottom: theme.spacing(8),
    minHeight: '80vh',
    background: '#ffffff',
  },
  title: {
    fontWeight: 800,
    textAlign: 'center',
    marginBottom: theme.spacing(4),
    color: '#0f172a',
  },
  tabs: {
    marginBottom: theme.spacing(6),
    '& .MuiTabs-indicator': {
      backgroundColor: '#b72429',
    },
    '& .Mui-selected': {
      color: '#b72429',
    }
  },
  imageContainer: {
    position: 'relative',
    borderRadius: '16px',
    overflow: 'hidden',
    cursor: 'pointer',
    aspectRatio: '16/10',
    '&:hover img': {
      transform: 'scale(1.1)',
    },
    '&:hover $overlay': {
      opacity: 1,
    }
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.5s ease',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(transparent, rgba(15,23,42,0.8))',
    display: 'flex',
    alignItems: 'flex-end',
    padding: theme.spacing(3),
    opacity: 0,
    transition: 'opacity 0.3s ease',
    color: '#ffffff',
  }
}));

const GalleryPage = () => {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const images = [
    { src: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80', title: 'Luxury Gold Class Lobby' },
    { src: 'https://images.unsplash.com/photo-1517604401157-538a9663ecb4?auto=format&fit=crop&q=80', title: 'IMAX Immersive Screen' },
    { src: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&q=80', title: 'Dolby Atmos Theater' },
    { src: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&q=80', title: 'Premier Concession Counter' },
    { src: 'https://images.unsplash.com/photo-1513106580091-1d82408b8cd6?auto=format&fit=crop&q=80', title: 'Corporate Event Hosting' },
    { src: 'https://images.unsplash.com/photo-1473161552614-246fd21c2941?auto=format&fit=crop&q=80', title: 'Outdoor Cinema Experience' }
  ];

  return (
    <div className={classes.root}>
      <Container maxWidth="lg">
        <Typography variant="h2" className={classes.title}>Gallery</Typography>
        
        <Box display="flex" justifyContent="center">
          <Tabs 
            value={value} 
            onChange={(e, v) => setValue(v)} 
            className={classes.tabs}
          >
            <Tab label="All" />
            <Tab label="Theaters" />
            <Tab label="Lobby" />
            <Tab label="Events" />
          </Tabs>
        </Box>

        <Grid container spacing={3}>
          {images.map((img, i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Box className={classes.imageContainer}>
                <img src={img.src} alt={img.title} className={classes.image} />
                <Box className={classes.overlay}>
                  <Typography variant="subtitle1" style={{ fontWeight: 600 }}>{img.title}</Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  );
};

export default GalleryPage;
