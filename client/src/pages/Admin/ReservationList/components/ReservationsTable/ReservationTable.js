import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  Switch
} from '@material-ui/core';
import moment from 'moment';

import { Portlet, PortletContent } from '../../../../../components';
import styles from './styles';

class ReservationsTable extends Component {
  state = {
    rowsPerPage: 10,
    page: 0
  };

  static propTypes = {
    className: PropTypes.string,
    classes: PropTypes.object.isRequired,
    onSelect: PropTypes.func,
    onShowDetails: PropTypes.func,
    onUpdateReservation: PropTypes.func,
    getReservations: PropTypes.func,
    reservations: PropTypes.array.isRequired,
    movies: PropTypes.array.isRequired,
    cinemas: PropTypes.array.isRequired
  };

  static defaultProps = {
    reservations: [],
    movies: [],
    cinemas: [],
    onSelect: () => {},
    onShowDetails: () => {},
    onUpdateReservation: () => {}
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  onFindAttr = (id, list, attr) => {
    const item = list.find(item => item._id === id);
    return item ? item[attr] : `Not ${attr} Found`;
  };

  handleToggleFoodOrder = async (id, currentStatus) => {
    await this.props.onUpdateReservation({ foodOrderCompleted: !currentStatus }, id);
    if (this.props.getReservations) {
      this.props.getReservations();
    }
  };

  render() {
    const { classes, className, reservations, movies, cinemas } = this.props;
    const { rowsPerPage, page } = this.state;
    const rootClassName = classNames(classes.root, className);

    return (
      <Portlet className={rootClassName}>
        <PortletContent noPadding>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="left">User</TableCell>
                <TableCell align="left">Phone</TableCell>
                <TableCell align="left">Placed At</TableCell>
                <TableCell align="left">Start At</TableCell>
                <TableCell align="left">Movie</TableCell>
                <TableCell align="left">Cinema</TableCell>
                <TableCell align="left">Ticket Price</TableCell>
                <TableCell align="left">Total</TableCell>
                <TableCell align="left">F&B Time</TableCell>
                <TableCell align="left">F&B Items</TableCell>
                <TableCell align="left">F&B Completed</TableCell>
                <TableCell align="left">Checkin</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reservations
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(reservation => (
                  <TableRow
                    className={classes.tableRow}
                    hover
                    key={reservation._id}>
                    <TableCell className={classes.tableCell}>
                      {reservation.username}
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      {reservation.phone}
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      {reservation.createdAt ? moment(reservation.createdAt).format('DD/MM/YYYY hh:mm A') : '-'}
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      {reservation.startAt}
                    </TableCell>

                    <TableCell className={classes.tableCell}>
                      {this.onFindAttr(reservation.movieId, movies, 'title')}
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      {this.onFindAttr(reservation.cinemaId, cinemas, 'name')}
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      {reservation.ticketPrice}
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      {reservation.total}
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      {reservation.foodItems && reservation.foodItems.length > 0 
                        ? `${reservation.foodDeliveryTime || 'At Interval'} (${reservation.foodDeliveryMethod || 'Seat Delivery'})` 
                        : '-'}
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      {reservation.foodItems && reservation.foodItems.length > 0 ? reservation.foodItems.map(item => `${item.name} (x${item.quantity} - ₹${item.price * item.quantity})`).join(', ') : '-'}
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      {reservation.foodItems && reservation.foodItems.length > 0 ? (
                        <Switch
                          checked={!!reservation.foodOrderCompleted}
                          onChange={() => this.handleToggleFoodOrder(reservation._id, reservation.foodOrderCompleted)}
                          color="primary"
                        />
                      ) : '-'}
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      {reservation.checkin ? 'yes' : 'no'}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            backIconButtonProps={{
              'aria-label': 'Previous Page'
            }}
            component="div"
            count={reservations.length}
            nextIconButtonProps={{
              'aria-label': 'Next Page'
            }}
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
            page={page}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </PortletContent>
      </Portlet>
    );
  }
}

export default withStyles(styles)(ReservationsTable);
