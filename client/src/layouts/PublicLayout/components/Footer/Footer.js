import React, { useState } from 'react';
import { 
  Divider, 
  Typography, 
  Grid, 
  Container, 
  TextField, 
  Button, 
  Box,
  IconButton
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import FacebookIcon from '@material-ui/icons/Facebook';
import InstagramIcon from '@material-ui/icons/Instagram';
import TwitterIcon from '@material-ui/icons/Twitter';
import YouTubeIcon from '@material-ui/icons/YouTube';
import useStyles from './styles';

export default function Footer() {
  const classes = useStyles();
  const [email, setEmail] = useState('');

  const handleNewsletter = (e) => {
    e.preventDefault();
    alert('Thank you for subscribing to our newsletter!');
    setEmail('');
  };

  return (
    <div className={classes.root}>
      <Divider style={{ marginBottom: '48px', backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Column 1: Brand */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" style={{ fontWeight: 900, color: '#b72429', marginBottom: '16px' }}>
              M2K CINEMAS
            </Typography>
            <Typography variant="body2" style={{ color: '#94a3b8', lineHeight: 1.8, marginBottom: '20px' }}>
              Experience the magic of cinema with M2K. We bring you the latest blockbusters in a premium and comfortable environment.
            </Typography>
            <Box mb={3}>
              <Typography variant="caption" style={{ color: '#ffffff', fontWeight: 700, display: 'block' }}>
                M2K Corporate Park, Sector-51
              </Typography>
              <Typography variant="caption" style={{ color: '#94a3b8', display: 'block' }}>
                Gurugram, Haryana - 122003
              </Typography>
              <Typography variant="caption" style={{ color: '#94a3b8', display: 'block', marginTop: '8px' }}>
                Phone: +91 0124 4525000
              </Typography>
              <Typography variant="caption" style={{ color: '#94a3b8', display: 'block' }}>
                Email: info@m2kcinemas.com
              </Typography>
            </Box>
            <Box display="flex" gap={1}>
              <IconButton size="small" style={{ color: '#ffffff', backgroundColor: 'rgba(255,255,255,0.05)', marginRight: '8px' }}><FacebookIcon /></IconButton>
              <IconButton size="small" style={{ color: '#ffffff', backgroundColor: 'rgba(255,255,255,0.05)', marginRight: '8px' }}><InstagramIcon /></IconButton>
              <IconButton size="small" style={{ color: '#ffffff', backgroundColor: 'rgba(255,255,255,0.05)', marginRight: '8px' }}><TwitterIcon /></IconButton>
              <IconButton size="small" style={{ color: '#ffffff', backgroundColor: 'rgba(255,255,255,0.05)' }}><YouTubeIcon /></IconButton>
            </Box>
          </Grid>

          {/* Column 2: Explore */}
          <Grid item xs={6} md={2}>
            <Typography variant="subtitle1" style={{ fontWeight: 700, color: '#ffffff', marginBottom: '20px' }}>
              Explore
            </Typography>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '12px' }}>
                <Link to="/movies" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem' }}>Movies</Link>
              </li>
              <li style={{ marginBottom: '12px' }}>
                <Link to="/cinemas" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem' }}>Cinemas</Link>
              </li>
              <li style={{ marginBottom: '12px' }}>
                <Link to="/events" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem' }}>Events</Link>
              </li>
              <li style={{ marginBottom: '12px' }}>
                <Link to="/offers" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem' }}>Offers</Link>
              </li>
            </ul>
          </Grid>

          {/* Column 3: Company */}
          <Grid item xs={6} md={2}>
            <Typography variant="subtitle1" style={{ fontWeight: 700, color: '#ffffff', marginBottom: '20px' }}>
              Company
            </Typography>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '12px' }}>
                <Link to="/about-us" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem' }}>About Us</Link>
              </li>
              <li style={{ marginBottom: '12px' }}>
                <Link to="/contact-us" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem' }}>Contact Us</Link>
              </li>
              <li style={{ marginBottom: '12px' }}>
                <Link to="/careers" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem' }}>Careers</Link>
              </li>
              <li style={{ marginBottom: '12px' }}>
                <Link to="/privacy-policy" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem' }}>Privacy Policy</Link>
              </li>
            </ul>
          </Grid>

          {/* Column 4: Newsletter */}
          <Grid item xs={12} md={5}>
            <Typography variant="subtitle1" style={{ fontWeight: 700, color: '#ffffff', marginBottom: '20px' }}>
              Newsletter
            </Typography>
            <Typography variant="body2" style={{ color: '#94a3b8', marginBottom: '20px' }}>
              Subscribe to get the latest movie updates and exclusive offers delivered to your inbox.
            </Typography>
            <form onSubmit={handleNewsletter} style={{ display: 'flex', gap: '8px' }}>
              <TextField
                variant="outlined"
                placeholder="Email Address"
                size="small"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{
                  style: { color: 'white', backgroundColor: 'rgba(255,255,255,0.05)' }
                }}
              />
              <Button 
                variant="contained" 
                type="submit"
                style={{ backgroundColor: '#b72429', color: 'white', fontWeight: 700, textTransform: 'none' }}
              >
                Join
              </Button>
            </form>
          </Grid>
        </Grid>

        <Box mt={8} pb={4} display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
          <Typography variant="caption" style={{ color: '#64748b' }}>
            &copy; {new Date().getFullYear()} M2K Cinemas. All rights reserved.
          </Typography>
          <Typography variant="caption" style={{ color: '#64748b' }}>
            Crafted for the ultimate movie experience.
          </Typography>
        </Box>
      </Container>
    </div>
  );
}
