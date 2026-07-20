import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  withStyles,
  Typography,
  Select,
  FormControl,
  InputLabel,
  OutlinedInput,
  FormControlLabel,
  Switch,
  Grid,
  Button,
  TextField,
  MenuItem,
} from '@material-ui/core';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import styles from './styles';
import { genreData, languageData, formatData } from '../../../../../data/MovieDataService';
import {
  addMovie,
  updateMovie,
  removeMovie
} from '../../../../../store/actions';
import FileUpload from '../../../../../components/FileUpload/FileUpload';
import FormSection from './FormSection';
import PeopleSection from './PeopleSection';

class AddMovie extends Component {
  state = {
    title: '',
    image: null,
    genre: [],
    language: '',
    duration: '',
    ticketPrice: '',
    description: '',
    director: '',
    cast: '',
    rating: '',
    synopsis: '',
    contentWarning: '',
    castMembers: [],
    crewMembers: [],
    castNameInput: '',
    crewNameInput: '',
    crewRoleInput: 'Director',
    castFiles: [],
    crewFiles: [],
    backdropFiles: [],
    backdropImages: [],
    releaseDate: new Date(),
    endDate: new Date(),
    isPublished: true,
    isAdult: false,
    format: '2D',
    certificate: '',
    languages: '',
    trailerUrl: ''
  };

  componentDidMount() {
    if (this.props.edit) {
      const {
        title,
        language,
        genre,
        director,
        cast,
        castCrew,
        description,
        synopsis,
        contentWarning,
        duration,
        ticketPrice,
        rating,
        releaseDate,
        endDate,
        isPublished,
        isAdult,
        format,
        certificate,
        languages,
        trailerUrl
      } = this.props.edit;
      const castMembers = Array.isArray(castCrew)
        ? castCrew.filter(item => String(item.role || '').toLowerCase() === 'cast')
        : [];
      const crewMembers = Array.isArray(castCrew)
        ? castCrew.filter(item => String(item.role || '').toLowerCase() !== 'cast')
        : [];
      this.setState({
        title,
        language,
        genre: genre.split(','),
        director,
        cast,
        castMembers,
        crewMembers,
        description,
        synopsis: synopsis || '',
        contentWarning: contentWarning || '',
        duration,
        ticketPrice: ticketPrice != null && ticketPrice !== '' ? String(ticketPrice) : '',
        rating: rating || '',
        endDate,
        isPublished: isPublished !== undefined ? isPublished : true,
        isAdult: isAdult || false,
        format: format || '2D',
        certificate: certificate || '',
        languages: languages || '',
        trailerUrl: trailerUrl || '',
        releaseDate: releaseDate || new Date(),
        backdropImages: Array.isArray(this.props.edit.backdropImages)
          ? this.props.edit.backdropImages
          : []
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.movie !== this.props.movie) {
      const { title, genre, language } = this.props.movie;
      this.setState({ title, genre, language });
    }
  }

  handleChange = e => {
    this.setState({
      state: e.target.value
    });
  };

  handleFieldChange = (field, value) => {
    const newState = { ...this.state };
    newState[field] = value;
    this.setState(newState);
  };

  onAddMovie = () => {
    const {
      genre,
      castMembers,
      crewMembers,
      castFiles,
      crewFiles,
      backdropFiles,
      title,
      language,
      duration,
      ticketPrice,
      description,
      director,
      cast,
      rating,
      synopsis,
      contentWarning,
      releaseDate,
      endDate,
      isPublished,
      isAdult,
      format,
      certificate,
      languages,
      trailerUrl,
      image
    } = this.state;
    const castCrew = [
      ...castMembers.map(item => ({ name: item.name, role: 'Cast', image: item.image || '' })),
      ...crewMembers.map(item => ({ name: item.name, role: item.role, image: item.image || '' }))
    ];
    const backdropImages = [];
    const movie = {
      title,
      genre: genre.join(','),
      language,
      duration,
      ticketPrice: Number(ticketPrice) || 0,
      description,
      director,
      cast,
      rating,
      synopsis,
      contentWarning,
      castCrew,
      backdropImages,
      releaseDate,
      endDate,
      isPublished,
      isAdult,
      format,
      certificate,
      languages,
      trailerUrl
    };
    this.props.addMovie(image, movie, backdropFiles, [...castFiles, ...crewFiles]);
  };

  onUpdateMovie = () => {
    const {
      genre,
      castMembers,
      crewMembers,
      castFiles,
      crewFiles,
      backdropFiles,
      title,
      language,
      duration,
      ticketPrice,
      description,
      director,
      cast,
      rating,
      synopsis,
      contentWarning,
      releaseDate,
      endDate,
      isPublished,
      isAdult,
      format,
      certificate,
      languages,
      trailerUrl,
      backdropImages,
      image
    } = this.state;

    const castCrew = [
      ...castMembers.map(item => ({
        name: item.name,
        role: 'Cast',
        image: item.image || ''
      })),
      ...crewMembers.map(item => ({
        name: item.name,
        role: item.role,
        image: item.image || ''
      }))
    ];
    const movie = {
      title,
      genre: genre.join(','),
      language,
      duration,
      ticketPrice: Number(ticketPrice) || 0,
      description,
      director,
      cast,
      rating,
      synopsis,
      contentWarning,
      castCrew,
      backdropImages,
      releaseDate,
      endDate,
      isPublished,
      isAdult,
      format,
      certificate,
      languages,
      trailerUrl
    };
    this.props.updateMovie(
      this.props.edit._id,
      movie,
      image,
      backdropFiles,
      [...castFiles, ...crewFiles]
    );
  };

  addCastMember = () => {
    const name = this.state.castNameInput.trim();
    if (!name) return;
    this.setState(prev => ({
      castMembers: [...prev.castMembers, { name, role: 'Cast', image: '' }],
      castNameInput: ''
    }));
  };

  addCrewMember = () => {
    const name = this.state.crewNameInput.trim();
    const role = this.state.crewRoleInput.trim();
    if (!name || !role) return;
    this.setState(prev => ({
      crewMembers: [...prev.crewMembers, { name, role, image: '' }],
      crewNameInput: ''
    }));
  };

  removeCastMember = index => {
    this.setState(prev => ({
      castMembers: prev.castMembers.filter((_, idx) => idx !== index)
    }));
  };

  removeCrewMember = index => {
    this.setState(prev => ({
      crewMembers: prev.crewMembers.filter((_, idx) => idx !== index)
    }));
  };

  addBackdropFiles = files => {
    this.setState(prev => ({
      backdropFiles: [...prev.backdropFiles, ...files]
    }));
  };

  removeBackdropFile = index => {
    this.setState(prev => ({
      backdropFiles: prev.backdropFiles.filter((_, idx) => idx !== index)
    }));
  };

  removeExistingBackdrop = index => {
    this.setState(prev => ({
      backdropImages: prev.backdropImages.filter((_, idx) => idx !== index)
    }));
  };

  onRemoveMovie = () => this.props.removeMovie(this.props.edit._id);

  render() {
    const { classes, className } = this.props;
    const {
      title,
      image,
      genre,
      language,
      duration,
      ticketPrice,
      description,
      synopsis,
      contentWarning,
      director,
      cast,
      rating,
      castMembers,
      crewMembers,
      castNameInput,
      crewNameInput,
      crewRoleInput,
      backdropFiles,
      castFiles,
      crewFiles,
      releaseDate,
      endDate,
      isPublished,
      isAdult,
      format,
      certificate,
      languages,
      trailerUrl
    } = this.state;

    const rootClassName = classNames(classes.root, className);
    const subtitle = this.props.edit ? 'Edit Movie' : 'Add Movie';
    const submitButton = this.props.edit ? 'Update Movie' : 'Save Details';
    const submitAction = this.props.edit
      ? () => this.onUpdateMovie()
      : () => this.onAddMovie();

    const { backdropImages } = this.state;

    return (
      <div className={rootClassName}>
        <Typography className={classes.pageTitle}>{subtitle}</Typography>

        <form autoComplete="off" noValidate>
          <FormSection title="Basic information" subtitle="Title, genre, and display credits shown on listings">
            <Grid container spacing={2} className={classes.grid}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Title"
                  required
                  variant="outlined"
                  size="small"
                  value={title}
                  onChange={e => this.handleFieldChange('title', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Director (display)"
                  required
                  variant="outlined"
                  size="small"
                  value={director}
                  onChange={e => this.handleFieldChange('director', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined" size="small" required>
                  <InputLabel id="genre-label">Genre</InputLabel>
                  <Select
                    labelId="genre-label"
                    multiple
                    value={genre}
                    onChange={e => this.handleFieldChange('genre', e.target.value)}
                    input={<OutlinedInput label="Genre" />}>
                    {genreData.map((genreItem, index) => (
                      <MenuItem key={`${genreItem}-${index}`} value={genreItem}>
                        {genreItem}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Cast (display)"
                  required
                  variant="outlined"
                  size="small"
                  value={cast}
                  onChange={e => this.handleFieldChange('cast', e.target.value)}
                />
              </Grid>
            </Grid>
          </FormSection>

          <FormSection
            title="Cast & crew"
            subtitle="Add names as chips, then upload photos in the same order for booking page cards">
            <div className={classes.castCrewGrid}>
              <div className={classes.castCrewCard}>
                <Typography className={classes.castCrewTitle}>Cast</Typography>
                <PeopleSection
                  nameLabel="Cast name"
                  nameValue={castNameInput}
                  onNameChange={v => this.handleFieldChange('castNameInput', v)}
                  onAdd={this.addCastMember}
                  members={castMembers}
                  onRemove={this.removeCastMember}
                  files={castFiles}
                  onFilesChange={files => this.handleFieldChange('castFiles', files)}
                  uploadLabel="Upload cast photos"
                />
              </div>
              <div className={classes.castCrewCard}>
                <Typography className={classes.castCrewTitle}>Crew</Typography>
                <PeopleSection
                  withRole
                  nameLabel="Crew name"
                  nameValue={crewNameInput}
                  roleValue={crewRoleInput}
                  onNameChange={v => this.handleFieldChange('crewNameInput', v)}
                  onRoleChange={v => this.handleFieldChange('crewRoleInput', v)}
                  onAdd={this.addCrewMember}
                  members={crewMembers}
                  onRemove={this.removeCrewMember}
                  files={crewFiles}
                  onFilesChange={files => this.handleFieldChange('crewFiles', files)}
                  uploadLabel="Upload crew photos"
                />
              </div>
            </div>
          </FormSection>

          <FormSection title="Backdrop gallery" subtitle="Images for movie detail and booking pages">
            {!!backdropImages.length && (
              <>
                <Typography variant="caption" color="textSecondary">
                  Current backdrops
                </Typography>
                <div className={classes.galleryContainer}>
                  {backdropImages.map((url, idx) => (
                    <div key={`existing-${idx}`} className={classes.backdropThumb}>
                      <img src={url} alt={`backdrop-${idx}`} />
                      <Button
                        className={classes.removeBtn}
                        onClick={() => this.removeExistingBackdrop(idx)}>
                        Delete
                      </Button>
                    </div>
                  ))}
                </div>
              </>
            )}
            <input
              id="backdrop-upload"
              className={classes.hiddenInput}
              type="file"
              accept="image/*"
              multiple
              onChange={event => {
                this.addBackdropFiles(Array.from(event.target.files || []));
                event.target.value = '';
              }}
            />
            <label htmlFor="backdrop-upload">
              <Button
                className={classes.uploadBtn}
                variant="outlined"
                size="small"
                component="span"
                startIcon={<CloudUploadIcon />}>
                Add backdrop images
              </Button>
            </label>
            <Typography variant="caption" display="block" style={{ marginTop: 8, color: '#64748b' }}>
              {backdropFiles.length
                ? `${backdropFiles.length} new image(s) ready to upload`
                : 'No new files selected'}
            </Typography>
            {!!backdropFiles.length && (
              <div className={classes.galleryContainer}>
                {backdropFiles.map((file, idx) => (
                  <div key={`new-${idx}`} className={classes.backdropThumb}>
                    <img src={URL.createObjectURL(file)} alt={`new-backdrop-${idx}`} />
                    <Button
                      className={classes.removeBtn}
                      onClick={() => this.removeBackdropFile(idx)}>
                      Cancel
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </FormSection>

          <FormSection title="Story & details">
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label="Description"
                  required
                  variant="outlined"
                  size="small"
                  value={description}
                  onChange={e => this.handleFieldChange('description', e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Synopsis"
                  required
                  variant="outlined"
                  size="small"
                  value={synopsis}
                  onChange={e => this.handleFieldChange('synopsis', e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label="Content warning (optional)"
                  variant="outlined"
                  size="small"
                  value={contentWarning}
                  onChange={e => this.handleFieldChange('contentWarning', e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Trailer URL (Optional)"
                  placeholder="e.g. YouTube link or .mp4 URL"
                  variant="outlined"
                  size="small"
                  value={trailerUrl}
                  onChange={e => this.handleFieldChange('trailerUrl', e.target.value)}
                />
              </Grid>
            </Grid>
          </FormSection>

          <FormSection title="Release & format">
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  select
                  label="Language"
                  required
                  variant="outlined"
                  size="small"
                  value={language}
                  onChange={e => this.handleFieldChange('language', e.target.value)}>
                  {languageData.map((langItem, index) => (
                    <MenuItem key={`${langItem}-${index}`} value={langItem}>
                      {langItem}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Duration (mins)"
                  type="number"
                  variant="outlined"
                  size="small"
                  value={duration}
                  onChange={e => this.handleFieldChange('duration', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Ticket price (₹)"
                  type="number"
                  required
                  variant="outlined"
                  size="small"
                  inputProps={{ min: 0, step: 1 }}
                  helperText="Regular seat price for this movie"
                  value={ticketPrice}
                  onChange={e => this.handleFieldChange('ticketPrice', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Rating (1–10)"
                  type="number"
                  variant="outlined"
                  size="small"
                  value={rating}
                  inputProps={{ min: 0, max: 10, step: 0.1 }}
                  onChange={e => this.handleFieldChange('rating', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  select
                  label="Format"
                  required
                  variant="outlined"
                  size="small"
                  value={format}
                  onChange={e => this.handleFieldChange('format', e.target.value)}>
                  {formatData.map((formatItem, index) => (
                    <MenuItem key={`${formatItem}-${index}`} value={formatItem}>
                      {formatItem}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Certificate"
                  placeholder="U, UA, A…"
                  variant="outlined"
                  size="small"
                  value={certificate}
                  onChange={e => this.handleFieldChange('certificate', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <MuiPickersUtilsProvider utils={MomentUtils}>
                  <KeyboardDatePicker
                    fullWidth
                    inputVariant="outlined"
                    size="small"
                    label="Release date"
                    value={releaseDate}
                    format="DD/MM/YYYY"
                    onChange={date => this.handleFieldChange('releaseDate', date._d)}
                  />
                </MuiPickersUtilsProvider>
              </Grid>
              <Grid item xs={12} sm={6}>
                <MuiPickersUtilsProvider utils={MomentUtils}>
                  <KeyboardDatePicker
                    fullWidth
                    inputVariant="outlined"
                    size="small"
                    label="End date"
                    value={endDate}
                    format="DD/MM/YYYY"
                    onChange={date => this.handleFieldChange('endDate', date._d)}
                  />
                </MuiPickersUtilsProvider>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label="Languages line (optional)"
                  placeholder="e.g. Hindi, Tamil"
                  variant="outlined"
                  size="small"
                  value={languages}
                  onChange={e => this.handleFieldChange('languages', e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  className={classes.switchRow}
                  control={
                    <Switch
                      checked={isPublished}
                      onChange={e => this.handleFieldChange('isPublished', e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Published (visible to users)"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  className={classes.switchRow}
                  control={
                    <Switch
                      checked={isAdult}
                      onChange={e => this.handleFieldChange('isAdult', e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Adult Movie (A Rated)"
                />
              </Grid>
            </Grid>
          </FormSection>

          <FormSection title="Poster" subtitle="Main movie image for cards and listings">
            <FileUpload
              className={classes.upload}
              file={image}
              onUpload={event => {
                const file = event.target.files[0];
                this.handleFieldChange('image', file);
              }}
            />
          </FormSection>

          <div className={classes.actions}>
            <Button color="primary" variant="contained" onClick={submitAction}>
              {submitButton}
            </Button>
            {this.props.edit && (
              <Button color="secondary" variant="outlined" onClick={this.onRemoveMovie}>
                Delete movie
              </Button>
            )}
          </div>
        </form>
      </div>
    );
  }
}

AddMovie.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object,
  movie: PropTypes.object
};

const mapStateToProps = ({ movieState }) => ({
  movies: movieState.movies
});

const mapDispatchToProps = { addMovie, updateMovie, removeMovie };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(AddMovie));
