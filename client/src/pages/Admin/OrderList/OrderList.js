import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core';
import {
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Tooltip,
  MenuItem,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Collapse
} from '@material-ui/core';
import { 
  ExpandMore as ExpandIcon, 
  ExpandLess as CollapseIcon, 
  Assignment as OrderIcon,
  LocalShipping as ShippingIcon,
  CheckCircle as DeliveredIcon,
  Cancel as CancelIcon
} from '@material-ui/icons';
import { getAllOrders, updateOrderStatus } from '../../../store/actions';

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
  table: {
    minWidth: 800,
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
  statusPending: { backgroundColor: 'rgba(254,243,199,0.1)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.3)' },
  statusProcessing: { backgroundColor: 'rgba(224,242,254,0.1)', color: '#38bdf8', border: '1px solid rgba(56,189,248,0.3)' },
  statusShipped: { backgroundColor: 'rgba(243,232,255,0.1)', color: '#c084fc', border: '1px solid rgba(192,132,252,0.3)' },
  statusDelivered: { backgroundColor: 'rgba(220,252,231,0.1)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.3)' },
  statusCancelled: { backgroundColor: 'rgba(254,226,226,0.1)', color: '#f87171', border: '1px solid rgba(248,113,113,0.3)' },
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
});

class OrderRow extends React.Component {
  state = { open: false };

  getStatusClass = (status, classes) => {
    switch (status) {
      case 'Pending': return classes.statusPending;
      case 'Processing': return classes.statusProcessing;
      case 'Shipped': return classes.statusShipped;
      case 'Delivered': return classes.statusDelivered;
      case 'Cancelled': return classes.statusCancelled;
      default: return '';
    }
  };

  render() {
    const { order, classes, onUpdate } = this.props;
    const { open } = this.state;

    return (
      <React.Fragment>
        <TableRow>
          <TableCell className={classes.rowCell}>
            <IconButton size="small" onClick={() => this.setState({ open: !open })} style={{ color: 'rgba(255,255,255,0.3)' }}>
              {open ? <CollapseIcon /> : <ExpandIcon />}
            </IconButton>
          </TableCell>
          <TableCell className={classes.rowCell} style={{ fontWeight: 700 }}>
            #{order._id.slice(-6).toUpperCase()}
          </TableCell>
          <TableCell className={classes.rowCell}>
            <Typography variant="body2" style={{ fontWeight: 600 }}>{order.user?.name || order.shippingAddress?.fullName || 'Unknown'}</Typography>
            <Typography variant="caption" style={{ color: 'rgba(255,255,255,0.4)' }}>{order.user?.email || 'Guest'}</Typography>
          </TableCell>
          <TableCell className={classes.rowCell}>
            {new Date(order.createdAt).toLocaleDateString()}
          </TableCell>
          <TableCell className={classes.rowCell} style={{ fontWeight: 800, color: '#b72429' }}>
            ₹{order.totalAmount}
          </TableCell>
          <TableCell className={classes.rowCell}>
            <Chip label={order.status} size="small" className={this.getStatusClass(order.status, classes)} />
          </TableCell>
          <TableCell className={classes.rowCell}>
            <Button 
              size="small" 
              variant="outlined" 
              style={{ color: '#b72429', borderColor: 'rgba(183,36,41,0.5)', textTransform: 'none' }}
              onClick={() => onUpdate(order)}
            >
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
                    <Typography variant="h6" gutterBottom style={{ fontWeight: 700, fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>
                      ITEMS PURCHASED
                    </Typography>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell style={{ color: 'rgba(255,255,255,0.4)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Product</TableCell>
                          <TableCell style={{ color: 'rgba(255,255,255,0.4)', borderBottom: '1px solid rgba(255,255,255,0.05)' }} align="right">Qty</TableCell>
                          <TableCell style={{ color: 'rgba(255,255,255,0.4)', borderBottom: '1px solid rgba(255,255,255,0.05)' }} align="right">Price</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {order.items.map((item) => (
                          <TableRow key={item._id}>
                            <TableCell style={{ color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>{item.name}</TableCell>
                            <TableCell style={{ color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.03)' }} align="right">{item.quantity}</TableCell>
                            <TableCell style={{ color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.03)' }} align="right">₹{item.price}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom style={{ fontWeight: 700, fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>
                      SHIPPING & PAYMENT
                    </Typography>
                    <Box style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem' }}>
                      <p><strong>Method:</strong> {order.paymentMethod}</p>
                      <p><strong>Tracking:</strong> {order.trackingId || 'Not assigned'}</p>
                      <Box mt={2} p={1.5} style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                        <p style={{ margin: 0 }}><strong>{order.shippingAddress.fullName}</strong></p>
                        <p style={{ margin: '4px 0' }}>{order.shippingAddress.address}</p>
                        <p style={{ margin: 0 }}>{order.shippingAddress.city} - {order.shippingAddress.postalCode}</p>
                        <p style={{ margin: '4px 0' }}>Phone: {order.shippingAddress.phone}</p>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  }
}

class OrderList extends Component {
  state = {
    updateDialog: false,
    selectedOrder: null,
    status: '',
    trackingId: '',
    saving: false
  };

  componentDidMount() {
    this.props.getAllOrders();
  }

  openUpdate = order => {
    this.setState({
      updateDialog: true,
      selectedOrder: order,
      status: order.status,
      trackingId: order.trackingId || ''
    });
  };

  handleSave = async () => {
    this.setState({ saving: true });
    const { selectedOrder, status, trackingId } = this.state;
    await this.props.updateOrderStatus(selectedOrder._id, { status, trackingId });
    this.setState({ updateDialog: false, saving: false });
  };

  render() {
    const { classes, orders } = this.props;
    const { updateDialog, status, trackingId, saving } = this.state;

    return (
      <div className={classes.root}>
        <div className={classes.header}>
          <div className={classes.titleBlock}>
            <OrderIcon className={classes.titleIcon} />
            <Typography className={classes.pageTitle}>Merchandise Orders</Typography>
          </div>
        </div>

        <Box className={classes.tablePaper}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell className={classes.headCell} />
                <TableCell className={classes.headCell}>ID</TableCell>
                <TableCell className={classes.headCell}>Customer</TableCell>
                <TableCell className={classes.headCell}>Date</TableCell>
                <TableCell className={classes.headCell}>Total</TableCell>
                <TableCell className={classes.headCell}>Status</TableCell>
                <TableCell className={classes.headCell}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map(order => (
                <OrderRow key={order._id} order={order} classes={classes} onUpdate={this.openUpdate} />
              ))}
            </TableBody>
          </Table>
        </Box>

        <Dialog open={updateDialog} onClose={() => this.setState({ updateDialog: false })} classes={{ paper: classes.dialogPaper }}>
          <DialogTitle style={{ color: '#fff' }}>Update Order Status</DialogTitle>
          <DialogContent style={{ paddingTop: 16 }}>
            <TextField
              select
              fullWidth
              label="Order Status"
              value={status}
              onChange={e => this.setState({ status: e.target.value })}
              variant="outlined"
              className={classes.input}
            >
              {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(s => (
                <MenuItem key={s} value={s}>{s}</MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              label="Tracking ID"
              value={trackingId}
              onChange={e => this.setState({ trackingId: e.target.value })}
              variant="outlined"
              className={classes.input}
              placeholder="e.g. BLUEDART-123456"
            />
          </DialogContent>
          <DialogActions style={{ padding: '16px 24px' }}>
            <Button onClick={() => this.setState({ updateDialog: false })} style={{ color: 'rgba(255,255,255,0.5)' }}>Cancel</Button>
            <Button 
              onClick={this.handleSave} 
              variant="contained" 
              style={{ backgroundColor: '#b72429', color: '#fff' }}
              disabled={saving}
            >
              {saving ? <CircularProgress size={20} color="inherit" /> : 'Save Changes'}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  orders: state.cartState.orders
});

export default connect(mapStateToProps, { getAllOrders, updateOrderStatus })(withStyles(styles)(OrderList));
