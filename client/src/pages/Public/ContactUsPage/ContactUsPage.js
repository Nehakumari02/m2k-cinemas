import React, { useEffect } from 'react';
import { Typography, Container, Grid, TextField, Button, Paper, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { Email, Phone, LocationOn, Send } from '@material-ui/icons';
import {
  M2K_LEGAL_NAME,
  M2K_REGISTERED_ADDRESS,
  M2K_ROHINI_VENUE,
  M2K_PITAMPURA_VENUE,
} from '../../../constants/m2kAddresses';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: '#f8fafc',
    minHeight: '100vh',
    padding: '100px 0',
  },
  title: {
    fontWeight: 900,
    textAlign: 'center',
    marginBottom: '60px',
    color: '#0f172a',
    fontSize: '3rem',
    [theme.breakpoints.down('sm')]: {
      fontSize: '2rem',
    }
  },
  formPaper: {
    padding: '48px',
    borderRadius: '24px',
    boxShadow: '0 20px 50px rgba(15,23,42,0.08)',
    border: '1px solid rgba(15,23,42,0.05)',
  },
  input: {
    marginBottom: '24px',
    '& .MuiOutlinedInput-root': {
      borderRadius: '12px',
      '&:hover fieldset': { borderColor: '#b72429' },
      '&.Mui-focused fieldset': { borderColor: '#b72429' },
    },
  },
  submitBtn: {
    backgroundColor: '#b72429',
    color: '#fff',
    padding: '16px',
    fontWeight: 800,
    borderRadius: '12px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    '&:hover': {
      backgroundColor: '#9a1e22',
      boxShadow: '0 10px 20px rgba(183,36,41,0.2)',
    }
  },
  contactInfoBox: {
    padding: '24px',
    display: 'flex',
    gap: '20px',
    alignItems: 'flex-start',
    marginBottom: '20px',
    borderRadius: '16px',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: '#fff',
      boxShadow: '0 10px 30px rgba(15,23,42,0.05)',
    }
  },
  iconBox: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    backgroundColor: 'rgba(183, 36, 41, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#b72429',
    flexShrink: 0,
  }
}));

const ContactUsPage = () => {
  const classes = useStyles();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={classes.root}>
      <Container maxWidth="lg">
        <Typography className={classes.title}>
          Get In <span style={{ color: '#b72429' }}>Touch</span>
        </Typography>

        <Grid container spacing={6}>
          <Grid item xs={12} md={7}>
            <Paper className={classes.formPaper}>
              <Box display="flex" alignItems="center" marginBottom={4}>
                <Send style={{ color: '#b72429', marginRight: '12px' }} />
                <Typography variant="h5" style={{ fontWeight: 800 }}>Send us a Message</Typography>
              </Box>
              <form noValidate autoComplete="off">
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Full Name" variant="outlined" className={classes.input} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Email Address" variant="outlined" className={classes.input} />
                  </Grid>
                </Grid>
                <TextField fullWidth label="Subject" variant="outlined" className={classes.input} />
                <TextField fullWidth label="Message" multiline rows={5} variant="outlined" className={classes.input} />
                <Button fullWidth variant="contained" className={classes.submitBtn}>
                  Send Message
                </Button>
              </form>
            </Paper>
          </Grid>

          <Grid item xs={12} md={5}>
            <Box paddingLeft={2}>
              <Typography variant="h4" style={{ fontWeight: 900, marginBottom: '32px', color: '#0f172a' }}>
                Contact Information
              </Typography>

              <div className={classes.contactInfoBox}>
                <div className={classes.iconBox}><LocationOn /></div>
                <div>
                  <Typography variant="h6" style={{ fontWeight: 800 }}>Registered Address</Typography>
                  <Typography variant="body1" style={{ color: '#64748b', lineHeight: 1.7 }}>
                    {M2K_LEGAL_NAME}
                    <br />
                    M2K Mall, 16, Mangalam Place District Centre,
                    <br />
                    Sector 3, Rohini, New Delhi - 110085, India.
                  </Typography>
                </div>
              </div>

              <div className={classes.contactInfoBox}>
                <div className={classes.iconBox}><LocationOn /></div>
                <div>
                  <Typography variant="h6" style={{ fontWeight: 800 }}>{M2K_ROHINI_VENUE.label}</Typography>
                  <Typography variant="body1" style={{ color: '#64748b', lineHeight: 1.7 }}>
                    M2K Mall, 16, Mangalam Place District Centre,
                    <br />
                    Sector 3, Rohini, New Delhi - 110085, India.
                    <br />
                    <strong>Phone:</strong> {M2K_ROHINI_VENUE.phone}
                  </Typography>
                </div>
              </div>

              <div className={classes.contactInfoBox}>
                <div className={classes.iconBox}><LocationOn /></div>
                <div>
                  <Typography variant="h6" style={{ fontWeight: 800 }}>{M2K_PITAMPURA_VENUE.label}</Typography>
                  <Typography variant="body1" style={{ color: '#64748b', lineHeight: 1.7 }}>
                    M2K Mall, Plot No 4, Community Centre,
                    <br />
                    Road No. 44, Pitampura, New Delhi, Delhi 110034
                    <br />
                    <strong>Phone:</strong> {M2K_PITAMPURA_VENUE.phone}
                  </Typography>
                </div>
              </div>

              <div className={classes.contactInfoBox}>
                <div className={classes.iconBox}><Email /></div>
                <div>
                  <Typography variant="h6" style={{ fontWeight: 800 }}>Email Us</Typography>
                  <Typography variant="body1" style={{ color: '#64748b', lineHeight: 1.7 }}>
                    <strong>For Feedback, School/Corporate Bookings, Kitty & Birthday Parties:</strong><br />
                    <a href="mailto:customercare@m2kcinemas.com" style={{ color: '#b72429', textDecoration: 'none', fontWeight: 600 }}>customercare@m2kcinemas.com</a>
                  </Typography>
                </div>
              </div>

              <div className={classes.contactInfoBox}>
                <div className={classes.iconBox}><Phone /></div>
                <div>
                  <Typography variant="h6" style={{ fontWeight: 800 }}>Call Us</Typography>
                  <Typography variant="body1" style={{ color: '#64748b', lineHeight: 1.7 }}>
                    Rohini: {M2K_ROHINI_VENUE.phone}<br />
                    Pitampura: {M2K_PITAMPURA_VENUE.phone}
                  </Typography>
                </div>
              </div>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default ContactUsPage;
