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
import {
  M2K_LEGAL_NAME,
  M2K_REGISTERED_ADDRESS,
  M2K_ROHINI_VENUE,
  M2K_PITAMPURA_VENUE,
} from '../../../../constants/m2kAddresses';

const fieldInputProps = {
  style: { color: 'white', backgroundColor: 'rgba(255,255,255,0.05)' }
};

export default function Footer() {
  const classes = useStyles();
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleNewsletter = async (e) => {
    e.preventDefault();
    const trimmedEmail = email.trim();
    const trimmedMobile = mobile.replace(/\D/g, '');
    const hasEmail = trimmedEmail.length > 0;
    const hasMobile = trimmedMobile.length >= 10;

    if (!hasEmail && !hasMobile) {
      alert('Please enter your email or mobile number.');
      return;
    }
    if (hasEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      alert('Please enter a valid email address.');
      return;
    }
    if (trimmedMobile.length > 0 && trimmedMobile.length < 10) {
      alert('Please enter a valid 10-digit mobile number.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: hasEmail ? trimmedEmail : undefined,
          phone: hasMobile ? trimmedMobile : undefined,
          source: 'footer_newsletter',
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (response.ok) {
        alert(data.message || 'Thank you for subscribing to our newsletter!');
        setEmail('');
        setMobile('');
      } else {
        alert((data && data.error && data.error.message) || 'Failed to subscribe. Please try again.');
      }
    } catch (err) {
      alert('Server error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={classes.root}>
      <Divider style={{ marginBottom: 24, backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
      <Container maxWidth="lg">
        <Grid container spacing={2}>
          {/* Column 1: Brand */}
          <Grid item xs={12} md={3}>
            <Typography variant="subtitle1" style={{ fontWeight: 900, color: '#b72429', marginBottom: 8 }}>
              M2K CINEMAS
            </Typography>
            <Box mb={1.5}>
              <span className={classes.addressLabel}>M2K Entertainment Pvt. Ltd</span>
              <Typography component="p" className={classes.addressBlock} style={{ marginBottom: 8 }}>
                {M2K_REGISTERED_ADDRESS}
              </Typography>
              <Typography variant="caption" style={{ color: '#94a3b8', display: 'block', fontSize: '0.7rem' }}>
                +91 0124 4525000 · info@m2kcinemas.com
              </Typography>
              <Typography variant="caption" style={{ color: '#94a3b8', display: 'block', fontSize: '0.7rem', marginTop: 4 }}>
                M2K Rohini: 9818199906 · M2K Pitampura: 981818199923
              </Typography>
            </Box>
            <Box display="flex" gap={1} mt={1}>
              <IconButton size="small" style={{ color: '#1877F2', backgroundColor: 'rgba(255,255,255,0.05)', marginRight: '8px' }}><FacebookIcon /></IconButton>
              <IconButton size="small" style={{ color: '#E1306C', backgroundColor: 'rgba(255,255,255,0.05)', marginRight: '8px' }}><InstagramIcon /></IconButton>
              <IconButton size="small" style={{ color: '#1DA1F2', backgroundColor: 'rgba(255,255,255,0.05)', marginRight: '8px' }}><TwitterIcon /></IconButton>
              <IconButton size="small" style={{ color: '#FF0000', backgroundColor: 'rgba(255,255,255,0.05)' }}><YouTubeIcon /></IconButton>
            </Box>
          </Grid>

          {/* Column 2: Explore */}
          <Grid item xs={6} md={2}>
            <Typography variant="subtitle2" style={{ fontWeight: 700, color: '#ffffff', marginBottom: 10 }}>
              Explore
            </Typography>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: 6 }}>
                <Link to="/movies" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem' }}>Movies</Link>
              </li>
              <li style={{ marginBottom: 6 }}>
                <Link to="/cinemas" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem' }}>Cinemas</Link>
              </li>
              <li style={{ marginBottom: 6 }}>
                <Link to="/events" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem' }}>Events</Link>
              </li>
              <li style={{ marginBottom: 6 }}>
                <Link to="/offers" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem' }}>Offers</Link>
              </li>
              <li style={{ marginBottom: 6 }}>
                <Link to="/membership" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem' }}>Membership</Link>
              </li>
              <li style={{ marginBottom: 6 }}>
                <Link
                  to="/group-booking"
                  style={{ color: '#f8fafc', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 700 }}>
                  Group Booking
                </Link>
              </li>
            </ul>
          </Grid>

          {/* Column 3: Company */}
          <Grid item xs={6} md={2}>
            <Typography variant="subtitle2" style={{ fontWeight: 700, color: '#ffffff', marginBottom: 10 }}>
              Company
            </Typography>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: 6 }}>
                <Link to="/about-us" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem' }}>About Us</Link>
              </li>
              <li style={{ marginBottom: 6 }}>
                <Link to="/contact-us" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem' }}>Contact Us</Link>
              </li>
              <li style={{ marginBottom: 6 }}>
                <Link to="/careers" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem' }}>Careers</Link>
              </li>
              <li style={{ marginBottom: 6 }}>
                <Link to="/privacy-policy" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem' }}>Privacy Policy</Link>
              </li>
            </ul>
          </Grid>

          {/* Column 4: Newsletter */}
          <Grid item xs={12} md={5}>
            <Typography variant="subtitle2" style={{ fontWeight: 700, color: '#ffffff', marginBottom: 8 }}>
              Newsletter
            </Typography>
            <Typography variant="caption" style={{ color: '#94a3b8', marginBottom: 10, display: 'block' }}>
              Email or mobile for updates and offers.
            </Typography>
            <form onSubmit={handleNewsletter}>
              <div>
                <div style={{ marginBottom: 10 }}>
                  <TextField
                    variant="outlined"
                    placeholder="Email Address"
                    size="small"
                    fullWidth
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    InputProps={fieldInputProps}
                  />
                </div>
                <div style={{ marginBottom: 10 }}>
                  <TextField
                    variant="outlined"
                    placeholder="Mobile Number"
                    size="small" 
                    fullWidth
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    inputProps={{ maxLength: 15 }}
                    InputProps={fieldInputProps}
                  />
                </div>
                <Button
                  variant="contained"
                  type="submit"
                  fullWidth
                  disabled={submitting}
                  style={{ backgroundColor: '#b72429', color: 'white', fontWeight: 700, textTransform: 'none' }}
                >
                  {submitting ? 'Joining...' : 'Join'}
                </Button>
              </div>
            </form>
          </Grid>
        </Grid>

        <Box mt={3} pb={2} display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
          <Typography variant="caption" style={{ color: '#64748b' }}>
            &copy; {new Date().getFullYear()} M2K Cinemas. All rights reserved.
          </Typography>
          <Box display="flex" flexWrap="wrap" alignItems="center" style={{ gap: 16 }}>
            <Link
              to="/group-booking"
              style={{ color: '#b72429', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 700 }}>
              Group Booking
            </Link>
            <Link to="/offers" style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.8rem' }}>
              Offers
            </Link>
            <Link to="/contact-us" style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.8rem' }}>
              Contact
            </Link>
          </Box>
        </Box>
      </Container>
    </div>
  );
}
