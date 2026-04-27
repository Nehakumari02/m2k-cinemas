import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core';
import {
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
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
import { Add, Edit, Delete, Movie, PhotoCamera } from '@material-ui/icons';
import {
  getAdminExperiences,
  createExperience,
  updateExperience,
  removeExperience,
} from '../../../store/actions';

const styles = theme => ({
  root: { padding: theme.spacing(3), minHeight: '100vh', backgroundColor: '#0e0e14', color: '#fff' },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: theme.spacing(4) },
  titleBlock: { display: 'flex', alignItems: 'center', gap: theme.spacing(2) },
  pageTitle: { fontWeight: 800, fontSize: '1.8rem', color: '#fff' },
  addBtn: { backgroundColor: '#b72429', color: '#fff', fontWeight: 700, borderRadius: 10 },
  card: { borderRadius: 14, overflow: 'hidden', color: '#fff', border: '1px solid rgba(255,255,255,0.08)' },
  cardContent: { minHeight: 210 },
  cardTitle: { fontWeight: 700, marginBottom: theme.spacing(1) },
  cardDesc: { color: 'rgba(255,255,255,0.7)', fontSize: '.85rem', marginBottom: theme.spacing(1.5) },
  chip: { marginRight: theme.spacing(1), marginBottom: theme.spacing(1) },
  cardActions: { justifyContent: 'flex-end' },
  dialogPaper: { backgroundColor: '#1a1a24', color: '#fff', borderRadius: 16, minWidth: 520 },
  imageUpload: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    border: '2px dashed rgba(255,255,255,0.15)',
    borderRadius: 10,
    padding: theme.spacing(2),
    cursor: 'pointer',
    marginBottom: theme.spacing(2),
    '&:hover': { borderColor: '#b72429' },
  },
  previewImg: {
    width: '100%',
    height: 160,
    objectFit: 'cover',
    borderRadius: 8,
    marginBottom: theme.spacing(1),
  },
  uploadIcon: { color: 'rgba(255,255,255,0.4)', fontSize: '2rem' },
  uploadText: { color: 'rgba(255,255,255,0.4)', fontSize: '.8rem' },
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
});

const EMPTY_FORM = {
  key: '',
  title: '',
  subtitle: '',
  description: '',
  features: '',
  gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
  accent: '#b72429',
  icon: '🎬',
  isActive: true,
};

class ExperienceList extends Component {
  state = {
    dialogOpen: false,
    isEditing: false,
    editId: null,
    form: EMPTY_FORM,
    imageFile: null,
    imagePreview: null,
    deleteConfirm: null,
  };

  componentDidMount() {
    this.props.getAdminExperiences();
  }

  openAdd = () =>
    this.setState({
      dialogOpen: true,
      isEditing: false,
      form: EMPTY_FORM,
      editId: null,
      imageFile: null,
      imagePreview: null,
    });

  openEdit = exp =>
    this.setState({
      dialogOpen: true,
      isEditing: true,
      editId: exp._id,
      form: {
        key: exp.key || '',
        title: exp.title || '',
        subtitle: exp.subtitle || '',
        description: exp.description || '',
        features: (exp.features || []).join(', '),
        gradient: exp.gradient || EMPTY_FORM.gradient,
        accent: exp.accent || '#b72429',
        icon: exp.icon || '🎬',
        isActive: exp.isActive !== false,
      },
      imageFile: null,
      imagePreview: exp.image || null,
    });

  closeDialog = () => this.setState({ dialogOpen: false });

  handleChange = e => {
    const { name, value, type, checked } = e.target;
    this.setState(prev => ({ form: { ...prev.form, [name]: type === 'checkbox' ? checked : value } }));
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
    const { form, isEditing, editId, imageFile } = this.state;
    if (!form.key || !form.title || !form.subtitle || !form.description) return;

    const payload = {
      ...form,
      features: form.features
        .split(',')
        .map(item => item.trim())
        .filter(Boolean),
    };

    const result = isEditing
      ? await this.props.updateExperience(editId, imageFile, payload)
      : await this.props.createExperience(imageFile, payload);

    if (result && result.status === 'success') this.closeDialog();
  };

  render() {
    const { classes, experiences } = this.props;
    const { dialogOpen, form, isEditing, deleteConfirm, imagePreview } = this.state;

    return (
      <div className={classes.root}>
        <div className={classes.header}>
          <div className={classes.titleBlock}>
            <Movie />
            <Typography className={classes.pageTitle}>Manage Experiences</Typography>
          </div>
          <Button className={classes.addBtn} startIcon={<Add />} onClick={this.openAdd}>
            Add Experience
          </Button>
        </div>

        <Grid container spacing={3}>
          {experiences.map(exp => (
            <Grid item key={exp._id} xs={12} sm={6} md={4} lg={3}>
              <Card className={classes.card} style={{ background: exp.gradient }}>
                <CardContent className={classes.cardContent}>
                  <Typography className={classes.cardTitle} variant="h5">{exp.title}</Typography>
                  <Typography className={classes.cardDesc}>{exp.subtitle}</Typography>
                  <Typography className={classes.cardDesc}>{exp.description}</Typography>
                  <Chip
                    label={exp.isActive ? 'Active' : 'Inactive'}
                    className={classes.chip}
                    size="small"
                    variant="outlined"
                  />
                  <Chip label={exp.key} className={classes.chip} size="small" variant="outlined" />
                </CardContent>
                <CardActions className={classes.cardActions}>
                  <Tooltip title="Edit">
                    <IconButton size="small" onClick={() => this.openEdit(exp)}>
                      <Edit fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton size="small" onClick={() => this.setState({ deleteConfirm: exp })}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Dialog open={dialogOpen} onClose={this.closeDialog} classes={{ paper: classes.dialogPaper }}>
          <DialogTitle>{isEditing ? 'Edit Experience' : 'Add Experience'}</DialogTitle>
          <DialogContent>
            <label htmlFor="experience-image-upload">
              <div className={classes.imageUpload}>
                {imagePreview ? (
                  <img src={imagePreview} alt="preview" className={classes.previewImg} />
                ) : (
                  <>
                    <PhotoCamera className={classes.uploadIcon} />
                    <Typography className={classes.uploadText}>Click to upload experience image</Typography>
                  </>
                )}
              </div>
            </label>
            <input
              id="experience-image-upload"
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={this.handleImage}
            />
            <TextField label="Key (e.g. imax)" name="key" value={form.key} onChange={this.handleChange} fullWidth variant="outlined" className={classes.input} />
            <TextField label="Title" name="title" value={form.title} onChange={this.handleChange} fullWidth variant="outlined" className={classes.input} />
            <TextField label="Subtitle" name="subtitle" value={form.subtitle} onChange={this.handleChange} fullWidth variant="outlined" className={classes.input} />
            <TextField label="Description" name="description" value={form.description} onChange={this.handleChange} fullWidth variant="outlined" multiline rows={3} className={classes.input} />
            <TextField label="Features (comma separated)" name="features" value={form.features} onChange={this.handleChange} fullWidth variant="outlined" className={classes.input} />
            <TextField label="Gradient CSS" name="gradient" value={form.gradient} onChange={this.handleChange} fullWidth variant="outlined" className={classes.input} />
            <TextField label="Accent Color" name="accent" value={form.accent} onChange={this.handleChange} fullWidth variant="outlined" className={classes.input} />
            <TextField label="Icon (emoji)" name="icon" value={form.icon} onChange={this.handleChange} fullWidth variant="outlined" className={classes.input} />
            <FormControlLabel control={<Switch checked={form.isActive} onChange={this.handleChange} name="isActive" />} label="Active" />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.closeDialog}>Cancel</Button>
            <Button onClick={this.handleSave} variant="contained" color="secondary">
              {isEditing ? 'Save Changes' : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={Boolean(deleteConfirm)} onClose={() => this.setState({ deleteConfirm: null })}>
          <DialogTitle>Delete Experience?</DialogTitle>
          <DialogActions>
            <Button onClick={() => this.setState({ deleteConfirm: null })}>Cancel</Button>
            <Button
              onClick={async () => {
                await this.props.removeExperience(deleteConfirm._id);
                this.setState({ deleteConfirm: null });
              }}
              color="secondary"
              variant="contained"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

const mapStateToProps = ({ experienceState }) => ({
  experiences: experienceState.experiences || [],
});

const mapDispatchToProps = {
  getAdminExperiences,
  createExperience,
  updateExperience,
  removeExperience,
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ExperienceList));
