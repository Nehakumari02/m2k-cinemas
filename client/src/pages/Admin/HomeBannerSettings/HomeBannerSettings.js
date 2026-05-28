import React, { useEffect, useState } from 'react';
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
  CircularProgress,
  FormControlLabel,
  Switch,
} from '@material-ui/core';
import PhotoLibraryIcon from '@material-ui/icons/PhotoLibrary';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    marginBottom: theme.spacing(3),
    display: 'flex',
    alignItems: 'center',
    color: '#b72429',
  },
  icon: {
    marginRight: theme.spacing(2),
    fontSize: '2rem',
  },
  form: {
    marginTop: theme.spacing(2),
  },
  submit: {
    marginTop: theme.spacing(3),
    backgroundColor: '#b72429',
    color: 'white',
    '&:hover': {
      backgroundColor: '#a01f23',
    },
  },
  infoBox: {
    backgroundColor: '#f8fafc',
    padding: theme.spacing(2),
    borderRadius: '8px',
    marginTop: theme.spacing(4),
    border: '1px solid #e2e8f0',
  },
  previewWrap: {
    marginTop: theme.spacing(2),
    borderRadius: 12,
    overflow: 'hidden',
    border: '1px solid rgba(15,23,42,0.12)',
    minHeight: 180,
    backgroundColor: '#0f172a',
    position: 'relative',
  },
  previewImage: {
    position: 'absolute',
    inset: 0,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    filter: 'brightness(0.58)',
  },
  previewContent: {
    position: 'relative',
    zIndex: 2,
    padding: theme.spacing(3),
    color: '#fff',
  },
}));

const DEFAULT_BANNER = {
  enabled: false,
  imageUrl: '',
  title: '',
  subtitle: '',
  ctaText: '',
  ctaLink: '',
};

export default function HomeBannerSettings() {
  const classes = useStyles();
  const [form, setForm] = useState(DEFAULT_BANNER);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const response = await fetch('/settings/homePageBanner');
        if (!response.ok) return;
        const data = await response.json();
        if (cancelled) return;
        setForm({ ...DEFAULT_BANNER, ...(data && data.value ? data.value : {}) });
      } catch (err) {
        // no-op: setting may not exist on first load
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const onChange = key => e => {
    const value =
      e && e.target && e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const onSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: '', type: '' });
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await fetch('/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          key: 'homePageBanner',
          value: form,
        }),
      });
      if (response.ok) {
        setMessage({ text: 'Home banner updated successfully!', type: 'success' });
      } else {
        const error = await response.json().catch(() => ({}));
        setMessage({ text: error.message || 'Failed to update home banner', type: 'error' });
      }
    } catch (err) {
      setMessage({ text: 'Server error', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const onUploadBanner = async e => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setUploading(true);
    setMessage({ text: '', type: '' });
    try {
      const token = localStorage.getItem('jwtToken');
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch('/settings/home-banner/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await response.json().catch(() => ({}));
      if (response.ok && data.imageUrl) {
        setForm(prev => ({ ...prev, imageUrl: data.imageUrl }));
        setMessage({ text: 'Banner image uploaded successfully.', type: 'success' });
      } else {
        setMessage({ text: data?.error?.message || 'Failed to upload image', type: 'error' });
      }
    } catch (err) {
      setMessage({ text: 'Upload failed', type: 'error' });
    } finally {
      setUploading(false);
      e.target.value = '';
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
          <PhotoLibraryIcon className={classes.icon} />
          Home Page Banner
        </Typography>
        <Divider />
        <form className={classes.form} onSubmit={onSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Switch checked={Boolean(form.enabled)} onChange={onChange('enabled')} color="primary" />}
                label="Enable custom home banner"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                fullWidth
                label="Banner image URL"
                value={form.imageUrl}
                onChange={onChange('imageUrl')}
                helperText="Use /uploads/... or full URL"
              />
              <Box mt={1}>
                <input
                  id="home-banner-upload"
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={onUploadBanner}
                />
                <label htmlFor="home-banner-upload">
                  <Button
                    component="span"
                    variant="outlined"
                    startIcon={<CloudUploadIcon />}
                    disabled={uploading}
                  >
                    {uploading ? 'Uploading...' : 'Upload Banner Image'}
                  </Button>
                </label>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                fullWidth
                label="Banner title"
                value={form.title}
                onChange={onChange('title')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                fullWidth
                label="Banner subtitle"
                value={form.subtitle}
                onChange={onChange('subtitle')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                fullWidth
                label="CTA text"
                value={form.ctaText}
                onChange={onChange('ctaText')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                fullWidth
                label="CTA link"
                value={form.ctaLink}
                onChange={onChange('ctaLink')}
                helperText="Example: /movies"
              />
            </Grid>
            <Grid item xs={12}>
              {message.text && (
                <Typography style={{ color: message.type === 'success' ? '#059669' : '#dc2626', fontWeight: 600 }}>
                  {message.text}
                </Typography>
              )}
              <Button type="submit" variant="contained" className={classes.submit} disabled={saving}>
                {saving ? 'Saving...' : 'Update Home Banner'}
              </Button>
            </Grid>
          </Grid>
        </form>

        {form.imageUrl && (
          <Box className={classes.previewWrap}>
            <div className={classes.previewImage} style={{ backgroundImage: `url("${form.imageUrl}")` }} />
            <div className={classes.previewContent}>
              <Typography variant="h5" style={{ fontWeight: 800 }}>
                {form.title || 'Banner Title'}
              </Typography>
              <Typography variant="body2" style={{ opacity: 0.9 }}>
                {form.subtitle || 'Banner subtitle preview'}
              </Typography>
            </div>
          </Box>
        )}

        <Box className={classes.infoBox}>
          <Typography variant="body2" color="textSecondary">
            When enabled, this custom banner replaces the default rotating hero on the home page.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

