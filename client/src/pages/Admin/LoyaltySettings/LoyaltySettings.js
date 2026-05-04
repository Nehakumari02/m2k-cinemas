import React, { useState, useEffect } from 'react';
import {
  makeStyles,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Divider,
  Box,
  CircularProgress
} from '@material-ui/core';
import StarIcon from '@material-ui/icons/Star';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  },
  paper: {
    padding: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column'
  },
  title: {
    marginBottom: theme.spacing(3),
    display: 'flex',
    alignItems: 'center',
    color: '#b72429'
  },
  icon: {
    marginRight: theme.spacing(2),
    fontSize: '2rem'
  },
  form: {
    marginTop: theme.spacing(2)
  },
  submit: {
    marginTop: theme.spacing(3),
    backgroundColor: '#b72429',
    color: 'white',
    '&:hover': {
      backgroundColor: '#a01f23'
    }
  },
  infoBox: {
    backgroundColor: '#f8fafc',
    padding: theme.spacing(2),
    borderRadius: '8px',
    marginTop: theme.spacing(4),
    border: '1px solid #e2e8f0'
  }
}));

const LoyaltySettings = () => {
  const classes = useStyles();
  const [points, setPoints] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/settings/loyaltyPointsPer100');
      if (response.ok) {
        const data = await response.json();
        setPoints(data.value);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: '', type: '' });

    const token = localStorage.getItem('jwtToken');
    try {
      const response = await fetch('/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          key: 'loyaltyPointsPer100',
          value: points
        })
      });

      if (response.ok) {
        setMessage({ text: 'Settings updated successfully!', type: 'success' });
      } else {
        const error = await response.json();
        setMessage({ text: error.message || 'Failed to update settings', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Server error', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="300px">
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" className={classes.root}>
      <Paper className={classes.paper} elevation={3}>
        <Typography variant="h4" className={classes.title}>
          <StarIcon className={classes.icon} />
          Loyalty Program Configuration
        </Typography>
        <Divider />
        <form className={classes.form} onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="body1" gutterBottom>
                Configure how many loyalty points users earn for every <strong>₹100</strong> spent on your platform.
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                fullWidth
                label="Points per ₹100"
                type="number"
                value={points}
                onChange={e => setPoints(e.target.value)}
                required
                helperText="Example: Entering '10' means a user earns 10 points for a ₹100 purchase."
              />
            </Grid>
            <Grid item xs={12}>
              {message.text && (
                <Typography style={{ color: message.type === 'success' ? '#059669' : '#dc2626', fontWeight: 600 }}>
                  {message.text}
                </Typography>
              )}
              <Button
                type="submit"
                variant="contained"
                className={classes.submit}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Update Settings'}
              </Button>
            </Grid>
          </Grid>
        </form>

        <Box className={classes.infoBox}>
          <Typography variant="h6" gutterBottom color="textPrimary">
            How it works:
          </Typography>
          <Typography variant="body2" color="textSecondary" paragraph>
            • This setting applies to both <strong>Movie Bookings</strong> and <strong>Shop Orders</strong>.
          </Typography>
          <Typography variant="body2" color="textSecondary" paragraph>
            • Points are calculated as: <code>(Total Amount / 100) * Points Setting</code>.
          </Typography>
          <Typography variant="body2" color="textSecondary">
            • If you set this to 0, the loyalty program will be effectively disabled.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoyaltySettings;
