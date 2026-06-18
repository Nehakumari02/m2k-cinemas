import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core';
import {
  Button,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Tooltip,
  MenuItem,
  Chip,
  FormControlLabel,
  Switch,
  Collapse,
  Box,
  Paper
} from '@material-ui/core';
import { Add, Edit, Delete, Fastfood, CloudUpload as CloudUploadIcon, ExpandLess, ExpandMore, Delete as DeleteIcon } from '@material-ui/icons';
import { getFood, addFood, removeFood, updateFood, uploadFoodImage } from '../../../store/actions';
import { normalizeImage } from '../../../utils/imageUrl';
import PhotoLibraryIcon from '@material-ui/icons/PhotoLibrary';

const styles = theme => ({
  root: {
    padding: theme.spacing(3),
    minHeight: '100vh',
    backgroundColor: '#0e0e14',
    color: '#fff',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(3),
  },
  titleBlock: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
  },
  titleIcon: {
    color: '#b72429',
    fontSize: '2rem',
  },
  pageTitle: {
    fontWeight: 800,
    fontSize: '1.8rem',
    color: '#fff',
  },
  addBtn: {
    backgroundColor: '#b72429',
    color: '#fff',
    fontWeight: 700,
    borderRadius: '10px',
    padding: '10px 24px',
    '&:hover': { backgroundColor: '#9a1e22' },
  },
  manageBannersBtn: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    color: '#fff',
    fontWeight: 700,
    borderRadius: '10px',
    padding: '10px 24px',
    marginRight: theme.spacing(2),
    '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' },
  },
  bannerPanel: {
    backgroundColor: '#1a1a24',
    borderRadius: 14,
    border: '1px solid rgba(255,255,255,0.09)',
    marginBottom: theme.spacing(3),
    overflow: 'hidden',
  },
  bannerPanelHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 20px',
    cursor: 'pointer',
    borderBottom: '1px solid rgba(255,255,255,0.07)',
  },
  bannerPanelBody: {
    padding: '20px',
  },
  card: {
    backgroundColor: '#1a1a24',
    borderRadius: '14px',
    border: '1px solid rgba(255,255,255,0.07)',
    overflow: 'hidden',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'box-shadow 0.2s',
    '&:hover': { boxShadow: '0 8px 24px rgba(0,0,0,0.5)' },
  },
  cardMedia: {
    height: 160,
    objectFit: 'cover',
    backgroundColor: '#12121c',
  },
  cardContent: { flexGrow: 1, padding: theme.spacing(2) },
  cardTitle: {
    fontWeight: 700,
    fontSize: '0.95rem',
    color: '#fff',
    marginBottom: theme.spacing(0.5),
  },
  cardDesc: {
    fontSize: '0.78rem',
    color: 'rgba(255,255,255,0.5)',
    marginBottom: theme.spacing(1.5),
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  priceBadge: {
    color: '#b72429',
    fontWeight: 800,
    fontSize: '1rem',
    marginBottom: theme.spacing(1),
  },
  typeChip: {
    fontSize: '0.7rem',
    fontWeight: 700,
    height: 20,
    marginBottom: theme.spacing(1)
  },
  cardActions: {
    justifyContent: 'flex-end',
    borderTop: '1px solid rgba(255,255,255,0.05)',
    padding: theme.spacing(1, 1.5),
    gap: 4
  },
  editBtn: { color: 'rgba(255,255,255,0.4)', '&:hover': { color: '#b72429' } },
  deleteBtn: { color: 'rgba(255,255,255,0.3)', '&:hover': { color: '#ef4444' } },
  progressWrapper: {
    display: 'flex',
    justifyContent: 'center',
    padding: theme.spacing(8),
  },
  dialogPaper: {
    backgroundColor: '#1a1a24',
    color: '#fff',
    borderRadius: '16px',
    minWidth: '480px',
  },
  dialogTitle: {
    color: '#fff',
    fontWeight: 700,
    borderBottom: '1px solid rgba(255,255,255,0.07)',
  },
  input: {
    '& .MuiOutlinedInput-root': {
      color: '#fff',
      '& fieldset': { borderColor: 'rgba(255,255,255,0.15)' },
      '&:hover fieldset': { borderColor: 'rgba(183,36,41,0.5)' },
      '&.Mui-focused fieldset': { borderColor: '#b72429' },
    },
    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' },
    '& .MuiInputLabel-root.Mui-focused': { color: '#b72429' },
    marginBottom: theme.spacing(2),
  },
  fileInput: {
    marginBottom: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    gap: 8
  },
  saveBtn: {
    backgroundColor: '#b72429',
    color: '#fff',
    fontWeight: 700,
    '&:hover': { backgroundColor: '#9a1e22' },
  },
  cancelBtn: { color: 'rgba(255,255,255,0.5)' },
  emptyState: {
    textAlign: 'center',
    padding: theme.spacing(10, 0),
    color: 'rgba(255,255,255,0.3)',
  },
});

const EMPTY_FORM = {
  name: '',
  category: '',
  description: '',
  price: '',
  image: '',
  type: 'veg',
  isWeeklyOffer: false,
  isMonthlyOffer: false
};

class FoodList extends Component {
  state = {
    dialogOpen: false,
    form: EMPTY_FORM,
    isEdit: false,
    selectedId: null,
    saving: false,
    uploading: false,
    deleteConfirm: null,
    // Banner panel state (inline, no dialog)
    bannerPanelOpen: false,
    banners: [],
    bannerLoading: false,
    bannerSaving: false,
    bannerUploading: false,
    bannerStatus: null,
  };

  componentDidMount() {
    this.props.getFood();
  }

  // ─── Food item methods ───────────────────────────────────────────────────────
  openAdd = () => {
    this.setState({ dialogOpen: true, form: EMPTY_FORM, isEdit: false, selectedId: null });
  };

  openEdit = item => {
    this.setState({
      dialogOpen: true,
      form: {
        name: item.name,
        category: item.category,
        description: item.description,
        price: item.price,
        image: item.image,
        type: item.type,
        isWeeklyOffer: item.isWeeklyOffer || false,
        isMonthlyOffer: item.isMonthlyOffer || false
      },
      isEdit: true,
      selectedId: item._id
    });
  };

  closeDialog = () => {
    this.setState({ dialogOpen: false, saving: false, uploading: false });
  };

  handleChange = e => {
    const { name, value, type, checked } = e.target;
    this.setState(prev => ({
      form: { ...prev.form, [name]: type === 'checkbox' ? checked : value },
    }));
  };

  handleFileChange = async e => {
    const file = e.target.files[0];
    if (!file) return;
    this.setState({ uploading: true });
    const result = await this.props.uploadFoodImage(file);
    if (result && result.status === 'success') {
      this.setState(prev => ({
        form: { ...prev.form, image: result.url },
        uploading: false
      }));
    } else {
      this.setState({ uploading: false });
    }
  };

  handleSave = async () => {
    const { form, isEdit, selectedId } = this.state;
    this.setState({ saving: true });
    let result;
    if (isEdit) {
      result = await this.props.updateFood(selectedId, form);
    } else {
      result = await this.props.addFood(form);
    }
    this.setState({ saving: false });
    if (result && result.status === 'success') this.closeDialog();
  };

  handleDelete = async id => {
    await this.props.removeFood(id);
    this.setState({ deleteConfirm: null });
  };

  // ─── Banner panel methods ────────────────────────────────────────────────────
  toggleBannerPanel = async () => {
    const opening = !this.state.bannerPanelOpen;
    this.setState({ bannerPanelOpen: opening, bannerStatus: null });
    if (opening && this.state.banners.length === 0) {
      this.setState({ bannerLoading: true });
      try {
        const res = await fetch('/food-banners');
        const data = await res.json();
        this.setState({ banners: Array.isArray(data.banners) ? data.banners : [] });
      } catch (e) {
        this.setState({ banners: [] });
      } finally {
        this.setState({ bannerLoading: false });
      }
    }
  };

  handleBannerUpload = async e => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    this.setState({ bannerUploading: true, bannerStatus: null });
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
          this.setState({ bannerStatus: { type: 'error', msg: `Upload failed: ${data.error || res.statusText}` } });
        }
      } catch (err) {
        this.setState({ bannerStatus: { type: 'error', msg: `Upload error: ${err.message}` } });
      }
    }
    this.setState(prev => ({
      banners: [...prev.banners, ...uploaded],
      bannerUploading: false,
    }));
    e.target.value = '';
  };

  handleBannerDelete = idx => {
    this.setState(prev => ({
      banners: prev.banners.filter((_, i) => i !== idx),
      bannerStatus: null,
    }));
  };

  handleBannerSave = async () => {
    this.setState({ bannerSaving: true, bannerStatus: null });
    try {
      const res = await fetch('/food-banners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ banners: this.state.banners }),
      });
      const data = await res.json();
      if (res.ok) {
        this.setState({ bannerStatus: { type: 'success', msg: `✓ Saved! ${data.count} banner(s) are now live.` } });
      } else {
        this.setState({ bannerStatus: { type: 'error', msg: `Save failed: ${data.error || res.statusText}` } });
      }
    } catch (err) {
      this.setState({ bannerStatus: { type: 'error', msg: `Error: ${err.message}` } });
    } finally {
      this.setState({ bannerSaving: false });
    }
  };

  render() {
    const { classes, food } = this.props;
    const {
      dialogOpen, form, saving, uploading, isEdit, deleteConfirm,
      bannerPanelOpen, banners, bannerLoading, bannerSaving, bannerUploading, bannerStatus,
    } = this.state;

    return (
      <div className={classes.root}>
        <div className={classes.header}>
          <div className={classes.titleBlock}>
            <Fastfood className={classes.titleIcon} />
            <Typography className={classes.pageTitle}>Manage Food & Combos</Typography>
          </div>
          <div>
            <Button
              className={classes.manageBannersBtn}
              startIcon={<PhotoLibraryIcon />}
              onClick={this.toggleBannerPanel}
              endIcon={bannerPanelOpen ? <ExpandLess /> : <ExpandMore />}
            >
              Manage Banners
            </Button>
            <Button className={classes.addBtn} startIcon={<Add />} onClick={this.openAdd}>
              Add Food Item
            </Button>
          </div>
        </div>

        {/* ── Inline Banner Panel ── */}
        <Collapse in={bannerPanelOpen}>
          <Paper className={classes.bannerPanel} elevation={0}>
            <div className={classes.bannerPanelHeader} onClick={this.toggleBannerPanel}>
              <Typography style={{ fontWeight: 700, color: '#fff', fontSize: '1rem' }}>
                📸 Food Page Banner Slides
              </Typography>
              {bannerPanelOpen ? <ExpandLess style={{ color: 'rgba(255,255,255,0.5)' }} /> : <ExpandMore style={{ color: 'rgba(255,255,255,0.5)' }} />}
            </div>

            <div className={classes.bannerPanelBody}>
              {bannerLoading ? (
                <Box display="flex" justifyContent="center" py={4}>
                  <CircularProgress style={{ color: '#b72429' }} />
                </Box>
              ) : (
                <>
                  {bannerStatus && (
                    <Box
                      mb={2} p={1.5}
                      style={{
                        borderRadius: 8,
                        backgroundColor: bannerStatus.type === 'success' ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
                        border: `1px solid ${bannerStatus.type === 'success' ? '#22c55e' : '#ef4444'}`,
                      }}
                    >
                      <Typography style={{ color: bannerStatus.type === 'success' ? '#22c55e' : '#ef4444', fontSize: '0.85rem' }}>
                        {bannerStatus.msg}
                      </Typography>
                    </Box>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
                    <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.83rem' }}>
                      Upload images to show as sliding banners on the Food &amp; Combos page.
                    </span>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <label style={{ cursor: 'pointer' }}>
                        <input
                          accept="image/*"
                          type="file"
                          multiple
                          style={{ display: 'none' }}
                          onChange={this.handleBannerUpload}
                        />
                        <span style={{
                          display: 'inline-block',
                          padding: '8px 18px',
                          border: '1px solid rgba(255,255,255,0.3)',
                          borderRadius: 8,
                          color: '#fff',
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          cursor: bannerUploading ? 'not-allowed' : 'pointer',
                          opacity: bannerUploading ? 0.5 : 1,
                          userSelect: 'none',
                        }}>
                          {bannerUploading ? 'Uploading…' : '⬆ Upload Images'}
                        </span>
                      </label>

                      <button
                        type="button"
                        disabled={bannerSaving}
                        onClick={this.handleBannerSave}
                        style={{
                          padding: '8px 20px',
                          backgroundColor: bannerSaving ? '#7a1519' : '#b72429',
                          color: '#fff',
                          border: 'none',
                          borderRadius: 8,
                          fontSize: '0.875rem',
                          fontWeight: 700,
                          cursor: bannerSaving ? 'not-allowed' : 'pointer',
                        }}
                      >
                        {bannerSaving ? 'Saving…' : '💾 Save Banners'}
                      </button>
                    </div>
                  </div>


                  {banners.length === 0 ? (
                    <Box textAlign="center" py={5}>
                      <CloudUploadIcon style={{ fontSize: 48, color: 'rgba(255,255,255,0.12)', marginBottom: 10 }} />
                      <Typography style={{ color: 'rgba(255,255,255,0.3)' }}>
                        No banners uploaded yet. Upload images above, then click Save Banners.
                      </Typography>
                    </Box>
                  ) : (
                    <Grid container spacing={2}>
                      {banners.map((banner, idx) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={idx}>
                          <Box position="relative" style={{ borderRadius: 8, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <img
                              src={normalizeImage(banner.imageUrl)}
                              alt={`Slide ${idx + 1}`}
                              style={{ width: '100%', height: 120, objectFit: 'cover', display: 'block' }}
                            />
                            <IconButton
                              size="small"
                              onClick={() => this.handleBannerDelete(idx)}
                              style={{ position: 'absolute', top: 4, right: 4, backgroundColor: 'rgba(0,0,0,0.7)', color: '#ef4444' }}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                            <Box style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.55)', padding: '3px 8px' }}>
                              <Typography style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.68rem' }}>Slide {idx + 1}</Typography>
                            </Box>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </>
              )}
            </div>
          </Paper>
        </Collapse>

        {/* ── Food Items Grid ── */}
        {!food ? (
          <div className={classes.progressWrapper}><CircularProgress style={{ color: '#b72429' }} /></div>
        ) : food.length === 0 ? (
          <div className={classes.emptyState}>
            <Fastfood style={{ fontSize: '4rem', marginBottom: 16 }} />
            <Typography variant="h6">No food items yet. Add your first item!</Typography>
          </div>
        ) : (
          <Grid container spacing={3}>
            {food.map(item => (
              <Grid item key={item._id} xs={12} sm={6} md={4} lg={3}>
                <Card className={classes.card} elevation={0}>
                  <CardMedia component="img" className={classes.cardMedia} image={normalizeImage(item.image)} alt={item.name} />
                  <CardContent className={classes.cardContent}>
                    <Chip
                      label={item.type.toUpperCase()}
                      className={classes.typeChip}
                      style={{ backgroundColor: item.type === 'veg' ? '#2e7d32' : '#c62828', color: '#fff' }}
                    />
                    <Typography className={classes.cardTitle}>{item.name}</Typography>
                    <Typography className={classes.cardDesc}>{item.description}</Typography>
                    <Typography className={classes.priceBadge}>₹{item.price}</Typography>
                  </CardContent>
                  <CardActions className={classes.cardActions}>
                    <Tooltip title="Edit">
                      <IconButton size="small" className={classes.editBtn} onClick={() => this.openEdit(item)}>
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton size="small" className={classes.deleteBtn} onClick={() => this.setState({ deleteConfirm: item })}>
                        <Delete fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* ── Add/Edit Dialog ── */}
        <Dialog open={dialogOpen} onClose={this.closeDialog} classes={{ paper: classes.dialogPaper }}>
          <DialogTitle className={classes.dialogTitle}>{isEdit ? 'Edit Food Item' : 'Add New Food Item'}</DialogTitle>
          <DialogContent style={{ paddingTop: 20 }}>
            <TextField label="Name *" name="name" value={form.name} onChange={this.handleChange} fullWidth variant="outlined" className={classes.input} />
            <TextField label="Category *" name="category" value={form.category} onChange={this.handleChange} fullWidth variant="outlined" className={classes.input} select>
              {['Popcorn', 'Combos', 'Snacks', 'Beverages'].map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
            </TextField>
            <TextField label="Description *" name="description" value={form.description} onChange={this.handleChange} fullWidth variant="outlined" multiline rows={3} className={classes.input} />
            <TextField label="Price (₹) *" name="price" type="number" value={form.price} onChange={this.handleChange} fullWidth variant="outlined" className={classes.input} />
            <div className={classes.fileInput}>
              <Typography variant="caption" style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>
                Food Image (Upload or URL)
              </Typography>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <Button variant="outlined" component="label" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.15)' }} disabled={uploading}>
                  {uploading ? <CircularProgress size={20} color="inherit" /> : 'Upload File'}
                  <input type="file" hidden accept="image/*" onChange={this.handleFileChange} />
                </Button>
                <TextField label="Image URL" name="image" value={form.image} onChange={this.handleChange} fullWidth variant="outlined" className={classes.input} style={{ marginBottom: 0 }} />
              </div>
            </div>
            <TextField label="Type *" name="type" value={form.type} onChange={this.handleChange} fullWidth variant="outlined" className={classes.input} select>
              <MenuItem value="veg">Veg</MenuItem>
              <MenuItem value="non-veg">Non-Veg</MenuItem>
            </TextField>
            <Grid container spacing={2} style={{ marginTop: 8 }}>
              <Grid item xs={6}>
                <FormControlLabel
                  control={<Switch checked={form.isWeeklyOffer} onChange={this.handleChange} name="isWeeklyOffer" color="secondary" type="checkbox" />}
                  label="Weekly Offer" style={{ color: 'rgba(255,255,255,0.7)' }}
                />
              </Grid>
              <Grid item xs={6}>
                <FormControlLabel
                  control={<Switch checked={form.isMonthlyOffer} onChange={this.handleChange} name="isMonthlyOffer" color="secondary" type="checkbox" />}
                  label="Monthly Offer" style={{ color: 'rgba(255,255,255,0.7)' }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions style={{ padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            <Button onClick={this.closeDialog} className={classes.cancelBtn}>Cancel</Button>
            <Button onClick={this.handleSave} className={classes.saveBtn} disabled={saving || uploading || !form.name || !form.price} variant="contained">
              {saving ? <CircularProgress size={20} color="inherit" /> : (isEdit ? 'Update Item' : 'Create Item')}
            </Button>
          </DialogActions>
        </Dialog>

        {/* ── Delete Confirm Dialog ── */}
        <Dialog open={Boolean(deleteConfirm)} onClose={() => this.setState({ deleteConfirm: null })} classes={{ paper: classes.dialogPaper }}>
          <DialogTitle className={classes.dialogTitle}>Delete Item?</DialogTitle>
          <DialogContent style={{ paddingTop: 16 }}>
            <Typography style={{ color: 'rgba(255,255,255,0.7)' }}>
              Are you sure you want to delete <strong>{deleteConfirm?.name}</strong>?
            </Typography>
          </DialogContent>
          <DialogActions style={{ padding: '16px 24px' }}>
            <Button onClick={() => this.setState({ deleteConfirm: null })} className={classes.cancelBtn}>Cancel</Button>
            <Button onClick={() => this.handleDelete(deleteConfirm._id)} style={{ backgroundColor: '#ef4444', color: '#fff' }} variant="contained">Delete</Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

const mapStateToProps = ({ foodState }) => ({ food: foodState.food });
export default connect(mapStateToProps, { getFood, addFood, removeFood, updateFood, uploadFoodImage })(withStyles(styles)(FoodList));
