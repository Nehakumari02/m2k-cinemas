import React, { useState } from 'react';
import { makeStyles, Container, Typography, TextField, Button, Grid, CircularProgress, Snackbar } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: '#1e293b',
    color: '#fff',
    minHeight: '100vh',
    paddingTop: '100px', // clears fixed navbar
    paddingBottom: theme.spacing(8),
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
  },
  header: {
    fontWeight: 800,
    marginBottom: theme.spacing(1),
    color: '#f8fafc',
  },
  subHeader: {
    color: '#cbd5e1',
    marginBottom: theme.spacing(4),
  },
  form: {
    width: '100%',
  },
  textField: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: theme.shape.borderRadius,
    '& .MuiOutlinedInput-root': {
      color: '#fff',
      '& fieldset': {
        borderColor: 'rgba(255, 255, 255, 0.2)',
      },
      '&:hover fieldset': {
        borderColor: 'rgba(255, 255, 255, 0.4)',
      },
      '&.Mui-focused fieldset': {
        borderColor: theme.palette.primary.main,
      },
    },
    '& .MuiInputLabel-root': {
      color: '#94a3b8',
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: theme.palette.primary.main,
    },
  },
  submitBtn: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(1.5, 4),
    fontWeight: 700,
  },
}));

export default function Feedback() {
  const classes = useStyles();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.message.trim()) {
      setSnackbar({ open: true, message: 'Message cannot be empty', severity: 'warning' });
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch('/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      
      if (response.ok) {
        setSnackbar({ open: true, message: 'Thank you for your feedback! It has been sent to M2K.', severity: 'success' });
        setFormData({ name: '', email: '', message: '' });
      } else {
        setSnackbar({ open: true, message: data.error || 'Failed to send feedback', severity: 'error' });
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'An error occurred. Please try again later.', severity: 'error' });
    }
    setLoading(false);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <div className={classes.root}>
      <Container maxWidth="md">
        <Typography variant="h4" className={classes.header} align="center">
          We value your feedback!
        </Typography>
        <Typography variant="body1" className={classes.subHeader} align="center">
          Let us know how we can improve your experience at M2K.
        </Typography>

        <form className={classes.form} onSubmit={handleSubmit} noValidate>
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} sm={6}>
              <TextField
                className={classes.textField}
                variant="outlined"
                fullWidth
                label="Your Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                className={classes.textField}
                variant="outlined"
                fullWidth
                label="Your Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                className={classes.textField}
                variant="outlined"
                fullWidth
                label="Your Feedback / Message"
                name="message"
                multiline
                rows={4}
                required
                value={formData.message}
                onChange={handleChange}
              />
            </Grid>
            <Grid item>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                className={classes.submitBtn}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Send Feedback'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Container>
      
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbar.message}
      />
    </div>
  );
}
