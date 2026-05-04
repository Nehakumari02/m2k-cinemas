import React from 'react';
import {
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
  IconButton,
  Collapse,
  Box
} from '@material-ui/core';
import { ExpandMore as KeyboardArrowDownIcon, ExpandLess as KeyboardArrowUpIcon } from '@material-ui/icons';
import { Button } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { submitRefundRequest } from '../../../../../store/actions';
import { RefundRequestModal } from '../../../../../components';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
    overflowX: 'auto',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
  },
  table: {
    minWidth: 650,
  },
  head: {
    backgroundColor: '#f8fafc',
  },
  headCell: {
    fontWeight: 700,
    color: '#64748b',
  },
  statusPending: { backgroundColor: '#fef3c7', color: '#92400e' },
  statusProcessing: { backgroundColor: '#e0f2fe', color: '#075985' },
  statusShipped: { backgroundColor: '#f3e8ff', color: '#6b21a8' },
  statusDelivered: { backgroundColor: '#dcfce7', color: '#166534' },
  statusCancelled: { backgroundColor: '#fee2e2', color: '#991b1b' },
  statusRefundRequested: { backgroundColor: '#fef3c7', color: '#92400e' },
  statusRefunded: { backgroundColor: '#d1fae5', color: '#065f46' },
}));

const Row = (props) => {
  const { order } = props;
  const [open, setOpen] = React.useState(false);
  const classes = useStyles();

  const getStatusClass = (status) => {
    switch (status) {
      case 'Pending': return classes.statusPending;
      case 'Processing': return classes.statusProcessing;
      case 'Shipped': return classes.statusShipped;
      case 'Delivered': return classes.statusDelivered;
      case 'Cancelled': return classes.statusCancelled;
      case 'Refund Requested': return classes.statusRefundRequested;
      case 'Refunded': return classes.statusRefunded;
      default: return '';
    }
  };

  const dispatch = useDispatch();
  const [refundModalOpen, setRefundModalOpen] = React.useState(false);

  const handleRefundSubmit = (data) => {
    dispatch(submitRefundRequest(data));
  };

  return (
    <React.Fragment>
      <TableRow>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell style={{ fontWeight: 600 }}>#{order._id ? order._id.slice(-6).toUpperCase() : 'N/A'}</TableCell>
        <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
        <TableCell style={{ fontWeight: 700 }}>₹{order.totalAmount}</TableCell>
        <TableCell>{order.paymentMethod}</TableCell>
        <TableCell>
          <Chip label={order.status} size="small" className={getStatusClass(order.status)} />
        </TableCell>
        <TableCell>{order.trackingId || 'N/A'}</TableCell>
        <TableCell>
          {order.status === 'Delivered' && (
            <Button
              size="small"
              variant="outlined"
              color="secondary"
              onClick={() => setRefundModalOpen(true)}
            >
              Refund
            </Button>
          )}
          <RefundRequestModal
            open={refundModalOpen}
            onClose={() => setRefundModalOpen(false)}
            item={order}
            type="Order"
            onSubmit={handleRefundSubmit}
          />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={2}>
              <Typography variant="h6" gutterBottom component="div" style={{ fontWeight: 700 }}>
                Order Details
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell style={{ fontWeight: 700 }}>Product</TableCell>
                    <TableCell style={{ fontWeight: 700 }}>Qty</TableCell>
                    <TableCell style={{ fontWeight: 700 }} align="right">Price</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.items.map((item) => (
                    <TableRow key={item._id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell align="right">₹{item.price}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Box mt={2}>
                <Typography variant="body2">
                  <strong>Shipping Address:</strong> {order.shippingAddress ? `${order.shippingAddress.fullName}, ${order.shippingAddress.address}, ${order.shippingAddress.city} - ${order.shippingAddress.postalCode}` : 'No address provided'}
                </Typography>
              </Box>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

export default function MyOrderTable({ orders }) {
  const classes = useStyles();

  return (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead className={classes.head}>
          <TableRow>
            <TableCell />
            <TableCell className={classes.headCell}>Order ID</TableCell>
            <TableCell className={classes.headCell}>Date</TableCell>
            <TableCell className={classes.headCell}>Total</TableCell>
            <TableCell className={classes.headCell}>Payment</TableCell>
            <TableCell className={classes.headCell}>Status</TableCell>
            <TableCell className={classes.headCell}>Tracking ID</TableCell>
            <TableCell className={classes.headCell}>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => (
            <Row key={order._id} order={order} />
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
