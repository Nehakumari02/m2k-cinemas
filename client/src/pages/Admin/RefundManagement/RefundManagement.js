import React, { useEffect, useState } from 'react';
import {
  makeStyles,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper
} from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { getAllRefunds, updateRefundStatus } from '../../../store/actions';
import { LocalActivity, Fastfood, CheckCircle, Cancel } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3),
    backgroundColor: '#0e0e14',
    minHeight: '100vh',
    color: '#fff',
  },
  title: {
    fontWeight: 800,
    marginBottom: theme.spacing(4),
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
  },
  card: {
    backgroundColor: '#1a1a24',
    color: '#fff',
    borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.07)',
  },
  table: {
    backgroundColor: 'transparent',
    '& .MuiTableCell-root': {
      color: 'rgba(255,255,255,0.7)',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
    },
    '& .MuiTableCell-head': {
      color: '#fff',
      fontWeight: 700,
    },
  },
  dialogPaper: {
    backgroundColor: '#1a1a24',
    color: '#fff',
  },
  input: {
    '& .MuiOutlinedInput-root': {
      color: '#fff',
      '& fieldset': { borderColor: 'rgba(255,255,255,0.15)' },
    },
    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' },
    marginTop: theme.spacing(2),
  }
}));

const RefundManagement = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRefund, setSelectedRefund] = useState(null);
  const [adminNote, setAdminNote] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchRefunds();
  }, []);

  const fetchRefunds = async () => {
    setLoading(true);
    const data = await dispatch(getAllRefunds());
    if (data) setRefunds(data);
    setLoading(false);
  };

  const handleUpdateStatus = async (status) => {
    setProcessing(true);
    const result = await dispatch(updateRefundStatus(selectedRefund._id, { status, adminNote }));
    if (result && result.status === 'success') {
      setSelectedRefund(null);
      setAdminNote('');
      fetchRefunds();
    }
    setProcessing(false);
  };

  return (
    <div className={classes.root}>
      <Typography variant="h4" className={classes.title}>
        Refund Management
      </Typography>

      {loading ? (
        <CircularProgress style={{ color: '#b72429' }} />
      ) : (
        <Paper className={classes.card}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>Type</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Reason</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {refunds.map((refund) => (
                <TableRow key={refund._id}>
                  <TableCell>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {refund.type === 'Reservation' ? <LocalActivity color="secondary" /> : <Fastfood style={{ color: '#4caf50' }} />}
                      {refund.type}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{refund.user?.name}</Typography>
                    <Typography variant="caption" style={{ opacity: 0.5 }}>{refund.user?.email}</Typography>
                  </TableCell>
                  <TableCell style={{ maxWidth: 200 }}>{refund.reason}</TableCell>
                  <TableCell style={{ fontWeight: 700 }}>₹{refund.amount}</TableCell>
                  <TableCell>{new Date(refund.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Chip 
                      label={refund.status} 
                      size="small"
                      style={{ 
                        backgroundColor: refund.status === 'Pending' ? '#ff9800' : refund.status === 'Approved' ? '#4caf50' : '#f44336',
                        color: '#fff'
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    {refund.status === 'Pending' && (
                      <Button 
                        size="small" 
                        variant="contained" 
                        color="primary"
                        onClick={() => setSelectedRefund(refund)}
                        style={{ backgroundColor: '#b72429' }}
                      >
                        Review
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}

      <Dialog 
        open={Boolean(selectedRefund)} 
        onClose={() => setSelectedRefund(null)}
        classes={{ paper: classes.dialogPaper }}
      >
        <DialogTitle>Review Refund Request</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            <strong>Reason:</strong> {selectedRefund?.reason}
          </Typography>
          <Typography variant="body1">
            <strong>Amount:</strong> ₹{selectedRefund?.amount}
          </Typography>
          <TextField
            label="Admin Note"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            className={classes.input}
            value={adminNote}
            onChange={(e) => setAdminNote(e.target.value)}
          />
        </DialogContent>
        <DialogActions style={{ padding: 16 }}>
          <Button onClick={() => setSelectedRefund(null)} style={{ color: '#fff' }}>Cancel</Button>
          <Button 
            startIcon={<Cancel />}
            onClick={() => handleUpdateStatus('Rejected')}
            style={{ color: '#f44336' }}
            disabled={processing}
          >
            Reject
          </Button>
          <Button 
            startIcon={<CheckCircle />}
            variant="contained"
            onClick={() => handleUpdateStatus('Approved')}
            style={{ backgroundColor: '#4caf50', color: '#fff' }}
            disabled={processing}
          >
            Approve
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default RefundManagement;
