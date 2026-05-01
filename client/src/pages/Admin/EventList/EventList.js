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
  Tooltip
} from '@material-ui/core';
import { Add, Delete, Event, Edit } from '@material-ui/icons';
import { getEvents, addEvent, removeEvent, updateEvent, uploadEventImage } from '../../../store/actions';

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
  dateBadge: {
    color: '#b72429',
    fontWeight: 700,
    fontSize: '0.8rem',
    marginBottom: theme.spacing(1),
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
  title: '',
  date: '',
  description: '',
  image: ''
};

class EventList extends Component {
  state = {
    dialogOpen: false,
    form: EMPTY_FORM,
    isEdit: false,
    selectedId: null,
    saving: false,
    uploading: false,
    deleteConfirm: null
  };

  componentDidMount() {
    this.props.getEvents();
  }

  openAdd = () => {
    this.setState({ dialogOpen: true, form: EMPTY_FORM, isEdit: false, selectedId: null });
  };

  openEdit = item => {
    this.setState({
      dialogOpen: true,
      form: {
        title: item.title,
        date: item.date,
        description: item.description,
        image: item.image
      },
      isEdit: true,
      selectedId: item._id
    });
  };

  closeDialog = () => {
    this.setState({ dialogOpen: false, saving: false, uploading: false });
  };

  handleChange = e => {
    const { name, value } = e.target;
    this.setState(prev => ({
      form: { ...prev.form, [name]: value },
    }));
  };

  handleFileChange = async e => {
    const file = e.target.files[0];
    if (!file) return;

    this.setState({ uploading: true });
    const result = await this.props.uploadEventImage(file);
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
      result = await this.props.updateEvent(selectedId, form);
    } else {
      result = await this.props.addEvent(form);
    }

    this.setState({ saving: false });
    if (result && result.status === 'success') this.closeDialog();
  };

  handleDelete = async id => {
    await this.props.removeEvent(id);
    this.setState({ deleteConfirm: null });
  };

  render() {
    const { classes, events } = this.props;
    const { dialogOpen, form, saving, uploading, isEdit, deleteConfirm } = this.state;

    return (
      <div className={classes.root}>
        <div className={classes.header}>
          <div className={classes.titleBlock}>
            <Add className={classes.titleIcon} />
            <Typography className={classes.pageTitle}>Manage Events</Typography>
          </div>
          <Button className={classes.addBtn} startIcon={<Add />} onClick={this.openAdd}>
            Add Event
          </Button>
        </div>

        {!events ? (
          <div className={classes.progressWrapper}><CircularProgress style={{ color: '#b72429' }} /></div>
        ) : events.length === 0 ? (
          <div className={classes.emptyState}>
            <Add style={{ fontSize: '4rem', marginBottom: 16 }} />
            <Typography variant="h6">No events yet. Add your first event!</Typography>
          </div>
        ) : (
          <Grid container spacing={3}>
            {events.map(event => (
              <Grid item key={event._id} xs={12} sm={6} md={4} lg={3}>
                <Card className={classes.card} elevation={0}>
                  <CardMedia component="img" className={classes.cardMedia} image={event.image} alt={event.title} />
                  <CardContent className={classes.cardContent}>
                    <Typography className={classes.dateBadge}>{event.date}</Typography>
                    <Typography className={classes.cardTitle}>{event.title}</Typography>
                    <Typography className={classes.cardDesc}>{event.description}</Typography>
                  </CardContent>
                  <CardActions className={classes.cardActions}>
                    <Tooltip title="Edit">
                      <IconButton size="small" className={classes.editBtn} onClick={() => this.openEdit(event)}>
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton size="small" className={classes.deleteBtn} onClick={() => this.setState({ deleteConfirm: event })}>
                        <Delete fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        <Dialog open={dialogOpen} onClose={this.closeDialog} classes={{ paper: classes.dialogPaper }}>
          <DialogTitle className={classes.dialogTitle}>{isEdit ? 'Edit Event' : 'Add New Event'}</DialogTitle>
          <DialogContent style={{ paddingTop: 20 }}>
            <TextField label="Title *" name="title" value={form.title} onChange={this.handleChange} fullWidth variant="outlined" className={classes.input} />
            <TextField label="Date (e.g. May 15, 2026) *" name="date" value={form.date} onChange={this.handleChange} fullWidth variant="outlined" className={classes.input} />
            <TextField label="Description *" name="description" value={form.description} onChange={this.handleChange} fullWidth variant="outlined" multiline rows={3} className={classes.input} />
            
            <div className={classes.fileInput}>
              <Typography variant="caption" style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>
                Event Image (Upload or URL)
              </Typography>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <Button variant="outlined" component="label" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.15)' }} disabled={uploading}>
                  {uploading ? <CircularProgress size={20} color="inherit" /> : 'Upload File'}
                  <input type="file" hidden accept="image/*" onChange={this.handleFileChange} />
                </Button>
                <TextField 
                  label="Image URL" 
                  name="image" 
                  value={form.image} 
                  onChange={this.handleChange} 
                  fullWidth 
                  variant="outlined" 
                  className={classes.input} 
                  style={{ marginBottom: 0 }}
                />
              </div>
            </div>
          </DialogContent>
          <DialogActions style={{ padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            <Button onClick={this.closeDialog} className={classes.cancelBtn}>Cancel</Button>
            <Button onClick={this.handleSave} className={classes.saveBtn} disabled={saving || uploading || !form.title || !form.date} variant="contained">
              {saving ? <CircularProgress size={20} color="inherit" /> : (isEdit ? 'Update Event' : 'Create Event')}
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={Boolean(deleteConfirm)} onClose={() => this.setState({ deleteConfirm: null })} classes={{ paper: classes.dialogPaper }}>
          <DialogTitle className={classes.dialogTitle}>Delete Event?</DialogTitle>
          <DialogContent style={{ paddingTop: 16 }}>
            <Typography style={{ color: 'rgba(255,255,255,0.7)' }}>
              Are you sure you want to delete <strong>{deleteConfirm?.title}</strong>?
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

const mapStateToProps = ({ eventState }) => ({ events: eventState.events });
export default connect(mapStateToProps, { getEvents, addEvent, removeEvent, updateEvent, uploadEventImage })(withStyles(styles)(EventList));
