import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  CircularProgress
} from '@material-ui/core';

const RefundRequestModal = ({ open, onClose, onSubmit, item, type }) => {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!reason.trim()) return;
    setLoading(true);
    await onSubmit({
      originalId: item._id,
      type,
      reason,
      amount: type === 'Reservation' ? item.total : item.totalAmount
    });
    setLoading(false);
    setReason('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle style={{ fontWeight: 700 }}>Request Refund</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Please provide a reason for your refund request for {type === 'Reservation' ? 'this booking' : 'this order'}.
        </Typography>
        <TextField
          autoFocus
          margin="dense"
          label="Reason for Refund"
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          style={{ marginTop: 16 }}
        />
      </DialogContent>
      <DialogActions style={{ padding: '16px 24px' }}>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="secondary"
          disabled={!reason.trim() || loading}
          style={{ backgroundColor: '#ef4444', color: '#fff' }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Submit Request'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RefundRequestModal;
