import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core';
import {
  Button,
  Typography,
  Grid,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Collapse,
  MenuItem
} from '@material-ui/core';
import {
  ExpandMore as ExpandIcon,
  ExpandLess as CollapseIcon,
  Fastfood as FoodOrderIcon
} from '@material-ui/icons';
import { getAllFoodOrders, updateFoodOrderStatus } from '../../../store/actions';

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
  tablePaper: {
    backgroundColor: '#1a1a24',
    borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.07)',
    overflow: 'hidden',
  },
  headCell: {
    color: 'rgba(255,255,255,0.5)',
    fontWeight: 700,
    borderBottom: '1px solid rgba(255,255,255,0.05)',
  },
  rowCell: {
    color: '#fff',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
  },
  statusPending: {
    backgroundColor: 'rgba(254,243,199,0.1)',
    color: '#fbbf24',
    border: '1px solid rgba(251,191,36,0.3)',
  },
  statusPreparing: {
    backgroundColor: 'rgba(224,242,254,0.1)',
    color: '#38bdf8',
    border: '1px solid rgba(56,189,248,0.3)',
  },
  statusReady: {
    backgroundColor: 'rgba(220,252,231,0.1)',
    color: '#4ade80',
    border: '1px solid rgba(74,222,128,0.3)',
  },
  statusCollected: {
    backgroundColor: 'rgba(243,232,255,0.1)',
    color: '#c084fc',
    border: '1px solid rgba(192,132,252,0.3)',
  },
  statusCancelled: {
    backgroundColor: 'rgba(254,226,226,0.1)',
    color: '#f87171',
    border: '1px solid rgba(248,113,113,0.3)',
  },
  detailBox: {
    backgroundColor: 'rgba(255,255,255,0.02)',
    padding: theme.spacing(3),
    borderRadius: '12px',
    margin: theme.spacing(1, 0, 3, 0),
  },
  dialogPaper: {
    backgroundColor: '#1a1a24',
    color: '#fff',
    borderRadius: '16px',
  },
  input: {
    '& .MuiOutlinedInput-root': {
      color: '#fff',
      '& fieldset': { borderColor: 'rgba(255,255,255,0.15)' },
      '&.Mui-focused fieldset': { borderColor: '#b72429' },
    },
    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' },
    marginBottom: theme.spacing(2),
  },
  empty: {
    padding: theme.spacing(6),
    textAlign: 'center',
    color: 'rgba(255,255,255,0.5)',
  },
});

const STATUSES = ['Pending', 'Preparing', 'Ready', 'Collected', 'Cancelled'];

function statusClass(status, classes) {
  switch (status) {
    case 'Pending':
      return classes.statusPending;
    case 'Preparing':
      return classes.statusPreparing;
    case 'Ready':
      return classes.statusReady;
    case 'Collected':
      return classes.statusCollected;
    case 'Cancelled':
      return classes.statusCancelled;
    default:
      return '';
  }
}

class FoodOrderRow extends React.Component {
  state = { open: false };

  render() {
    const { order, classes, onUpdate } = this.props;
    const { open } = this.state;
    const pickup = order.pickupDetails || {};

    return (
      <>
        <TableRow>
          <TableCell className={classes.rowCell}>
            <IconButton
              size="small"
              onClick={() => this.setState({ open: !open })}
              style={{ color: 'rgba(255,255,255,0.3)' }}>
              {open ? <CollapseIcon /> : <ExpandIcon />}
            </IconButton>
          </TableCell>
          <TableCell className={classes.rowCell} style={{ fontWeight: 700 }}>
            {order.orderNumber || `#${order._id.slice(-6).toUpperCase()}`}
          </TableCell>
          <TableCell className={classes.rowCell}>
            <Typography variant="body2" style={{ fontWeight: 600 }}>
              {order.user?.name || pickup.fullName || 'Guest'}
            </Typography>
            <Typography variant="caption" style={{ color: 'rgba(255,255,255,0.4)' }}>
              {order.user?.email || pickup.phone || '—'}
            </Typography>
          </TableCell>
          <TableCell className={classes.rowCell}>
            {new Date(order.createdAt).toLocaleString()}
          </TableCell>
          <TableCell className={classes.rowCell} style={{ fontWeight: 800, color: '#b72429' }}>
            ₹{order.totalAmount}
          </TableCell>
          <TableCell className={classes.rowCell}>
            <Chip
              label={order.status}
              size="small"
              className={statusClass(order.status, classes)}
            />
          </TableCell>
          <TableCell className={classes.rowCell}>
            <Button
              size="small"
              variant="outlined"
              style={{
                color: '#b72429',
                borderColor: 'rgba(183,36,41,0.5)',
                textTransform: 'none',
              }}
              onClick={() => onUpdate(order)}>
              Update
            </Button>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0, border: 'none' }} colSpan={7}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box className={classes.detailBox}>
                <Grid container spacing={4}>
                  <Grid item xs={12} md={6}>
                    <Typography
                      variant="h6"
                      gutterBottom
                      style={{
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        color: 'rgba(255,255,255,0.6)',
                      }}>
                      ITEMS
                    </Typography>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell
                            style={{
                              color: 'rgba(255,255,255,0.4)',
                              borderBottom: '1px solid rgba(255,255,255,0.05)',
                            }}>
                            Item
                          </TableCell>
                          <TableCell
                            align="right"
                            style={{
                              color: 'rgba(255,255,255,0.4)',
                              borderBottom: '1px solid rgba(255,255,255,0.05)',
                            }}>
                            Qty
                          </TableCell>
                          <TableCell
                            align="right"
                            style={{
                              color: 'rgba(255,255,255,0.4)',
                              borderBottom: '1px solid rgba(255,255,255,0.05)',
                            }}>
                            Price
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {(order.items || []).map((item, idx) => (
                          <TableRow key={item._id || idx}>
                            <TableCell
                              style={{
                                color: '#fff',
                                borderBottom: '1px solid rgba(255,255,255,0.03)',
                              }}>
                              {item.name || 'Item'}
                            </TableCell>
                            <TableCell
                              align="right"
                              style={{
                                color: '#fff',
                                borderBottom: '1px solid rgba(255,255,255,0.03)',
                              }}>
                              {item.quantity}
                            </TableCell>
                            <TableCell
                              align="right"
                              style={{
                                color: '#fff',
                                borderBottom: '1px solid rgba(255,255,255,0.03)',
                              }}>
                              ₹{item.price}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography
                      variant="h6"
                      gutterBottom
                      style={{
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        color: 'rgba(255,255,255,0.6)',
                      }}>
                      PICKUP & PAYMENT
                    </Typography>
                    <Box style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem' }}>
                      <p>
                        <strong>Payment:</strong> {order.paymentMethod}
                      </p>
                      {order.couponCode && (
                        <p>
                          <strong>Coupon:</strong> {order.couponCode}
                        </p>
                      )}
                      {order.discountAmount > 0 && (
                        <p>
                          <strong>Discount:</strong> ₹{order.discountAmount}
                        </p>
                      )}
                      {order.pointsUsed > 0 && (
                        <p>
                          <strong>Points used:</strong> {order.pointsUsed}
                        </p>
                      )}
                      <Box mt={2} p={1.5} style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 8 }}>
                        <p style={{ margin: 0 }}>
                          <strong>{pickup.fullName || '—'}</strong>
                        </p>
                        <p style={{ margin: '4px 0' }}>Phone: {pickup.phone || '—'}</p>
                        <p style={{ margin: '4px 0' }}>
                          Pickup: {pickup.pickupTime || 'ASAP'}
                        </p>
                        <p style={{ margin: '4px 0' }}>
                          Location: {pickup.location || 'M2K Concession Counter'}
                        </p>
                        {pickup.notes && <p style={{ margin: '4px 0' }}>Notes: {pickup.notes}</p>}
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </>
    );
  }
}

class FoodOrderList extends Component {
  state = {
    updateDialog: false,
    selectedOrder: null,
    status: '',
    saving: false,
  };

  componentDidMount() {
    this.props.getAllFoodOrders();
  }

  openUpdate = order => {
    this.setState({
      updateDialog: true,
      selectedOrder: order,
      status: order.status,
    });
  };

  handleSave = async () => {
    this.setState({ saving: true });
    const { selectedOrder, status } = this.state;
    await this.props.updateFoodOrderStatus(selectedOrder._id, status);
    this.setState({ updateDialog: false, saving: false });
  };

  render() {
    const { classes, orders, loading } = this.props;
    const { updateDialog, status, saving } = this.state;

    return (
      <div className={classes.root}>
        <div className={classes.header}>
          <div className={classes.titleBlock}>
            <FoodOrderIcon className={classes.titleIcon} />
            <Typography className={classes.pageTitle}>Food Orders</Typography>
          </div>
        </div>

        <Box className={classes.tablePaper}>
          {loading && !orders.length ? (
            <Box display="flex" justifyContent="center" py={6}>
              <CircularProgress style={{ color: '#b72429' }} />
            </Box>
          ) : orders.length === 0 ? (
            <Typography className={classes.empty}>No food orders yet.</Typography>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell className={classes.headCell} />
                  <TableCell className={classes.headCell}>Order #</TableCell>
                  <TableCell className={classes.headCell}>Customer</TableCell>
                  <TableCell className={classes.headCell}>Date</TableCell>
                  <TableCell className={classes.headCell}>Total</TableCell>
                  <TableCell className={classes.headCell}>Status</TableCell>
                  <TableCell className={classes.headCell}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map(order => (
                  <FoodOrderRow
                    key={order._id}
                    order={order}
                    classes={classes}
                    onUpdate={this.openUpdate}
                  />
                ))}
              </TableBody>
            </Table>
          )}
        </Box>

        <Dialog
          open={updateDialog}
          onClose={() => this.setState({ updateDialog: false })}
          classes={{ paper: classes.dialogPaper }}>
          <DialogTitle style={{ color: '#fff' }}>Update Food Order Status</DialogTitle>
          <DialogContent style={{ paddingTop: 16 }}>
            <TextField
              select
              fullWidth
              label="Status"
              value={status}
              onChange={e => this.setState({ status: e.target.value })}
              variant="outlined"
              className={classes.input}>
              {STATUSES.map(s => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </TextField>
          </DialogContent>
          <DialogActions style={{ padding: '16px 24px' }}>
            <Button
              onClick={() => this.setState({ updateDialog: false })}
              style={{ color: 'rgba(255,255,255,0.5)' }}>
              Cancel
            </Button>
            <Button
              onClick={this.handleSave}
              variant="contained"
              style={{ backgroundColor: '#b72429', color: '#fff' }}
              disabled={saving}>
              {saving ? <CircularProgress size={20} color="inherit" /> : 'Save'}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  orders: state.foodCartState.adminOrders,
  loading: state.foodCartState.loading,
});

export default connect(mapStateToProps, {
  getAllFoodOrders,
  updateFoodOrderStatus,
})(withStyles(styles)(FoodOrderList));
