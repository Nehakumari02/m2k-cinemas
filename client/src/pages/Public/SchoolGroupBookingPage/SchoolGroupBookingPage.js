import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import {
  Typography,
  Button,
  TextField,
  Grid,
  Paper,
  Chip,
  CircularProgress,
  Snackbar,
} from '@material-ui/core';
import { School, Group, LocalOffer, Send } from '@material-ui/icons';
import { getOffers } from '../../../store/actions';
import { normalizeImage } from '../../../utils/imageUrl';
import apiUrl from '../../../utils/apiUrl';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: '#f8fafc',
    minHeight: '100vh',
    paddingTop: theme.spacing(12),
    paddingBottom: theme.spacing(8),
  },
  hero: {
    textAlign: 'center',
    maxWidth: 720,
    margin: '0 auto',
    padding: theme.spacing(0, 3, 5),
  },
  title: {
    fontWeight: 900,
    fontSize: '2.5rem',
    color: '#0f172a',
    letterSpacing: '-0.02em',
  },
  subtitle: {
    color: '#64748b',
    marginTop: theme.spacing(1.5),
    fontSize: '1.05rem',
    lineHeight: 1.6,
  },
  accent: {
    width: 60,
    height: 4,
    background: '#b72429',
    borderRadius: 2,
    margin: '16px auto 0',
  },
  perks: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: theme.spacing(1.5),
    marginTop: theme.spacing(3),
  },
  perkChip: {
    backgroundColor: '#fff',
    border: '1px solid rgba(183,36,41,0.25)',
    color: '#b72429',
    fontWeight: 700,
  },
  section: {
    maxWidth: 1100,
    margin: '0 auto',
    padding: theme.spacing(0, 3),
  },
  sectionTitle: {
    fontWeight: 800,
    fontSize: '1.35rem',
    color: '#0f172a',
    marginBottom: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  offerCard: {
    borderRadius: 16,
    overflow: 'hidden',
    border: '1px solid rgba(15,23,42,0.08)',
    background: '#fff',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  offerImage: {
    width: '100%',
    height: 140,
    objectFit: 'cover',
    backgroundColor: '#e2e8f0',
  },
  offerBody: {
    padding: theme.spacing(2),
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  offerTitle: {
    fontWeight: 800,
    fontSize: '1rem',
    color: '#0f172a',
    marginBottom: theme.spacing(0.5),
  },
  offerDesc: {
    fontSize: '0.85rem',
    color: '#64748b',
    flex: 1,
    marginBottom: theme.spacing(1.5),
  },
  codeChip: {
    alignSelf: 'flex-start',
    fontWeight: 800,
    color: '#b72429',
    borderColor: 'rgba(183,36,41,0.4)',
    marginBottom: theme.spacing(1),
  },
  formPaper: {
    padding: theme.spacing(4),
    borderRadius: 20,
    border: '1px solid rgba(15,23,42,0.06)',
    boxShadow: '0 20px 50px rgba(15,23,42,0.06)',
    marginTop: theme.spacing(5),
  },
  input: {
    marginBottom: theme.spacing(2),
    '& .MuiOutlinedInput-root.Mui-focused fieldset': { borderColor: '#b72429' },
    '& .MuiInputLabel-root.Mui-focused': { color: '#b72429' },
  },
  submitBtn: {
    backgroundColor: '#b72429',
    color: '#fff',
    fontWeight: 800,
    padding: '14px 32px',
    borderRadius: 12,
    '&:hover': { backgroundColor: '#9a1e22' },
  },
  offersLink: {
    marginTop: theme.spacing(2),
    color: '#b72429',
    fontWeight: 700,
    textDecoration: 'none',
    '&:hover': { textDecoration: 'underline' },
  },
}));

const FALLBACK_SCHOOL_OFFERS = [
  {
    _id: 'school-fallback-1',
    title: 'School Group Booking — 30% Off',
    description:
      'Book for 30+ students and get 30% off ticket price. Ideal for educational trips, annual days, and reward screenings. Staff coordinator support included.',
    code: 'SCHOOL30',
    category: 'school_group',
    minTickets: 30,
    discountPercentage: 30,
    validTill: new Date('2026-12-31'),
    image: '/images/offers/offer4.png',
  },
  {
    _id: 'school-fallback-2',
    title: 'Large Group Special — 40% Off (50+ students)',
    description:
      'Groups of 50 or more students receive 40% off. Private showtime slots available on request. Submit your enquiry below.',
    code: 'SCHOOL40',
    category: 'school_group',
    minTickets: 50,
    discountPercentage: 40,
    inquiryOnly: true,
    validTill: new Date('2026-12-31'),
    image: '/images/offers/offer2.png',
  },
];

const EMPTY_FORM = {
  schoolName: '',
  contactName: '',
  email: '',
  phone: '',
  studentCount: '',
  gradeOrClass: '',
  preferredDate: '',
  preferredMovie: '',
  preferredCinema: '',
  offerCode: '',
  message: '',
};

function SchoolGroupBookingPage({ offers, getOffers }) {
  const classes = useStyles();
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    window.scrollTo(0, 0);
    getOffers();
  }, [getOffers]);

  const schoolOffers = (offers && offers.length > 0
    ? offers.filter(o => o.category === 'school_group')
    : FALLBACK_SCHOOL_OFFERS);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const applyOfferCode = code => {
    setForm(prev => ({ ...prev, offerCode: code }));
    setSnack({ open: true, message: `Offer code ${code} added to your enquiry.`, severity: 'success' });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await fetch(apiUrl('/school-group-inquiries'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          studentCount: Number(form.studentCount),
        }),
      });
      const text = await response.text();
      let data = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        const isHtml = text.trim().startsWith('<');
        const cannotPost = text.includes('Cannot POST');
        setSnack({
          open: true,
          message: isHtml
            ? cannotPost
              ? 'The API on port 8080 does not have the school booking route yet. Stop the server, run `cd server && npm run dev` again, and confirm you see "School bookings: POST /school-group-inquiries" in the terminal.'
              : 'Wrong service on port 8080 (HTML instead of JSON). Use `cd server && npm run dev` for the API—not a static file server alone.'
            : `Unexpected server response. Check http://localhost:8080/health — then restart the server.`,
          severity: 'error',
        });
        setSubmitting(false);
        return;
      }
      if (response.ok) {
        setForm(EMPTY_FORM);
        setSnack({
          open: true,
          message: data.message || 'Enquiry submitted! Our team will contact you shortly.',
          severity: 'success',
        });
      } else {
        setSnack({
          open: true,
          message: data.error?.message || 'Could not submit enquiry.',
          severity: 'error',
        });
      }
    } catch {
      setSnack({
        open: true,
        message:
          'Cannot reach the server. Run the API on port 8080: cd server && npm run dev — then restart the client (npm start).',
        severity: 'error',
      });
    }
    setSubmitting(false);
  };

  return (
    <div className={classes.root}>
      <div className={classes.hero}>
        <School style={{ fontSize: 48, color: '#b72429', marginBottom: 8 }} />
        <Typography className={classes.title}>School Group Booking</Typography>
        <Typography className={classes.subtitle}>
          Exclusive offers for schools, colleges, and educational institutions. Plan a private
          screening or block-book seats at special rates — our team will confirm availability and
          pricing.
        </Typography>
        <div className={classes.accent} />
        <div className={classes.perks}>
          <Chip icon={<Group />} label="30+ student groups" className={classes.perkChip} />
          <Chip icon={<LocalOffer />} label="Dedicated promo codes" className={classes.perkChip} />
          <Chip label="Coordinator support" className={classes.perkChip} />
        </div>
        <Link to="/offers" className={classes.offersLink}>
          View all offers →
        </Link>
      </div>

      <div className={classes.section}>
        <Typography className={classes.sectionTitle}>
          <LocalOffer /> School group offers
        </Typography>
        <Grid container spacing={3}>
          {schoolOffers.map(offer => (
            <Grid item xs={12} sm={6} md={4} key={offer._id || offer.code}>
              <Paper className={classes.offerCard} elevation={0}>
                <img
                  className={classes.offerImage}
                  src={normalizeImage(offer.image) || '/images/offers/offer4.png'}
                  alt={offer.title}
                />
                <div className={classes.offerBody}>
                  <Chip label={offer.code} size="small" variant="outlined" className={classes.codeChip} />
                  <Typography className={classes.offerTitle}>{offer.title}</Typography>
                  <Typography className={classes.offerDesc}>{offer.description}</Typography>
                  {offer.minTickets > 0 && (
                    <Typography variant="caption" color="textSecondary" style={{ marginBottom: 8 }}>
                      Min. {offer.minTickets} students
                      {offer.discountPercentage ? ` · ${offer.discountPercentage}% off` : ''}
                      {offer.inquiryOnly ? ' · Enquiry only' : ''}
                    </Typography>
                  )}
                  <Button
                    size="small"
                    color="primary"
                    variant="outlined"
                    onClick={() => applyOfferCode(offer.code)}
                    style={{ alignSelf: 'flex-start', fontWeight: 700 }}>
                    Use this offer
                  </Button>
                </div>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Paper className={classes.formPaper} elevation={0}>
          <Typography className={classes.sectionTitle} style={{ marginTop: 0 }}>
            <Send /> Submit booking enquiry
          </Typography>
          <Typography variant="body2" color="textSecondary" style={{ marginBottom: 24 }}>
            Fill in your school details and we will call or email you with showtimes, pricing, and
            payment options. For online checkout, use your group code at payment (minimum seats may
            apply).
          </Typography>
          <form onSubmit={handleSubmit} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  className={classes.input}
                  label="School / Institution name *"
                  name="schoolName"
                  value={form.schoolName}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  className={classes.input}
                  label="Coordinator name *"
                  name="contactName"
                  value={form.contactName}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  className={classes.input}
                  label="Email *"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  className={classes.input}
                  label="Phone *"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  className={classes.input}
                  label="Number of students *"
                  name="studentCount"
                  type="number"
                  inputProps={{ min: 1 }}
                  value={form.studentCount}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  className={classes.input}
                  label="Grade / Class"
                  name="gradeOrClass"
                  value={form.gradeOrClass}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  className={classes.input}
                  label="Preferred date"
                  name="preferredDate"
                  type="date"
                  value={form.preferredDate}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  className={classes.input}
                  label="Preferred movie"
                  name="preferredMovie"
                  value={form.preferredMovie}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  className={classes.input}
                  label="Preferred cinema / city"
                  name="preferredCinema"
                  value={form.preferredCinema}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  className={classes.input}
                  label="Offer code (optional)"
                  name="offerCode"
                  value={form.offerCode}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  inputProps={{ style: { textTransform: 'uppercase' } }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  className={classes.input}
                  label="Additional notes"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  multiline
                  rows={3}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  className={classes.submitBtn}
                  variant="contained"
                  startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <Send />}
                  disabled={submitting}>
                  {submitting ? 'Submitting…' : 'Submit enquiry'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </div>

      <Snackbar
        open={snack.open}
        autoHideDuration={6000}
        onClose={() => setSnack(s => ({ ...s, open: false }))}
        message={snack.message}
      />
    </div>
  );
}

const mapStateToProps = ({ offerState }) => ({
  offers: offerState.offers,
});

export default connect(mapStateToProps, { getOffers })(SchoolGroupBookingPage);
