import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles, Typography, Select } from '@material-ui/core';
import { Button, TextField, MenuItem } from '@material-ui/core';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import styles from './styles';
import { genreData, languageData } from '../../../../../data/MovieDataService';
import {
  addMovie,
  updateMovie,
  removeMovie
} from '../../../../../store/actions';
import FileUpload from '../../../../../components/FileUpload/FileUpload';

class AddMovie extends Component {
  state = {
    title: '',
    image: null,
    genre: [],
    language: '',
    duration: '',
    description: '',
    director: '',
    cast: '',
    castMembers: [],
    crewMembers: [],
    castNameInput: '',
    crewNameInput: '',
    crewRoleInput: 'Director',
    castFiles: [],
    crewFiles: [],
    backdropFiles: [],
    releaseDate: new Date(),
    endDate: new Date()
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
        duration,
        releaseDate,
        endDate
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
        duration,
        releaseDate,
        endDate
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
      image,
      genre,
      castMembers,
      crewMembers,
      castFiles,
      crewFiles,
      backdropFiles,
      castNameInput,
      crewNameInput,
      crewRoleInput,
      ...rest
    } = this.state;
    const castCrew = [
      ...castMembers.map(item => ({ name: item.name, role: 'Cast', image: item.image || '' })),
      ...crewMembers.map(item => ({ name: item.name, role: item.role, image: item.image || '' }))
    ];
    const backdropImages = [];
    const movie = { ...rest, genre: genre.join(','), castCrew, backdropImages };
    this.props.addMovie(image, movie, backdropFiles, [...castFiles, ...crewFiles]);
  };

  onUpdateMovie = () => {
    const {
      image,
      genre,
      castMembers,
      crewMembers,
      castFiles,
      crewFiles,
      backdropFiles,
      castNameInput,
      crewNameInput,
      crewRoleInput,
      ...rest
    } = this.state;

    const existingCast = Array.isArray(this.props.edit.castCrew)
      ? this.props.edit.castCrew.filter(item => String(item.role || '').toLowerCase() === 'cast')
      : [];
    const existingCrew = Array.isArray(this.props.edit.castCrew)
      ? this.props.edit.castCrew.filter(item => String(item.role || '').toLowerCase() !== 'cast')
      : [];

    const castCrew = [
      ...castMembers.map((item, index) => ({
        name: item.name,
        role: 'Cast',
        image: item.image || (existingCast[index] && existingCast[index].image) || ''
      })),
      ...crewMembers.map((item, index) => ({
        name: item.name,
        role: item.role,
        image: item.image || (existingCrew[index] && existingCrew[index].image) || ''
      }))
    ];
    const backdropImages = Array.isArray(this.props.edit.backdropImages)
      ? this.props.edit.backdropImages
      : [];
    const movie = { ...rest, genre: genre.join(','), castCrew, backdropImages };
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

  onRemoveMovie = () => this.props.removeMovie(this.props.edit._id);

  render() {
    const { classes, className } = this.props;
    const {
      title,
      image,
      genre,
      language,
      duration,
      description,
      director,
      cast,
      castMembers,
      crewMembers,
      castNameInput,
      crewNameInput,
      crewRoleInput,
      backdropFiles,
      castFiles,
      crewFiles,
      releaseDate,
      endDate
    } = this.state;

    const rootClassName = classNames(classes.root, className);
    const subtitle = this.props.edit ? 'Edit Movie' : 'Add Movie';
    const submitButton = this.props.edit ? 'Update Movie' : 'Save Details';
    const submitAction = this.props.edit
      ? () => this.onUpdateMovie()
      : () => this.onAddMovie();

    return (
      <div className={rootClassName}>
        <Typography variant="h4" className={classes.title}>
          {subtitle}
        </Typography>
        <form autoComplete="off" noValidate>
          <div className={classes.field}>
            <TextField
              className={classes.textField}
              helperText="Please specify the title"
              label="Title"
              margin="dense"
              required
              value={title}
              variant="outlined"
              onChange={event =>
                this.handleFieldChange('title', event.target.value)
              }
            />
          </div>
          <div className={classes.field}>
            <Select
              multiple
              displayEmpty
              className={classes.textField}
              label="Genre"
              margin="dense"
              required
              value={genre}
              variant="outlined"
              onChange={event =>
                this.handleFieldChange('genre', event.target.value)
              }>
              {genreData.map((genreItem, index) => (
                <MenuItem key={genreItem + '-' + index} value={genreItem}>
                  {genreItem}
                </MenuItem>
              ))}
            </Select>
          </div>
          <div className={`${classes.field} ${classes.mediaField}`}>
            <div className={`${classes.textField} ${classes.peopleSection}`}>
              <Typography variant="body2" className={classes.sectionHeading}>
                Cast (like in PVR)
              </Typography>
              <Typography variant="caption" className={classes.sectionHint}>
                Add cast names one by one, then upload cast images in the same order.
              </Typography>
              <div className={classes.inputRow}>
                <TextField
                  label="Cast Name"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={castNameInput}
                  onChange={event =>
                    this.handleFieldChange('castNameInput', event.target.value)
                  }
                />
                <Button color="primary" variant="contained" onClick={this.addCastMember}>
                  Add
                </Button>
              </div>
              <Typography variant="caption" className={classes.listTitle}>
                Added Cast ({castMembers.length})
              </Typography>
              <div className={classes.memberList}>
                {castMembers.length ? (
                  castMembers.map((member, index) => (
                    <div key={`${member.name}-${index}`} className={classes.memberRow}>
                      <Typography variant="caption" className={classes.memberText}>
                        {index + 1}. {member.name}
                      </Typography>
                      <Button size="small" color="secondary" onClick={() => this.removeCastMember(index)}>
                        Remove
                      </Button>
                    </div>
                  ))
                ) : (
                  <Typography variant="caption" className={classes.emptyText}>
                    No cast members added yet.
                  </Typography>
                )}
              </div>
              <Typography variant="body2" className={classes.uploadTitle}>
                Upload Cast Images (same order as cast list)
              </Typography>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={event =>
                  this.handleFieldChange('castFiles', Array.from(event.target.files || []))
                }
              />
              <Typography variant="caption" className={classes.fileHint}>
                {castFiles.length
                  ? `${castFiles.length} cast image(s) selected`
                  : 'No files selected'}
              </Typography>
              {!!castFiles.length && (
                <div className={classes.fileList}>
                  {castFiles.map((file, idx) => (
                    <Typography key={`${file.name}-${idx}`} variant="caption" display="block">
                      {idx + 1}. {file.name}
                    </Typography>
                  ))}
                </div>
              )}
            </div>
            <div className={`${classes.textField} ${classes.peopleSection}`}>
              <Typography variant="body2" className={classes.sectionHeading}>
                Crew (Director, Producer, etc.)
              </Typography>
              <Typography variant="caption" className={classes.sectionHint}>
                Choose role, add crew name, then upload crew images in same order.
              </Typography>
              <div className={classes.inputRow}>
                <TextField
                  select
                  label="Crew Role"
                  variant="outlined"
                  size="small"
                  className={classes.crewRoleField}
                  value={crewRoleInput}
                  onChange={event =>
                    this.handleFieldChange('crewRoleInput', event.target.value)
                  }>
                  {['Director', 'Producer', 'Writer', 'Music', 'Cinematographer', 'Editor'].map(role => (
                    <MenuItem key={role} value={role}>
                      {role}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  label="Crew Name"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={crewNameInput}
                  onChange={event =>
                    this.handleFieldChange('crewNameInput', event.target.value)
                  }
                />
                <Button color="primary" variant="contained" onClick={this.addCrewMember}>
                  Add
                </Button>
              </div>
              <Typography variant="caption" className={classes.listTitle}>
                Added Crew ({crewMembers.length})
              </Typography>
              <div className={classes.memberList}>
                {crewMembers.length ? (
                  crewMembers.map((member, index) => (
                    <div key={`${member.role}-${member.name}-${index}`} className={classes.memberRow}>
                      <Typography variant="caption" className={classes.memberText}>
                        {index + 1}. {member.role}: {member.name}
                      </Typography>
                      <Button size="small" color="secondary" onClick={() => this.removeCrewMember(index)}>
                        Remove
                      </Button>
                    </div>
                  ))
                ) : (
                  <Typography variant="caption" className={classes.emptyText}>
                    No crew members added yet.
                  </Typography>
                )}
              </div>
              <Typography variant="body2" className={classes.uploadTitle}>
                Upload Crew Images (same order as crew list)
              </Typography>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={event =>
                  this.handleFieldChange('crewFiles', Array.from(event.target.files || []))
                }
              />
              <Typography variant="caption" className={classes.fileHint}>
                {crewFiles.length
                  ? `${crewFiles.length} crew image(s) selected`
                  : 'No files selected'}
              </Typography>
              {!!crewFiles.length && (
                <div className={classes.fileList}>
                  {crewFiles.map((file, idx) => (
                    <Typography key={`${file.name}-${idx}`} variant="caption" display="block">
                      {idx + 1}. {file.name}
                    </Typography>
                  ))}
                </div>
              )}
            </div>
            <div className={classes.textField}>
              <Typography variant="body2" style={{ fontWeight: 700 }}>
                Backdrops
              </Typography>
              <Typography variant="caption" style={{ color: '#64748b', display: 'block', marginBottom: 8 }}>
                Upload gallery/backdrop images for movie detail and booking page.
              </Typography>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={event => {
                  this.addBackdropFiles(Array.from(event.target.files || []));
                  event.target.value = '';
                }}
              />
              <Typography variant="caption">
                {backdropFiles.length
                  ? `${backdropFiles.length} backdrop image(s) selected`
                  : 'No backdrop files selected'}
              </Typography>
              {!!backdropFiles.length && (
                <div style={{ marginTop: 4 }}>
                  {backdropFiles.map((file, idx) => (
                    <div key={`${file.name}-${idx}`} className={classes.memberRow}>
                      <Typography variant="caption" className={classes.memberText}>
                        {idx + 1}. {file.name}
                      </Typography>
                      <Button size="small" color="secondary" onClick={() => this.removeBackdropFile(idx)}>
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className={classes.field}>
            <TextField
              fullWidth
              multiline
              className={classes.textField}
              label="Description"
              margin="dense"
              required
              variant="outlined"
              value={description}
              onChange={event =>
                this.handleFieldChange('description', event.target.value)
              }
            />
          </div>
          <div className={classes.field}>
            <TextField
              select
              className={classes.textField}
              label="Language"
              margin="dense"
              required
              value={language}
              variant="outlined"
              onChange={event =>
                this.handleFieldChange('language', event.target.value)
              }>
              {languageData.map((langItem, index) => (
                <MenuItem key={langItem + '-' + index} value={langItem}>
                  {langItem}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              className={classes.textField}
              label="Duration"
              margin="dense"
              type="number"
              value={duration}
              variant="outlined"
              onChange={event =>
                this.handleFieldChange('duration', event.target.value)
              }
            />
          </div>
          <div className={classes.field}>
            <TextField
              className={classes.textField}
              label="Director"
              margin="dense"
              required
              value={director}
              variant="outlined"
              onChange={event =>
                this.handleFieldChange('director', event.target.value)
              }
            />
            <TextField
              className={classes.textField}
              label="Cast"
              margin="dense"
              required
              value={cast}
              variant="outlined"
              onChange={event =>
                this.handleFieldChange('cast', event.target.value)
              }
            />
          </div>
          <div className={classes.field}>
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <KeyboardDatePicker
                className={classes.textField}
                inputVariant="outlined"
                margin="normal"
                id="release-date"
                label="Release Date"
                value={releaseDate}
                onChange={date =>
                  this.handleFieldChange('releaseDate', date._d)
                }
                KeyboardButtonProps={{
                  'aria-label': 'change date'
                }}
              />

              <KeyboardDatePicker
                className={classes.textField}
                inputVariant="outlined"
                margin="normal"
                id="end-date"
                label="End Date"
                value={endDate}
                onChange={date => this.handleFieldChange('endDate', date._d)}
                KeyboardButtonProps={{
                  'aria-label': 'change date'
                }}
              />
            </MuiPickersUtilsProvider>
          </div>
          <div className={classes.field}>
            <FileUpload
              className={classes.upload}
              file={image}
              onUpload={event => {
                const file = event.target.files[0];
                this.handleFieldChange('image', file);
              }}
            />
          </div>
        </form>

        <Button
          className={classes.buttonFooter}
          color="primary"
          variant="contained"
          onClick={submitAction}>
          {submitButton}
        </Button>
        {this.props.edit && (
          <Button
            color="secondary"
            className={classes.buttonFooter}
            variant="contained"
            onClick={this.onRemoveMovie}>
            Delete Movie
          </Button>
        )}
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
