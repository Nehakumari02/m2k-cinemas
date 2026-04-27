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
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Switch,
  FormControlLabel,
  IconButton,
  Tooltip,
} from '@material-ui/core';
import { Add, Edit, Delete, LocalOffer, PhotoCamera } from '@material-ui/icons';
import {
  getAdminOffers,
  onSelectOffer,
  createOffer,
  updateOffer,
  removeOffer,
} from '../../../store/actions';

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
    marginBottom: theme.spacing(4),
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
  codeBadge: {
    color: '#b72429',
    border: '1px dashed rgba(183,36,41,0.5)',
    backgroundColor: 'rgba(183,36,41,0.08)',
    fontWeight: 800,
    fontSize: '0.72rem',
    letterSpacing: '0.08em',
    marginBottom: theme.spacing(1),
  },
  activeBadge: {
    color: '#22c55e',
    border: '1px solid rgba(34,197,94,0.3)',
    backgroundColor: 'rgba(34,197,94,0.08)',
    fontSize: '0.7rem',
    fontWeight: 700,
    marginLeft: theme.spacing(1),
  },
  inactiveBadge: {
    color: 'rgba(255,255,255,0.3)',
    border: '1px solid rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(255,255,255,0.04)',
    fontSize: '0.7rem',
    marginLeft: theme.spacing(1),
  },
  validTill: {
    fontSize: '0.72rem',
    color: 'rgba(255,255,255,0.4)',
    marginTop: theme.spacing(0.5),
  },
  cardActions: {
    justifyContent: 'flex-end',
    borderTop: '1px solid rgba(255,255,255,0.05)',
    padding: theme.spacing(1, 1.5),
  },
  editBtn: { color: '#b72429' },
  deleteBtn: { color: 'rgba(255,255,255,0.35)', '&:hover': { color: '#ef4444' } },
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
  imageUpload: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    border: '2px dashed rgba(255,255,255,0.15)',
    borderRadius: '10px',
    padding: theme.spacing(2),
    cursor: 'pointer',
    marginBottom: theme.spacing(2),
    '&:hover': { borderColor: '#b72429' },
  },
  previewImg: {
    width: '100%',
    height: '160px',
    objectFit: 'cover',
    borderRadius: '8px',
    marginBottom: theme.spacing(1),
  },
  uploadIcon: { color: 'rgba(255,255,255,0.4)', fontSize: '2rem' },
  uploadText: { color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' },
  toggleLabel: { color: 'rgba(255,255,255,0.7)' },
  saveBtn: {
    backgroundColor: '#b72429',
    color: '#fff',
    fontWeight: 700,
    '&:hover': { backgroundColor: '#9a1e22' },
    '&:disabled': { backgroundColor: 'rgba(183,36,41,0.3)' },
  },
  cancelBtn: { color: 'rgba(255,255,255,0.5)' },
  emptyState: {
    textAlign: 'center',
    padding: theme.spacing(10, 0),
    color: 'rgba(255,255,255,0.3)',
  },
});

const EMPTY_FORM = {
  title: '',
  description: '',
  code: '',
  validTill: '',
  isActive: true,
};

class OfferList extends Component {
  state = {
    dialogOpen: false,
    isEditing: false,
    form: EMPTY_FORM,
    imageFile: null,
    imagePreview: null,
    saving: false,
    deleteConfirm: null,
  };

  componentDidMount() {
    this.props.getAdminOffers();
  }

  openAdd = () => {
    this.setState({
      dialogOpen: true,
      isEditing: false,
      form: EMPTY_FORM,
      imageFile: null,
      imagePreview: null,
    });
  };

  openEdit = offer => {
    this.setState({
      dialogOpen: true,
      isEditing: true,
      form: {
        title: offer.title || '',
        description: offer.description || '',
        code: offer.code || '',
        validTill: offer.validTill ? offer.validTill.split('T')[0] : '',
        isActive: offer.isActive !== false,
      },
      imageFile: null,
      imagePreview: offer.image || null,
      editId: offer._id,
    });
  };

  closeDialog = () => {
    this.setState({ dialogOpen: false, saving: false });
  };

  handleChange = e => {
    const { name, value, type, checked } = e.target;
    this.setState(prev => ({
      form: { ...prev.form, [name]: type === 'checkbox' ? checked : value },
    }));
  };

  handleImage = e => {
    const file = e.target.files[0];
    if (!file) return;
    this.setState({
      imageFile: file,
      imagePreview: URL.createObjectURL(file),
    });
  };

  handleSave = async () => {
    const { form, imageFile, isEditing, editId } = this.state;
    if (!form.title || !form.code || !form.validTill) return;
    this.setState({ saving: true });

    const payload = { ...form };
    let result;
    if (isEditing) {
      result = await this.props.updateOffer(imageFile, payload, editId);
    } else {
      result = await this.props.createOffer(imageFile, payload);
    }

    this.setState({ saving: false });
    if (result && result.status === 'success') this.closeDialog();
  };

  confirmDelete = offer => this.setState({ deleteConfirm: offer });

  handleDelete = async () => {
    const { deleteConfirm } = this.state;
    if (!deleteConfirm) return;
    await this.props.removeOffer(deleteConfirm._id);
    this.setState({ deleteConfirm: null });
  };

  getOfferImage = offer => {
    const fallback = '/images/offers/offer1.png';
    if (!offer || !offer.image) return fallback;
    if (offer.image.startsWith('http://') || offer.image.startsWith('https://')) {
      return encodeURI(offer.image);
    }
    return encodeURI(offer.image.startsWith('/') ? offer.image : `/${offer.image}`);
  };

  render() {
    const { classes, offers } = this.props;
    const {
      dialogOpen, form, saving, imagePreview, deleteConfirm, isEditing,
    } = this.state;

    return (
      <div className={classes.root}>
        {/* Header */}
        <div className={classes.header}>
          <div className={classes.titleBlock}>
            <LocalOffer className={classes.titleIcon} />
            <Typography className={classes.pageTitle}>Manage Offers</Typography>
          </div>
          <Button className={classes.addBtn} startIcon={<Add />} onClick={this.openAdd}>
            Add Offer
          </Button>
        </div>

        {/* Offer Cards Grid */}
        {!offers ? (
          <div className={classes.progressWrapper}><CircularProgress style={{ color: '#b72429' }} /></div>
        ) : offers.length === 0 ? (
          <div className={classes.emptyState}>
            <LocalOffer style={{ fontSize: '4rem', marginBottom: 16 }} />
            <Typography variant="h6">No offers yet. Add your first offer!</Typography>
          </div>
        ) : (
          <Grid container spacing={3}>
            {offers.map(offer => (
              <Grid item key={offer._id} xs={12} sm={6} md={4} lg={3}>
                <Card className={classes.card} elevation={0}>
                  <CardMedia
                    component="img"
                    className={classes.cardMedia}
                    image={this.getOfferImage(offer)}
                    alt={offer.title}
                  />
                  <CardContent className={classes.cardContent}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                      <Chip label={offer.code} className={classes.codeBadge} size="small" variant="outlined" />
                      <Chip
                        label={offer.isActive ? 'Active' : 'Inactive'}
                        className={offer.isActive ? classes.activeBadge : classes.inactiveBadge}
                        size="small"
                        variant="outlined"
                      />
                    </div>
                    <Typography className={classes.cardTitle}>{offer.title}</Typography>
                    <Typography className={classes.cardDesc}>{offer.description}</Typography>
                    <Typography className={classes.validTill}>
                      Valid till: {new Date(offer.validTill).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </Typography>
                  </CardContent>
                  <CardActions className={classes.cardActions}>
                    <Tooltip title="Edit">
                      <IconButton size="small" className={classes.editBtn} onClick={() => this.openEdit(offer)}>
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton size="small" className={classes.deleteBtn} onClick={() => this.confirmDelete(offer)}>
                        <Delete fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Add / Edit Dialog */}
        <Dialog open={dialogOpen} onClose={this.closeDialog} classes={{ paper: classes.dialogPaper }}>
          <DialogTitle className={classes.dialogTitle}>
            {isEditing ? 'Edit Offer' : 'Add New Offer'}
          </DialogTitle>
          <DialogContent style={{ paddingTop: 20 }}>
            {/* Image Upload */}
            <label htmlFor="offer-image-upload">
              <div className={classes.imageUpload}>
                {imagePreview ? (
                  <img src={imagePreview} alt="preview" className={classes.previewImg} />
                ) : (
                  <>
                    <PhotoCamera className={classes.uploadIcon} />
                    <Typography className={classes.uploadText}>Click to upload offer banner image</Typography>
                  </>
                )}
                {imagePreview && (
                  <Typography className={classes.uploadText} style={{ marginTop: 4 }}>Click to change image</Typography>
                )}
              </div>
            </label>
            <input
              id="offer-image-upload"
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={this.handleImage}
            />

            <TextField
              label="Offer Title *"
              name="title"
              value={form.title}
              onChange={this.handleChange}
              fullWidth
              variant="outlined"
              className={classes.input}
            />
            <TextField
              label="Description *"
              name="description"
              value={form.description}
              onChange={this.handleChange}
              fullWidth
              variant="outlined"
              multiline
              rows={3}
              className={classes.input}
            />
            <TextField
              label="Promo Code *"
              name="code"
              value={form.code}
              onChange={this.handleChange}
              fullWidth
              variant="outlined"
              inputProps={{ style: { textTransform: 'uppercase' } }}
              className={classes.input}
            />
            <TextField
              label="Valid Till *"
              name="validTill"
              type="date"
              value={form.validTill}
              onChange={this.handleChange}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              className={classes.input}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={form.isActive}
                  onChange={this.handleChange}
                  name="isActive"
                  color="primary"
                />
              }
              label={<span className={classes.toggleLabel}>Active (visible on website)</span>}
            />
          </DialogContent>
          <DialogActions style={{ padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            <Button onClick={this.closeDialog} className={classes.cancelBtn}>Cancel</Button>
            <Button
              onClick={this.handleSave}
              className={classes.saveBtn}
              disabled={saving || !form.title || !form.code || !form.validTill}
              variant="contained">
              {saving ? <CircularProgress size={20} color="inherit" /> : isEditing ? 'Save Changes' : 'Create Offer'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirm Dialog */}
        <Dialog
          open={Boolean(deleteConfirm)}
          onClose={() => this.setState({ deleteConfirm: null })}
          classes={{ paper: classes.dialogPaper }}>
          <DialogTitle className={classes.dialogTitle}>Delete Offer?</DialogTitle>
          <DialogContent style={{ paddingTop: 16 }}>
            <Typography style={{ color: 'rgba(255,255,255,0.7)' }}>
              Are you sure you want to delete <strong style={{ color: '#fff' }}>{deleteConfirm?.title}</strong>? This cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions style={{ padding: '16px 24px' }}>
            <Button onClick={() => this.setState({ deleteConfirm: null })} className={classes.cancelBtn}>Cancel</Button>
            <Button onClick={this.handleDelete} style={{ backgroundColor: '#ef4444', color: '#fff', fontWeight: 700 }} variant="contained">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

const mapStateToProps = ({ offerState }) => ({
  offers: offerState.offers,
  selectedOffer: offerState.selectedOffer,
});

const mapDispatchToProps = { getAdminOffers, onSelectOffer, createOffer, updateOffer, removeOffer };

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(OfferList));
