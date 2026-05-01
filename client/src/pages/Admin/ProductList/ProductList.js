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
  MenuItem,
  Box
} from '@material-ui/core';
import { Add, Edit, Delete, Store as StoreIcon, PhotoCamera } from '@material-ui/icons';
import {
  getProductsAdmin,
  addProduct,
  updateProduct,
  deleteProduct,
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
  categoryBadge: {
    color: '#b72429',
    border: '1px solid rgba(183,36,41,0.3)',
    backgroundColor: 'rgba(183,36,41,0.08)',
    fontSize: '0.7rem',
    fontWeight: 700,
  },
  stockBadge: {
    fontSize: '0.7rem',
    fontWeight: 700,
    marginLeft: theme.spacing(1),
  },
  priceText: {
    fontWeight: 800,
    color: '#b72429',
    marginTop: theme.spacing(1),
  },
  cardActions: {
    justifyContent: 'flex-end',
    borderTop: '1px solid rgba(255,255,255,0.05)',
    padding: theme.spacing(1, 1.5),
  },
  editBtn: { color: '#b72429' },
  deleteBtn: { color: 'rgba(255,255,255,0.35)', '&:hover': { color: '#ef4444' } },
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
  saveBtn: {
    backgroundColor: '#b72429',
    color: '#fff',
    fontWeight: 700,
    '&:hover': { backgroundColor: '#9a1e22' },
  },
  cancelBtn: { color: 'rgba(255,255,255,0.5)' },
});

const EMPTY_FORM = {
  name: '',
  description: '',
  price: '',
  category: 'Other',
  stock: '',
  isActive: true,
};

class ProductList extends Component {
  state = {
    dialogOpen: false,
    isEditing: false,
    form: EMPTY_FORM,
    imageFile: null,
    imagePreview: null,
    saving: false,
    deleteConfirm: null,
    editId: null,
  };

  componentDidMount() {
    this.props.getProductsAdmin();
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

  openEdit = product => {
    this.setState({
      dialogOpen: true,
      isEditing: true,
      form: {
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        stock: product.stock,
        isActive: product.isActive,
      },
      imageFile: null,
      imagePreview: product.image || null,
      editId: product._id,
    });
  };

  closeDialog = () => this.setState({ dialogOpen: false, saving: false });

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
    if (!form.name || !form.price || !form.stock) return;
    this.setState({ saving: true });

    let result;
    if (isEditing) {
      result = await this.props.updateProduct(editId, imageFile, form);
    } else {
      result = await this.props.addProduct(imageFile, form);
    }

    this.setState({ saving: false });
    if (result && result.status === 'success') this.closeDialog();
  };

  handleDelete = async () => {
    const { deleteConfirm } = this.state;
    if (!deleteConfirm) return;
    await this.props.deleteProduct(deleteConfirm._id);
    this.setState({ deleteConfirm: null });
  };

  render() {
    const { classes, products } = this.props;
    const { dialogOpen, form, saving, imagePreview, deleteConfirm, isEditing } = this.state;

    return (
      <div className={classes.root}>
        <div className={classes.header}>
          <div className={classes.titleBlock}>
            <StoreIcon className={classes.titleIcon} />
            <Typography className={classes.pageTitle}>Shop Management</Typography>
          </div>
          <Button className={classes.addBtn} startIcon={<Add />} onClick={this.openAdd}>
            Add Product
          </Button>
        </div>

        {/* Product Grid */}
        <Grid container spacing={3}>
          {products.map(product => (
            <Grid item key={product._id} xs={12} sm={6} md={4} lg={3}>
              <Card className={classes.card} elevation={0}>
                <CardMedia
                  component="img"
                  className={classes.cardMedia}
                  image={product.image || 'https://via.placeholder.com/300?text=Merchandise'}
                  alt={product.name}
                />
                <CardContent className={classes.cardContent}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Chip label={product.category} className={classes.categoryBadge} size="small" />
                    <Chip 
                      label={`${product.stock} in stock`} 
                      size="small" 
                      className={classes.stockBadge}
                      style={{ color: product.stock > 0 ? '#22c55e' : '#ef4444' }} 
                    />
                  </Box>
                  <Typography className={classes.cardTitle}>{product.name}</Typography>
                  <Typography className={classes.cardDesc}>{product.description}</Typography>
                  <Typography variant="h6" className={classes.priceText}>₹{product.price}</Typography>
                </CardContent>
                <CardActions className={classes.cardActions}>
                  <IconButton size="small" className={classes.editBtn} onClick={() => this.openEdit(product)}>
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton size="small" className={classes.deleteBtn} onClick={() => this.setState({ deleteConfirm: product })}>
                    <Delete fontSize="small" />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Add / Edit Dialog */}
        <Dialog open={dialogOpen} onClose={this.closeDialog} classes={{ paper: classes.dialogPaper }}>
          <DialogTitle className={classes.dialogTitle}>{isEditing ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          <DialogContent style={{ paddingTop: 20 }}>
            <label htmlFor="product-image-upload">
              <div className={classes.imageUpload}>
                {imagePreview ? (
                  <img src={imagePreview} alt="preview" className={classes.previewImg} />
                ) : (
                  <>
                    <PhotoCamera className={classes.uploadIcon} />
                    <Typography className={classes.uploadText}>Click to upload product image</Typography>
                  </>
                )}
              </div>
            </label>
            <input id="product-image-upload" type="file" accept="image/*" style={{ display: 'none' }} onChange={this.handleImage} />

            <TextField label="Product Name *" name="name" value={form.name} onChange={this.handleChange} fullWidth variant="outlined" className={classes.input} />
            <TextField label="Description *" name="description" value={form.description} onChange={this.handleChange} fullWidth variant="outlined" multiline rows={3} className={classes.input} />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField label="Price (₹) *" name="price" type="number" value={form.price} onChange={this.handleChange} fullWidth variant="outlined" className={classes.input} />
              </Grid>
              <Grid item xs={6}>
                <TextField label="Stock *" name="stock" type="number" value={form.stock} onChange={this.handleChange} fullWidth variant="outlined" className={classes.input} />
              </Grid>
            </Grid>
            <TextField select label="Category" name="category" value={form.category} onChange={this.handleChange} fullWidth variant="outlined" className={classes.input}>
              {['T-Shirt', 'Mug', 'Poster', 'Keychain', 'Other'].map(cat => (
                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
              ))}
            </TextField>
            <FormControlLabel
              control={<Switch checked={form.isActive} onChange={this.handleChange} name="isActive" color="primary" />}
              label="Active"
            />
          </DialogContent>
          <DialogActions style={{ padding: '16px 24px' }}>
            <Button onClick={this.closeDialog} className={classes.cancelBtn}>Cancel</Button>
            <Button onClick={this.handleSave} className={classes.saveBtn} disabled={saving} variant="contained">
              {saving ? <CircularProgress size={20} color="inherit" /> : 'Save Product'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation */}
        <Dialog open={Boolean(deleteConfirm)} onClose={() => this.setState({ deleteConfirm: null })} classes={{ paper: classes.dialogPaper }}>
          <DialogTitle className={classes.dialogTitle}>Delete Product?</DialogTitle>
          <DialogContent style={{ paddingTop: 16 }}>
            <Typography>Are you sure you want to delete <strong>{deleteConfirm?.name}</strong>?</Typography>
          </DialogContent>
          <DialogActions style={{ padding: '16px 24px' }}>
            <Button onClick={() => this.setState({ deleteConfirm: null })} className={classes.cancelBtn}>Cancel</Button>
            <Button onClick={this.handleDelete} style={{ backgroundColor: '#ef4444', color: '#fff' }} variant="contained">Delete</Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  products: state.productState.products
});

export default connect(mapStateToProps, { getProductsAdmin, addProduct, updateProduct, deleteProduct })(withStyles(styles)(ProductList));
