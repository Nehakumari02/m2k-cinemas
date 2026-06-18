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
  imageUrl: '',
  videoUrl: '',
  title: '',
  subtitle: '',
  ctaText: '',
  ctaLink: '',
};

const DEFAULT_STATE = {
  enabled: false,
  banners: [{ ...DEFAULT_BANNER }],
};

export default function HomeBannerSettings() {
  const classes = useStyles();
  const [form, setForm] = useState(DEFAULT_STATE);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const response = await fetch('/settings/homePageBanner');
        if (!response.ok) return;
        const data = await response.json();
        if (cancelled) return;
        if (data && data.value) {
          // Migration from single banner object to array of banners
          let banners = data.value.banners || [];
          if (!data.value.banners && data.value.imageUrl) {
            banners = [data.value];
          }
          if (banners.length === 0) banners = [{ ...DEFAULT_BANNER }];
          setForm({ enabled: !!data.value.enabled, banners });
        }
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

  const onEnableChange = e => {
    setForm(prev => ({ ...prev, enabled: e.target.checked }));
  };

  const onBannerChange = (index, key) => e => {
    const value = e.target.value;
    setForm(prev => {
      const newBanners = [...prev.banners];
      newBanners[index] = { ...newBanners[index], [key]: value };
      return { ...prev, banners: newBanners };
    });
  };

  const addBanner = () => {
    setForm(prev => ({ ...prev, banners: [...prev.banners, { ...DEFAULT_BANNER }] }));
  };

  const removeBanner = index => {
    setForm(prev => {
      const newBanners = [...prev.banners];
      newBanners.splice(index, 1);
      return { ...prev, banners: newBanners };
    });
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
        setMessage({ text: 'Home banners updated successfully!', type: 'success' });
      } else {
        const error = await response.json().catch(() => ({}));
        setMessage({ text: error.message || 'Failed to update home banners', type: 'error' });
      }
    } catch (err) {
      setMessage({ text: 'Server error', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const onUploadBanner = async (e, index) => {
    const target = e.target;
    const file = target.files && target.files[0];
    if (!file) return;
    setUploadingIndex(index);
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
        setForm(prev => {
          const newBanners = [...prev.banners];
          newBanners[index] = { ...newBanners[index], imageUrl: data.imageUrl };
          return { ...prev, banners: newBanners };
        });
        setMessage({ text: 'Banner image uploaded successfully.', type: 'success' });
      } else {
        setMessage({ text: data?.error?.message || 'Failed to upload image', type: 'error' });
      }
    } catch (err) {
      setMessage({ text: 'Upload failed', type: 'error' });
    } finally {
      setUploadingIndex(null);
      target.value = '';
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
          Home Page Banners
        </Typography>
        <Divider />
        <form className={classes.form} onSubmit={onSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Switch checked={Boolean(form.enabled)} onChange={onEnableChange} color="primary" />}
                label="Enable custom home banners"
              />
            </Grid>
          </Grid>
          
          {form.banners.map((banner, index) => (
            <Box key={index} my={4} p={3} border="1px solid #e2e8f0" borderRadius={8} position="relative">
              <Typography variant="h6" style={{ marginBottom: 16 }}>
                Banner #{index + 1}
              </Typography>
              {form.banners.length > 1 && (
                <Button 
                  onClick={() => removeBanner(index)} 
                  variant="outlined" 
                  color="secondary" 
                  size="small"
                  style={{ position: 'absolute', top: 16, right: 16 }}
                >
                  Remove
                </Button>
              )}
              
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    fullWidth
                    label="Banner image URL"
                    value={banner.imageUrl}
                    onChange={onBannerChange(index, 'imageUrl')}
                    helperText="Use /uploads/... or full URL"
                  />
                  <Box mt={1}>
                    <input
                      id={`home-banner-upload-${index}`}
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => onUploadBanner(e, index)}
                    />
                    <label htmlFor={`home-banner-upload-${index}`}>
                      <Button
                        component="span"
                        variant="outlined"
                        startIcon={<CloudUploadIcon />}
                        disabled={uploadingIndex === index}
                      >
                        {uploadingIndex === index ? 'Uploading...' : 'Upload Banner Image'}
                      </Button>
                    </label>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    fullWidth
                    label="Banner video/trailer URL (Optional)"
                    value={banner.videoUrl}
                    onChange={onBannerChange(index, 'videoUrl')}
                    helperText="If provided, this video will play inside a floating card on the banner."
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    variant="outlined"
                    fullWidth
                    label="Banner title"
                    value={banner.title}
                    onChange={onBannerChange(index, 'title')}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    variant="outlined"
                    fullWidth
                    label="Banner subtitle"
                    value={banner.subtitle}
                    onChange={onBannerChange(index, 'subtitle')}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    variant="outlined"
                    fullWidth
                    label="CTA text"
                    value={banner.ctaText}
                    onChange={onBannerChange(index, 'ctaText')}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    variant="outlined"
                    fullWidth
                    label="CTA link"
                    value={banner.ctaLink}
                    onChange={onBannerChange(index, 'ctaLink')}
                    helperText="Example: /movies"
                  />
                </Grid>
              </Grid>
              
              {banner.imageUrl && (
                <Box className={classes.previewWrap}>
                  <div className={classes.previewImage} style={{ backgroundImage: `url("${banner.imageUrl}")` }} />
                  <div className={classes.previewContent}>
                    <Typography variant="h5" style={{ fontWeight: 800 }}>
                      {banner.title || 'Banner Title'}
                    </Typography>
                    <Typography variant="body2" style={{ opacity: 0.9 }}>
                      {banner.subtitle || 'Banner subtitle preview'}
                    </Typography>
                  </div>
                </Box>
              )}
            </Box>
          ))}
          
          <Box mb={4}>
            <Button variant="outlined" color="primary" onClick={addBanner}>
              + Add Another Banner
            </Button>
          </Box>
          
          <Grid container spacing={3}>
            <Grid item xs={12}>
              {message.text && (
                <Typography style={{ color: message.type === 'success' ? '#059669' : '#dc2626', fontWeight: 600 }}>
                  {message.text}
                </Typography>
              )}
              <Button type="submit" variant="contained" className={classes.submit} disabled={saving}>
                {saving ? 'Saving...' : 'Update Home Banners'}
              </Button>
            </Grid>
          </Grid>
        </form>

        <Box className={classes.infoBox}>
          <Typography variant="body2" color="textSecondary">
            When enabled, these custom banners replace the default rotating hero on the home page.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

