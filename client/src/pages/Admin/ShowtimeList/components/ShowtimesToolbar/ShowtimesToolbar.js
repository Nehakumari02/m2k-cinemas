import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core';
import { Button, IconButton } from '@material-ui/core';
import { Delete as DeleteIcon, Edit as EditIcon } from '@material-ui/icons';
import styles from './styles';

class ShowtimesToolbar extends Component {
  static propTypes = {
    className: PropTypes.string,
    classes: PropTypes.object.isRequired,
    selectedShowtimes: PropTypes.array
  };

  static defaultProps = {
    selectedShowtimes: []
  };

  render() {
    const {
      classes,
      className,
      selectedShowtimes,
      toggleDialog,
      deleteShowtime,
      editSelectedShowtime
    } = this.props;

    const rootClassName = classNames(classes.root, className);

    return (
      <div className={rootClassName}>
        <div className={classes.row}>
          <div>
            {selectedShowtimes.length > 0 && (
              <IconButton
                className={classes.deleteButton}
                onClick={deleteShowtime}>
                <DeleteIcon />
              </IconButton>
            )}

            {selectedShowtimes.length === 1 && (
              <Button
                onClick={editSelectedShowtime}
                color="primary"
                size="small"
                variant="outlined"
                style={{ marginRight: 8 }}
                startIcon={<EditIcon fontSize="small" />}>
                Edit
              </Button>
            )}
            <Button onClick={toggleDialog} color="primary" size="small" variant="outlined">
              Add
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(ShowtimesToolbar);
