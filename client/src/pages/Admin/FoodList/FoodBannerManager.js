import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  CircularProgress,
  IconButton,
  Grid,
  Box
} from '@material-ui/core';
import { Delete as DeleteIcon, CloudUpload as CloudUploadIcon } from '@material-ui/icons';
import { normalizeImage } from '../../../utils/imageUrl';

export default function FoodBannerManager({ open, onClose, classes }) {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState(null); // { type: 'error'|'success', msg }

  useEffect(() => {
    if (open) {
      setStatus(null);
      loadBanners();
    }
  }, [open]);

  const loadBanners = async () => {
    setLoading(true);
    try {
      const res = await fetch('/food-banners');
      const data = await res.json();
      setBanners(Array.isArray(data.banners) ? data.banners : []);
    } catch (e) {
      setBanners([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    setStatus(null);

    const uploaded = [];
    for (const file of files) {
      const form = new FormData();
      form.append('image', file);
      try {
        const res = await fetch('/food-banners/upload', { method: 'POST', body: form });
        const data = await res.json();
        if (res.ok && data.url) {
          uploaded.push({ imageUrl: data.url });
        } else {
          setStatus({ type: 'error', msg: `Upload failed: ${data.error || res.statusText}` });
        }
      } catch (err) {
        setStatus({ type: 'error', msg: `Upload error: ${err.message}` });
      }
    }

    if (uploaded.length) {
      setBanners(prev => [...prev, ...uploaded]);
    }
    setUploading(false);
    e.target.value = '';
  };

  const handleDelete = (idx) => {
    setBanners(prev => prev.filter((_, i) => i !== idx));
    setStatus(null);
  };

  const handleSave = async () => {
    setSaving(true);
    setStatus(null);
    try {
      const res = await fetch('/food-banners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ banners }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus({ type: 'success', msg: `Saved! ${data.count} banner(s) active.` });
        setTimeout(() => onClose(), 1200);
      } else {
        setStatus({ type: 'error', msg: `Save failed: ${data.error || res.statusText}` });
      }
    } catch (err) {
      setStatus({ type: 'error', msg: `Error: ${err.message}` });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} classes={{ paper: classes.dialogPaper }} maxWidth="md" fullWidth>
      <DialogTitle className={classes.dialogTitle}>Manage Food Page Banners</DialogTitle>

      <DialogContent style={{ paddingTop: 20, minHeight: 300 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" style={{ height: 200 }}>
            <CircularProgress style={{ color: '#b72429' }} />
          </Box>
        ) : (
          <>
            {status && (
              <Box
                mb={2} p={1.5}
                style={{
                  borderRadius: 8,
                  backgroundColor: status.type === 'success' ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
                  border: `1px solid ${status.type === 'success' ? '#22c55e' : '#ef4444'}`,
                }}
              >
                <Typography style={{ color: status.type === 'success' ? '#22c55e' : '#ef4444', fontSize: '0.85rem' }}>
                  {status.msg}
                </Typography>
              </Box>
            )}

            <Box mb={3} display="flex" justifyContent="space-between" alignItems="center">
              <Typography style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.83rem' }}>
                These images will slide as banners on the Food &amp; Combos page.
              </Typography>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="food-banner-file"
                type="file"
                multiple
                onChange={handleUpload}
              />
              <label htmlFor="food-banner-file">
                <Button
                  variant="outlined"
                  component="span"
                  disabled={uploading}
                  style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.25)', marginLeft: 12, whiteSpace: 'nowrap' }}
                  startIcon={uploading ? <CircularProgress size={16} color="inherit" /> : <CloudUploadIcon />}
                >
                  {uploading ? 'Uploading…' : 'Upload Images'}
                </Button>
              </label>
            </Box>

            {banners.length === 0 ? (
              <Box textAlign="center" py={6}>
                <CloudUploadIcon style={{ fontSize: 52, color: 'rgba(255,255,255,0.12)', marginBottom: 12 }} />
                <Typography style={{ color: 'rgba(255,255,255,0.3)' }}>
                  No banners yet. Upload images above, then click Save.
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={2}>
                {banners.map((banner, idx) => (
                  <Grid item xs={12} sm={6} md={4} key={idx}>
                    <Box
                      position="relative"
                      style={{ borderRadius: 8, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}
                    >
                      <img
                        src={normalizeImage(banner.imageUrl)}
                        alt={`Slide ${idx + 1}`}
                        style={{ width: '100%', height: 130, objectFit: 'cover', display: 'block' }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(idx)}
                        style={{
                          position: 'absolute', top: 6, right: 6,
                          backgroundColor: 'rgba(0,0,0,0.7)', color: '#ef4444',
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                      <Box
                        style={{
                          position: 'absolute', bottom: 0, left: 0, right: 0,
                          background: 'rgba(0,0,0,0.55)', padding: '3px 8px',
                        }}
                      >
                        <Typography style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.68rem' }}>
                          Slide {idx + 1}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            )}
          </>
        )}
      </DialogContent>

      <DialogActions style={{ padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <Button onClick={onClose} className={classes.cancelBtn}>Cancel</Button>
        <Button
          onClick={handleSave}
          className={classes.saveBtn}
          disabled={saving}
          variant="contained"
        >
          {saving ? <CircularProgress size={20} color="inherit" /> : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
