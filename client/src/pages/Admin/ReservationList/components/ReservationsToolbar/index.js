import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles, Button } from '@material-ui/core';
import { GetApp as DownloadIcon } from '@material-ui/icons';

import { SearchInput, DisplayMode } from '../../../../../components';
import { downloadReservationsCsv } from '../../../../../utils';
import styles from './styles';

class ReservationsToolbar extends Component {
  static propTypes = {
    className: PropTypes.string,
    classes: PropTypes.object.isRequired,
    reservations: PropTypes.array,
    movies: PropTypes.array,
    cinemas: PropTypes.array,
  };

  handleDownload = () => {
    const { reservations, movies, cinemas } = this.props;
    if (!reservations.length) return;
    downloadReservationsCsv(reservations, movies, cinemas);
  };

  render() {
    const {
      classes,
      className,
      search,
      mode,
      onChangeSearch,
      onChangeMode,
      reservations = [],
    } = this.props;
    const rootClassName = classNames(classes.root, className);

    return (
      <div className={rootClassName}>
        <div className={classes.row}>
          <SearchInput
            className={classes.searchInput}
            placeholder="Search reservation by Phone"
            value={search}
            onChange={onChangeSearch}
          />
          <div className={classes.actions}>
            <Button
              variant="outlined"
              color="primary"
              size="small"
              startIcon={<DownloadIcon />}
              disabled={!reservations.length}
              onClick={this.handleDownload}
              className={classes.downloadBtn}>
              Download CSV
            </Button>
            <DisplayMode mode={mode} onChange={onChangeMode} />
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(ReservationsToolbar);
