import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import { Button, TextField, Typography, IconButton } from '@material-ui/core';
import { Add, Delete, EventSeat } from '@material-ui/icons';
import styles from './styles';
import {
  getCinemas,
  createCinemas,
  updateCinemas,
  removeCinemas
} from '../../../../../store/actions';
import { FileUpload } from '../../../../../components';

const ROW_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const CATEGORIES = [
  { key: 'gold', label: 'GOLD', color: '#b72429', bg: 'rgba(183,36,41,0.12)' },
  { key: 'premium', label: 'PREMIUM', color: '#e040fb', bg: 'rgba(224,64,251,0.12)' },
  { key: 'classic', label: 'CLASSIC', color: '#42a5f5', bg: 'rgba(66,165,245,0.12)' },
];

function getCategory(rowIndex, totalRows) {
  const third = Math.ceil(totalRows / 3);
  if (rowIndex < third) return CATEGORIES[0];
  if (rowIndex < third * 2) return CATEGORIES[1];
  return CATEGORIES[2];
}

class AddCinema extends Component {
  state = {
    _id: '',
    name: '',
    image: null,
    ticketPrice: '',
    specialPrice: '',
    city: '',
    rowConfigs: [{ seats: 10, specials: [] }],
    notification: {}
  };

  componentDidMount() {
    if (this.props.editCinema) {
      const { image, seats, seatsAvailable, ...rest } = this.props.editCinema;
      // Parse existing seats 2D array back into row configs
      const rowConfigs =
        seats && seats.length > 0
          ? seats.map(row => {
              const rowSeats = Array.isArray(row) ? row : [];
              const specials = [];
              rowSeats.forEach((val, idx) => {
                if (Number(val) === 5) specials.push(idx);
              });
              return { seats: rowSeats.length, specials };
            })
          : [{ seats: 10, specials: [] }];
      this.setState({ ...rest, rowConfigs });
    }
  }

  handleFieldChange = (field, value) => {
    this.setState({ [field]: value });
  };

  // ── Row Config Handlers ──
  handleAddRow = () => {
    if (this.state.rowConfigs.length >= 26) return;
    this.setState(prev => ({
      rowConfigs: [...prev.rowConfigs, { seats: 10, specials: [] }]
    }));
  };

  handleRemoveRow = index => {
    this.setState(prev => ({
      rowConfigs: prev.rowConfigs.filter((_, i) => i !== index)
    }));
  };

  handleRowSeatsChange = (index, value) => {
    const numVal = Math.max(0, Math.min(20, Number(value) || 0));
    this.setState(prev => {
      const rowConfigs = [...prev.rowConfigs];
      // Filter out specials that are now out of bounds
      rowConfigs[index] = { 
        ...rowConfigs[index], 
        seats: numVal,
        specials: rowConfigs[index].specials.filter(s => s < numVal)
      };
      return { rowConfigs };
    });
  };

  handleToggleSpecial = (rowIndex, seatIndex) => {
    this.setState(prev => {
      // Deep clone rowConfigs to guarantee React detects the change
      const rowConfigs = prev.rowConfigs.map((row, i) => {
        if (i !== rowIndex) return row;
        const specials = Array.isArray(row.specials) ? [...row.specials] : [];
        const idx = specials.indexOf(seatIndex);
        if (idx > -1) {
          specials.splice(idx, 1);
        } else {
          specials.push(seatIndex);
        }
        return { ...row, specials };
      });
      return { rowConfigs };
    });
  };

  // ── Build seats 2D array from rowConfigs ──
  buildSeatsFromConfigs = () => {
    return this.state.rowConfigs.map(row =>
      Array.from({ length: row.seats }, (_, i) => (row.specials.includes(i) ? 5 : 0))
    );
  };

  getTotalSeats = () => {
    return this.state.rowConfigs.reduce((sum, row) => sum + row.seats, 0);
  };

  // ── Submit ──
  onSubmitAction = async type => {
    const { getCinemas, createCinemas, updateCinemas, removeCinemas } = this.props;
    const { _id, name, image, ticketPrice, specialPrice, city } = this.state;
    const seats = this.buildSeatsFromConfigs();
    const seatsAvailable = this.getTotalSeats();
    const cinema = { 
      name, 
      ticketPrice: Number(ticketPrice), 
      specialPrice: specialPrice ? Number(specialPrice) : 0, 
      city, 
      seatsAvailable, 
      seats 
    };

    let notification = {};
    if (type === 'create') {
      notification = await createCinemas(image, cinema);
    } else if (type === 'update') {
      notification = await updateCinemas(image, cinema, _id);
    } else {
      notification = await removeCinemas(_id);
    }
    this.setState({ notification });
    if (notification && notification.status === 'success') getCinemas();
  };

  // ── Render Live Preview ──
  renderPreview = () => {
    const { classes } = this.props;
    // Always read directly from state for freshness
    const rowConfigs = this.state.rowConfigs;
    const totalRows = rowConfigs.length;

    if (totalRows === 0 || this.getTotalSeats() === 0) {
      return (
        <div className={classes.previewEmpty}>
          Add rows above to see the seat layout preview
        </div>
      );
    }

    const third = Math.ceil(totalRows / 3);
    const categoryBreaks = [0, third, third * 2];

    return (
      <>
        {/* Screen */}
        <div className={classes.previewScreen}>
          <div className={classes.previewScreenCurve} />
          <span className={classes.previewScreenLabel}>Screen</span>
        </div>

        {/* Rows */}
        {rowConfigs.map((row, rowIndex) => {
          const cat = getCategory(rowIndex, totalRows);
          const showBand = categoryBreaks.includes(rowIndex);
          const letter = ROW_LETTERS[rowIndex] || String(rowIndex + 1);
          const aisleAt = Math.floor(row.seats / 2);

          return (
            <Fragment key={rowIndex}>
              {showBand && (
                <div className={classes.previewCategoryBand}>
                  <div
                    className={classes.previewCategoryLine}
                    style={{ background: cat.color }}
                  />
                  <span
                    className={classes.previewCategoryLabel}
                    style={{
                      color: cat.color,
                      background: cat.bg,
                      border: `1px solid ${cat.color}`
                    }}>
                    {cat.label}
                  </span>
                  <div
                    className={classes.previewCategoryLine}
                    style={{ background: cat.color }}
                  />
                </div>
              )}
              <div className={classes.previewRow}>
                <span className={classes.previewRowLabel}>{letter}</span>
                <div className={classes.previewSeatsGroup}>
                  {Array.from({ length: row.seats }).map((_, si) => (
                    <Fragment key={si}>
                      {si === aisleAt && (
                        <div className={classes.previewAisle} />
                      )}
                      <button
                        type="button"
                        className={classes.previewSeat}
                        style={{ 
                          backgroundColor: row.specials.includes(si) ? '#FFD700' : cat.color + '33',
                          cursor: 'pointer',
                          border: row.specials.includes(si) ? '2px solid #FF8C00' : '2px solid transparent',
                          boxShadow: row.specials.includes(si) ? '0 0 8px rgba(255,215,0,0.7)' : 'none'
                        }}
                        title={row.specials.includes(si) ? 'Special Seat (click to remove)' : 'Click to mark as Special'}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          this.handleToggleSpecial(rowIndex, si);
                        }}
                      />
                    </Fragment>
                  ))}
                </div>
                <span className={classes.previewRowLabel}>{letter}</span>
              </div>
            </Fragment>
          );
        })}
      </>
    );
  };

  render() {
    const { classes, className } = this.props;
    const { name, image, ticketPrice, specialPrice, city, rowConfigs, notification } = this.state;
    const totalSeats = this.getTotalSeats();
    const totalRows = rowConfigs.length;

    const rootClassName = classNames(classes.root, className);
    const mainTitle = this.props.editCinema ? 'Edit Cinema' : 'Add Cinema';
    const submitButton = this.props.editCinema ? 'Update Cinema' : 'Save Details';
    const submitAction = this.props.editCinema
      ? () => this.onSubmitAction('update')
      : () => this.onSubmitAction('create');

    return (
      <div className={rootClassName}>
        <Typography variant="h4" className={classes.title}>
          {mainTitle}
        </Typography>

        <form autoComplete="off" noValidate>
          {/* ── Basic Fields ── */}
          <div className={classes.field}>
            <TextField
              className={classes.textField}
              helperText="Please specify the cinema name"
              label="Name"
              margin="dense"
              required
              value={name}
              variant="outlined"
              onChange={e => this.handleFieldChange('name', e.target.value)}
            />
            <TextField
              fullWidth
              className={classes.textField}
              label="City"
              margin="dense"
              required
              variant="outlined"
              value={city}
              onChange={e => this.handleFieldChange('city', e.target.value)}
            />
          </div>

          <div className={classes.field}>
            <FileUpload
              className={classes.textField}
              file={image}
              onUpload={event => {
                const file = event.target.files[0];
                this.handleFieldChange('image', file);
              }}
            />
          </div>

          <div className={classes.field}>
            <TextField
              className={classes.textField}
              label="Normal Ticket Price"
              margin="dense"
              type="number"
              value={ticketPrice}
              variant="outlined"
              onChange={e => this.handleFieldChange('ticketPrice', e.target.value)}
            />
            <TextField
              className={classes.textField}
              label="Special Ticket Price"
              margin="dense"
              type="number"
              value={specialPrice}
              variant="outlined"
              onChange={e => this.handleFieldChange('specialPrice', e.target.value)}
            />
          </div>
        </form>

        {/* ── Seat Layout Builder ── */}
        <div className={classes.seatBuilderSection}>
          <div className={classes.seatBuilderTitle}>
            <EventSeat style={{ fontSize: '1.2rem' }} />
            Seat Layout Builder
          </div>

          {/* Stats */}
          <div className={classes.seatBuilderStats}>
            <span className={classes.statChip}>
              {totalRows} Row{totalRows !== 1 ? 's' : ''}
            </span>
            <span className={classes.statChip}>
              {totalSeats} Total Seat{totalSeats !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Row Configs */}
          <div className={classes.rowConfigList}>
            {rowConfigs.map((row, index) => {
              const cat = getCategory(index, totalRows);
              const letter = ROW_LETTERS[index] || String(index + 1);

              return (
                <div key={index} className={classes.rowConfigItem}>
                  {/* Row Letter */}
                  <div
                    className={classes.rowLabel}
                    style={{
                      background: cat.bg,
                      color: cat.color,
                      border: `1px solid ${cat.color}`
                    }}>
                    {letter}
                  </div>

                  {/* Category Badge */}
                  <span
                    className={classes.rowCategoryName}
                    style={{
                      color: cat.color,
                      background: cat.bg,
                      border: `1px solid ${cat.color}`
                    }}>
                    {cat.label}
                  </span>

                  {/* Seats Input */}
                  <TextField
                    className={classes.rowSeatsInput}
                    label="Seats"
                    size="small"
                    type="number"
                    variant="outlined"
                    value={row.seats}
                    inputProps={{ min: 1, max: 20 }}
                    onChange={e =>
                      this.handleRowSeatsChange(index, e.target.value)
                    }
                  />

                  {/* Info */}
                  <span className={classes.rowSeatsLabel}>
                    {row.seats} seat{row.seats !== 1 ? 's' : ''} in row {letter}
                  </span>

                  {/* Delete */}
                  <IconButton
                    className={classes.deleteRowBtn}
                    onClick={() => this.handleRemoveRow(index)}
                    disabled={rowConfigs.length <= 1}>
                    <Delete style={{ fontSize: '1rem' }} />
                  </IconButton>
                </div>
              );
            })}
          </div>

          {/* Add Row Button */}
          <Button
            className={classes.addRowBtn}
            variant="outlined"
            onClick={this.handleAddRow}
            disabled={rowConfigs.length >= 26}>
            <Add style={{ marginRight: 4 }} />
            Add Row {ROW_LETTERS[rowConfigs.length] || ''}
          </Button>

          {/* ── Live Preview ── */}
          <div className={classes.previewSection}>
            <div className={classes.previewTitle}>Live Seat Map Preview</div>
            <div style={{ textAlign: 'center', color: '#FFD700', fontSize: '0.7rem', marginBottom: 8, fontWeight: 600 }}>
              💎 Click any seat to mark it as Special (Golden = Special)
            </div>
            {this.renderPreview()}
          </div>
        </div>

        {/* ── Action Buttons ── */}
        <Button
          className={classes.buttonFooter}
          color="primary"
          variant="contained"
          onClick={submitAction}>
          {submitButton}
        </Button>
        {this.props.editCinema && (
          <Button
            color="secondary"
            className={classes.buttonFooter}
            variant="contained"
            onClick={() => this.onSubmitAction('remove')}>
            Delete Cinema
          </Button>
        )}

        {notification && notification.status ? (
          notification.status === 'success' ? (
            <Typography
              className={classes.infoMessage}
              color="primary"
              variant="caption">
              {notification.message}
            </Typography>
          ) : (
            <Typography
              className={classes.infoMessage}
              color="error"
              variant="caption">
              {notification.message}
            </Typography>
          )
        ) : null}
      </div>
    );
  }
}

AddCinema.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired
};

const mapStateToProps = null;
const mapDispatchToProps = {
  getCinemas,
  createCinemas,
  updateCinemas,
  removeCinemas
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(AddCinema));
